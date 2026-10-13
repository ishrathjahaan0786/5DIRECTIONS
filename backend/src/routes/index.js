import { Router } from 'express'
import authRoutes from './authRoutes.js'
import materialsRoutes from './materialsRoutes.js'
import suppliersRoutes from './suppliersRoutes.js'
import ordersRoutes from './ordersRoutes.js'
import disruptionsRoutes from './disruptionsRoutes.js'

const router = Router()

// Health check
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: '5Directions Supply Chain API',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  })
})

// Sub-routes
router.use('/auth', authRoutes)
router.use('/materials', materialsRoutes)
router.use('/suppliers', suppliersRoutes)
router.use('/orders', ordersRoutes)
router.use('/disruptions', disruptionsRoutes)

export default router
