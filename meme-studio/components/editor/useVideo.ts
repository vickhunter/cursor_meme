"use client"

import { useEffect, useRef, useState } from "react"

function isCrossOriginCandidate(src: string): boolean {
  return src.startsWith("http://") || src.startsWith("https://")
}

export type UseVideoOptions = {
  playing?: boolean
  muted?: boolean
  loop?: boolean
}

export type UseVideoState = {
  element: HTMLVideoElement | null
  ready: boolean
  durationSec: number | null
}

export function useVideo(
  src: string | null | undefined,
  { playing = false, muted = true, loop = true }: UseVideoOptions = {}
): UseVideoState {
  const [state, setState] = useState<UseVideoState>({
    element: null,
    ready: false,
    durationSec: null,
  })
  const videoRef = useRef<HTMLVideoElement | null>(null)

  useEffect(() => {
    if (!src) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- clearing local state when external src clears is the intended sync
      setState({ element: null, ready: false, durationSec: null })
      return
    }
    const video = document.createElement("video")
    if (isCrossOriginCandidate(src)) {
      video.crossOrigin = "anonymous"
    }
    video.muted = true
    video.loop = loop
    video.playsInline = true
    video.preload = "auto"
    video.src = src
    videoRef.current = video

    let cancelled = false
    const handleReady = () => {
      if (cancelled) return
      setState({
        element: video,
        ready: true,
        durationSec: Number.isFinite(video.duration) ? video.duration : null,
      })
    }
    const handleError = () => {
      if (cancelled) return
      console.warn("useVideo: failed to load", src)
      setState({ element: null, ready: false, durationSec: null })
    }
    video.addEventListener("loadeddata", handleReady)
    video.addEventListener("error", handleError)

    return () => {
      cancelled = true
      video.removeEventListener("loadeddata", handleReady)
      video.removeEventListener("error", handleError)
      try {
        video.pause()
      } catch {}
      video.src = ""
      videoRef.current = null
    }
  }, [src, loop])

  useEffect(() => {
    const video = videoRef.current
    if (!video || !state.ready) return
    video.muted = muted
    video.loop = loop
  }, [state.ready, muted, loop])

  useEffect(() => {
    const video = videoRef.current
    if (!video || !state.ready) return
    if (playing) {
      const p = video.play()
      if (p && typeof p.then === "function") {
        p.catch(() => {
        })
      }
    } else {
      video.pause()
    }
  }, [playing, state.ready])

  return state
}
