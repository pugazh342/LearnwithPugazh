import type { IncomingMessage, ServerResponse } from 'node:http'
import { HttpError } from './otp.js'

export type ApiRequest = IncomingMessage & { body?: unknown }
export type ApiResponse = ServerResponse

const MAX_BODY_BYTES = 8 * 1024

export function sendJson(res: ApiResponse, status: number, payload: Record<string, unknown>): void {
  const body = JSON.stringify(payload)
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.setHeader('Cache-Control', 'no-store')
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.end(body)
}

export async function readJsonBody(req: ApiRequest): Promise<Record<string, unknown>> {
  if (req.body && typeof req.body === 'object') {
    return req.body as Record<string, unknown>
  }
  const chunks: Buffer[] = []
  let size = 0
  for await (const chunk of req) {
    size += chunk.length
    if (size > MAX_BODY_BYTES) {
      throw new HttpError(413, 'payload_too_large', 'Request body is too large.')
    }
    chunks.push(chunk)
  }
  const raw = Buffer.concat(chunks).toString('utf8').trim()
  if (!raw) return {}
  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch {
    throw new HttpError(400, 'invalid_json', 'Request body must be valid JSON.')
  }
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new HttpError(400, 'invalid_json', 'Request body must be a JSON object.')
  }
  return parsed as Record<string, unknown>
}

export function handle(
  res: ApiResponse,
  work: () => Promise<void>,
): void {
  work().catch((err: unknown) => {
    if (err instanceof HttpError) {
      sendJson(res, err.status, { error: err.code, message: err.message })
      return
    }
    console.error('Unhandled API error:', err)
    sendJson(res, 500, { error: 'internal_error', message: 'Something went wrong. Please try again.' })
  })
}
