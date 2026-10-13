import { Router } from 'express'
import {
  getAllDisruptions,
  createDisruptionAlert,
  getRiskOverview
} from '../controllers/disruptionsController.js'
import { optionalAuth } from '../middleware/authMiddleware.js'

const router = Router()

router.get('/', getAllDisruptions)
router.get('/overview', getRiskOverview)
router.post('/', optionalAuth, createDisruptionAlert)

export default router
