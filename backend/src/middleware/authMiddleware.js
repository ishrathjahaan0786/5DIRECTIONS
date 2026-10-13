import jwt from 'jsonwebtoken'
import { db } from '../data/db.js'

const JWT_SECRET = process.env.JWT_SECRET || '5directions_super_secret_jwt_key_2026'

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Authentication token required'
    })
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    const user = db.users.find(u => u.id === decoded.id)
    if (!user) {
      return res.status(403).json({ success: false, message: 'Invalid or expired session user' })
    }
    const { passwordHash: _, ...safeUser } = user
    req.user = safeUser
    next()
  } catch (err) {
    return res.status(403).json({
      success: false,
      message: 'Invalid or expired token',
      error: err.message
    })
  }
}

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
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET)
      const user = db.users.find(u => u.id === decoded.id)
      if (user) {
        const { passwordHash: _, ...safeUser } = user
        req.user = safeUser
      }
    } catch {
      // Ignore invalid token on optional auth
    }
  }
  next()
}
