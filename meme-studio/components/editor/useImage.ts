"use client"

import { useEffect, useState } from "react"

function isCrossOriginCandidate(src: string): boolean {
  return src.startsWith("http://") || src.startsWith("https://")
}

export function useImage(src: string | null | undefined): HTMLImageElement | null {
  const [image, setImage] = useState<HTMLImageElement | null>(null)

  useEffect(() => {
    if (!src) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- clearing local state when external src clears is the intended sync
      setImage(null)
      return
    }
    const img = new window.Image()
    if (isCrossOriginCandidate(src)) {
      img.crossOrigin = "anonymous"
    }
    let cancelled = false
    const handleLoad = () => {
      if (!cancelled) setImage(img)
    }
    const handleError = (ev: Event | string) => {
      if (cancelled) return
      console.warn("useImage: failed to load", src, ev)
      setImage(null)
    }
    img.addEventListener("load", handleLoad)
    img.addEventListener("error", handleError)
    img.src = src
    return () => {
      cancelled = true
      img.removeEventListener("load", handleLoad)
      img.removeEventListener("error", handleError)
    }
  }, [src])

  return image
}
