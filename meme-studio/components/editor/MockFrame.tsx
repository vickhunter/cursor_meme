"use client"

import type { ReactNode } from "react"
import type { SocialFormatId } from "@/lib/formats"

type MockFrameProps = {
  formatId: SocialFormatId
  cssWidth: number
  cssHeight: number
  children: ReactNode
}

export type MockFrameMetrics = {
  /** Vertical padding ABOVE the canvas slot, in CSS pixels. */
  topGutter: number
  /** Vertical padding BELOW the canvas slot, in CSS pixels. */
  bottomGutter: number
  /** Horizontal padding LEFT + RIGHT of the canvas slot, in CSS pixels (each side). */
  sideGutter: number
  /** Whether the chrome is overlaid on top of the canvas (true) or sits as a card (false). */
  overlay: boolean
}

const RATIOS: Record<
  SocialFormatId,
  {
    topGutter: (w: number) => number
    bottomGutter: (w: number) => number
    sideGutter: (w: number) => number
    overlay: boolean
  }
> = {
  "ig-post": {
    topGutter: (w) => Math.round(w * 0.13),
    bottomGutter: (w) => Math.round(w * 0.2),
    sideGutter: () => 0,
    overlay: false,
  },
  "ig-story": {
    topGutter: () => 0,
    bottomGutter: () => 0,
    sideGutter: () => 0,
    overlay: true,
  },
  tiktok: {
    topGutter: () => 0,
    bottomGutter: () => 0,
    sideGutter: () => 0,
    overlay: true,
  },
  fb: {
    topGutter: (w) => Math.round(w * 0.11),
    bottomGutter: (w) => Math.round(w * 0.14),
    sideGutter: () => 0,
    overlay: false,
  },
  linkedin: {
    topGutter: (w) => Math.round(w * 0.12),
    bottomGutter: (w) => Math.round(w * 0.14),
    sideGutter: () => 0,
    overlay: false,
  },
  x: {
    topGutter: (w) => Math.round(w * 0.09),
    bottomGutter: (w) => Math.round(w * 0.08),
    sideGutter: () => 0,
    overlay: false,
  },
}

export function getMockFrameMetrics(
  formatId: SocialFormatId,
  cssWidth: number
): MockFrameMetrics {
  const r = RATIOS[formatId]
  return {
    topGutter: r.topGutter(cssWidth),
    bottomGutter: r.bottomGutter(cssWidth),
    sideGutter: r.sideGutter(cssWidth),
    overlay: r.overlay,
  }
}

export function MockFrame({
  formatId,
  cssWidth,
  cssHeight,
  children,
}: MockFrameProps) {
  const m = getMockFrameMetrics(formatId, cssWidth)
  const totalWidth = cssWidth + m.sideGutter * 2
  const totalHeight = cssHeight + m.topGutter + m.bottomGutter

  const baseFont = Math.max(8, cssWidth * 0.022)

  if (m.overlay) {
    return (
      <div
        className="relative isolate"
        style={{
          width: totalWidth,
          height: totalHeight,
          fontSize: baseFont,
        }}
      >
        <PhoneBezel formatId={formatId}>{children}</PhoneBezel>
        {formatId === "ig-story" && <IgStoryOverlay width={cssWidth} />}
        {formatId === "tiktok" && <TikTokOverlay width={cssWidth} />}
      </div>
    )
  }

  return (
    <div
      className="relative flex flex-col overflow-hidden rounded-xl bg-white ring-1 ring-zinc-200 shadow-xl shadow-black/10 dark:bg-zinc-950 dark:ring-zinc-800"
      style={{
        width: totalWidth,
        height: totalHeight,
        fontSize: baseFont,
      }}
    >
      <div
        className="flex-shrink-0"
        style={{ height: m.topGutter, padding: cssWidth * 0.015 }}
      >
        {formatId === "ig-post" && <IgHeader width={cssWidth} />}
        {formatId === "fb" && <FbHeader width={cssWidth} />}
        {formatId === "linkedin" && <LiHeader width={cssWidth} />}
        {formatId === "x" && <XHeader width={cssWidth} />}
      </div>
      <div className="relative flex-shrink-0" style={{ width: cssWidth, height: cssHeight }}>
        {children}
      </div>
      <div
        className="flex-shrink-0"
        style={{ height: m.bottomGutter, padding: cssWidth * 0.015 }}
      >
        {formatId === "ig-post" && <IgFooter width={cssWidth} />}
        {formatId === "fb" && <FbFooter width={cssWidth} />}
        {formatId === "linkedin" && <LiFooter width={cssWidth} />}
        {formatId === "x" && <XFooter width={cssWidth} />}
      </div>
    </div>
  )
}

function PhoneBezel({
  formatId,
  children,
}: {
  formatId: SocialFormatId
  children: ReactNode
}) {
  return (
    <div className="absolute inset-0 overflow-hidden rounded-2xl bg-black/90 shadow-2xl shadow-black/30">
      <div className="absolute inset-0">{children}</div>
      {formatId !== "ig-post" && (
        <span className="pointer-events-none absolute left-1/2 top-1.5 z-30 h-1 w-12 -translate-x-1/2 rounded-full bg-zinc-900/80" />
      )}
    </div>
  )
}

