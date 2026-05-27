import { Suspense } from "react"
import { hasStripeConfigured } from "@/lib/env"
import { Editor } from "@/components/editor/Editor"

type Params = { memeId: string }

export default async function StudioMemePage({
  params,
}: {
  params: Promise<Params>
}) {
  const { memeId } = await params
  const isLocalMode = !hasStripeConfigured
  return (
    <Suspense fallback={null}>
      <Editor initialMemeId={memeId} isLocalMode={isLocalMode} />
    </Suspense>
  )
}
