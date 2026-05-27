"use client"

import Konva from "konva"
import JSZip from "jszip"
import { saveAs } from "file-saver"
import { FORMATS, getFormat, type SocialFormat, type SocialFormatId } from "./formats"
import type { Scene } from "./types"

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new window.Image()
    img.crossOrigin = "anonymous"
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`))
    img.src = src
  })
}

async function preloadImages(scene: Scene): Promise<Map<string, HTMLImageElement>> {
  const map = new Map<string, HTMLImageElement>()
  const sources = new Set<string>()
  for (const node of scene.nodes) {
    if (node.type === "image") sources.add(node.src)
    else if (node.type === "video" && node.poster) sources.add(node.poster)
  }
  await Promise.all(
    [...sources].map(async (src) => {
      try {
        map.set(src, await loadImage(src))
      } catch {
      }
    })
  )
  return map
}

function paintScene(
  stage: Konva.Stage,
  scene: Scene,
  target: SocialFormat,
  source: SocialFormat,
  images: Map<string, HTMLImageElement>
) {
  const bgLayer = new Konva.Layer({ listening: false })
  bgLayer.add(
    new Konva.Rect({
      x: 0,
      y: 0,
      width: target.w,
      height: target.h,
      fill: scene.background,
    })
  )
  stage.add(bgLayer)

  const scaleX = target.w / source.w
  const scaleY = target.h / source.h
  const scale = Math.min(scaleX, scaleY)
  const offsetX = (target.w - source.w * scale) / 2
  const offsetY = (target.h - source.h * scale) / 2

  const contentLayer = new Konva.Layer({ listening: false })
  contentLayer.scale({ x: scale, y: scale })
  contentLayer.position({ x: offsetX, y: offsetY })

  for (const node of scene.nodes) {
    if (node.type === "image") {
      const img = images.get(node.src)
      if (!img) continue
      contentLayer.add(
        new Konva.Image({
          image: img,
          x: node.x,
          y: node.y,
          width: node.width,
          height: node.height,
          rotation: node.rotation,
        })
      )
    } else if (node.type === "video") {
      const img = node.poster ? images.get(node.poster) : null
      if (img) {
        contentLayer.add(
          new Konva.Image({
            image: img,
            x: node.x,
            y: node.y,
            width: node.width,
            height: node.height,
            rotation: node.rotation,
          })
        )
      }
    } else if (node.type === "text") {
      contentLayer.add(
        new Konva.Text({
          text: node.text,
          x: node.x,
          y: node.y,
          fontFamily: node.fontFamily,
          fontSize: node.fontSize,
          fill: node.fill,
          stroke: node.stroke ?? undefined,
          strokeWidth: node.strokeWidth,
          align: node.align,
          width: node.width,
          rotation: node.rotation,
        })
      )
    } else if (node.type === "rect") {
      contentLayer.add(
        new Konva.Rect({
          x: node.x,
          y: node.y,
          width: node.width,
          height: node.height,
          fill: node.fill,
          rotation: node.rotation,
        })
      )
    }
  }
  stage.add(contentLayer)
}

function paintWatermark(stage: Konva.Stage, target: SocialFormat, label: string) {
  const watermarkLayer = new Konva.Layer({ listening: false })
  const fontSize = Math.max(18, Math.floor(target.h * 0.028))
  const padding = Math.floor(fontSize * 0.6)

  const wm = new Konva.Text({
    text: label,
    fontFamily: "Impact, Arial Black, sans-serif",
    fontSize,
    fill: "rgba(255,255,255,0.95)",
    stroke: "rgba(0,0,0,0.7)",
    strokeWidth: Math.max(1, Math.floor(fontSize * 0.06)),
    fontStyle: "bold",
  })
  wm.x(padding)
  wm.y(target.h - fontSize - padding)
  watermarkLayer.add(wm)
  stage.add(watermarkLayer)
}

async function renderFormat(
  scene: Scene,
  source: SocialFormat,
  target: SocialFormat,
  images: Map<string, HTMLImageElement>,
  watermarked: boolean,
  watermarkLabel: string
): Promise<Blob> {
  const container = document.createElement("div")
  container.style.position = "absolute"
  container.style.left = "-10000px"
  container.style.top = "-10000px"
  document.body.appendChild(container)

  try {
    const stage = new Konva.Stage({
      container,
      width: target.w,
      height: target.h,
    })

    paintScene(stage, scene, target, source, images)

    if (watermarked) {
      paintWatermark(stage, target, watermarkLabel)
    }

    stage.draw()

    const dataUrl = stage.toDataURL({
      pixelRatio: 1,
      mimeType: "image/png",
    })
    stage.destroy()

    const res = await fetch(dataUrl)
    return await res.blob()
  } finally {
    container.remove()
  }
}

export type ExportOptions = {
  scene: Scene
  workingFormat: SocialFormatId
  formats?: SocialFormatId[]
  watermarked: boolean
  watermarkLabel?: string
  zipFilename?: string
}

export async function exportZip({
  scene,
  workingFormat,
  formats,
  watermarked,
  watermarkLabel = "MEMEFORGE",
  zipFilename = "memeforge-bundle.zip",
}: ExportOptions): Promise<void> {
  const source = getFormat(workingFormat)
  const targets = (formats ?? FORMATS.map((f) => f.id)).map(getFormat)
  const images = await preloadImages(scene)
  const zip = new JSZip()

  for (const target of targets) {
    const blob = await renderFormat(
      scene,
      source,
      target,
      images,
      watermarked,
      watermarkLabel
    )
    zip.file(target.filename, blob)
  }

  const content = await zip.generateAsync({ type: "blob" })
  saveAs(content, zipFilename)
}

export async function exportPreview(
  scene: Scene,
  workingFormat: SocialFormatId,
  watermarked: boolean
): Promise<string> {
  const source = getFormat(workingFormat)
  const images = await preloadImages(scene)
  const container = document.createElement("div")
  container.style.position = "absolute"
  container.style.left = "-10000px"
  document.body.appendChild(container)

  try {
    const stage = new Konva.Stage({
      container,
      width: source.w,
      height: source.h,
    })
    paintScene(stage, scene, source, source, images)
    if (watermarked) paintWatermark(stage, source, "MEMEFORGE")
    stage.draw()
    const dataUrl = stage.toDataURL({ mimeType: "image/png", pixelRatio: 0.5 })
    stage.destroy()
    return dataUrl
  } finally {
    container.remove()
  }
}