function Avatar({ size, color = "#fb7185" }: { size: number; color?: string }) {
  return (
    <span
      className="flex items-center justify-center rounded-full text-white font-semibold ring-2 ring-white"
      style={{
        width: size,
        height: size,
        background: `linear-gradient(135deg, ${color}, #a78bfa)`,
        fontSize: size * 0.45,
      }}
    >
      M
    </span>
  )
}

function IgHeader({ width }: { width: number }) {
  const av = Math.round(width * 0.07)
  return (
    <div className="flex h-full items-center gap-2 px-2">
      <Avatar size={av} color="#fb7185" />
      <div className="flex flex-col leading-tight">
        <span className="font-semibold text-zinc-900 dark:text-white">memeforge_it</span>
        <span className="text-zinc-500" style={{ fontSize: width * 0.018 }}>
          Sponsorizzato
        </span>
      </div>
      <span className="ml-auto text-zinc-400">⋯</span>
    </div>
  )
}

function IgFooter({ width }: { width: number }) {
  return (
    <div className="flex h-full flex-col gap-1.5 px-2 text-zinc-900 dark:text-white">
      <div className="flex items-center gap-3">
        <Icon path="M12 21s-7-4.5-9.5-9.1C.7 8.6 2.7 5 6 5c1.9 0 3.4 1 4 2 .6-1 2.1-2 4-2 3.3 0 5.3 3.6 3.5 6.9C19 16.5 12 21 12 21z" size={width * 0.05} />
        <Icon path="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8v.5z" size={width * 0.05} stroke />
        <Icon path="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z" size={width * 0.05} stroke />
        <span className="ml-auto">
          <Icon path="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" size={width * 0.05} stroke />
        </span>
      </div>
      <span className="font-semibold" style={{ fontSize: width * 0.022 }}>
        12.345 mi piace
      </span>
      <span className="line-clamp-1 text-zinc-700 dark:text-zinc-300" style={{ fontSize: width * 0.022 }}>
        <strong>memeforge_it</strong> Il miglior meme di sempre 🔥 #ai #cursor
      </span>
    </div>
  )
}

function IgStoryOverlay({ width }: { width: number }) {
  return (
    <div className="pointer-events-none absolute inset-0 z-20 flex flex-col justify-between p-2">
      <div className="flex flex-col gap-1.5">
        <div className="flex gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <span
              key={i}
              className="h-0.5 flex-1 rounded-full bg-white/40"
              style={{ background: i === 0 ? "rgba(255,255,255,0.95)" : undefined }}
            />
          ))}
        </div>
        <div className="flex items-center gap-2 text-white">
          <Avatar size={width * 0.08} color="#f472b6" />
          <span className="font-semibold drop-shadow" style={{ fontSize: width * 0.022 }}>
            memeforge_it
          </span>
          <span className="text-white/80 drop-shadow" style={{ fontSize: width * 0.02 }}>
            · 2h
          </span>
          <span className="ml-auto text-white drop-shadow" style={{ fontSize: width * 0.04 }}>
            ✕
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2 text-white">
        <span
          className="flex-1 rounded-full border border-white/70 bg-black/15 px-3 py-2 backdrop-blur-sm"
          style={{ fontSize: width * 0.022 }}
        >
          Invia messaggio
        </span>
        <Icon path="M12 21s-7-4.5-9.5-9.1C.7 8.6 2.7 5 6 5c1.9 0 3.4 1 4 2 .6-1 2.1-2 4-2 3.3 0 5.3 3.6 3.5 6.9C19 16.5 12 21 12 21z" size={width * 0.06} stroke />
        <Icon path="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z" size={width * 0.06} stroke />
      </div>
    </div>
  )
}

function TikTokOverlay({ width }: { width: number }) {
  return (
    <div className="pointer-events-none absolute inset-0 z-20 flex flex-col justify-between p-2 text-white">
      <div className="flex justify-center gap-4 pt-1 font-medium drop-shadow" style={{ fontSize: width * 0.024 }}>
        <span className="text-white/70">Seguiti</span>
        <span className="border-b-2 border-white">Per te</span>
      </div>
      <div className="flex w-full items-end justify-between gap-2">
        <div className="flex flex-1 flex-col gap-1">
          <span className="font-semibold drop-shadow" style={{ fontSize: width * 0.024 }}>
            @memeforge.it
          </span>
          <span className="line-clamp-2 drop-shadow" style={{ fontSize: width * 0.022 }}>
            Quando il workshop AI Builder ti cambia la vita 🤖 #meme #cursor
          </span>
          <span className="mt-1 flex items-center gap-1 drop-shadow" style={{ fontSize: width * 0.02 }}>
            ♫ suono originale · memeforge.it
          </span>
        </div>
        <div className="flex flex-col items-center gap-3 pr-1">
          <Avatar size={width * 0.07} color="#fb7185" />
          <TikIcon emoji="❤️" label="12,3K" width={width} />
          <TikIcon emoji="💬" label="1.234" width={width} />
          <TikIcon emoji="🔖" label="2.890" width={width} />
          <TikIcon emoji="➤" label="245" width={width} />
        </div>
      </div>
    </div>
  )
}

