"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Loader2, Search, Upload } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { t } from "@/lib/i18n/it"

export type ImageResult = {
  id: string
  thumb: string
  full: string
  alt: string
  photographer?: string
}

type Props = {
  onPick: (url: string) => void
}

export function ImageSearch({ onPick }: Props) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<ImageResult[]>([])
  const [loading, setLoading] = useState(false)
  const [source, setSource] = useState<"pexels" | "seed">("seed")
  const [todoLabel, setTodoLabel] = useState<string | null>(null)
  const [hasPexels, setHasPexels] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const fetchImages = useCallback(async (q: string) => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ q })
      const res = await fetch(`/api/images?${params}`)
      const data = (await res.json()) as {
        results: ImageResult[]
        source: "pexels" | "seed"
        todo?: string
        hasPexels?: boolean
      }
      setResults(data.results)
      setSource(data.source)
      setTodoLabel(data.todo ?? null)
      setHasPexels(Boolean(data.hasPexels))
    } catch {
      setResults([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchImages("")
  }, [fetchImages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    fetchImages(query)
  }

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === "string") onPick(reader.result)
    }
    reader.readAsDataURL(file)
    e.target.value = ""
  }

  return (
    <div className="space-y-3">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <Input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.studio.searchPlaceholder}
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

      {source === "seed" && todoLabel ? (
        <p className="text-xs text-amber-700 dark:text-amber-400">
          Stai vedendo immagini di esempio. Completa il TODO in
          <code className="mx-1 rounded bg-amber-50 px-1 dark:bg-amber-950">
            app/api/images/route.ts
          </code>
          per attivare la ricerca live Pexels{hasPexels ? " (chiave già caricata)" : ""}.
        </p>
      ) : source === "seed" && !hasPexels ? (
        <p className="text-xs text-zinc-500">
          Modalità locale senza chiave Pexels. Aggiungi
          <code className="mx-1 rounded bg-zinc-100 px-1 dark:bg-zinc-800">
            PEXELS_API_KEY
          </code>
          al tuo <code className="mx-1 rounded bg-zinc-100 px-1 dark:bg-zinc-800">.envrc</code>
          per la ricerca live.
        </p>
      ) : null}

      <div className="grid grid-cols-2 gap-2">
        {results.map((r) => (
          <button
            key={r.id}
            type="button"
            onClick={() => onPick(r.full)}
            className="group relative aspect-square overflow-hidden rounded-md ring-1 ring-zinc-200 transition-all hover:ring-zinc-950 dark:ring-zinc-800 dark:hover:ring-white"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={r.thumb}
              alt={r.alt}
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
            />
          </button>
        ))}
      </div>
      {!loading && results.length === 0 && (
        <p className="text-sm text-zinc-500">{t.errors.pexels}</p>
      )}
    </div>
  )
}
