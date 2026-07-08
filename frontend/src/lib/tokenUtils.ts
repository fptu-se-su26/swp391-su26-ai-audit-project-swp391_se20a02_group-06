interface JwtPayload {
  exp?: number
  iat?: number
  sub?: string
  [key: string]: unknown
}

/**
 * Decodes a JWT token's payload without verifying the signature.
 * This is safe for client-side use where we only need to read claims like `exp`.
 * Signature verification is always done server-side.
 */
function decodeJwtPayload(token: string): JwtPayload | null {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null

    // Base64url → Base64 → decode
    const base64Url = parts[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )

    return JSON.parse(jsonPayload)
  } catch {
    return null
  }
}

/**
 * Checks whether a JWT token is expired.
 * Returns `true` if the token is expired, malformed, or cannot be decoded.
 * Includes a 30-second safety buffer to prevent edge-case 401s mid-request.
 */
export function isTokenExpired(token: string | null): boolean {
  if (!token) return true

  const decoded = decodeJwtPayload(token)
  if (!decoded || !decoded.exp) {
    // Token is malformed or has no expiry claim — treat as expired
    return true
  }

  const currentTime = Math.floor(Date.now() / 1000)
  const bufferSeconds = 30

  return decoded.exp - bufferSeconds <= currentTime
}
