import { SignJWT, jwtVerify } from "jose"
import { serverEnv } from "./env"

function getKey(): Uint8Array {
  return new TextEncoder().encode(serverEnv.unlockSecret)
}

export type UnlockClaims = {
  memeId: string
  sessionId: string
}

export async function signUnlockToken(claims: UnlockClaims): Promise<string> {
  return await new SignJWT({ memeId: claims.memeId, sessionId: claims.sessionId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setIssuer("memeforge")
    .setSubject(claims.memeId)
    .setExpirationTime("365d")
    .sign(getKey())
}

export async function verifyUnlockToken(token: string): Promise<UnlockClaims | null> {
  try {
    const { payload } = await jwtVerify(token, getKey(), {
      issuer: "memeforge",
    })
    if (typeof payload.memeId !== "string" || typeof payload.sessionId !== "string") {
      return null
    }
    return { memeId: payload.memeId, sessionId: payload.sessionId }
  } catch {
    return null
  }
}
