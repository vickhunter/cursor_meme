"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Film, ImageIcon, Loader2, Play, Search, Upload } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { t } from "@/lib/i18n/it"

export type MediaResult = {
  id: string
  type: "image" | "video"
  thumb: string
  full: string
  alt: string
  photographer?: string
  videoSrc?: string
  durationSec?: number
}

type ApiResponse = {
  results: MediaResult[]
  source: "pexels" | "seed"
  type: "image" | "video"
}

type Tab = "image" | "video"

export type MediaPick = {
  kind: "image" | "video"
  full: string
  videoSrc?: string
  poster?: string
  durationSec?: number
  sourceLabel?: string
}

type Props = {
  onPick: (pick: MediaPick) => void
}

function formatDuration(sec?: number): string {
  if (!sec || !isFinite(sec)) return ""
  const m = Math.floor(sec / 60)
  const s = Math.floor(sec % 60)
  return `${m}:${s.toString().padStart(2, "0")}`
}

export function MediaSearch({ onPick }: Props) {
  const [tab, setTab] = useState<Tab>("image")
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<MediaResult[]>([])
  const [loading, setLoading] = useState(false)
  const [source, setSource] = useState<"pexels" | "seed">("seed")
  const fileRef = useRef<HTMLInputElement>(null)

  const fetchMedia = useCallback(async (q: string, type: Tab) => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ q, type })
      const res = await fetch(`/api/images?${params}`)
      if (!res.ok) throw new Error(`Request failed ${res.status}`)
      const data = (await res.json()) as ApiResponse
      setResults(data.results)
      setSource(data.source)
    } catch (err) {
      console.error("MediaSearch failed:", err)
      setResults([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    // Trigger on tab change with the current query; user search submit
    // also calls fetchMedia directly via handleSubmit, so we intentionally
    // omit `query` from deps to avoid debouncing every keystroke.
    // eslint-disable-next-line react-hooks/exhaustive-deps, react-hooks/set-state-in-effect -- one-shot fetch on tab change; query is captured at submit time via handleSubmit
    fetchMedia(query, tab)
  }, [tab, fetchMedia])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    fetchMedia(query, tab)
  }

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === "string") {
        onPick({ kind: "image", full: reader.result, sourceLabel: file.name })
      }
    }
    reader.readAsDataURL(file)
    e.target.value = ""
  }

  const handlePick = (r: MediaResult) => {
    const label = r.photographer
      ? `${r.photographer} · ${r.alt || r.id}`
      : r.alt
    if (r.type === "video" && r.videoSrc) {
      onPick({
        kind: "video",
        full: r.videoSrc,
        videoSrc: r.videoSrc,
        poster: r.full,
        durationSec: r.durationSec,
        sourceLabel: label,
      })
      return
    }
    onPick({
      kind: "image",
      full: r.full,
      videoSrc: r.videoSrc,
      sourceLabel: label,
    })
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-1 rounded-md bg-zinc-100 p-1 text-xs font-medium dark:bg-zinc-900">
        <button
          type="button"
          onClick={() => setTab("image")}
          className={`flex items-center justify-center gap-1.5 rounded-sm px-2 py-1.5 transition-colors ${
            tab === "image"
              ? "bg-white shadow-sm dark:bg-zinc-800"
              : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
          }`}
        >
          <ImageIcon className="h-3.5 w-3.5" />
          {t.studio.tabImages}
        </button>
        <button
          type="button"
          onClick={() => setTab("video")}
          className={`flex items-center justify-center gap-1.5 rounded-sm px-2 py-1.5 transition-colors ${
            tab === "video"
              ? "bg-white shadow-sm dark:bg-zinc-800"
              : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
          }`}
        >
          <Film className="h-3.5 w-3.5" />
          {t.studio.tabVideos}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              tab === "video"
                ? t.studio.searchPlaceholderVideo
                : t.studio.searchPlaceholder
            }
            className="pl-9"
          />
        </div>
        <Button type="submit" variant="secondary" size="md" disabled={loading}>
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            t.studio.search
          )}
        </Button>
      </form>

      {tab === "image" && (
        <div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleUpload}
          />
          <Button
            type="button"
            variant="outline"
            size="md"
            className="w-full"
            onClick={() => fileRef.current?.click()}
          >
            <Upload className="h-4 w-4" />
            {t.studio.upload}
          </Button>
        </div>
      )}

      {source === "seed" && (
        <p className="text-xs text-zinc-500">
          {t.studio.seedNotice}{" "}
          <code className="rounded bg-zinc-100 px-1 dark:bg-zinc-800">
            PEXELS_API_KEY
          </code>
          .
        </p>
      )}

      <div className="grid grid-cols-2 gap-2">
        {results.map((r) => (
          <button
            key={r.id}
            type="button"
            onClick={() => handlePick(r)}
            className="group relative aspect-square overflow-hidden rounded-md ring-1 ring-zinc-200 transition-all hover:ring-zinc-950 dark:ring-zinc-800 dark:hover:ring-white"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={r.thumb}
              alt={r.alt}
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
            />
            {r.type === "video" && (
              <>
                <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/15">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/85 text-zinc-950 shadow-md">
                    <Play className="h-4 w-4 fill-current" />
                  </span>
                </span>
                {r.durationSec ? (
                  <span className="absolute bottom-1.5 right-1.5 rounded bg-black/65 px-1.5 py-0.5 text-[10px] font-medium text-white">
                    {formatDuration(r.durationSec)}
                  </span>
                ) : null}
              </>
            )}
          </button>
        ))}
      </div>
      {!loading && results.length === 0 && (
        <p className="text-sm text-zinc-500">{t.errors.pexels}</p>
      )}
    </div>
  )
}
