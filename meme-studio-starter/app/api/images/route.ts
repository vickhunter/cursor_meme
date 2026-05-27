import { NextResponse } from "next/server"
import { hasPexelsConfigured } from "@/lib/env"

export const runtime = "nodejs"

// ─────────────────────────────────────────────────────────────────────────
// TODO (workshop minuto 9-13): proxy alla Pexels API + fallback seed.
//
// Obiettivo:
// 1. Leggi `q` dalla query string
// 2. Se `hasPexelsConfigured` è false, restituisci 12 immagini-seed
//    generate come SVG inline (gradiente + testo con la query)
// 3. Altrimenti chiama Pexels:
//      https://api.pexels.com/v1/search?query=<q>&per_page=24
//    con header `Authorization: <PEXELS_API_KEY>`
// 4. Mappa la risposta in `{ id, thumb, full, alt, photographer }[]`
// 5. Restituisci `{ results, source: "pexels" | "seed" }`
//
// Suggerimento prompt per Cursor:
// "Implementa GET in app/api/images/route.ts: se PEXELS_API_KEY è
//  configurata fai una richiesta alla Pexels Search API, altrimenti
//  restituisci 12 immagini SVG di esempio con gradiente colorato e il
//  testo della query. Vedi serverEnv in lib/env.ts."
// ─────────────────────────────────────────────────────────────────────────

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const query = searchParams.get("q") ?? ""

  return NextResponse.json({
    results: placeholderResults(query),
    source: "seed" as const,
    todo: "Implementa la ricerca immagini in app/api/images/route.ts",
    hasPexels: hasPexelsConfigured,
  })
}

function placeholderResults(q: string) {
  const label = (q || "TODO").toUpperCase()
  return Array.from({ length: 6 }, (_, i) => {
    // NB: l'SVG necessita di `width` + `height` espliciti, altrimenti Konva
    // non riesce a calcolare le dimensioni naturali e l'immagine non viene
    // disegnata sul canvas.
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600"><rect width="600" height="600" fill="hsl(${i * 60}, 70%, 60%)"/><text x="50%" y="52%" font-family="Impact, sans-serif" font-size="80" fill="white" stroke="black" stroke-width="6" text-anchor="middle" dominant-baseline="middle">${label}</text></svg>`
    const url = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
    return { id: `placeholder-${i}`, thumb: url, full: url, alt: label }
  })
}
