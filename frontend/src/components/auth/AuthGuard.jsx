import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

/**
 * Wraps a route and protects role access.
 * Strictly verifies the server-authenticated user and role.
 */
export default function AuthGuard({ children, requiredRole }) {
  const { user, role, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFFCF7]">
        <div className="flex flex-col items-center gap-4">
          <img src="/logo.jpg" alt="5Directions" className="w-16 h-16 rounded-2xl object-contain animate-pulse" />
          <p className="text-text-muted text-sm font-medium">Verifying Session…</p>
        </div>
      </div>
    )
  }

  // If not authenticated, redirect to Sign In
  if (!user) {
    return <Navigate to="/sign-in" replace />
  }

  // If role does not match requirement, redirect to user's authorized dashboard
  if (requiredRole && role !== requiredRole) {
    if (role === 'company')  return <Navigate to="/company/dashboard" replace />
    if (role === 'supplier') return <Navigate to="/supplier/dashboard" replace />
    return <Navigate to="/sign-in" replace />
  }

  return children
}
