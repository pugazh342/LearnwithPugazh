import { handle, readJsonBody, sendJson, type ApiRequest, type ApiResponse } from '../_lib/http.js'
import { OTP_TTL_MS, issueOtp, verifyAdminIdToken } from '../_lib/otp.js'

export default function handler(req: ApiRequest, res: ApiResponse): void {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    sendJson(res, 405, { error: 'method_not_allowed', message: 'Use POST for this endpoint.' })
    return
  }

  handle(res, async () => {
    const body = await readJsonBody(req)
    const { uid, email } = await verifyAdminIdToken(body.idToken)
    await issueOtp(uid, email)
    sendJson(res, 200, { ok: true, expiresInSeconds: Math.round(OTP_TTL_MS / 1000) })
  })
}
