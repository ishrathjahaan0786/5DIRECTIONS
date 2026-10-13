import { Router } from 'express'
import authRoutes from './authRoutes.js'
import materialsRoutes from './materialsRoutes.js'
import suppliersRoutes from './suppliersRoutes.js'
import ordersRoutes from './ordersRoutes.js'
import disruptionsRoutes from './disruptionsRoutes.js'
import agentRoutes from './agentRoutes.js'
import { getDbStatus } from '../config/db.js'

const router = Router()

// Health check
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: '5Directions Supply Chain & AI Resilience API',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: getDbStatus()
  })
})

// Sub-routes
router.use('/auth', authRoutes)
router.use('/agent', agentRoutes)
router.use('/materials', materialsRoutes)
router.use('/suppliers', suppliersRoutes)
router.use('/orders', ordersRoutes)
router.use('/disruptions', disruptionsRoutes)

export default router
