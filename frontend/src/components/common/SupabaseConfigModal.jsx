import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { isSupabaseConfigured, currentSupabaseUrl, currentSupabaseKey, saveSupabaseConfig, clearSupabaseConfig } from '../../lib/supabase'

export default function SupabaseConfigModal({ isOpen, onClose }) {
  const [url, setUrl] = useState(currentSupabaseUrl || '')
  const [key, setKey] = useState(currentSupabaseKey || '')
  const [testing, setTesting] = useState(false)
  const [status, setStatus] = useState(null) // { type: 'success' | 'error', message: string }
  const [showSql, setShowSql] = useState(false)

  if (!isOpen) return null

  const handleTestAndSave = async (e) => {
    e.preventDefault()
    setStatus(null)
    setTesting(true)

    const trimmedUrl = url.trim()
    const trimmedKey = key.trim()

    if (!trimmedUrl.startsWith('https://')) {
      setTesting(false)
      setStatus({ type: 'error', message: 'Supabase URL must start with https:// (e.g., https://your-project.supabase.co)' })
      return
    }

    if (!trimmedKey || trimmedKey.length < 20) {
      setTesting(false)
      setStatus({ type: 'error', message: 'Please enter a valid Supabase anon public API key.' })
      return
    }

    try {
      const testClient = createClient(trimmedUrl, trimmedKey)
      const { error } = await testClient.auth.getSession()
      if (error && error.message && !error.message.includes('fetch')) {
        throw error
      }
      setStatus({ type: 'success', message: 'Connection successful! Connecting app now...' })
      setTimeout(() => {
        saveSupabaseConfig(trimmedUrl, trimmedKey)
      }, 1000)
    } catch (err) {
      setTesting(false)
      setStatus({ type: 'error', message: `Connection failed: ${err.message || 'Check your URL and API key'}` })
    }
  }

  const handleDisconnect = () => {
    if (window.confirm('Disconnect from Supabase and revert to Demo Mode?')) {
      clearSupabaseConfig()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-pure-white rounded-2xl shadow-card-lg max-w-lg w-full p-6 sm:p-8 border border-deep-navy/10 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-text-muted hover:text-deep-navy p-1 rounded-lg transition-colors"
        >
          <span className="material-symbols-outlined text-xl">close</span>
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-2xl">database</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-deep-navy">Supabase Connection Settings</h2>
            <p className="text-xs text-text-muted">Connect your live Supabase database and authentication</p>
          </div>
        </div>

        {isSupabaseConfigured ? (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-bold text-emerald-800 text-sm">Live Supabase Connected</span>
            </div>
            <p className="text-xs text-emerald-700 font-mono break-all mb-3">
              {currentSupabaseUrl}
            </p>
            <button
              onClick={handleDisconnect}
              className="px-3 py-1.5 rounded-lg bg-crimson-red/10 text-crimson-red hover:bg-crimson-red/20 text-xs font-semibold transition-colors"
            >
              Disconnect & Return to Demo Mode
            </button>
          </div>
        ) : (
          <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800">
            <strong>Current Status:</strong> Running in Demo / Preview Mode. Enter your Supabase credentials below to activate real cloud database operations and authentication.
          </div>
        )}

        <form onSubmit={handleTestAndSave} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-bold text-deep-navy uppercase tracking-wider mb-1">
              Project URL (VITE_SUPABASE_URL)
            </label>
            <input
              type="text"
              value={url}
              onChange={e => setUrl(e.target.value)}
              placeholder="https://xyzabcdefg.supabase.co"
              className="input text-sm font-mono"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-deep-navy uppercase tracking-wider mb-1">
              Anon Public API Key (VITE_SUPABASE_ANON_KEY)
            </label>
            <input
              type="password"
              value={key}
              onChange={e => setKey(e.target.value)}
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              className="input text-sm font-mono"
              required
            />
          </div>

          {status && (
            <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
              status.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-crimson-red/10 text-crimson-red border border-crimson-red/20'
            }`}>
              <span className="material-symbols-outlined text-base">
                {status.type === 'success' ? 'check_circle' : 'error'}
              </span>
              <span>{status.message}</span>
            </div>
          )}

          <div className="flex gap-3 mt-2">
            <button
              type="submit"
              disabled={testing}
              className="btn-primary flex-1 py-3 text-sm flex items-center justify-center gap-2"
            >
              {testing ? (
                <><span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>Connecting…</>
              ) : (
                <><span className="material-symbols-outlined text-lg">bolt</span>Connect & Save</>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary py-3 px-4 text-sm"
            >
              Cancel
            </button>
          </div>
        </form>

        {/* Database setup instructions */}
        <div className="mt-6 pt-6 border-t border-border-neutral">
          <button
            type="button"
            onClick={() => setShowSql(s => !s)}
            className="flex items-center justify-between w-full text-xs font-bold text-ocean-blue hover:text-deep-navy transition-colors"
          >
            <span>Need database tables? View Supabase Setup Steps</span>
            <span className="material-symbols-outlined text-sm">{showSql ? 'expand_less' : 'expand_more'}</span>
          </button>

          {showSql && (
            <div className="mt-3 text-xs text-text-muted space-y-2 animate-fade-in bg-warm-cream/50 p-4 rounded-xl">
              <p><strong>1.</strong> Log in to <a href="https://supabase.com/dashboard" target="_blank" rel="noreferrer" className="text-ocean-blue underline">supabase.com/dashboard</a> and open your project.</p>
              <p><strong>2.</strong> Go to <strong>Project Settings → API</strong> to copy your <strong>Project URL</strong> and <strong>anon public API key</strong>.</p>
              <p><strong>3.</strong> Go to the <strong>SQL Editor</strong> in Supabase, create a new query, and paste the contents of <code className="bg-white px-1.5 py-0.5 rounded border">supabase-schema.sql</code> (located in your <code className="bg-white px-1.5 py-0.5 rounded border">frontend/</code> directory) to create all tables and RLS security policies.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
