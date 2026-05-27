"use client"

import type { SocialFormatId } from "./formats"
import type { Scene } from "./types"

// ─────────────────────────────────────────────────────────────────────────
// TODO (workshop minuto 13-16): implementa l'export multi-formato in ZIP.
//
// Obiettivo:
// 1. Per ogni formato in FORMATS (lib/formats.ts):
//    - Crea uno Stage di Konva offscreen alla dimensione format.w x format.h
//    - Renderizza lo scene (background + nodes) scalato per fittare
//    - Se `watermarked === true`, aggiungi un layer con il testo "MEMEFORGE"
//      in basso a sinistra
//    - Usa `stage.toDataURL({ mimeType: 'image/png' })` per ottenere il PNG
//    - Convertilo in Blob via `await fetch(dataUrl).then(r => r.blob())`
// 2. Inserisci ogni blob in un JSZip con il filename del formato
// 3. Genera il file ZIP e scaricalo con `file-saver`
//
// Suggerimento prompt per Cursor:
// "Implementa exportZip in lib/export.ts: per ogni SocialFormat, renderizza
//  lo scene in uno Stage Konva offscreen e aggiungilo a un JSZip. Aggiungi
//  un watermark 'MEMEFORGE' se watermarked è true. Scarica il file con
//  file-saver. Pre-carica tutte le immagini con `new Image()` prima del
//  rendering."
// ─────────────────────────────────────────────────────────────────────────

export type ExportOptions = {
  scene: Scene
  workingFormat: SocialFormatId
  formats?: SocialFormatId[]
  watermarked: boolean
  watermarkLabel?: string
  zipFilename?: string
}

export async function exportZip(opts: ExportOptions): Promise<void> {
  console.warn("TODO: implementa lib/export.ts", opts)
  alert(
    "TODO: implementa lib/export.ts.\n\nChiedi a Cursor:\n\"Implementa exportZip con Konva offscreen + JSZip + file-saver\""
  )
}
