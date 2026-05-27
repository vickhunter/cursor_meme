import { NextResponse } from "next/server"
import { hasStripeConfigured } from "@/lib/env"

export const runtime = "nodejs"

// ─────────────────────────────────────────────────────────────────────────
// TODO (workshop minuto 16-18, opzionale): crea una Checkout Session.
//
// Obiettivo (richiede STRIPE_SECRET_KEY in .env):
// 1. Leggi { memeId, memeTitle } dal body (Zod)
// 2. Se !hasStripeConfigured, restituisci 400 "stripe_not_configured"
// 3. Crea una Stripe Checkout Session:
//    - mode: "payment"
//    - line_items: [{ price_data: { currency:'eur', unit_amount:299, ... } }]
//    - metadata: { memeId }
//    - success_url: `${appUrl}/studio/${memeId}?session_id={CHECKOUT_SESSION_ID}&unlock=1`
//    - cancel_url: `${appUrl}/studio/${memeId}?canceled=1`
// 4. Restituisci `{ url: session.url }`
//
// Suggerimento prompt per Cursor:
// "Implementa POST in app/api/stripe/checkout/route.ts. Valida il body
//  con Zod ({memeId, memeTitle?}). Se !hasStripeConfigured ritorna 400.
//  Altrimenti crea una Checkout Session con Stripe SDK (€2.99) e
//  ritorna { url }. Vedi getAppUrl, publicEnv, serverEnv in lib/env.ts."
// ─────────────────────────────────────────────────────────────────────────

export async function POST() {
  if (!hasStripeConfigured) {
    return NextResponse.json(
      {
        error: "stripe_not_configured",
        message:
          "Modalità locale: lo sblocco è gratuito. Stripe non è configurato.",
      },
      { status: 400 }
    )
  }
  return NextResponse.json(
    {
      error: "not_implemented",
      message: "TODO: implementa app/api/stripe/checkout/route.ts",
    },
    { status: 501 }
  )
}
