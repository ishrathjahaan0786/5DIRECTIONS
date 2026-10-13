import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import SupabaseConfigModal from '../common/SupabaseConfigModal'

export default function DemoBanner() {
  const { isDemoMode, user, role, loginAsDemo } = useAuth()
  const [minimized, setMinimized] = useState(false)
  const [showConfigModal, setShowConfigModal] = useState(false)
  const navigate = useNavigate()

  if (!isDemoMode) {
    return (
      <>
        <div className="bg-emerald-900/90 text-white text-xs px-4 py-1.5 flex items-center justify-between border-b border-emerald-700/50">
          <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span><strong>Live Supabase Active:</strong> Database and authentication synchronized.</span>
            </div>
            <button
              onClick={() => setShowConfigModal(true)}
              className="text-emerald-200 hover:text-white underline text-[11px]"
            >
              Database Settings
            </button>
          </div>
        </div>
        <SupabaseConfigModal isOpen={showConfigModal} onClose={() => setShowConfigModal(false)} />
      </>
    )
  }

  const handleQuickSwitch = (targetRole) => {
    loginAsDemo(targetRole)
    if (targetRole === 'company') {
      navigate('/company/dashboard')
    } else {
      navigate('/supplier/dashboard')
    }
  }

  if (minimized) {
    return (
      <>
        <aside aria-label="Demo Mode Indicator" className="fixed bottom-4 right-4 z-50 flex items-center gap-2">
          <button
            onClick={() => setShowConfigModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 text-white text-xs font-semibold rounded-full shadow-card-lg hover:bg-emerald-700 transition-colors border border-white/20"
            title="Configure Supabase"
          >
            <span className="material-symbols-outlined text-sm">database</span>
            <span>Connect DB</span>
          </button>
          <button
            onClick={() => setMinimized(false)}
            className="flex items-center gap-2 px-3 py-2 bg-deep-navy text-white text-xs font-semibold rounded-full shadow-card-lg border border-white/20 hover:bg-ocean-blue transition-colors"
            title="Expand Demo Mode toolbar"
          >
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
            <span>⚡ Demo Mode</span>
            <span className="material-symbols-outlined text-sm">unfold_more</span>
          </button>
        </aside>
        <SupabaseConfigModal isOpen={showConfigModal} onClose={() => setShowConfigModal(false)} />
      </>
    )
  }

  return (
    <>
      <aside aria-label="Demo Mode Indicator" className="relative z-50 bg-gradient-to-r from-deep-navy via-[#1e293b] to-deep-navy text-white text-xs px-4 py-2.5 border-b border-amber-400/30 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Notice */}
          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-amber-400/20 text-amber-300 font-bold text-xs">
              ⚡
            </span>
            <p className="text-white/90">
              <strong className="text-amber-300 font-semibold">Demo / Preview Mode:</strong>{' '}
              Local state active.
              {user ? (
                <span className="ml-1 text-white/70">
                  Logged in as: <strong className="text-white capitalize">{role || 'User'}</strong>
                </span>
              ) : (
                <span className="ml-1 text-white/60">
                  Ready to test Company & Supplier screens.
                </span>
              )}
            </p>
          </div>

          {/* Quick Nav Actions */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-white/50 text-[11px] hidden sm:inline">Quick Jump:</span>
            <Link
              to="/"
              className="px-2.5 py-1 rounded-md bg-white/10 hover:bg-white/20 text-white font-medium transition-colors"
            >
              Landing
            </Link>
            <button
              onClick={() => handleQuickSwitch('company')}
              className="px-2.5 py-1 rounded-md bg-ocean-blue/30 hover:bg-ocean-blue/50 text-white font-medium transition-colors flex items-center gap-1"
            >
              🏢 Company
            </button>
            <button
              onClick={() => handleQuickSwitch('supplier')}
              className="px-2.5 py-1 rounded-md bg-crimson-red/30 hover:bg-crimson-red/50 text-white font-medium transition-colors flex items-center gap-1"
            >
              🏭 Supplier
            </button>
            <button
              onClick={() => setShowConfigModal(true)}
              className="px-2.5 py-1 rounded-md bg-amber-400 text-deep-navy font-bold hover:bg-amber-300 transition-colors flex items-center gap-1 shadow-sm"
              title="Connect real Supabase credentials"
            >
              <span className="material-symbols-outlined text-sm">database</span>
              Connect Supabase
            </button>
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
      <SupabaseConfigModal isOpen={showConfigModal} onClose={() => setShowConfigModal(false)} />
    </>
  )
}
