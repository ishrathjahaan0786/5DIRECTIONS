import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function SignUp() {
  const { signUp, isDemoMode } = useAuth()
  const navigate = useNavigate()
  const [role,      setRole]      = useState('company')
  const [fullName,  setFullName]  = useState('')
  const [company,   setCompany]   = useState('')
  const [email,     setEmail]     = useState('')
  const [password,  setPassword]  = useState('')
  const [showPwd,   setShowPwd]   = useState(false)
  const [loading,   setLoading]   = useState(false)
  const [error,     setError]     = useState('')
  const [success,   setSuccess]   = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return }
    setError('')
    setLoading(true)
    const { data, error: err } = await signUp(email, password, fullName, company, role)
    setLoading(false)
    if (err) { setError(err.message || 'Registration failed'); return }

    // Session is saved automatically via backend HttpOnly cookie; navigate to appropriate dashboard
    if (role === 'supplier') {
      navigate('/supplier/dashboard')
    } else {
      navigate('/company/dashboard')
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[#FFFCF7] flex items-center justify-center px-6">
        <div className="text-center max-w-md animate-slide-up">
          <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
            <span className="material-symbols-outlined text-4xl text-emerald-600">mark_email_read</span>
          </div>
          <h1 className="text-2xl font-extrabold text-deep-navy mb-3">Check your email</h1>
          <p className="text-text-muted text-sm mb-6">We've sent a confirmation link to <strong className="text-deep-navy">{email}</strong>. Click the link to activate your account.</p>
          <Link to="/sign-in" className="btn-primary">Go to Sign In</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FFFCF7] flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-deep-navy relative overflow-hidden flex-col justify-between p-12">
        <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-crimson-red/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full bg-ocean-blue/20 blur-3xl pointer-events-none" />
        <div className="flex items-center gap-3 relative z-10">
          <img src="/logo.jpg" alt="5Directions" className="w-10 h-10 rounded-xl object-contain ring-1 ring-white/20" />
          <div>
            <div className="font-bold text-xl text-white">5Directions</div>
            <div className="text-xs text-ocean-blue/80 uppercase tracking-wider font-semibold">Resilient Supply Chain</div>
          </div>
        </div>
        <div className="relative z-10">
          <h2 className="text-4xl font-extrabold text-white leading-tight mb-4">
            Start building a<br />
            <span className="text-crimson-red">resilient supply chain</span><br />today.
          </h2>
          <p className="text-white/60 text-base leading-relaxed">
            Connect directly with verified suppliers or showcase your material capabilities to enterprises worldwide.
          </p>
          <div className="mt-8 space-y-3">
            {[
              'Enterprise-grade multi-supplier resilience modeling',
              'Real-time material catalog with instant lead-times',
              'Automated compliance and ISO certificate management'
            ].map(point => (
              <div key={point} className="flex items-center gap-2 text-white/80 text-sm">
                <span className="material-symbols-outlined text-emerald-400 text-lg">check_circle</span>
                <span>{point}</span>
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

          <h1 className="text-3xl font-extrabold text-deep-navy mb-2">Create Account</h1>
          <p className="text-text-muted text-sm mb-6">Select your role and start your workspace.</p>

          {/* Demo Mode Notice */}
          {isDemoMode && (
            <div className="mb-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2">
              <span className="text-amber-600 font-bold">⚡ Demo Mode:</span>
              <span>Account will be created locally without cloud database setup.</span>
            </div>
          )}

          {/* Role selector tabs */}
          <div className="flex rounded-xl p-1 bg-warm-cream border border-deep-navy/10 mb-6">
            <button
              type="button"
              onClick={() => setRole('company')}
              className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-1.5 ${
                role === 'company'
                  ? 'bg-deep-navy text-white shadow-sm'
                  : 'text-deep-navy/60 hover:text-deep-navy'
              }`}
            >
              <span className="material-symbols-outlined text-lg">business</span>
              Enterprise Buyer
            </button>
            <button
              type="button"
              onClick={() => setRole('supplier')}
              className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-1.5 ${
                role === 'supplier'
                  ? 'bg-crimson-red text-white shadow-sm'
                  : 'text-deep-navy/60 hover:text-deep-navy'
              }`}
            >
              <span className="material-symbols-outlined text-lg">factory</span>
              Material Supplier
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-crimson-red/10 border border-crimson-red/20 text-crimson-red text-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-base">error</span>{error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-semibold text-deep-navy mb-1.5" htmlFor="signup-name">Full Name</label>
              <input id="signup-name" type="text" value={fullName} onChange={e => setFullName(e.target.value)}
                className="input" placeholder="Sarah Jenkins" required />
            </div>
            <div>
              <label className="block text-sm font-semibold text-deep-navy mb-1.5" htmlFor="signup-company">Company Name</label>
              <input id="signup-company" type="text" value={company} onChange={e => setCompany(e.target.value)}
                className="input" placeholder="AeroDynamics Global Inc." required />
            </div>
            <div>
              <label className="block text-sm font-semibold text-deep-navy mb-1.5" htmlFor="signup-email">Work Email</label>
              <input id="signup-email" type="email" value={email} onChange={e => setEmail(e.target.value)}
                className="input" placeholder="sarah@aerodynamics.com" required />
            </div>
            <div>
              <label className="block text-sm font-semibold text-deep-navy mb-1.5" htmlFor="signup-password">Password (min 8 chars)</label>
              <div className="relative">
                <input id="signup-password" type={showPwd ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                  className="input pr-12" placeholder="••••••••" required />
                <button type="button" onClick={() => setShowPwd(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-deep-navy transition-colors">
                  <span className="material-symbols-outlined text-xl">{showPwd ? 'visibility_off' : 'visibility'}</span>
                </button>
              </div>
            </div>
            <button id="signup-submit" type="submit" disabled={loading}
              className="btn-primary w-full py-3 mt-2 disabled:opacity-60 disabled:cursor-not-allowed">
              {loading ? (
                <><span className="material-symbols-outlined text-xl animate-spin">progress_activity</span>Creating Account…</>
              ) : (
                <><span className="material-symbols-outlined text-xl">person_add</span>Create {role === 'company' ? 'Buyer' : 'Supplier'} Account</>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-text-muted mt-6">
            Already have an account?{' '}
            <Link to="/sign-in" className="text-ocean-blue font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
