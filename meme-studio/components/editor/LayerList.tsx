"use client"

import {
  ChevronDown,
  ChevronUp,
  Film,
  ImageIcon,
  Square,
  Trash2,
  Type,
} from "lucide-react"
import { Button } from "@/components/ui/Button"
import { cn } from "@/lib/utils"
import { t } from "@/lib/i18n/it"
import type { Scene, SceneNode } from "@/lib/types"

type Props = {
  scene: Scene
  selectedId: string | null
  onSelect: (id: string | null) => void
  onChange: (next: Scene) => void
}

export function LayerList({ scene, selectedId, onSelect, onChange }: Props) {
  if (scene.nodes.length === 0) {
    return (
      <p className="text-sm text-zinc-500">{t.studio.layers.empty}</p>
    )
  }

  const move = (id: string, direction: "front" | "back") => {
    const nodes = [...scene.nodes]
    const idx = nodes.findIndex((n) => n.id === id)
    if (idx === -1) return
    const target = direction === "front" ? idx + 1 : idx - 1
    if (target < 0 || target >= nodes.length) return
    ;[nodes[idx], nodes[target]] = [nodes[target], nodes[idx]]
    onChange({ ...scene, nodes })
  }

  const remove = (id: string) => {
    onChange({ ...scene, nodes: scene.nodes.filter((n) => n.id !== id) })
    if (selectedId === id) onSelect(null)
  }

  return (
    <ul className="space-y-1">
      {[...scene.nodes].reverse().map((node) => (
        <li key={node.id}>
          <div
            className={cn(
              "flex items-center gap-2 rounded-md border px-2 py-1.5 text-sm transition-colors",
              selectedId === node.id
                ? "border-zinc-950 bg-zinc-100 dark:border-white dark:bg-zinc-800"
                : "border-zinc-200 dark:border-zinc-800"
            )}
          >
            <button
              type="button"
              onClick={() => onSelect(node.id)}
              className="flex flex-1 items-center gap-2 truncate text-left"
            >
              <NodeIcon node={node} />
              <span className="truncate">{nodeLabel(node)}</span>
            </button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => move(node.id, "front")}
              aria-label={t.studio.layers.front}
              className="h-7 w-7"
            >
              <ChevronUp className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => move(node.id, "back")}
              aria-label={t.studio.layers.back}
              className="h-7 w-7"
            >
              <ChevronDown className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => remove(node.id)}
              aria-label={t.studio.layers.delete}
              className="h-7 w-7 text-red-600"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </li>
      ))}
    </ul>
  )
}

function NodeIcon({ node }: { node: SceneNode }) {
  if (node.type === "image") return <ImageIcon className="h-4 w-4 text-zinc-500" />
  if (node.type === "video") return <Film className="h-4 w-4 text-zinc-500" />
  if (node.type === "text") return <Type className="h-4 w-4 text-zinc-500" />
  return <Square className="h-4 w-4 text-zinc-500" />
}

function nodeLabel(node: SceneNode): string {
  if (node.type === "text") return node.text || "Testo"
  if (node.type === "image") return "Immagine"
  if (node.type === "video") return node.sourceLabel || "Video"
  return "Rettangolo"
}
