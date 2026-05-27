"use client"

import { useLayoutEffect, useRef, useState } from "react"
import type Konva from "konva"
import type { Scene } from "@/lib/types"
import type { SocialFormat } from "@/lib/formats"
import { t } from "@/lib/i18n/it"

// ─────────────────────────────────────────────────────────────────────────
// TODO (workshop minuto 5-9): implementa il canvas con react-konva.
//
// Obiettivo: mostrare uno Stage di Konva alla dimensione `format.w x format.h`,
// scalato per entrare nel container. Renderizza ogni nodo di `scene.nodes`
// come Image / Text / Rect. Permetti drag, resize e rotate con il
// componente Transformer. Aggiorna lo scene via `onChange` quando l'utente
// sposta o ridimensiona un elemento.
//
// Suggerimento prompt per Cursor:
// "Implementa Canvas.tsx con react-konva. Renderizza scene.nodes (image,
//  text, rect) dentro uno Stage scalato alla dimensione di `format`. Usa
//  Transformer per la selezione. Aggiorna scene tramite onChange in modo
//  immutabile. Vedi components/editor/CanvasNodes.tsx per i pezzi pronti."
//
// I componenti ImageNode / TextNode / RectNode sono già pronti in
// ./CanvasNodes.tsx — puoi importarli e usarli direttamente.
// ─────────────────────────────────────────────────────────────────────────

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
}

export function Canvas({ scene, format }: CanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)

  useLayoutEffect(() => {
    const el = containerRef.current
    if (!el) return
    const compute = () => {
      const rect = el.getBoundingClientRect()
      const padding = 32
      const sx = (rect.width - padding) / format.w
      const sy = (rect.height - padding) / format.h
      setScale(Math.min(sx, sy, 1))
    }
    compute()
    const ro = new ResizeObserver(compute)
    ro.observe(el)
    return () => ro.disconnect()
  }, [format.w, format.h])

  return (
    <div
      ref={containerRef}
      className="relative flex h-full w-full items-center justify-center overflow-hidden bg-zinc-100 dark:bg-zinc-900"
    >
      <div
        className="relative flex items-center justify-center text-center shadow-2xl shadow-black/20 ring-1 ring-zinc-200 dark:ring-zinc-800"
        style={{
          width: format.w * scale,
          height: format.h * scale,
          background: scene.background,
        }}
      >
        <div className="space-y-2 px-6 text-zinc-500">
          <p className="text-sm">{t.studio.canvas.empty}</p>
          <p className="text-xs font-medium uppercase tracking-wider text-fuchsia-600">
            TODO · implementa Canvas.tsx
          </p>
        </div>
      </div>
      <div className="pointer-events-none absolute bottom-2 right-3 select-none text-xs text-zinc-400">
        {format.w}×{format.h} · {Math.round(scale * 100)}%
      </div>
    </div>
  )
}
