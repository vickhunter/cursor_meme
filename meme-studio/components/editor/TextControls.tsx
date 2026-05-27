"use client"

import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { Select } from "@/components/ui/Select"
import { t } from "@/lib/i18n/it"
import type { SceneNode } from "@/lib/types"
import { FONT_FAMILIES, PRESET_COLORS } from "./fonts"

type Props = {
  node: Extract<SceneNode, { type: "text" }>
  onChange: (next: SceneNode) => void
}

export function TextControls({ node, onChange }: Props) {
  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="text-content">{t.studio.text.content}</Label>
        <Input
          id="text-content"
          value={node.text}
          onChange={(e) => onChange({ ...node, text: e.target.value })}
          placeholder={t.studio.text.contentPlaceholder}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="text-font">{t.studio.text.font}</Label>
        <Select
          id="text-font"
          value={node.fontFamily}
          onChange={(e) => onChange({ ...node, fontFamily: e.target.value })}
        >
          {FONT_FAMILIES.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="text-size">
          {t.studio.text.size} · {node.fontSize}px
        </Label>
        <input
          id="text-size"
          type="range"
          min={16}
          max={240}
          value={node.fontSize}
          onChange={(e) =>
            onChange({ ...node, fontSize: Number(e.target.value) })
          }
          className="w-full accent-zinc-950 dark:accent-white"
        />
      </div>

      <ColorRow
        label={t.studio.text.color}
        value={node.fill}
        onChange={(c) => onChange({ ...node, fill: c })}
      />

      <ColorRow
        label={t.studio.text.strokeColor}
        value={node.stroke ?? "#000000"}
        onChange={(c) => onChange({ ...node, stroke: c })}
      />

      <div className="space-y-1.5">
        <Label htmlFor="text-stroke">
          {t.studio.text.stroke} · {node.strokeWidth}
        </Label>
        <input
          id="text-stroke"
          type="range"
          min={0}
          max={20}
          value={node.strokeWidth}
          onChange={(e) =>
            onChange({ ...node, strokeWidth: Number(e.target.value) })
          }
          className="w-full accent-zinc-950 dark:accent-white"
        />
      </div>
    </div>
  )
}

function ColorRow({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (c: string) => void
}) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-9 w-12 cursor-pointer rounded border border-zinc-300 bg-transparent dark:border-zinc-700"
        />
        <div className="flex flex-wrap gap-1.5">
          {PRESET_COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => onChange(c)}
              className="h-5 w-5 rounded-full ring-1 ring-zinc-300 transition hover:ring-zinc-950 dark:ring-zinc-700 dark:hover:ring-white"
              style={{ background: c }}
              aria-label={c}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
