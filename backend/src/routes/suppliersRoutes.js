import { Router } from 'express'
import {
  getAllSuppliers,
  getSupplierById,
  compareSuppliers,
  updateAllocations
} from '../controllers/suppliersController.js'
import { optionalAuth } from '../middleware/authMiddleware.js'

const router = Router()

router.get('/', getAllSuppliers)
router.get('/compare', compareSuppliers)
router.get('/:id', getSupplierById)
router.post('/allocations', optionalAuth, updateAllocations)

export default router
