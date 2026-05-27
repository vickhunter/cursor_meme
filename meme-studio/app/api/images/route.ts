import { NextResponse } from "next/server"
import { hasPexelsConfigured, serverEnv } from "@/lib/env"

export const runtime = "nodejs"

export type MediaType = "image" | "video"

export type MediaResult = {
  id: string
  type: MediaType
  thumb: string
  full: string
  alt: string
  photographer?: string
  videoSrc?: string
  durationSec?: number
}

type PexelsPhoto = {
  id: number
  alt: string
  photographer: string
  src: {
    medium: string
    large2x: string
    original: string
    tiny: string
    small: string
  }
}

type PexelsPhotoResponse = { photos: PexelsPhoto[] }

type PexelsVideoFile = {
  id: number
  quality: string
  file_type: string
  width: number
  height: number
  link: string
}

type PexelsVideoPicture = {
  id: number
  picture: string
}

type PexelsVideo = {
  id: number
  duration: number
  user: { name: string }
  image: string
  video_files: PexelsVideoFile[]
  video_pictures: PexelsVideoPicture[]
}

type PexelsVideoResponse = { videos: PexelsVideo[] }

const SEED_PROMPTS = [
  "Pizza",
  "Gatto",
  "Cane",
  "Mare",
  "Caffè",
  "Pasta",
  "Roma",
  "Tramonto",
  "Calcio",
  "Vespa",
  "Espresso",
  "Gelato",
]

const SEED_PALETTE = [
  ["#ff6b6b", "#ffd93d"],
  ["#4facfe", "#00f2fe"],
  ["#43e97b", "#38f9d7"],
  ["#fa709a", "#fee140"],
  ["#30cfd0", "#330867"],
  ["#a8edea", "#fed6e3"],
  ["#ff9a9e", "#fad0c4"],
  ["#ffecd2", "#fcb69f"],
  ["#fbc2eb", "#a6c1ee"],
  ["#84fab0", "#8fd3f4"],
  ["#cfd9df", "#e2ebf0"],
  ["#a1c4fd", "#c2e9fb"],
]

function buildSeedSvg(label: string, from: string, to: string, decoration?: "play"): string {
  const safeLabel = label
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
  const playOverlay =
    decoration === "play"
      ? `<circle cx="300" cy="300" r="90" fill="rgba(0,0,0,0.45)"/><polygon points="275,250 275,350 360,300" fill="#ffffff"/>`
      : ""
  return `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${from}"/>
      <stop offset="100%" stop-color="${to}"/>
    </linearGradient>
  </defs>
  <rect width="600" height="600" fill="url(#g)"/>
  <text x="50%" y="52%" font-family="Impact, Arial Black, sans-serif" font-size="92" fill="#ffffff" stroke="#000000" stroke-width="6" text-anchor="middle" dominant-baseline="middle" letter-spacing="2">${safeLabel.toUpperCase()}</text>
  ${playOverlay}
</svg>`
}

function svgDataUri(svg: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

function seedImages(query: string): MediaResult[] {
  const base = query.trim() || "Meme"
  return SEED_PROMPTS.map((preset, i) => {
    const label = i === 0 ? base : preset
    const [from, to] = SEED_PALETTE[i % SEED_PALETTE.length]
    const svg = buildSeedSvg(label, from, to)
    const url = svgDataUri(svg)
    return {
      id: `seed-img-${i}`,
      type: "image" as const,
      thumb: url,
      full: url,
      alt: label,
      photographer: "MemeForge seed",
    }
  })
}

function seedVideos(query: string): MediaResult[] {
  const base = query.trim() || "Video"
  return SEED_PROMPTS.slice(0, 6).map((preset, i) => {
    const label = i === 0 ? base : preset
    const [from, to] = SEED_PALETTE[(i + 3) % SEED_PALETTE.length]
    const svg = buildSeedSvg(label, from, to, "play")
    const url = svgDataUri(svg)
    return {
      id: `seed-vid-${i}`,
      type: "video" as const,
      thumb: url,
      full: url,
      alt: label,
      photographer: "MemeForge seed",
      durationSec: 6 + i,
    }
  })
}

async function pexelsImages(query: string): Promise<MediaResult[]> {
  const url = new URL("https://api.pexels.com/v1/search")
  url.searchParams.set("query", query || "meme")
  url.searchParams.set("per_page", "24")
  const res = await fetch(url, {
    headers: { Authorization: serverEnv.pexelsApiKey ?? "" },
    cache: "no-store",
  })
  if (!res.ok) throw new Error(`Pexels images error ${res.status}`)
  const data = (await res.json()) as PexelsPhotoResponse
  return data.photos.map((p) => ({
    id: `pexels-img-${p.id}`,
    type: "image" as const,
    thumb: p.src.small ?? p.src.tiny ?? p.src.medium,
    full: p.src.large2x ?? p.src.original,
    alt: p.alt || "",
    photographer: p.photographer,
  }))
}

function pickVideoFile(files: PexelsVideoFile[]): PexelsVideoFile | null {
  if (files.length === 0) return null
  const mp4 = files.filter((f) => f.file_type === "video/mp4")
  const pool = mp4.length > 0 ? mp4 : files
  const sd = pool.find((f) => f.quality === "sd")
  if (sd) return sd
  return pool.sort((a, b) => a.width - b.width)[0] ?? pool[0]
}

async function pexelsVideos(query: string): Promise<MediaResult[]> {
  const url = new URL("https://api.pexels.com/videos/search")
  url.searchParams.set("query", query || "meme")
  url.searchParams.set("per_page", "24")
  const res = await fetch(url, {
    headers: { Authorization: serverEnv.pexelsApiKey ?? "" },
    cache: "no-store",
  })
  if (!res.ok) throw new Error(`Pexels videos error ${res.status}`)
  const data = (await res.json()) as PexelsVideoResponse
  return data.videos.map((v) => {
    const file = pickVideoFile(v.video_files)
    return {
      id: `pexels-vid-${v.id}`,
      type: "video" as const,
      thumb: v.video_pictures[0]?.picture ?? v.image,
      full: v.image,
      alt: `Video di ${v.user.name}`,
      photographer: v.user.name,
      videoSrc: file?.link,
      durationSec: v.duration,
    }
  })
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const query = searchParams.get("q") ?? ""
  const type = (searchParams.get("type") ?? "image") as MediaType

  if (hasPexelsConfigured) {
    try {
      const results =
        type === "video" ? await pexelsVideos(query) : await pexelsImages(query)
      return NextResponse.json({ results, source: "pexels" as const, type })
    } catch (err) {
      console.warn("Pexels fallback to seed:", err)
    }
  }

  const results = type === "video" ? seedVideos(query) : seedImages(query)
  return NextResponse.json({ results, source: "seed" as const, type })
}
