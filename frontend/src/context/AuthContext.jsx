import { createContext, useContext, useEffect, useState } from 'react'
import api from '../lib/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [role, setRole]       = useState(null) // 'company' | 'supplier'
  const [loading, setLoading] = useState(true)

  // Verify and restore session on page mount
  useEffect(() => {
    let mounted = true

    async function checkSession() {
      try {
        const res = await api.auth.getMe()
        if (mounted && res?.success && res.user) {
          setUser(res.user)
          setRole(res.user.role)
        }
      } catch (err) {
        // No active session or unauthenticated
        if (mounted) {
          setUser(null)
          setRole(null)
        }
      } finally {
        if (mounted) setLoading(false)
      }
    }

    checkSession()

    return () => {
      mounted = false
    }
  }, [])

  const signIn = async (email, password) => {
    try {
      const res = await api.auth.login(email, password)
      if (res?.success && res.user) {
        setUser(res.user)
        setRole(res.user.role)
        return { data: { user: res.user }, error: null }
      }
      return { data: null, error: new Error(res?.message || 'Login failed') }
    } catch (err) {
      return { data: null, error: err }
    }
  }

  const signUp = async (email, password, fullName, company, selectedRole) => {
    try {
      const res = await api.auth.register({
        email,
        password,
        fullName,
        companyName: company,
        role: selectedRole
      })
      if (res?.success && res.user) {
        setUser(res.user)
        setRole(res.user.role)
        return { data: { user: res.user }, error: null }
      }
      return { data: null, error: new Error(res?.message || 'Registration failed') }
    } catch (err) {
      return { data: null, error: err }
    }
  }

  const signOut = async () => {
    try {
      await api.auth.logout()
    } catch (err) {
      console.warn('Sign out warning:', err.message)
    } finally {
      setUser(null)
      setRole(null)
    }
  }

  return (
    <AuthContext.Provider value={{
      user,
      role,
      loading,
      signIn,
      signUp,
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
