"use client"

import { useState } from "react"
import { ImageIcon, Layers, Palette, Type } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Label } from "@/components/ui/Label"
import { Select } from "@/components/ui/Select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs"
import { FORMATS, type SocialFormat, type SocialFormatId } from "@/lib/formats"
import { t } from "@/lib/i18n/it"
import type { Scene, SceneNode } from "@/lib/types"
import { MediaSearch, type MediaPick } from "./MediaSearch"
import { LayerList } from "./LayerList"
import { TextControls } from "./TextControls"
import { PRESET_COLORS } from "./fonts"

type Props = {
  scene: Scene
  format: SocialFormat
  selectedId: string | null
  onSelect: (id: string | null) => void
  onChange: (next: Scene) => void
  onFormatChange: (id: SocialFormatId) => void
  onAddMedia: (pick: MediaPick) => void
  onAddText: () => void
  onAddRect: () => void
}

export function SidePanel({
  scene,
  format,
  selectedId,
  onSelect,
  onChange,
  onFormatChange,
  onAddMedia,
  onAddText,
  onAddRect,
}: Props) {
  const [tab, setTab] = useState("design")
  const selected = scene.nodes.find((n) => n.id === selectedId) ?? null

  const updateNode = (next: SceneNode) => {
    onChange({
      ...scene,
      nodes: scene.nodes.map((n) => (n.id === next.id ? next : n)),
    })
  }

  return (
    <aside className="flex h-full w-full flex-col gap-4 overflow-y-auto border-l border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="space-y-1.5">
        <Label htmlFor="format-select">{t.studio.format}</Label>
        <Select
          id="format-select"
          value={format.id}
          onChange={(e) => onFormatChange(e.target.value as SocialFormatId)}
        >
          {FORMATS.map((f) => (
            <option key={f.id} value={f.id}>
              {f.label} · {f.w}×{f.h}
            </option>
          ))}
        </Select>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="design">
            <Palette className="mr-1 h-4 w-4" />
            {t.studio.panel.design}
          </TabsTrigger>
          <TabsTrigger value="images">
            <ImageIcon className="mr-1 h-4 w-4" />
            {t.studio.panel.images}
          </TabsTrigger>
          <TabsTrigger value="text">
            <Type className="mr-1 h-4 w-4" />
            {t.studio.panel.text}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="design">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>Sfondo</Label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={scene.background}
                  onChange={(e) =>
                    onChange({ ...scene, background: e.target.value })
                  }
                  className="h-9 w-12 cursor-pointer rounded border border-zinc-300 bg-transparent dark:border-zinc-700"
                />
                <div className="flex flex-wrap gap-1.5">
                  {PRESET_COLORS.slice(0, 6).map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => onChange({ ...scene, background: c })}
                      className="h-5 w-5 rounded-full ring-1 ring-zinc-300 transition hover:ring-zinc-950 dark:ring-zinc-700 dark:hover:ring-white"
                      style={{ background: c }}
                      aria-label={c}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>{t.studio.layers.title}</Label>
              <LayerList
                scene={scene}
                selectedId={selectedId}
                onSelect={onSelect}
                onChange={onChange}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="images">
          <MediaSearch onPick={(pick: MediaPick) => onAddMedia(pick)} />
        </TabsContent>

        <TabsContent value="text">
          {selected && selected.type === "text" ? (
            <TextControls node={selected} onChange={updateNode} />
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-zinc-500">
                Aggiungi un livello di testo o seleziona uno esistente.
              </p>
              <Button onClick={onAddText} variant="primary" className="w-full">
                <Type className="h-4 w-4" />
                {t.studio.add.text}
              </Button>
              <Button onClick={onAddRect} variant="outline" className="w-full">
                <Layers className="h-4 w-4" />
                {t.studio.add.rect}
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </aside>
  )
}
