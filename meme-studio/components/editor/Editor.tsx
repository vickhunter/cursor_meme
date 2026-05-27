"use client"

import dynamic from "next/dynamic"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import {
  Check,
  Download,
  Frame,
  ImageIcon,
  Loader2,
  Lock,
  Pause,
  Play,
  Sparkles,
  Type,
} from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import type Konva from "konva"

import { Button } from "@/components/ui/Button"
import { exportZip } from "@/lib/export"
import { exportVideoZip, sceneHasVideo } from "@/lib/exportVideo"
import type { MediaPick } from "./MediaSearch"
import { DEFAULT_FORMAT, getFormat, type SocialFormatId } from "@/lib/formats"
import { t } from "@/lib/i18n/it"
import {
  createMeme,
  getMeme,
  hasUnlock,
  saveMeme,
  setUnlockToken,
} from "@/lib/store"
import type { MemeRecord, Scene, SceneNode } from "@/lib/types"

const Canvas = dynamic(
  () => import("./Canvas").then((m) => m.Canvas),
  { ssr: false, loading: () => <CanvasFallback /> }
)

function CanvasFallback() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-zinc-100 dark:bg-zinc-900">
      <Loader2 className="h-6 w-6 animate-spin text-zinc-400" />
    </div>
  )
}

type EditorProps = {
  initialMemeId?: string
  isLocalMode: boolean
}

