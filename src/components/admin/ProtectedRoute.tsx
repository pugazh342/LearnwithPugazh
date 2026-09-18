import type { JSX } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import './admin.css'

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth()

  if (loading) {
    return <div className="admin-loading">Checking session…</div>
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />
  }

  return children
}