import { Suspense } from "react"
import { hasStripeConfigured } from "@/lib/env"
import { Editor } from "@/components/editor/Editor"

export default function StudioPage() {
  const isLocalMode = !hasStripeConfigured
  return (
    <Suspense fallback={null}>
      <Editor isLocalMode={isLocalMode} />
    </Suspense>
  )
}
