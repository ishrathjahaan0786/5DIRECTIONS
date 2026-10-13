import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function SignIn() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [showPwd,  setShowPwd]  = useState(false)
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')
  const [autofillNotice, setAutofillNotice] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setAutofillNotice('')
    setLoading(true)

    const { data, error: err } = await signIn(email, password)
    setLoading(false)

    if (err) {
      setError(err.message || 'Invalid email address or password.')
      return
    }

    const role = data?.user?.role
    if (role === 'supplier') {
      navigate('/supplier/dashboard')
    } else {
      navigate('/company/dashboard')
    }
  }

  // Demo autofill populates form fields only; user must authenticate via Sign In
  const handleAutofillDemo = (targetRole) => {
    setError('')
    if (targetRole === 'company') {
      setEmail('company.demo@5directions.demo')
      setPassword('Demo@12345')
      setAutofillNotice('Populated Company Demo credentials. Click "Sign In" below to authenticate against the server.')
    } else {
      setEmail('supplier.demo@5directions.demo')
      setPassword('Demo@12345')
      setAutofillNotice('Populated Supplier Demo credentials. Click "Sign In" below to authenticate against the server.')
    }
  }

  return (
    <div className="min-h-screen bg-[#FFFCF7] flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-deep-navy relative overflow-hidden flex-col justify-between p-12">
        {/* Decorative circles */}
        <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-crimson-red/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full bg-ocean-blue/20 blur-3xl pointer-events-none" />
        {/* Logo */}
        <div className="flex items-center gap-3 relative z-10">
          <img src="/logo.jpg" alt="5Directions" className="w-10 h-10 rounded-xl object-contain ring-1 ring-white/20" />
          <div>
            <div className="font-bold text-xl text-white">5Directions</div>
            <div className="text-xs text-ocean-blue/80 uppercase tracking-wider font-semibold">Resilient Supply Chain</div>
          </div>
        </div>
        {/* Tagline */}
        <div className="relative z-10">
          <h2 className="text-4xl font-extrabold text-white leading-tight mb-4">
            One disruption.<br />Autonomous AI recovery.<br />
            <span className="text-crimson-red">A resilient supply chain.</span>
          </h2>
          <p className="text-white/60 text-base leading-relaxed">
            Multi-step agentic AI investigating supply shocks, finding verified alternative suppliers, and allocating inventory with human oversight.
          </p>
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-8">
            {[['99.98%','On-Time SLA'],['2,400+','Active Suppliers'],['$2.1B','Orders Managed']].map(([v,l]) => (
              <div key={l} className="bg-white/5 rounded-2xl p-4 border border-white/10">
                <div className="text-2xl font-extrabold text-white">{v}</div>
                <div className="text-xs text-white/50 mt-1">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md animate-slide-up">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <img src="/logo.jpg" alt="5Directions" className="w-9 h-9 rounded-xl object-contain" />
            <span className="font-bold text-xl text-deep-navy">5Directions</span>
          </div>

          <h1 className="text-3xl font-extrabold text-deep-navy mb-2">Welcome Back</h1>
          <p className="text-text-muted text-sm mb-6">Sign in to your supply chain resilience workspace.</p>

          {/* Demo quick access autofill badge */}
          <div className="mb-6 p-4 rounded-xl bg-warm-cream/50 border border-border-neutral/60">
            <div className="flex items-center justify-between mb-2">
              <span className="text-deep-navy font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-crimson-red animate-pulse"></span>
                Verified Demo Accounts
              </span>
              <span className="text-[11px] text-ocean-blue bg-ocean-blue/10 px-2 py-0.5 rounded-full font-medium">
                MongoDB Persistent
              </span>
            </div>
            <p className="text-xs text-text-muted mb-3">
              Click below to autofill demonstration credentials and authenticate against the backend:
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                id="btn-demo-company"
                onClick={() => handleAutofillDemo('company')}
                className="py-2 px-3 rounded-lg bg-deep-navy text-white text-xs font-semibold hover:bg-ocean-blue transition-colors flex items-center justify-center gap-1.5 shadow-sm"
              >
                <span>🏢</span> Try Company Demo
              </button>
              <button
                type="button"
                id="btn-demo-supplier"
                onClick={() => handleAutofillDemo('supplier')}
                className="py-2 px-3 rounded-lg bg-crimson-red text-white text-xs font-semibold hover:bg-crimson-red/90 transition-colors flex items-center justify-center gap-1.5 shadow-sm"
              >
                <span>🏭</span> Try Supplier Demo
              </button>
            </div>
            {autofillNotice && (
              <p className="text-[11px] text-ocean-blue font-medium mt-2.5 animate-fade-in bg-ocean-blue/10 p-2 rounded-lg">
                ℹ️ {autofillNotice}
              </p>
            )}
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-crimson-red/10 border border-crimson-red/20 text-crimson-red text-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-base">error</span>{error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-semibold text-deep-navy mb-1.5" htmlFor="signin-email">Email Address</label>
              <input
                id="signin-email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="input"
                placeholder="you@company.com"
                required
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-semibold text-deep-navy" htmlFor="signin-password">Password</label>
                <Link to="/forgot-password" className="text-xs text-ocean-blue hover:text-deep-navy transition-colors font-semibold">Forgot password?</Link>
              </div>
              <div className="relative">
                <input
                  id="signin-password"
                  type={showPwd ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="input pr-12"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-deep-navy transition-colors"
                >
                  <span className="material-symbols-outlined text-xl">{showPwd ? 'visibility_off' : 'visibility'}</span>
                </button>
              </div>
            </div>
            <button
              id="signin-submit"
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <><span className="material-symbols-outlined text-xl animate-spin">progress_activity</span>Authenticating with Server…</>
              ) : (
                <><span className="material-symbols-outlined text-xl">login</span>Sign In</>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-text-muted mt-6">
            Don't have an account?{' '}
            <Link to="/sign-up" className="text-crimson-red font-semibold hover:underline">Create account</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
