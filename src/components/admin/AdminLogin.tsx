import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { KeyRound, ShieldCheck } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { MfaError, hasAdminMfaClaim, requestAdminOtp, verifyAdminOtp } from '../../services/mfaService'
import { ADMIN_EMAIL, isAdminEmail } from '../../utils/admin'
import { useSEO } from '../../hooks/useSEO'
import type { User } from 'firebase/auth'
import './AdminLogin.css'

const RESEND_COOLDOWN_SECONDS = 30

function getAuthErrorMessage(err: unknown): string {
  if (err instanceof MfaError) return err.message
  if (!err || typeof err !== 'object') return 'Failed to sign in.'
  const code = (err as { code?: string }).code || ''
  const msg = (err as { message?: string }).message || ''

  if (code.includes('requests-from-referer') || msg.includes('requests-from-referer') || msg.includes('API_KEY_HTTP_REFERRER_BLOCKED')) {
    return 'Google Cloud blocked localhost. Please add "http://localhost:5173/*" to your API Key HTTP Referrers in Google Cloud Console.'
  }
  if (code.includes('app-check') || msg.includes('App Check')) {
    return 'Firebase App Check validation failed. Please check your App Check token and debug settings.'
  }
  if (code === 'auth/user-not-found' || code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
    return 'Invalid email or password. Please verify your admin credentials.'
  }
  if (code === 'auth/invalid-email') {
    return 'Please enter a valid email address.'
  }
  if (code === 'auth/operation-not-allowed') {
    return 'Email/Password sign-in is disabled in Firebase Authentication Console.'
  }
  if (code === 'auth/too-many-requests') {
    return 'Too many failed login attempts. Please reset your password or try again later.'
  }
  if (code === 'auth/network-request-failed') {
    return 'Network connection error. Please verify your internet connection.'
  }
  if (code === 'auth/popup-closed-by-user' || code === 'auth/user-token-expired') {
    return 'Your session expired. Please sign in again.'
  }
  return msg || 'Invalid email or password.'
}

export default function AdminLogin() {
  const { user, loading, login, applyMfaSession, logout } = useAuth()
  const navigate = useNavigate()

  const [step, setStep] = useState<'credentials' | 'otp'>('credentials')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [sentAt, setSentAt] = useState(0)
  const [expiresAt, setExpiresAt] = useState(0)
  const [now, setNow] = useState(() => Date.now())

  const flowStarted = useRef(false)
  const otpInFlight = useRef(false)

  useSEO({
    title: 'Admin Login',
    description: 'Admin login page for LearnwithPugazh portfolio management.',
    url: 'https://learnwithpugazh.vercel.app/admin/login',
  })

  useEffect(() => {
    if (step !== 'otp') return
    const id = window.setInterval(() => setNow(Date.now()), 500)
    return () => window.clearInterval(id)
  }, [step])

  const startOtp = useCallback(
    async (target: User) => {
      if (otpInFlight.current) return
      otpInFlight.current = true
      setError('')
      setSubmitting(true)
      try {
        const idToken = await target.getIdToken()
        const seconds = await requestAdminOtp(idToken)
        const stamp = Date.now()
        setSentAt(stamp)
        setExpiresAt(stamp + seconds * 1000)
        setNow(stamp)
        setOtp('')
        setStep('otp')
      } catch (err) {
        setError(getAuthErrorMessage(err))
        if (err instanceof MfaError && (err.status === 401 || err.status === 403)) {
          await logout()
          setStep('credentials')
        }
      } finally {
        otpInFlight.current = false
        setSubmitting(false)
      }
    },
    [logout],
  )

  useEffect(() => {
    if (loading || flowStarted.current || !user || !isAdminEmail(user.email)) return
    flowStarted.current = true
    void hasAdminMfaClaim(user).then((verified) => {
      if (verified) {
        navigate('/admin', { replace: true })
        return
      }
      void startOtp(user)
    })
  }, [user, loading, navigate, startOtp])

  const handleCredentials = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    flowStarted.current = true
    setSubmitting(true)
    try {
      const signedIn = await login(email.trim(), password)
      if (!isAdminEmail(signedIn.email)) {
        await logout()
        setError(`This account is not authorised as admin. Use ${ADMIN_EMAIL}.`)
        return
      }
      await startOtp(signedIn)
    } catch (err) {
      console.error('Login error:', err)
      setError(getAuthErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      if (!user) {
        throw new MfaError(401, 'unauthorized', 'Your session expired. Please sign in again.')
      }
      const idToken = await user.getIdToken()
      const customToken = await verifyAdminOtp(idToken, otp.trim())
      await applyMfaSession(customToken)
      navigate('/admin', { replace: true })
    } catch (err) {
      console.error('OTP error:', err)
      setError(getAuthErrorMessage(err))
      if (err instanceof MfaError && ['otp_invalid', 'otp_expired', 'otp_locked'].includes(err.code)) {
        setOtp('')
      }
      if (err instanceof MfaError && err.status === 401 && err.code === 'unauthorized') {
        await logout()
        setStep('credentials')
      }
    } finally {
      setSubmitting(false)
    }
  }

  const handleBack = async () => {
    setError('')
    setOtp('')
    await logout()
    setStep('credentials')
  }

  const secondsLeft = Math.max(0, Math.ceil((expiresAt - now) / 1000))
  const resendIn = Math.max(0, Math.ceil((sentAt + RESEND_COOLDOWN_SECONDS * 1000 - now) / 1000))
  const expired = secondsLeft <= 0

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-icon">
          {step === 'credentials' ? <ShieldCheck size={22} /> : <KeyRound size={22} />}
        </div>
        <h1 className="serif">{step === 'credentials' ? 'Admin Access' : 'Enter your code'}</h1>
        <p>
          {step === 'credentials'
            ? 'Sign in to manage blog posts and learning resources.'
            : `We emailed a 6-digit code to ${ADMIN_EMAIL}.`}
        </p>

        {step === 'credentials' ? (
          <form onSubmit={handleCredentials} className="login-form">
            <div className="form-row">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                required
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>
            <div className="form-row">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            {error && <p className="admin-error">{error}</p>}

            <button className="btn btn-primary btn-block" disabled={submitting}>
              {submitting ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerify} className="login-form">
            <div className="form-row">
              <label htmlFor="otp">6-digit code</label>
              <input
                id="otp"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                pattern="\d{6}"
                maxLength={6}
                required
                autoFocus
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
                className="otp-input"
              />
            </div>

            <p className={expired || secondsLeft <= 5 ? 'otp-timer otp-timer-urgent' : 'otp-timer'}>
              {expired ? 'That code has expired.' : `Code expires in ${secondsLeft}s`}
            </p>

            {error && <p className="admin-error">{error}</p>}

            <button className="btn btn-primary btn-block" disabled={submitting || otp.length !== 6 || expired}>
              {submitting ? 'Verifying…' : 'Verify Code'}
            </button>

            <div className="otp-actions">
              <button
                type="button"
                className="otp-link"
                onClick={() => user && void startOtp(user)}
                disabled={submitting || resendIn > 0 || !user}
              >
                {resendIn > 0 ? `Resend code in ${resendIn}s` : 'Resend code'}
              </button>
              <button type="button" className="otp-link" onClick={() => void handleBack()} disabled={submitting}>
                Use a different account
              </button>
            </div>
          </form>
        )}

        <a href="/" className="back-link">← Back to portfolio</a>
      </div>
    </div>
  )
}
