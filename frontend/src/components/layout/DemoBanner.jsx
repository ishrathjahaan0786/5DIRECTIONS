import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function DemoBanner() {
  const { user, role, signOut } = useAuth()
  const [minimized, setMinimized] = useState(false)
  const navigate = useNavigate()

  if (minimized) {
    return (
      <aside aria-label="5Directions Platform Status" className="fixed bottom-4 right-4 z-50 flex items-center gap-2">
        <button
          onClick={() => setMinimized(false)}
          className="flex items-center gap-2 px-3.5 py-2 bg-deep-navy text-white text-xs font-semibold rounded-full shadow-card-lg border border-white/20 hover:bg-ocean-blue transition-colors"
          title="Expand Platform status"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>5Directions Agentic AI</span>
          <span className="material-symbols-outlined text-sm">unfold_more</span>
        </button>
      </aside>
    )
  }

  return (
    <aside aria-label="5Directions Platform Status" className="relative z-50 bg-gradient-to-r from-deep-navy via-[#1e293b] to-deep-navy text-white text-xs px-4 py-2 border-b border-ocean-blue/30 shadow-sm">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Notice */}
        <div className="flex items-center gap-2.5">
          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-crimson-red/20 text-crimson-red font-bold text-xs">
            🤖
          </span>
          <div className="text-white/90 flex items-center gap-2 flex-wrap">
            <strong className="text-white font-semibold">5Directions Agentic Platform:</strong>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              MongoDB & Sessions Active
            </span>
            {user ? (
              <span className="text-white/70">
                Authenticated as: <strong className="text-white capitalize">{user.fullName || user.email}</strong> ({role})
              </span>
            ) : (
              <span className="text-white/60">
                Sign in with demo credentials to test role-authorized actions.
              </span>
            )}
          </div>
        </div>

        {/* Quick Nav Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <Link
            to="/"
            className="px-2.5 py-1 rounded-md bg-white/10 hover:bg-white/20 text-white font-medium transition-colors"
          >
            Landing
          </Link>
          {user ? (
            <>
              {role === 'company' && (
                <Link
                  to="/company/dashboard"
                  className="px-2.5 py-1 rounded-md bg-ocean-blue/30 hover:bg-ocean-blue/50 text-white font-medium transition-colors flex items-center gap-1"
                >
                  🏢 Company Dashboard
                </Link>
              )}
              {role === 'supplier' && (
                <Link
                  to="/supplier/dashboard"
                  className="px-2.5 py-1 rounded-md bg-crimson-red/30 hover:bg-crimson-red/50 text-white font-medium transition-colors flex items-center gap-1"
                >
                  🏭 Supplier Dashboard
                </Link>
              )}
              <button
                onClick={() => { signOut(); navigate('/sign-in') }}
                className="px-2 py-1 rounded-md bg-white/10 hover:bg-crimson-red/80 text-white/80 hover:text-white font-medium transition-colors"
              >
                Sign Out
              </button>
            </>
          ) : (
            <Link
              to="/sign-in"
              className="px-2.5 py-1 rounded-md bg-ocean-blue text-white font-bold hover:bg-ocean-blue/90 transition-colors flex items-center gap-1 shadow-sm"
            >
              Sign In
            </Link>
          )}
          <button
            onClick={() => setMinimized(true)}
            className="text-white/40 hover:text-white p-1 rounded transition-colors ml-1"
            title="Minimize banner"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
      </div>
    </aside>
  )
}
