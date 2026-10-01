import { handle, readJsonBody, sendJson, type ApiRequest, type ApiResponse } from '../_lib/http.js'
import { HttpError, mintMfaToken, verifyAdminIdToken, verifyOtp } from '../_lib/otp.js'

export default function handler(req: ApiRequest, res: ApiResponse): void {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    sendJson(res, 405, { error: 'method_not_allowed', message: 'Use POST for this endpoint.' })
    return
  }

  handle(res, async () => {
    const body = await readJsonBody(req)
    const { uid } = await verifyAdminIdToken(body.idToken)

    const code = typeof body.code === 'string' ? body.code.trim() : ''
    if (!/^\d{6}$/.test(code)) {
      throw new HttpError(400, 'invalid_code', 'Enter the 6-digit code from your email.')
    }

    await verifyOtp(uid, code)
    const customToken = await mintMfaToken(uid)
    sendJson(res, 200, { ok: true, customToken })
  })
}
