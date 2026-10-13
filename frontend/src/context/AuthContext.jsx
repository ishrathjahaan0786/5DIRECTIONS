import { createContext, useContext, useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [role, setRole]       = useState(null) // 'company' | 'supplier'
  const [loading, setLoading] = useState(true)
  const isDemoMode = !isSupabaseConfigured

  useEffect(() => {
    let mounted = true

    // Get initial session safely
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return
      const session = data?.session
      if (session?.user) {
        setUser(session.user)
        setRole(session.user.user_metadata?.role || null)
      }
      setLoading(false)
    }).catch((err) => {
      console.warn('[5Directions Auth] getSession error:', err)
      if (mounted) setLoading(false)
    })

    // Listen for auth state changes safely
    let subscription = null
    try {
      const res = supabase.auth.onAuthStateChange((_event, session) => {
        if (!mounted) return
        if (session?.user) {
          setUser(session.user)
          setRole(session.user.user_metadata?.role || null)
        } else {
          setUser(null)
          setRole(null)
        }
        setLoading(false)
      })
      subscription = res?.data?.subscription
    } catch (err) {
      console.warn('[5Directions Auth] onAuthStateChange error:', err)
      if (mounted) setLoading(false)
    }

    return () => {
      mounted = false
      if (subscription?.unsubscribe) subscription.unsubscribe()
    }
  }, [])

  const signIn = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (data?.user) {
        setUser(data.user)
        setRole(data.user.user_metadata?.role || null)
      }
      return { data, error }
    } catch (err) {
      return { data: null, error: err }
    }
  }

  const signUp = async (email, password, fullName, company, selectedRole) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            company_name: company,
            role: selectedRole,
          },
        },
      })
      if (data?.user) {
        setUser(data.user)
        setRole(selectedRole || data.user.user_metadata?.role || null)
      }
      return { data, error }
    } catch (err) {
      return { data: null, error: err }
    }
  }

  const loginAsDemo = (demoRole = 'company') => {
    const mockUser = {
      id: `demo-${demoRole}-${Date.now()}`,
      email: `${demoRole}@5directions.demo`,
      user_metadata: {
        full_name: demoRole === 'company' ? 'Sarah Jenkins (Procurement Dir)' : 'Hans Becker (Sales Head)',
        company_name: demoRole === 'company' ? 'AeroDynamics Global Inc.' : 'Titan Works GmbH',
        role: demoRole
      }
    }
    localStorage.setItem('5directions_demo_user', JSON.stringify(mockUser))
    setUser(mockUser)
    setRole(demoRole)
    return mockUser
  }

  const resetPassword = async (email) => {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })
      return { data, error }
    } catch (err) {
      return { data: null, error: err }
    }
  }

  const signOut = async () => {
    try {
      await supabase.auth.signOut()
    } catch (err) {
      console.warn('Sign out error:', err)
    }
    localStorage.removeItem('5directions_demo_user')
    setUser(null)
    setRole(null)
  }

  return (
    <AuthContext.Provider value={{
      user,
      role,
      loading,
      isDemoMode,
      signIn,
      signUp,
      loginAsDemo,
      resetPassword,
      signOut
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
