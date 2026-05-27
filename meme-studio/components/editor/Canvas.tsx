"use client"

import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { Layer, Rect, Stage, Transformer } from "react-konva"
import type Konva from "konva"
import type { Scene, SceneNode } from "@/lib/types"
import type { SocialFormat } from "@/lib/formats"
import { t } from "@/lib/i18n/it"
import { ImageNode, RectNode, TextNode, VideoNode } from "./CanvasNodes"
import { MockFrame, getMockFrameMetrics } from "./MockFrame"

export type CanvasHandle = {
  getStage: () => Konva.Stage | null
}

type CanvasProps = {
  scene: Scene
  format: SocialFormat
  selectedId: string | null
  onSelect: (id: string | null) => void
  onChange: (next: Scene) => void
  stageRef: React.RefObject<Konva.Stage | null>
  showMockFrame: boolean
  isPlaying: boolean
}

export function Canvas({
  scene,
  format,
  selectedId,
  onSelect,
  onChange,
  stageRef,
  showMockFrame,
  isPlaying,
}: CanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const transformerRef = useRef<Konva.Transformer>(null)
  const nodeMap = useRef<Map<string, Konva.Node>>(new Map())
  const [scale, setScale] = useState(1)

  useLayoutEffect(() => {
    const el = containerRef.current
    if (!el) return
    const compute = () => {
      const rect = el.getBoundingClientRect()
      const padding = 48
      const availW = Math.max(0, rect.width - padding)
      const availH = Math.max(0, rect.height - padding)
      let next: number
      if (showMockFrame) {
        const probeMetrics = getMockFrameMetrics(format.id, format.w)
        const totalH = format.h + probeMetrics.topGutter + probeMetrics.bottomGutter
        const totalW = format.w + probeMetrics.sideGutter * 2
        next = Math.min(availW / totalW, availH / totalH, 1)
      } else {
        next = Math.min(availW / format.w, availH / format.h, 1)
      }
      setScale(Math.max(0.05, next))
    }
    compute()
    const ro = new ResizeObserver(compute)
    ro.observe(el)
    return () => ro.disconnect()
  }, [format.w, format.h, format.id, showMockFrame])

  useEffect(() => {
    const tr = transformerRef.current
    if (!tr) return
    const node = selectedId ? nodeMap.current.get(selectedId) : null
    tr.nodes(node ? [node] : [])
    tr.getLayer()?.batchDraw()
  }, [selectedId, scene.nodes])

  const registerNode = (id: string, node: Konva.Node | null) => {
    if (node) nodeMap.current.set(id, node)
    else nodeMap.current.delete(id)
  }

  const updateNode = (next: SceneNode) => {
    onChange({
      ...scene,
      nodes: scene.nodes.map((n) => (n.id === next.id ? next : n)),
    })
  }

  const handleStageClick = (
    e: Konva.KonvaEventObject<MouseEvent | TouchEvent>
  ) => {
    if (e.target === e.target.getStage()) {
      onSelect(null)
    }
  }

  const cssW = format.w * scale
  const cssH = format.h * scale

  const stageBlock = (
    <div
      className="relative shadow-2xl shadow-black/20 ring-1 ring-zinc-200 dark:ring-zinc-800"
      style={{
        width: cssW,
        height: cssH,
        background: scene.background,
      }}
    >
      <Stage
        ref={stageRef}
        width={cssW}
        height={cssH}
        scaleX={scale}
        scaleY={scale}
        onMouseDown={handleStageClick}
        onTouchStart={handleStageClick}
      >
        <Layer listening={false}>
          <Rect
            x={0}
            y={0}
            width={format.w}
            height={format.h}
            fill={scene.background}
          />
        </Layer>
        <Layer>
          {scene.nodes.map((node) => {
            const isSelected = node.id === selectedId
            const commonProps = {
              isSelected,
              onSelect: () => onSelect(node.id),
              onChange: updateNode,
              registerNode,
            }
            if (node.type === "image") {
              return <ImageNode key={node.id} node={node} {...commonProps} />
            }
            if (node.type === "video") {
              return (
                <VideoNode
                  key={node.id}
                  node={node}
                  isPlaying={isPlaying}
                  {...commonProps}
                />
              )
            }
            if (node.type === "text") {
              return <TextNode key={node.id} node={node} {...commonProps} />
            }
            return <RectNode key={node.id} node={node} {...commonProps} />
          })}
          <Transformer
            ref={transformerRef}
            rotateEnabled
            keepRatio={false}
            boundBoxFunc={(_oldBox, newBox) => {
              if (newBox.width < 10 || newBox.height < 10) return _oldBox
              return newBox
            }}
          />
        </Layer>
      </Stage>
      {scene.nodes.length === 0 && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-8 text-center text-sm text-zinc-400">
          {t.studio.canvas.empty}
        </div>
      )}
    </div>
  )

  return (
    <div
      ref={containerRef}
      className="relative flex h-full w-full items-center justify-center overflow-hidden bg-zinc-100 dark:bg-zinc-900"
    >
      {showMockFrame ? (
        <MockFrame
          formatId={format.id}
          cssWidth={cssW}
          cssHeight={cssH}
        >
          {stageBlock}
        </MockFrame>
      ) : (
        stageBlock
      )}
      <div className="pointer-events-none absolute bottom-2 right-3 select-none text-xs text-zinc-400">
        {format.w}×{format.h} · {Math.round(scale * 100)}%
        {showMockFrame && <span className="ml-1">· anteprima social</span>}
      </div>
    </div>
  )
}
