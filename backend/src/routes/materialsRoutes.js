import { Router } from 'express'
import {
  getAllMaterials,
  getMaterialById,
  createMaterial,
  updateMaterial,
  deleteMaterial
} from '../controllers/materialsController.js'
import { optionalAuth } from '../middleware/authMiddleware.js'

const router = Router()

router.get('/', getAllMaterials)
router.get('/:id', getMaterialById)
router.post('/', optionalAuth, createMaterial)
router.put('/:id', optionalAuth, updateMaterial)
router.delete('/:id', optionalAuth, deleteMaterial)

export default router
