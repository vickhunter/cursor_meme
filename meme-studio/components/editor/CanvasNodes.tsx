"use client"

import { useEffect, useRef } from "react"
import { Image as KonvaImage, Rect, Text } from "react-konva"
import type Konva from "konva"
import type { SceneNode } from "@/lib/types"
import { useImage } from "./useImage"
import { useVideo } from "./useVideo"

type CommonProps = {
  isSelected: boolean
  onSelect: () => void
  onChange: (next: SceneNode) => void
  registerNode: (id: string, node: Konva.Node | null) => void
}

export function ImageNode({
  node,
  onSelect,
  onChange,
  registerNode,
}: { node: Extract<SceneNode, { type: "image" }> } & CommonProps) {
  const ref = useRef<Konva.Image>(null)
  const img = useImage(node.src)

  useEffect(() => {
    registerNode(node.id, ref.current)
    return () => registerNode(node.id, null)
  }, [node.id, registerNode])

  if (!img) return null

  return (
    <KonvaImage
      ref={ref}
      image={img}
      x={node.x}
      y={node.y}
      width={node.width}
      height={node.height}
      rotation={node.rotation}
      draggable
      onClick={onSelect}
      onTap={onSelect}
      onDragEnd={(e) => {
        onChange({ ...node, x: e.target.x(), y: e.target.y() })
      }}
      onTransformEnd={() => {
        const n = ref.current
        if (!n) return
        const scaleX = n.scaleX()
        const scaleY = n.scaleY()
        n.scaleX(1)
        n.scaleY(1)
        onChange({
          ...node,
          x: n.x(),
          y: n.y(),
          rotation: n.rotation(),
          width: Math.max(20, n.width() * scaleX),
          height: Math.max(20, n.height() * scaleY),
        })
      }}
    />
  )
}

export function VideoNode({
  node,
  isPlaying,
  onSelect,
  onChange,
  registerNode,
}: {
  node: Extract<SceneNode, { type: "video" }>
  isPlaying: boolean
} & CommonProps) {
  const ref = useRef<Konva.Image>(null)
  const { element: video, ready } = useVideo(node.src, {
    playing: isPlaying,
    muted: true,
    loop: true,
  })

  useEffect(() => {
    registerNode(node.id, ref.current)
    return () => registerNode(node.id, null)
  }, [node.id, registerNode])

  useEffect(() => {
    if (!video || !ready || !isPlaying) return
    const konvaNode = ref.current
    if (!konvaNode) return
    const layer = konvaNode.getLayer()
    if (!layer) return
    let rafId = 0
    const tick = () => {
      layer.batchDraw()
      rafId = requestAnimationFrame(tick)
    }
    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [video, ready, isPlaying])

  if (!video || !ready) return null

  return (
    <KonvaImage
      ref={ref}
      image={video}
      x={node.x}
      y={node.y}
      width={node.width}
      height={node.height}
      rotation={node.rotation}
      draggable
      onClick={onSelect}
      onTap={onSelect}
      onDragEnd={(e) => {
        onChange({ ...node, x: e.target.x(), y: e.target.y() })
      }}
      onTransformEnd={() => {
        const n = ref.current
        if (!n) return
        const scaleX = n.scaleX()
        const scaleY = n.scaleY()
        n.scaleX(1)
        n.scaleY(1)
        onChange({
          ...node,
          x: n.x(),
          y: n.y(),
          rotation: n.rotation(),
          width: Math.max(20, n.width() * scaleX),
          height: Math.max(20, n.height() * scaleY),
        })
      }}
    />
  )
}

export function TextNode({
  node,
  onSelect,
  onChange,
  registerNode,
}: { node: Extract<SceneNode, { type: "text" }> } & CommonProps) {
  const ref = useRef<Konva.Text>(null)

  useEffect(() => {
    registerNode(node.id, ref.current)
    return () => registerNode(node.id, null)
  }, [node.id, registerNode])

  return (
    <Text
      ref={ref}
      text={node.text}
      x={node.x}
      y={node.y}
      fontFamily={node.fontFamily}
      fontSize={node.fontSize}
      fill={node.fill}
      stroke={node.stroke ?? undefined}
      strokeWidth={node.strokeWidth}
      fontStyle={node.fontStyle}
      align={node.align}
      width={node.width}
      rotation={node.rotation}
      draggable
      onClick={onSelect}
      onTap={onSelect}
      onDragEnd={(e) => {
        onChange({ ...node, x: e.target.x(), y: e.target.y() })
      }}
      onTransformEnd={() => {
        const n = ref.current
        if (!n) return
        const scaleX = n.scaleX()
        const scaleY = n.scaleY()
        n.scaleX(1)
        n.scaleY(1)
        onChange({
          ...node,
          x: n.x(),
          y: n.y(),
          rotation: n.rotation(),
          width: Math.max(50, n.width() * scaleX),
          fontSize: Math.max(8, node.fontSize * ((scaleX + scaleY) / 2)),
        })
      }}
    />
  )
}

export function RectNode({
  node,
  onSelect,
  onChange,
  registerNode,
}: { node: Extract<SceneNode, { type: "rect" }> } & CommonProps) {
  const ref = useRef<Konva.Rect>(null)

  useEffect(() => {
    registerNode(node.id, ref.current)
    return () => registerNode(node.id, null)
  }, [node.id, registerNode])

  return (
    <Rect
      ref={ref}
      x={node.x}
      y={node.y}
      width={node.width}
      height={node.height}
      fill={node.fill}
      rotation={node.rotation}
      draggable
      onClick={onSelect}
      onTap={onSelect}
      onDragEnd={(e) => {
        onChange({ ...node, x: e.target.x(), y: e.target.y() })
      }}
      onTransformEnd={() => {
        const n = ref.current
        if (!n) return
        const scaleX = n.scaleX()
        const scaleY = n.scaleY()
        n.scaleX(1)
        n.scaleY(1)
        onChange({
          ...node,
          x: n.x(),
          y: n.y(),
          rotation: n.rotation(),
          width: Math.max(10, n.width() * scaleX),
          height: Math.max(10, n.height() * scaleY),
        })
      }}
    />
  )
}
