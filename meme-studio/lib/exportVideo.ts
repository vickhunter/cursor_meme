"use client"

import JSZip from "jszip"
import { saveAs } from "file-saver"
import { FORMATS, getFormat, type SocialFormat, type SocialFormatId } from "./formats"
import type { Scene, SceneNode } from "./types"

const DEFAULT_FPS = 30
const MAX_DURATION_SEC = 15
const MIN_DURATION_SEC = 4

function pickMimeType(): string {
  if (typeof MediaRecorder === "undefined") return ""
  const candidates = [
    "video/webm;codecs=vp9,opus",
    "video/webm;codecs=vp9",
    "video/webm;codecs=vp8",
    "video/webm",
  ]
  for (const m of candidates) {
    if (MediaRecorder.isTypeSupported(m)) return m
  }
  return ""
}

function loadImageEl(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    if (src.startsWith("http://") || src.startsWith("https://")) {
      img.crossOrigin = "anonymous"
    }
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error(`image load failed: ${src}`))
    img.src = src
  })
}

const VIDEO_LOAD_TIMEOUT_MS = 15_000

function loadVideoEl(src: string): Promise<HTMLVideoElement> {
  return new Promise((resolve, reject) => {
    const v = document.createElement("video")
    if (src.startsWith("http://") || src.startsWith("https://")) {
      v.crossOrigin = "anonymous"
    }
    v.muted = true
    v.loop = false
    v.playsInline = true
    v.preload = "auto"

    let settled = false
    const cleanup = () => {
      v.removeEventListener("loadeddata", onReady)
      v.removeEventListener("canplay", onReady)
      v.removeEventListener("error", onError)
      clearTimeout(timer)
    }
    const onReady = () => {
      if (settled) return
      settled = true
      cleanup()
      resolve(v)
    }
    const onError = () => {
      if (settled) return
      settled = true
      cleanup()
      reject(new Error(`video load failed: ${src}`))
    }
    v.addEventListener("loadeddata", onReady)
    v.addEventListener("canplay", onReady)
    v.addEventListener("error", onError)

    const timer = setTimeout(() => {
      if (settled) return
      settled = true
      cleanup()
      reject(new Error(`video load timed out (>${VIDEO_LOAD_TIMEOUT_MS}ms): ${src}`))
    }, VIDEO_LOAD_TIMEOUT_MS)

    v.src = src
    try {
      v.load()
    } catch {
    }
  })
}

type PreloadedMedia = {
  images: Map<string, HTMLImageElement>
  videos: Map<string, HTMLVideoElement>
  durationSec: number
}

async function preloadMedia(scene: Scene): Promise<PreloadedMedia> {
  const images = new Map<string, HTMLImageElement>()
  const videos = new Map<string, HTMLVideoElement>()
  let maxDur = 0

  await Promise.all(
    scene.nodes.map(async (node) => {
      if (node.type === "image") {
        try {
          images.set(node.src, await loadImageEl(node.src))
        } catch (err) {
          console.warn(err)
        }
      } else if (node.type === "video") {
        try {
          const v = await loadVideoEl(node.src)
          videos.set(node.id, v)
          const d = Number.isFinite(v.duration) ? v.duration : 0
          if (d > maxDur) maxDur = d
        } catch (err) {
          console.warn(err)
        }
      }
    })
  )

  const durationSec = Math.min(
    MAX_DURATION_SEC,
    Math.max(MIN_DURATION_SEC, maxDur || MIN_DURATION_SEC)
  )
  return { images, videos, durationSec }
}

function wrapLines(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const result: string[] = []
  for (const rawLine of text.split(/\r?\n/)) {
    const words = rawLine.split(/(\s+)/)
    let current = ""
    for (const w of words) {
      const candidate = current + w
      if (ctx.measureText(candidate).width <= maxWidth || current === "") {
        current = candidate
      } else {
        result.push(current.trimEnd())
        current = w.trimStart()
      }
    }
    result.push(current)
  }
  return result
}

