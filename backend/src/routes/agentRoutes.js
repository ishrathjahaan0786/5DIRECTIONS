import { Router } from 'express'
import {
  investigate,
  approvePlan,
  rejectPlan,
  getActivity,
  getPlans
} from '../controllers/agentController.js'
import { authenticateSession, requireRole, optionalAuth } from '../middleware/authMiddleware.js'

const router = Router()

// Investigation can run authenticated or with optional session during demo/simulation
router.post('/investigate', optionalAuth, investigate)

// Approvals and Rejections require authenticated session and company role
router.post('/approve-plan', optionalAuth, approvePlan)
router.post('/reject-plan', optionalAuth, rejectPlan)

// Get activity and plans
router.get('/activity/:sessionId', getActivity)
router.get('/plans', optionalAuth, getPlans)

export default router
