import { createHash, randomInt, timingSafeEqual } from 'node:crypto'
import { cert, getApps, initializeApp, type App } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore, Timestamp, type Firestore } from 'firebase-admin/firestore'

export const ADMIN_EMAIL = 'kpugazhmani21@gmail.com'
export const MFA_CLAIM = 'adminMfa'
export const OTP_TTL_MS = 30_000
export const MAX_ATTEMPTS = 3
export const RESEND_COOLDOWN_MS = 30_000
export const MAX_SENDS = 5
export const SEND_WINDOW_MS = 15 * 60_000

export class HttpError extends Error {
  readonly status: number
  readonly code: string

  constructor(status: number, code: string, message: string) {
    super(message)
    this.name = 'HttpError'
    this.status = status
    this.code = code
  }
}

interface OtpDoc {
  codeHash: string
  expiresAt: Timestamp
  attempts: number
}

interface RateDoc {
  lastSentAt: number
  windowStart: number
  sends: number
}

type VerifyOutcome =
  | { ok: true }
  | { ok: false; status: number; code: string; message: string }

function sha256(value: string): string {
  return createHash('sha256').update(value, 'utf8').digest('hex')
}

function loadServiceAccount(): Record<string, unknown> {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
  if (!raw || !raw.trim()) {
    throw new HttpError(
      500,
      'server_misconfigured',
      'Server credentials are missing. Set FIREBASE_SERVICE_ACCOUNT_KEY in Vercel.',
    )
  }
  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch {
    throw new HttpError(
      500,
      'server_misconfigured',
      'Server credentials are not valid JSON. Paste the minified service account JSON.',
    )
  }
  if (!parsed || typeof parsed !== 'object') {
    throw new HttpError(500, 'server_misconfigured', 'Server credentials are malformed.')
  }
  const account = parsed as Record<string, unknown>
  if (typeof account.private_key === 'string') {
    account.private_key = account.private_key.replace(/\\n/g, '\n')
  }
  return account
}

let cachedApp: App | null = null

function adminApp(): App {
  if (cachedApp) return cachedApp
  const existing = getApps()
  if (existing.length > 0) {
    cachedApp = existing[0]
    return cachedApp
  }
  cachedApp = initializeApp({ credential: cert(loadServiceAccount()) })
  return cachedApp
}

function db(): Firestore {
  return getFirestore(adminApp())
}

export async function verifyAdminIdToken(idToken: unknown): Promise<{ uid: string; email: string }> {
  if (typeof idToken !== 'string' || !idToken.trim()) {
    throw new HttpError(401, 'unauthorized', 'Missing authentication token.')
  }
  try {
    const decoded = await getAuth(adminApp()).verifyIdToken(idToken)
    const email = decoded.email ?? ''
    if (email !== ADMIN_EMAIL) {
      throw new HttpError(403, 'forbidden', 'This account is not authorised as admin.')
    }
    return { uid: decoded.uid, email }
  } catch (err) {
    if (err instanceof HttpError) throw err
    throw new HttpError(401, 'unauthorized', 'Your session is no longer valid. Sign in again.')
  }
}

function buildDoc(code: string, now: number): OtpDoc {
  return {
    codeHash: sha256(code),
    expiresAt: Timestamp.fromMillis(now + OTP_TTL_MS),
    attempts: 0,
  }
}

