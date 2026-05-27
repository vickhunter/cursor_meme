import { NextResponse } from "next/server"
import { hasPexelsConfigured, hasStripeConfigured, publicEnv } from "@/lib/env"

export const runtime = "nodejs"

export async function GET() {
  return NextResponse.json({
    isLocalMode: !hasStripeConfigured,
    hasStripe: hasStripeConfigured,
    hasPexels: hasPexelsConfigured,
    priceCents: publicEnv.stripePriceCents,
    brandName: publicEnv.brandName,
  })
}
