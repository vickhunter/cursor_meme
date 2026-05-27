import { NextResponse } from "next/server"
import Stripe from "stripe"
import { z } from "zod"
import { getAppUrl, hasStripeConfigured, publicEnv, serverEnv } from "@/lib/env"

export const runtime = "nodejs"

const BodySchema = z.object({
  memeId: z.string().min(1),
  memeTitle: z.string().max(120).optional(),
})

export async function POST(req: Request) {
  if (!hasStripeConfigured) {
    return NextResponse.json(
      {
        error: "stripe_not_configured",
        message: "Modalità locale: lo sblocco è gratuito. Stripe non è configurato.",
      },
      { status: 400 }
    )
  }

  const json = await req.json().catch(() => null)
  const parsed = BodySchema.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid_body", issues: parsed.error.issues },
      { status: 400 }
    )
  }

  const stripe = new Stripe(serverEnv.stripeSecretKey!, {
    typescript: true,
  })

  const appUrl = getAppUrl()
  const memeId = parsed.data.memeId
  const memeTitle = parsed.data.memeTitle ?? "Meme HD"

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "eur",
          unit_amount: publicEnv.stripePriceCents,
          product_data: {
            name: `${publicEnv.brandName} HD — ${memeTitle}`,
            description:
              "Sblocca l'esportazione HD senza watermark in tutti i formati.",
          },
        },
      },
    ],
    metadata: { memeId },
    success_url: `${appUrl}/studio/${memeId}?session_id={CHECKOUT_SESSION_ID}&unlock=1`,
    cancel_url: `${appUrl}/studio/${memeId}?canceled=1`,
  })

  if (!session.url) {
    return NextResponse.json(
      { error: "missing_session_url" },
      { status: 500 }
    )
  }

  return NextResponse.json({ url: session.url })
}
