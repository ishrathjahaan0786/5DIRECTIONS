import { Router } from 'express'
import {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  respondToOrder
} from '../controllers/ordersController.js'
import { optionalAuth } from '../middleware/authMiddleware.js'

const router = Router()

router.get('/', getAllOrders)
router.get('/:id', getOrderById)
router.post('/', optionalAuth, createOrder)
router.patch('/:id/status', optionalAuth, updateOrderStatus)
router.post('/:id/respond', optionalAuth, respondToOrder)

export default router
