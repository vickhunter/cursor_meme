import { NextResponse } from "next/server"
import { hasStripeConfigured } from "@/lib/env"
import { signUnlockToken } from "@/lib/jwt"

export const runtime = "nodejs"

// ─────────────────────────────────────────────────────────────────────────
// TODO (workshop minuto 16-18, opzionale): verifica la sessione Stripe
// e firma un JWT di sblocco.
//
// Obiettivo:
// 1. Leggi session_id e meme_id dalla query string
// 2. Se !hasStripeConfigured, firma direttamente un JWT (modalità locale)
//    e ritornalo
// 3. Altrimenti:
//    - `stripe.checkout.sessions.retrieve(session_id)`
//    - verifica payment_status === "paid"
//    - verifica session.metadata.memeId === meme_id
//    - firma il JWT con signUnlockToken({ memeId, sessionId })
// 4. Ritorna { token, source: "stripe" | "local" }
//
// Suggerimento prompt per Cursor:
// "Implementa GET in app/api/stripe/unlock/route.ts. Verifica la session
//  Stripe via SDK, controlla payment_status e metadata.memeId, e firma
//  un JWT con signUnlockToken (vedi lib/jwt.ts)."
// ─────────────────────────────────────────────────────────────────────────

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const sessionId = searchParams.get("session_id")
  const memeId = searchParams.get("meme_id")

  if (!sessionId || !memeId) {
    return NextResponse.json({ error: "missing_params" }, { status: 400 })
  }

  if (!hasStripeConfigured) {
    const token = await signUnlockToken({ memeId, sessionId: "local" })
    return NextResponse.json({ token, source: "local" as const })
  }

  return NextResponse.json(
    {
      error: "not_implemented",
      message: "TODO: implementa app/api/stripe/unlock/route.ts",
    },
    { status: 501 }
  )
}
