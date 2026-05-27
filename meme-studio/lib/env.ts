export const serverEnv = {
  stripeSecretKey: process.env.STRIPE_SECRET_KEY,
  pexelsApiKey: process.env.PEXELS_API_KEY,
  unlockSecret: process.env.UNLOCK_SECRET ?? "dev-only-do-not-use-in-prod",
  appUrl:
    process.env.NEXT_PUBLIC_APP_URL ??
    process.env.VERCEL_URL ??
    "http://localhost:3000",
}

export const hasStripeConfigured = Boolean(process.env.STRIPE_SECRET_KEY)
export const hasPexelsConfigured = Boolean(process.env.PEXELS_API_KEY)

export const publicEnv = {
  isLocalMode: !process.env.NEXT_PUBLIC_STRIPE_ENABLED,
  stripePriceCents: 299,
  brandName: "MemeForge",
}

export function getAppUrl(): string {
  const fromEnv =
    process.env.NEXT_PUBLIC_APP_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined)
  return fromEnv ?? "http://localhost:3000"
}
