import { useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

/**
 * Wraps a route and protects role access.
 * In Demo/Preview Mode: seamlessly grants demo access to test both roles.
 * In Supabase Live Mode: strictly enforces authentication and role verification.
 */
export default function AuthGuard({ children, requiredRole }) {
  const { user, role, loading, isDemoMode, loginAsDemo } = useAuth()

  useEffect(() => {
    if (isDemoMode && (!user || (requiredRole && role !== requiredRole))) {
      loginAsDemo(requiredRole || 'company')
    }
  }, [isDemoMode, user, role, requiredRole, loginAsDemo])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFFCF7]">
        <div className="flex flex-col items-center gap-4">
          <img src="/logo.jpg" alt="5Directions" className="w-16 h-16 rounded-2xl object-contain animate-pulse" />
          <p className="text-text-muted text-sm font-medium">Loading…</p>
        </div>
      </div>
    )
  }

  // In demo mode, if state is still updating, render children
  if (isDemoMode) {
    return children
  }

  if (!user) return <Navigate to="/sign-in" replace />

  if (requiredRole && role !== requiredRole) {
    if (role === 'company')  return <Navigate to="/company/dashboard" replace />
    if (role === 'supplier') return <Navigate to="/supplier/dashboard" replace />
    return <Navigate to="/" replace />
  }

  return children
}
