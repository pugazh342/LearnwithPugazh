import { useEffect, useState, type JSX } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { hasAdminMfaClaim } from '../../services/mfaService'
import { isAdminEmail } from '../../utils/admin'
import './admin.css'

type Gate = 'checking' | 'allowed' | 'denied'

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth()
  const [gate, setGate] = useState<{ uid: string; value: Gate } | null>(null)

  useEffect(() => {
    if (loading || !user) return
    let active = true
    const uid = user.uid
    hasAdminMfaClaim(user).then((verified) => {
      if (active) setGate({ uid, value: verified ? 'allowed' : 'denied' })
    })
    return () => {
      active = false
    }
  }, [user, loading])

  if (loading) {
    return <div className="admin-loading">Checking session…</div>
  }

  if (!user || !isAdminEmail(user.email)) {
    return <Navigate to="/admin/login" replace />
  }

  const resolved: Gate = gate && gate.uid === user.uid ? gate.value : 'checking'

  if (resolved === 'checking') {
    return <div className="admin-loading">Verifying admin session…</div>
  }

  if (resolved === 'denied') {
    return <Navigate to="/admin/login" replace />
  }

  return children
}