export function Editor({ initialMemeId, isLocalMode }: EditorProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [meme, setMeme] = useState<MemeRecord | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [unlocked, setUnlocked] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [showMockFrame, setShowMockFrame] = useState(true)
  const [isPlaying, setIsPlaying] = useState(true)
  const [unlockingToast, setUnlockingToast] = useState<
    "idle" | "verifying" | "success" | "error"
  >("idle")
  const stageRef = useRef<Konva.Stage>(null)
  const hydratedRef = useRef(false)

  useEffect(() => {
    if (hydratedRef.current) return
    hydratedRef.current = true
    if (initialMemeId) {
      const existing = getMeme(initialMemeId)
      if (existing) {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- one-shot hydration from localStorage on mount
        setMeme(existing)
        setUnlocked(hasUnlock(initialMemeId))
        return
      }
    }
    const created = createMeme({ id: initialMemeId })
    setMeme(created)
    if (!initialMemeId) {
      router.replace(`/studio/${created.id}`)
    }
  }, [initialMemeId, router])

  useEffect(() => {
    if (!meme) return
    const unlockParam = searchParams.get("unlock")
    const sessionId = searchParams.get("session_id")
    if (unlockParam !== "1" || !sessionId) return
    let cancelled = false
    // eslint-disable-next-line react-hooks/set-state-in-effect -- toast state synced with one-shot Stripe verify response
    setUnlockingToast("verifying")
    ;(async () => {
      try {
        const res = await fetch(
          `/api/stripe/unlock?session_id=${encodeURIComponent(
            sessionId
          )}&meme_id=${encodeURIComponent(meme.id)}`
        )
        if (!res.ok) throw new Error("verify_failed")
        const data = (await res.json()) as { token: string }
        if (cancelled) return
        setUnlockToken(meme.id, data.token)
        setUnlocked(true)
        setUnlockingToast("success")
        router.replace(`/studio/${meme.id}`)
        setTimeout(() => setUnlockingToast("idle"), 3000)
      } catch {
        if (cancelled) return
        setUnlockingToast("error")
        setTimeout(() => setUnlockingToast("idle"), 3000)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [meme, searchParams, router])

  const format = useMemo(
    () => getFormat(meme?.workingFormat ?? DEFAULT_FORMAT),
    [meme?.workingFormat]
  )

  const updateScene = useCallback(
    (next: Scene) => {
      setMeme((prev) => {
        if (!prev) return prev
        const updated = { ...prev, scene: next, updatedAt: Date.now() }
        saveMeme(updated)
        return updated
      })
    },
    [setMeme]
  )

  const updateFormat = useCallback((id: SocialFormatId) => {
    setMeme((prev) => {
      if (!prev) return prev
      const updated = { ...prev, workingFormat: id, updatedAt: Date.now() }
      saveMeme(updated)
      return updated
    })
  }, [])

  const addMedia = useCallback(
    (pick: MediaPick) => {
      if (!meme) return
      const baseGeo = {
        x: format.w * 0.15,
        y: format.h * 0.15,
        width: format.w * 0.7,
        height: format.h * 0.7,
        rotation: 0,
      }
      const node: SceneNode =
        pick.kind === "video" && pick.videoSrc
          ? {
              type: "video",
              id: newNodeId(),
              src: pick.videoSrc,
              poster: pick.poster,
              durationSec: pick.durationSec,
              sourceLabel: pick.sourceLabel,
              ...baseGeo,
            }
          : {
              type: "image",
              id: newNodeId(),
              src: pick.full,
              videoSrc: pick.videoSrc,
              sourceLabel: pick.sourceLabel,
              ...baseGeo,
            }
      const next: Scene = { ...meme.scene, nodes: [...meme.scene.nodes, node] }
      updateScene(next)
      setSelectedId(node.id)
      if (node.type === "video") setIsPlaying(true)
    },
    [meme, format, updateScene]
  )

  const addText = useCallback(() => {
    if (!meme) return
    const node: SceneNode = {
      type: "text",
      id: newNodeId(),
      text: "TESTO IN ALTO",
      x: format.w * 0.1,
      y: format.h * 0.08,
      width: format.w * 0.8,
      fontFamily: "Impact",
      fontSize: Math.round(format.h * 0.09),
      fill: "#ffffff",
      stroke: "#000000",
      strokeWidth: Math.max(2, Math.round(format.h * 0.005)),
      fontStyle: "bold",
      align: "center",
      rotation: 0,
    }
    const next: Scene = { ...meme.scene, nodes: [...meme.scene.nodes, node] }
    updateScene(next)
    setSelectedId(node.id)
  }, [meme, format, updateScene])

  const addRect = useCallback(() => {
    if (!meme) return
    const node: SceneNode = {
      type: "rect",
      id: newNodeId(),
      x: format.w * 0.2,
      y: format.h * 0.4,
      width: format.w * 0.6,
      height: format.h * 0.15,
      fill: "#ffcc00",
      rotation: 0,
    }
    const next: Scene = { ...meme.scene, nodes: [...meme.scene.nodes, node] }
    updateScene(next)
    setSelectedId(node.id)
  }, [meme, format, updateScene])

  const startCheckout = useCallback(async () => {
    if (!meme) return
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ memeId: meme.id, memeTitle: meme.title }),
      })
      if (!res.ok) throw new Error("checkout_failed")
      const data = (await res.json()) as { url: string }
      window.location.href = data.url
    } catch {
      setUnlockingToast("error")
      setTimeout(() => setUnlockingToast("idle"), 3000)
    }
  }, [meme])

  const handleDownload = useCallback(
    async (kind: "watermarked" | "hd") => {
      if (!meme) return
      const isHd = kind === "hd"
      if (isHd && !unlocked && !isLocalMode) {
        await startCheckout()
        return
      }
      setExporting(true)
      const wasPlaying = isPlaying
      setIsPlaying(false)
      try {
        const isVideoScene = sceneHasVideo(meme.scene)
        const baseName = slugify(meme.title)
        if (isVideoScene) {
          await exportVideoZip({
            scene: meme.scene,
            workingFormat: meme.workingFormat,
            watermarked: !isHd,
            watermarkLabel: "MEMEFORGE",
            zipFilename: isHd
              ? `${baseName}-hd-video.zip`
              : `${baseName}-watermark-video.zip`,
          })
        } else {
          await exportZip({
            scene: meme.scene,
            workingFormat: meme.workingFormat,
            watermarked: !isHd,
            watermarkLabel: "MEMEFORGE",
            zipFilename: isHd
              ? `${baseName}-hd.zip`
              : `${baseName}-watermark.zip`,
          })
        }
      } finally {
        setExporting(false)
        setIsPlaying(wasPlaying)
      }
    },
    [meme, unlocked, isLocalMode, isPlaying, startCheckout]
  )

  if (!meme) {
    return <CanvasFallback />
  }

  const hasVideo = meme.scene.nodes.some((n) => n.type === "video")

  return (
    <div className="flex h-[calc(100dvh-3.5rem)] flex-col">
      <Toolbar
        meme={meme}
        onTitleChange={(title) => {
          const updated = { ...meme, title }
          setMeme(updated)
          saveMeme(updated)
        }}
        isLocalMode={isLocalMode}
        unlocked={unlocked}
        exporting={exporting}
        hasVideo={hasVideo}
        isPlaying={isPlaying}
        onTogglePlaying={() => setIsPlaying((v) => !v)}
        showMockFrame={showMockFrame}
        onToggleMockFrame={() => setShowMockFrame((v) => !v)}
        onAddText={addText}
        onAddRect={addRect}
        onDownload={() => handleDownload("watermarked")}
        onDownloadHd={() => handleDownload("hd")}
        unlockingToast={unlockingToast}
      />
      <div className="grid flex-1 grid-cols-[1fr_360px] overflow-hidden">
        <Canvas
          scene={meme.scene}
          format={format}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onChange={updateScene}
          stageRef={stageRef}
          showMockFrame={showMockFrame}
          isPlaying={isPlaying}
        />
        <SidePanelLazy
          scene={meme.scene}
          format={format}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onChange={updateScene}
          onFormatChange={updateFormat}
          onAddMedia={addMedia}
          onAddText={addText}
          onAddRect={addRect}
        />
      </div>
    </div>
  )
}

const SidePanelLazy = dynamic(
  () => import("./SidePanel").then((m) => m.SidePanel),
  { ssr: false }
)

