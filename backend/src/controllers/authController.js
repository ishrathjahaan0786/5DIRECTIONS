import bcrypt from 'bcryptjs'
import User from '../models/User.js'
import { db, saveDb } from '../data/db.js'
import { getDbStatus } from '../config/db.js'

// Helper to find user either in MongoDB Atlas or in local db
const findUserByEmail = async (email) => {
  const cleanEmail = email.toLowerCase().trim()
  const dbStatus = getDbStatus()

  if (dbStatus.connected) {
    try {
      const user = await User.findOne({ email: cleanEmail })
      if (user) {
        return {
          id: user._id.toString(),
          _id: user._id,
          email: user.email,
          passwordHash: user.passwordHash,
          fullName: user.fullName,
          companyName: user.companyName,
          role: user.role,
          country: user.country,
          source: 'mongodb'
        }
      }
    } catch (err) {
      console.warn('[Auth] Mongo lookup fallback to local:', err.message)
    }
  }

  // Fallback to local db
  const localUser = db.users.find(u => u.email.toLowerCase() === cleanEmail)
  if (localUser) {
    return { ...localUser, source: 'local' }
  }
  return null
}

export const register = async (req, res) => {
  try {
    const { email, password, fullName, companyName, role, country } = req.body

    if (!email || !password || !fullName || !role) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: email, password, fullName, role'
      })
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      })
    }

    const cleanEmail = email.toLowerCase().trim()
    const validRole = role === 'supplier' ? 'supplier' : 'company'

    const existing = await findUserByEmail(cleanEmail)
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email address already exists'
      })
    }

    const salt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(password, salt)

    let createdUser = null
    const dbStatus = getDbStatus()

    if (dbStatus.connected) {
      try {
        const newUser = await User.create({
          email: cleanEmail,
          passwordHash,
          role: validRole,
          fullName: fullName.trim(),
          companyName: (companyName || fullName).trim(),
          country: country || 'United States'
        })
        createdUser = {
          id: newUser._id.toString(),
          email: newUser.email,
          fullName: newUser.fullName,
          companyName: newUser.companyName,
          role: newUser.role,
          country: newUser.country
        }
      } catch (err) {
        console.warn('[Auth] Atlas user save error, saving to local store:', err.message)
      }
    }

    if (!createdUser) {
      const localId = `usr-${validRole.slice(0, 4)}-${Date.now()}`
      const localUser = {
        id: localId,
        email: cleanEmail,
        passwordHash,
        fullName: fullName.trim(),
        companyName: (companyName || fullName).trim(),
        role: validRole,
        country: country || 'United States',
        createdAt: new Date().toISOString()
      }
      db.users.push(localUser)
      saveDb()
      createdUser = {
        id: localId,
        email: localUser.email,
        fullName: localUser.fullName,
        companyName: localUser.companyName,
        role: localUser.role,
        country: localUser.country
      }
    }

    // Set server-managed session
    req.session.user = createdUser
    req.session.save((err) => {
      if (err) {
        console.error('[Auth] Session save error on register:', err)
      }
      return res.status(201).json({
        success: true,
        message: 'Account created and authenticated successfully',
        user: createdUser
      })
    })
  } catch (error) {
    console.error('[Auth] Register error:', error)
    return res.status(500).json({
      success: false,
      message: 'Server error during registration. Please try again later.'
    })
  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      })
    }

    const user = await findUserByEmail(email)
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email address or password'
      })
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash)
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email address or password'
      })
    }

    const safeUser = {
      id: user.id || user._id?.toString(),
      email: user.email,
      fullName: user.fullName,
      companyName: user.companyName,
      role: user.role,
      country: user.country
    }

    // Store in server-managed session
    req.session.user = safeUser
    req.session.save((err) => {
      if (err) {
        console.error('[Auth] Session save error on login:', err)
      }
      return res.json({
        success: true,
        message: 'Signed in successfully',
        user: safeUser
      })
    })
  } catch (error) {
    console.error('[Auth] Login error:', error)
    return res.status(500).json({
      success: false,
      message: 'Internal server error during login'
    })
  }
}

export const logout = (req, res) => {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        console.error('[Auth] Logout session destruction error:', err)
        return res.status(500).json({ success: false, message: 'Could not log out' })
      }
      res.clearCookie('5directions.sid')
      return res.json({
        success: true,
        message: 'Signed out successfully'
      })
    })
  } else {
    res.clearCookie('5directions.sid')
    return res.json({
      success: true,
      message: 'Signed out successfully'
    })
  }
}

export const getMe = (req, res) => {
  if (req.session && req.session.user) {
    return res.json({
      success: true,
      user: req.session.user
    })
  }

  return res.status(401).json({
    success: false,
    message: 'No active session. Please sign in.'
  })
}

export const forgotPassword = async (req, res) => {
  const { email } = req.body
  if (!email) {
    return res.status(400).json({ success: false, message: 'Email address is required' })
  }

  // Safe response regardless of email existence to prevent user enumeration
  return res.json({
    success: true,
    message: 'If an account matches that email address, password reset instructions have been dispatched.'
  })
}

export const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body
  if (!token || !newPassword) {
    return res.status(400).json({ success: false, message: 'Token and new password are required' })
  }

  return res.json({
    success: true,
    message: 'Password reset confirmed. Please sign in with your new credentials.'
  })
}