function drawTextNode(
  ctx: CanvasRenderingContext2D,
  node: Extract<SceneNode, { type: "text" }>
) {
  const fontStyle = node.fontStyle.includes("bold") ? "bold" : "normal"
  const italic = node.fontStyle.includes("italic") ? "italic " : ""
  ctx.font = `${italic}${fontStyle} ${node.fontSize}px ${node.fontFamily}, sans-serif`
  ctx.textBaseline = "top"
  ctx.fillStyle = node.fill
  const align = node.align
  ctx.textAlign = align === "left" ? "left" : align === "right" ? "right" : "center"

  const lines = wrapLines(ctx, node.text, node.width)
  const lineHeight = node.fontSize * 1.16
  const drawX =
    align === "center"
      ? node.x + node.width / 2
      : align === "right"
      ? node.x + node.width
      : node.x

  ctx.save()
  if (node.stroke && node.strokeWidth > 0) {
    ctx.lineWidth = node.strokeWidth
    ctx.strokeStyle = node.stroke
    ctx.lineJoin = "round"
    ctx.miterLimit = 2
    for (let i = 0; i < lines.length; i++) {
      ctx.strokeText(lines[i], drawX, node.y + i * lineHeight)
    }
  }
  for (let i = 0; i < lines.length; i++) {
    ctx.fillText(lines[i], drawX, node.y + i * lineHeight)
  }
  ctx.restore()
}

function applyRotation(
  ctx: CanvasRenderingContext2D,
  node: SceneNode,
  fn: () => void
) {
  const rot = ("rotation" in node ? node.rotation : 0) || 0
  if (!rot) {
    fn()
    return
  }
  let cx: number, cy: number
  if (node.type === "text") {
    cx = node.x + node.width / 2
    cy = node.y + node.fontSize / 2
  } else {
    cx = node.x + node.width / 2
    cy = node.y + node.height / 2
  }
  ctx.save()
  ctx.translate(cx, cy)
  ctx.rotate((rot * Math.PI) / 180)
  ctx.translate(-cx, -cy)
  fn()
  ctx.restore()
}

function paintFrame(
  ctx: CanvasRenderingContext2D,
  scene: Scene,
  source: SocialFormat,
  target: SocialFormat,
  media: PreloadedMedia,
  watermarked: boolean,
  watermarkLabel: string
) {
  ctx.fillStyle = scene.background
  ctx.fillRect(0, 0, target.w, target.h)

  const scale = Math.min(target.w / source.w, target.h / source.h)
  const offsetX = (target.w - source.w * scale) / 2
  const offsetY = (target.h - source.h * scale) / 2

  ctx.save()
  ctx.translate(offsetX, offsetY)
  ctx.scale(scale, scale)

  for (const node of scene.nodes) {
    applyRotation(ctx, node, () => {
      if (node.type === "image") {
        const img = media.images.get(node.src)
        if (img && img.naturalWidth > 0) {
          ctx.drawImage(img, node.x, node.y, node.width, node.height)
        }
      } else if (node.type === "video") {
        const v = media.videos.get(node.id)
        if (v && v.readyState >= 2) {
          ctx.drawImage(v, node.x, node.y, node.width, node.height)
        }
      } else if (node.type === "rect") {
        ctx.fillStyle = node.fill
        ctx.fillRect(node.x, node.y, node.width, node.height)
      } else if (node.type === "text") {
        drawTextNode(ctx, node)
      }
    })
  }

  ctx.restore()

  if (watermarked) {
    const diagSize = Math.floor(Math.min(target.w, target.h) * 0.11)
    ctx.save()
    ctx.translate(target.w / 2, target.h / 2)
    ctx.rotate((-28 * Math.PI) / 180)
    ctx.font = `bold ${diagSize}px Impact, "Arial Black", sans-serif`
    ctx.textBaseline = "middle"
    ctx.textAlign = "center"
    ctx.lineJoin = "round"
    ctx.lineWidth = Math.max(1, Math.floor(diagSize * 0.04))
    ctx.strokeStyle = "rgba(0,0,0,0.22)"
    ctx.fillStyle = "rgba(255,255,255,0.32)"
    const diagText = `${watermarkLabel} · FREE`
    ctx.strokeText(diagText, 0, 0)
    ctx.fillText(diagText, 0, 0)
    ctx.restore()

    const cornerSize = Math.max(22, Math.floor(target.h * 0.034))
    const padding = Math.floor(cornerSize * 0.6)
    ctx.save()
    ctx.font = `bold ${cornerSize}px Impact, "Arial Black", sans-serif`
    ctx.textBaseline = "alphabetic"
    ctx.textAlign = "left"
    ctx.lineJoin = "round"
    ctx.lineWidth = Math.max(1, Math.floor(cornerSize * 0.06))
    ctx.strokeStyle = "rgba(0,0,0,0.75)"
    ctx.fillStyle = "rgba(255,255,255,0.95)"
    const ty = target.h - padding
    ctx.strokeText(watermarkLabel, padding, ty)
    ctx.fillText(watermarkLabel, padding, ty)
    ctx.restore()
  }
}

