import { Router } from 'express'
import {
  login,
  register,
  logout,
  getMe,
  forgotPassword,
  resetPassword
} from '../controllers/authController.js'
import { authenticateSession } from '../middleware/authMiddleware.js'

const router = Router()

router.post('/login', login)
router.post('/register', register)
router.post('/logout', logout)
router.get('/me', authenticateSession, getMe)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password', resetPassword)

export default router