function TikIcon({
  emoji,
  label,
  width,
}: {
  emoji: string
  label: string
  width: number
}) {
  return (
    <span className="flex flex-col items-center gap-0.5 drop-shadow">
      <span style={{ fontSize: width * 0.045 }}>{emoji}</span>
      <span style={{ fontSize: width * 0.018 }}>{label}</span>
    </span>
  )
}

function FbHeader({ width }: { width: number }) {
  const av = Math.round(width * 0.05)
  return (
    <div className="flex h-full items-center gap-2 px-2">
      <Avatar size={av} color="#60a5fa" />
      <div className="flex flex-col leading-tight">
        <span className="font-semibold text-zinc-900 dark:text-white">MemeForge</span>
        <span className="text-zinc-500" style={{ fontSize: width * 0.015 }}>
          Sponsorizzato · 🌐
        </span>
      </div>
      <span className="ml-auto text-zinc-400">⋯</span>
    </div>
  )
}

function FbFooter({ width }: { width: number }) {
  return (
    <div className="flex h-full flex-col gap-1.5 px-2 text-zinc-900 dark:text-white">
      <div className="flex items-center gap-2" style={{ fontSize: width * 0.018 }}>
        <span className="text-blue-600">👍</span>
        <span className="text-rose-500">❤️</span>
        <span>😂</span>
        <span className="text-zinc-500">1,2K reazioni</span>
        <span className="ml-auto text-zinc-500">234 commenti · 89 condivisioni</span>
      </div>
      <div className="my-1 h-px w-full bg-zinc-200 dark:bg-zinc-800" />
      <div className="flex items-center justify-around text-zinc-500" style={{ fontSize: width * 0.02 }}>
        <span>👍 Mi piace</span>
        <span>💬 Commenta</span>
        <span>🔗 Condividi</span>
      </div>
    </div>
  )
}

function LiHeader({ width }: { width: number }) {
  const av = Math.round(width * 0.05)
  return (
    <div className="flex h-full items-center gap-2 px-2">
      <Avatar size={av} color="#0a66c2" />
      <div className="flex flex-col leading-tight">
        <span className="font-semibold text-zinc-900 dark:text-white">Mario Rossi</span>
        <span className="text-zinc-500" style={{ fontSize: width * 0.015 }}>
          Founder, MemeForge · Sponsorizzato
        </span>
        <span className="text-zinc-400" style={{ fontSize: width * 0.014 }}>
          2g · 🌐
        </span>
      </div>
      <span className="ml-auto rounded-full bg-blue-600 px-2 py-0.5 text-white" style={{ fontSize: width * 0.016 }}>
        Segui
      </span>
    </div>
  )
}

function LiFooter({ width }: { width: number }) {
  return (
    <div className="flex h-full flex-col gap-1.5 px-2 text-zinc-900 dark:text-white">
      <div className="flex items-center gap-2 text-zinc-500" style={{ fontSize: width * 0.016 }}>
        <span>👍 ❤️ 💡</span>
        <span>1.234</span>
        <span className="ml-auto">234 commenti · 89 repost</span>
      </div>
      <div className="my-1 h-px w-full bg-zinc-200 dark:bg-zinc-800" />
      <div className="flex items-center justify-around text-zinc-500" style={{ fontSize: width * 0.018 }}>
        <span>👍 Consiglia</span>
        <span>💬 Commenta</span>
        <span>🔁 Reposta</span>
        <span>📤 Invia</span>
      </div>
    </div>
  )
}

function XHeader({ width }: { width: number }) {
  const av = Math.round(width * 0.045)
  return (
    <div className="flex h-full items-center gap-2 px-3">
      <Avatar size={av} color="#0ea5e9" />
      <div className="flex items-center gap-1 leading-tight">
        <span className="font-semibold text-zinc-900 dark:text-white">MemeForge</span>
        <span className="text-blue-500">✓</span>
        <span className="text-zinc-500" style={{ fontSize: width * 0.016 }}>
          @memeforge_it · 2h
        </span>
      </div>
      <span className="ml-auto text-zinc-400">⋯</span>
    </div>
  )
}

function XFooter({ width }: { width: number }) {
  return (
    <div className="flex h-full items-center justify-around px-2 text-zinc-500" style={{ fontSize: width * 0.018 }}>
      <span>💬 234</span>
      <span>🔁 1,2K</span>
      <span>❤️ 12,3K</span>
      <span>📊 234K</span>
      <span>🔗</span>
    </div>
  )
}

function Icon({
  path,
  size,
  stroke = false,
}: {
  path: string
  size: number
  stroke?: boolean
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill={stroke ? "none" : "currentColor"}
      stroke={stroke ? "currentColor" : "none"}
      strokeWidth={stroke ? 1.7 : 0}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={path} />
    </svg>
  )
}
