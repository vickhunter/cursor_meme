import { NextResponse } from "next/server"
import Stripe from "stripe"
import { hasStripeConfigured, serverEnv } from "@/lib/env"
import { signUnlockToken } from "@/lib/jwt"

export const runtime = "nodejs"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const sessionId = searchParams.get("session_id")
  const memeId = searchParams.get("meme_id")

  if (!sessionId || !memeId) {
    return NextResponse.json(
      { error: "missing_params" },
      { status: 400 }
    )
  }

  if (!hasStripeConfigured) {
    const token = await signUnlockToken({ memeId, sessionId: "local" })
    return NextResponse.json({ token, source: "local" as const })
  }

  const stripe = new Stripe(serverEnv.stripeSecretKey!, { typescript: true })

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId)
    if (session.payment_status !== "paid") {
      return NextResponse.json(
        { error: "not_paid", paymentStatus: session.payment_status },
        { status: 402 }
      )
    }
    const meta = session.metadata ?? {}
    if (meta.memeId !== memeId) {
      return NextResponse.json(
        { error: "meme_mismatch" },
        { status: 400 }
      )
    }
    const token = await signUnlockToken({ memeId, sessionId })
    return NextResponse.json({ token, source: "stripe" as const })
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown_error"
    return NextResponse.json(
      { error: "stripe_error", message },
      { status: 500 }
    )
  }
}
