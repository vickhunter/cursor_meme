export type SocialFormatId =
  | "ig-post"
  | "ig-story"
  | "tiktok"
  | "fb"
  | "linkedin"
  | "x"

export type SocialFormat = {
  id: SocialFormatId
  label: string
  filename: string
  w: number
  h: number
}

export const FORMATS: readonly SocialFormat[] = [
  {
    id: "ig-post",
    label: "Instagram Post",
    filename: "instagram-post-1080x1080.png",
    w: 1080,
    h: 1080,
  },
  {
    id: "ig-story",
    label: "Instagram Story",
    filename: "instagram-story-1080x1920.png",
    w: 1080,
    h: 1920,
  },
  {
    id: "tiktok",
    label: "TikTok",
    filename: "tiktok-1080x1920.png",
    w: 1080,
    h: 1920,
  },
  {
    id: "fb",
    label: "Facebook Post",
    filename: "facebook-1200x630.png",
    w: 1200,
    h: 630,
  },
  {
    id: "linkedin",
    label: "LinkedIn Post",
    filename: "linkedin-1200x627.png",
    w: 1200,
    h: 627,
  },
  {
    id: "x",
    label: "X Post",
    filename: "x-1600x900.png",
    w: 1600,
    h: 900,
  },
] as const

export const DEFAULT_FORMAT: SocialFormatId = "ig-post"

export function getFormat(id: SocialFormatId): SocialFormat {
  const f = FORMATS.find((f) => f.id === id)
  if (!f) throw new Error(`Unknown format: ${id}`)
  return f
}