async function recordFormat({
  scene,
  source,
  target,
  media,
  watermarked,
  watermarkLabel,
  fps,
  durationSec,
}: {
  scene: Scene
  source: SocialFormat
  target: SocialFormat
  media: PreloadedMedia
  watermarked: boolean
  watermarkLabel: string
  fps: number
  durationSec: number
}): Promise<Blob> {
  const canvas = document.createElement("canvas")
  canvas.width = target.w
  canvas.height = target.h
  const ctx = canvas.getContext("2d", { alpha: false })
  if (!ctx) throw new Error("Canvas 2D not available")

  paintFrame(ctx, scene, source, target, media, watermarked, watermarkLabel)

  const mime = pickMimeType()
  if (typeof canvas.captureStream !== "function") {
    throw new Error("canvas.captureStream non è supportato in questo browser.")
  }
  const stream = canvas.captureStream(fps)
  const recorder = new MediaRecorder(stream, {
    mimeType: mime || undefined,
    videoBitsPerSecond: 2_500_000,
  })
  const chunks: Blob[] = []
  recorder.ondataavailable = (e) => {
    if (e.data.size > 0) chunks.push(e.data)
  }

  const finished = new Promise<Blob>((resolve, reject) => {
    const stopTimer = setTimeout(() => {
      reject(new Error("MediaRecorder.stop() non ha emesso onstop in tempo."))
    }, 8000)
    recorder.onstop = () => {
      clearTimeout(stopTimer)
      resolve(new Blob(chunks, { type: mime || "video/webm" }))
    }
    recorder.onerror = (ev) => {
      clearTimeout(stopTimer)
      reject(new Error(`MediaRecorder error: ${(ev as ErrorEvent).message ?? "unknown"}`))
    }
  })

  for (const v of media.videos.values()) {
    try {
      v.pause()
      v.currentTime = 0
    } catch {}
  }

  recorder.start(100)

  await Promise.all(
    [...media.videos.values()].map(async (v) => {
      try {
        await v.play()
      } catch (err) {
        console.warn("video.play() rejected", err)
      }
    })
  )

  const start = performance.now()
  const durationMs = durationSec * 1000
  await new Promise<void>((resolve) => {
    const tick = () => {
      const elapsed = performance.now() - start
      paintFrame(ctx, scene, source, target, media, watermarked, watermarkLabel)
      if (elapsed >= durationMs) {
        resolve()
        return
      }
      requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  })

  for (const v of media.videos.values()) {
    try {
      v.pause()
    } catch {}
  }

  if (recorder.state !== "inactive") {
    try {
      recorder.requestData()
    } catch {}
    recorder.stop()
  }
  return await finished
}

export type ExportVideoOptions = {
  scene: Scene
  workingFormat: SocialFormatId
  formats?: SocialFormatId[]
  watermarked: boolean
  watermarkLabel?: string
  zipFilename?: string
  fps?: number
  onProgress?: (info: { formatId: SocialFormatId; index: number; total: number }) => void
}

export async function exportVideoZip({
  scene,
  workingFormat,
  formats,
  watermarked,
  watermarkLabel = "MEMEFORGE",
  zipFilename = "memeforge-video.zip",
  fps = DEFAULT_FPS,
  onProgress,
}: ExportVideoOptions): Promise<void> {
  if (typeof MediaRecorder === "undefined") {
    throw new Error("MediaRecorder non è supportato in questo browser.")
  }
  const source = getFormat(workingFormat)
  const targets = (formats ?? FORMATS.map((f) => f.id)).map(getFormat)
  const media = await preloadMedia(scene)
  const zip = new JSZip()

  for (let i = 0; i < targets.length; i++) {
    const target = targets[i]
    onProgress?.({ formatId: target.id, index: i, total: targets.length })
    const blob = await recordFormat({
      scene,
      source,
      target,
      media,
      watermarked,
      watermarkLabel,
      fps,
      durationSec: media.durationSec,
    })
    const filename = target.filename.replace(/\.png$/i, ".webm")
    zip.file(filename, blob)
  }

  for (const v of media.videos.values()) {
    try {
      v.pause()
      v.removeAttribute("src")
      v.load()
    } catch {}
  }

  const content = await zip.generateAsync({ type: "blob" })
  saveAs(content, zipFilename)
}

export function sceneHasVideo(scene: Scene): boolean {
  return scene.nodes.some((n) => n.type === "video")
}
