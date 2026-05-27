import { DEFAULT_FORMAT } from "./formats"
import { EMPTY_SCENE, type MemeRecord, type Scene } from "./types"

const MEMES_KEY = "memeforge:memes"
const UNLOCK_PREFIX = "memeforge:unlock:"

function isBrowser(): boolean {
  return typeof window !== "undefined"
}

function readMemes(): MemeRecord[] {
  if (!isBrowser()) return []
  try {
    const raw = window.localStorage.getItem(MEMES_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed as MemeRecord[]
  } catch {
    return []
  }
}

function writeMemes(memes: MemeRecord[]) {
  if (!isBrowser()) return
  window.localStorage.setItem(MEMES_KEY, JSON.stringify(memes))
}

export function newMemeId(): string {
  return `meme_${Math.random().toString(36).slice(2, 10)}_${Date.now().toString(36)}`
}

export function createMeme(initial?: Partial<MemeRecord>): MemeRecord {
  const meme: MemeRecord = {
    id: initial?.id ?? newMemeId(),
    title: initial?.title ?? "Meme senza titolo",
    scene: initial?.scene ?? EMPTY_SCENE,
    workingFormat: initial?.workingFormat ?? DEFAULT_FORMAT,
    updatedAt: Date.now(),
  }
  const memes = readMemes()
  memes.unshift(meme)
  writeMemes(memes)
  return meme
}

export function listMemes(): MemeRecord[] {
  return readMemes()
}

export function getMeme(id: string): MemeRecord | null {
  return readMemes().find((m) => m.id === id) ?? null
}

export function saveScene(id: string, scene: Scene): void {
  const memes = readMemes()
  const idx = memes.findIndex((m) => m.id === id)
  if (idx === -1) return
  memes[idx] = { ...memes[idx], scene, updatedAt: Date.now() }
  writeMemes(memes)
}

export function saveMeme(meme: MemeRecord): void {
  const memes = readMemes()
  const idx = memes.findIndex((m) => m.id === meme.id)
  const updated = { ...meme, updatedAt: Date.now() }
  if (idx === -1) memes.unshift(updated)
  else memes[idx] = updated
  writeMemes(memes)
}

export function deleteMeme(id: string): void {
  writeMemes(readMemes().filter((m) => m.id !== id))
  if (isBrowser()) window.localStorage.removeItem(UNLOCK_PREFIX + id)
}

export function getUnlockToken(memeId: string): string | null {
  if (!isBrowser()) return null
  return window.localStorage.getItem(UNLOCK_PREFIX + memeId)
}

export function setUnlockToken(memeId: string, token: string): void {
  if (!isBrowser()) return
  window.localStorage.setItem(UNLOCK_PREFIX + memeId, token)
}

export function hasUnlock(memeId: string): boolean {
  return getUnlockToken(memeId) !== null
}
