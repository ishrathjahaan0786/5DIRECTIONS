import { createClient } from '@supabase/supabase-js'

// 1. Read from env or local storage config
const envUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim()
const envKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim()

let storedConfig = null
try {
  const raw = localStorage.getItem('5directions_supabase_config')
  if (raw) storedConfig = JSON.parse(raw)
} catch {
  // ignore local storage error
}

const supabaseUrl = (storedConfig?.url || envUrl).trim()
const supabaseAnonKey = (storedConfig?.key || envKey).trim()

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.startsWith('https://') &&
  !supabaseUrl.includes('your-project') &&
  !supabaseAnonKey.includes('your-anon-key')
)

export const saveSupabaseConfig = (url, key) => {
  localStorage.setItem('5directions_supabase_config', JSON.stringify({ url: url.trim(), key: key.trim() }))
  window.location.reload()
}

export const clearSupabaseConfig = () => {
  localStorage.removeItem('5directions_supabase_config')
  localStorage.removeItem('5directions_demo_user')
  window.location.reload()
}

// Fallback local storage demo auth client if Supabase keys aren't provided
const createMockSupabase = () => {
  const STORAGE_KEY = '5directions_demo_user'

  return {
    auth: {
      getSession: async () => {
        try {
          const raw = localStorage.getItem(STORAGE_KEY)
          if (!raw) return { data: { session: null }, error: null }
          const user = JSON.parse(raw)
          return { data: { session: { user } }, error: null }
        } catch {
          return { data: { session: null }, error: null }
        }
      },
      onAuthStateChange: (callback) => {
        const handleStorage = () => {
          try {
            const raw = localStorage.getItem(STORAGE_KEY)
            const user = raw ? JSON.parse(raw) : null
            callback('SIGNED_IN', user ? { user } : null)
          } catch {
            callback('SIGNED_OUT', null)
          }
        }
        window.addEventListener('storage', handleStorage)
        return {
          data: {
            subscription: {
              unsubscribe: () => window.removeEventListener('storage', handleStorage)
            }
          }
        }
      },
      signInWithPassword: async ({ email }) => {
        const role = email.toLowerCase().includes('supplier') ? 'supplier' : 'company'
        const mockUser = {
          id: 'demo-user-id',
          email,
          user_metadata: {
            full_name: email.split('@')[0],
            company_name: role === 'company' ? 'AeroDynamics Global Inc.' : 'Titan Works GmbH',
            role
          }
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(mockUser))
        return { data: { user: mockUser, session: { user: mockUser } }, error: null }
      },
      signUp: async ({ email, options }) => {
        const role = options?.data?.role || 'company'
        const mockUser = {
          id: `demo-user-${Date.now()}`,
          email,
          user_metadata: {
            full_name: options?.data?.full_name || email.split('@')[0],
            company_name: options?.data?.company_name || (role === 'company' ? 'AeroDynamics Global Inc.' : 'Titan Works GmbH'),
            role
          }
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(mockUser))
        return { data: { user: mockUser, session: { user: mockUser } }, error: null }
      },
      resetPasswordForEmail: async () => {
        return { data: {}, error: null }
      },
      signOut: async () => {
        localStorage.removeItem(STORAGE_KEY)
        return { error: null }
      }
    },
    // Mock DB methods if called in demo mode
    from: (table) => ({
      select: () => Promise.resolve({ data: [], error: null }),
      insert: (data) => Promise.resolve({ data, error: null }),
      update: (data) => Promise.resolve({ data, error: null }),
      delete: () => Promise.resolve({ data: null, error: null })
    })
  }
}

let client = null

if (isSupabaseConfigured) {
  try {
    client = createClient(supabaseUrl, supabaseAnonKey)
    console.info('[5Directions] Connected to live Supabase backend:', supabaseUrl)
  } catch (err) {
    console.warn('[5Directions] Failed to initialize Supabase client, falling back to Demo Mode:', err)
    client = createMockSupabase()
  }
} else {
  console.info('[5Directions] Running in Demo / Preview Mode (No Supabase credentials configured).')
  client = createMockSupabase()
}

export const supabase = client
export const currentSupabaseUrl = supabaseUrl
export const currentSupabaseKey = supabaseAnonKey
