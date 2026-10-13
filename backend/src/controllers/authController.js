import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { db, saveDb } from '../data/db.js'

const JWT_SECRET = process.env.JWT_SECRET || '5directions_super_secret_jwt_key_2026'

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      companyName: user.companyName,
      fullName: user.fullName
    },
    JWT_SECRET,
    { expiresIn: '30d' }
  )
}

export const login = async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email and password are required'
    })
  }

  const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase().trim())

  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password'
    })
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash)
  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password'
    })
  }

  const token = generateToken(user)
  const { passwordHash: _, ...safeUser } = user

  return res.json({
    success: true,
    message: 'Login successful',
    token,
    user: safeUser
  })
}

export const register = async (req, res) => {
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
  const existing = db.users.find(u => u.email.toLowerCase() === cleanEmail)
  if (existing) {
    return res.status(400).json({
      success: false,
      message: 'An account with this email already exists'
    })
  }

  const salt = await bcrypt.genSalt(10)
  const passwordHash = await bcrypt.hash(password, salt)

  const newUser = {
    id: `usr-${role.slice(0, 4)}-${Date.now()}`,
    email: cleanEmail,
    passwordHash,
    fullName: fullName.trim(),
    companyName: (companyName || fullName).trim(),
    role: role === 'supplier' ? 'supplier' : 'company',
    country: country || 'United States',
    createdAt: new Date().toISOString()
  }

  db.users.push(newUser)
  saveDb()

  const token = generateToken(newUser)
  const { passwordHash: _, ...safeUser } = newUser

  return res.status(201).json({
    success: true,
    message: 'User registered successfully',
    token,
    user: safeUser
  })
}

export const getMe = (req, res) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Not authenticated' })
  }
  return res.json({
    success: true,
    user: req.user
  })
}

export const updateProfile = (req, res) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Not authenticated' })
  }
  const { fullName, companyName, country } = req.body
  const user = db.users.find(u => u.id === req.user.id)
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' })
  }

  if (fullName) user.fullName = fullName.trim()
  if (companyName) user.companyName = companyName.trim()
  if (country) user.country = country.trim()
  saveDb()

  const { passwordHash: _, ...safeUser } = user
  return res.json({
    success: true,
    message: 'Profile updated successfully',
    user: safeUser
  })
}
