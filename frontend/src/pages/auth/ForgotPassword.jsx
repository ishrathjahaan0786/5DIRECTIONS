import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function ForgotPassword() {
  const { resetPassword } = useAuth()
  const [email,   setEmail]   = useState('')
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')
  const [sent,    setSent]    = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(''); setLoading(true)
    const { error: err } = await resetPassword(email)
    setLoading(false)
    if (err) { setError(err.message); return }
    setSent(true)
  }

  return (
    <div className="min-h-screen bg-[#FFFCF7] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md animate-slide-up">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-10">
          <img src="/logo.jpg" alt="5Directions" className="w-9 h-9 rounded-xl object-contain" />
          <span className="font-bold text-xl text-deep-navy">5Directions</span>
        </div>

        {sent ? (
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
              <span className="material-symbols-outlined text-4xl text-emerald-600">mark_email_read</span>
            </div>
            <h1 className="text-2xl font-extrabold text-deep-navy mb-3">Check your inbox</h1>
            <p className="text-text-muted text-sm mb-6">
              We've sent a password reset link to <strong className="text-deep-navy">{email}</strong>.
            </p>
            <Link to="/sign-in" className="btn-primary">Back to Sign In</Link>
          </div>
        ) : (
          <>
            {/* Back link */}
            <Link to="/sign-in" className="inline-flex items-center gap-1 text-sm text-text-muted hover:text-deep-navy transition-colors mb-6 font-semibold">
              <span className="material-symbols-outlined text-base">arrow_back</span>Back to Sign In
            </Link>

            <h1 className="text-3xl font-extrabold text-deep-navy mb-2">Reset Your Password</h1>
            <p className="text-text-muted text-sm mb-8">
              Enter your email and we'll send you a link to reset your password.
            </p>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-crimson-red/10 border border-crimson-red/20 text-crimson-red text-sm flex items-center gap-2">
                <span className="material-symbols-outlined text-base">error</span>{error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-semibold text-deep-navy mb-1.5" htmlFor="forgot-email">Email Address</label>
                <input id="forgot-email" type="email" value={email} onChange={e => setEmail(e.target.value)}
                  className="input" placeholder="you@company.com" required />
              </div>
              <button id="forgot-submit" type="submit" disabled={loading}
                className="btn-primary w-full py-3 mt-1 disabled:opacity-60">
                {loading ? (
                  <><span className="material-symbols-outlined text-xl animate-spin">progress_activity</span>Sending…</>
                ) : (
                  <><span className="material-symbols-outlined text-xl">send</span>Send Reset Link</>
                )}
              </button>
            </form>

            <p className="text-center text-sm text-text-muted mt-6">
              Remember your password?{' '}
              <Link to="/sign-in" className="text-crimson-red font-semibold hover:underline">Sign in</Link>
            </p>
          </>
        )}
      </div>
    </div>
  )
}