function Toolbar({
  meme,
  onTitleChange,
  isLocalMode,
  unlocked,
  exporting,
  hasVideo,
  isPlaying,
  onTogglePlaying,
  showMockFrame,
  onToggleMockFrame,
  onAddText,
  onAddRect,
  onDownload,
  onDownloadHd,
  unlockingToast,
}: {
  meme: MemeRecord
  onTitleChange: (title: string) => void
  isLocalMode: boolean
  unlocked: boolean
  exporting: boolean
  hasVideo: boolean
  isPlaying: boolean
  onTogglePlaying: () => void
  showMockFrame: boolean
  onToggleMockFrame: () => void
  onAddText: () => void
  onAddRect: () => void
  onDownload: () => void
  onDownloadHd: () => void
  unlockingToast: "idle" | "verifying" | "success" | "error"
}) {
  const hdLabel = unlocked
    ? t.studio.download
    : isLocalMode
    ? t.studio.downloadLocal
    : t.studio.downloadHd

  return (
    <header className="flex h-14 flex-shrink-0 items-center gap-3 border-b border-zinc-200 bg-white px-4 dark:border-zinc-800 dark:bg-zinc-950">
      <Link
        href="/"
        className="flex items-center gap-2 text-sm font-semibold tracking-tight"
      >
        <Sparkles className="h-4 w-4 text-fuchsia-600" />
        MemeForge
      </Link>
      <div className="mx-2 h-5 w-px bg-zinc-200 dark:bg-zinc-800" />
      <input
        value={meme.title}
        onChange={(e) => onTitleChange(e.target.value)}
        className="w-64 rounded-md bg-transparent px-2 py-1 text-sm outline-none transition-colors hover:bg-zinc-100 focus:bg-zinc-100 dark:hover:bg-zinc-800 dark:focus:bg-zinc-800"
      />
      <span className="ml-2 text-xs text-zinc-400">{t.studio.saved}</span>
      <div className="ml-auto flex items-center gap-2">
        {isLocalMode && (
          <span className="hidden items-center gap-1 rounded-full bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700 ring-1 ring-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:ring-amber-900 sm:inline-flex">
            <Sparkles className="h-3 w-3" />
            {t.studio.localModeBadge}
          </span>
        )}
        {unlocked && (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:ring-emerald-900">
            <Check className="h-3 w-3" />
            {t.studio.unlockedBadge}
          </span>
        )}
        {hasVideo && (
          <Button
            onClick={onTogglePlaying}
            variant={isPlaying ? "secondary" : "ghost"}
            size="sm"
            title={isPlaying ? t.studio.video.pause : t.studio.video.play}
          >
            {isPlaying ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
            {isPlaying ? t.studio.video.pause : t.studio.video.play}
          </Button>
        )}
        <Button
          onClick={onToggleMockFrame}
          variant={showMockFrame ? "secondary" : "ghost"}
          size="sm"
          title={t.studio.preview.hint}
        >
          <Frame className="h-4 w-4" />
          {showMockFrame ? t.studio.preview.off : t.studio.preview.on}
        </Button>
        <Button onClick={onAddText} variant="ghost" size="sm">
          <Type className="h-4 w-4" />
          {t.studio.add.text}
        </Button>
        <Button onClick={onAddRect} variant="ghost" size="sm">
          <ImageIcon className="h-4 w-4" />
          {t.studio.add.rect}
        </Button>
        <Button
          onClick={onDownload}
          variant="secondary"
          disabled={exporting}
          size="sm"
        >
          {exporting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Download className="h-4 w-4" />
          )}
          {t.studio.download}
        </Button>
        <Button
          onClick={onDownloadHd}
          variant={unlocked || isLocalMode ? "primary" : "accent"}
          disabled={exporting || unlockingToast === "verifying"}
          size="sm"
        >
          {unlocked || isLocalMode ? (
            <Download className="h-4 w-4" />
          ) : (
            <Lock className="h-4 w-4" />
          )}
          {hdLabel}
        </Button>
      </div>
      {unlockingToast !== "idle" && (
        <UnlockToast status={unlockingToast} />
      )}
    </header>
  )
}

function UnlockToast({
  status,
}: {
  status: "verifying" | "success" | "error"
}) {
  const message =
    status === "verifying"
      ? t.unlock.successDesc
      : status === "success"
      ? "HD sbloccato. Ora puoi scaricare senza watermark."
      : t.unlock.failDesc
  return (
    <div className="fixed left-1/2 top-20 z-50 -translate-x-1/2 rounded-md border border-zinc-200 bg-white px-4 py-2 text-sm shadow-lg dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex items-center gap-2">
        {status === "verifying" ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : status === "success" ? (
          <Check className="h-4 w-4 text-emerald-600" />
        ) : (
          <Lock className="h-4 w-4 text-red-600" />
        )}
        <span>{message}</span>
      </div>
    </div>
  )
}

function newNodeId(): string {
  return `n_${Math.random().toString(36).slice(2, 10)}`
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40) || "meme"
}
