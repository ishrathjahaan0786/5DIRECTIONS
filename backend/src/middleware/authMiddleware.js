import User from '../models/User.js'
import { db } from '../data/db.js'
import { getDbStatus } from '../config/db.js'

export const authenticateSession = async (req, res, next) => {
  // 1. Check server-managed session
  if (req.session && req.session.user) {
    req.user = req.session.user
    return next()
  }

  // 2. Fallback check for authorization bearer header (for API tools/test scripts)
  const authHeader = req.headers['authorization']
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1]
    // Check if token matches a known user ID or email
    const localUser = db.users.find(u => u.id === token || u.email === token)
    if (localUser) {
      req.user = {
        id: localUser.id,
        email: localUser.email,
        fullName: localUser.fullName,
        companyName: localUser.companyName,
        role: localUser.role,
        country: localUser.country
      }
      return next()
    }
  }

  return res.status(401).json({
    success: false,
    message: 'Authentication required. Please sign in.'
  })
}

// Backwards-compatible alias
export const authenticateToken = authenticateSession

export const requireRole = (allowedRole) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required' })
    }
    const roles = Array.isArray(allowedRole) ? allowedRole : [allowedRole]
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Access restricted to ${roles.join(' or ')} role (Your role: ${req.user.role})`
      })
    }
    next()
  }
}

export const optionalAuth = (req, res, next) => {
  if (req.session && req.session.user) {
    req.user = req.session.user
  }
  next()
}
