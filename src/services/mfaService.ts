import { MFA_CLAIM } from '../utils/admin'

const REQUEST_TIMEOUT_MS = 20_000

export class MfaError extends Error {
  readonly status: number
  readonly code: string

  constructor(status: number, code: string, message: string) {
    super(message)
    this.name = 'MfaError'
    this.status = status
    this.code = code
  }
}

interface ApiResponse {
  ok?: boolean
  error?: string
  message?: string
  expiresInSeconds?: number
  customToken?: string
}

async function post(path: string, payload: Record<string, unknown>): Promise<ApiResponse> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

  let response: Response
  try {
    response = await fetch(path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    })
  } catch {
    throw new MfaError(0, 'network', 'Network error. Please check your connection and try again.')
  } finally {
    clearTimeout(timer)
  }

  let data: ApiResponse = {}
  const text = await response.text().catch(() => '')
  if (text) {
    try {
      const parsed: unknown = JSON.parse(text)
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        data = parsed as ApiResponse
      }
    } catch {
      data = {}
    }
  }

  if (!response.ok || data.ok !== true) {
    throw new MfaError(
      response.status,
      data.error ?? 'request_failed',
      data.message ?? 'Request failed. Please try again.',
    )
  }
  return data
}

export async function requestAdminOtp(idToken: string): Promise<number> {
  const data = await post('/api/auth/request-otp', { idToken })
  const seconds = data.expiresInSeconds
  return typeof seconds === 'number' && seconds > 0 ? seconds : 30
}

export async function verifyAdminOtp(idToken: string, code: string): Promise<string> {
  const data = await post('/api/auth/verify-otp', { idToken, code })
  const token = data.customToken
  if (typeof token !== 'string' || !token) {
    throw new MfaError(500, 'bad_response', 'Server returned an invalid response. Please try again.')
  }
  return token
}

export async function hasAdminMfaClaim(user: {
  getIdTokenResult: (forceRefresh?: boolean) => Promise<{ claims: Record<string, unknown> }>
}): Promise<boolean> {
  try {
    const result = await user.getIdTokenResult()
    return result.claims[MFA_CLAIM] === true
  } catch {
    return false
  }
}