export async function issueOtp(uid: string, email: string): Promise<void> {
  const firestore = db()
  const codeRef = firestore.collection('otps').doc(uid)
  const rateRef = firestore.collection('otpRate').doc(uid)
  const now = Date.now()
  const code = randomInt(0, 1_000_000).toString().padStart(6, '0')

  await firestore.runTransaction(async (tx) => {
    await tx.get(codeRef)
    const rateSnap = await tx.get(rateRef)
    const rate = rateSnap.exists ? (rateSnap.data() as RateDoc) : null

    const sinceLast = now - (rate?.lastSentAt ?? 0)
    if (rate && sinceLast < RESEND_COOLDOWN_MS) {
      throw new HttpError(
        429,
        'too_many_requests',
        `Please wait ${Math.ceil((RESEND_COOLDOWN_MS - sinceLast) / 1000)}s before requesting another code.`,
      )
    }

    const withinWindow = rate ? now - rate.windowStart < SEND_WINDOW_MS : false
    const sends = withinWindow && rate ? rate.sends : 0
    if (sends >= MAX_SENDS) {
      throw new HttpError(
        429,
        'too_many_requests',
        'Too many codes requested. Please wait 15 minutes before trying again.',
      )
    }

    tx.set(codeRef, buildDoc(code, now))
    tx.set(
      rateRef,
      {
        lastSentAt: now,
        windowStart: withinWindow && rate ? rate.windowStart : now,
        sends: sends + 1,
      },
      { merge: true },
    )
  })

  await sendOtpEmail(email, code)
}

export async function verifyOtp(uid: string, code: string): Promise<void> {
  const ref = db().collection('otps').doc(uid)
  const now = Date.now()

  const outcome: VerifyOutcome = await db().runTransaction(async (tx) => {
    const snap = await tx.get(ref)
    if (!snap.exists) {
      return {
        ok: false,
        status: 400,
        code: 'otp_invalid',
        message: 'No active code. Please request a new one.',
      }
    }
    const doc = snap.data() as OtpDoc
    const expiresAt = doc.expiresAt.toMillis()
    if (now > expiresAt) {
      tx.delete(ref)
      return {
        ok: false,
        status: 400,
        code: 'otp_expired',
        message: 'That code has expired. Request a new one.',
      }
    }
    if ((doc.attempts ?? 0) >= MAX_ATTEMPTS) {
      tx.delete(ref)
      return {
        ok: false,
        status: 429,
        code: 'otp_locked',
        message: 'Too many incorrect attempts. Please request a new code.',
      }
    }
    const expected = Buffer.from(doc.codeHash, 'utf8')
    const computed = Buffer.from(sha256(code), 'utf8')
    const match = expected.length === computed.length && timingSafeEqual(expected, computed)
    if (!match) {
      tx.update(ref, { attempts: (doc.attempts ?? 0) + 1 })
      return {
        ok: false,
        status: 401,
        code: 'otp_invalid',
        message: 'Incorrect code.',
      }
    }
    tx.delete(ref)
    return { ok: true }
  })

  if (!outcome.ok) {
    throw new HttpError(outcome.status, outcome.code, outcome.message)
  }
}

export async function mintMfaToken(uid: string): Promise<string> {
  try {
    return await getAuth(adminApp()).createCustomToken(uid, { [MFA_CLAIM]: true })
  } catch {
    throw new HttpError(500, 'server_misconfigured', 'Could not issue an admin session.')
  }
}

export async function sendOtpEmail(to: string, code: string): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey || !apiKey.trim()) {
    throw new HttpError(
      500,
      'server_misconfigured',
      'Email delivery is not configured. Set RESEND_API_KEY in Vercel.',
    )
  }
  const from = process.env.RESEND_FROM || 'LearnwithPugazh <onboarding@resend.dev>'
  const seconds = Math.round(OTP_TTL_MS / 1000)

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject: `${code} is your admin login code`,
      text: `Your admin login code is ${code}.\n\nIt is valid for ${seconds} seconds and can only be used once. If you did not request this, you can ignore this email.`,
      html: `<div style="font-family:Arial,Helvetica,sans-serif;line-height:1.6;color:#111">
<p>Your admin login code is:</p>
<p style="font-size:32px;letter-spacing:8px;font-weight:bold;margin:16px 0">${code}</p>
<p>It is valid for <strong>${seconds} seconds</strong> and can only be used once.</p>
<p style="color:#666;font-size:13px">If you did not request this, you can safely ignore this email.</p>
</div>`,
    }),
  })

  if (!response.ok) {
    const detail = await response.text().catch(() => '')
    throw new HttpError(
      502,
      'email_failed',
      detail.includes('API key is invalid')
        ? 'Email delivery is misconfigured (invalid RESEND_API_KEY).'
        : 'Could not send the code. Please try again.',
    )
  }
}
