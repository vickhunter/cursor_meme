"use client"

import { useEffect, useState } from "react"

// Imposta `crossOrigin` solo per URL http(s): Pexels lo richiede per
// poter esportare il canvas in PNG, mentre i data: URI (le immagini
// seed locali) non hanno bisogno di CORS e con `anonymous` impostato
// possono fallire silenziosamente su alcuni browser.
function isCrossOriginCandidate(src: string): boolean {
  return src.startsWith("http://") || src.startsWith("https://")
}

export function useImage(src: string | null | undefined): HTMLImageElement | null {
  const [image, setImage] = useState<HTMLImageElement | null>(null)

  useEffect(() => {
    if (!src) {
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
    const handleError = () => {
      if (!cancelled) setImage(null)
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
