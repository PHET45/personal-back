//route/categoryRoutes.js
import express from 'express'
import { CategoryController } from '../controller/categoryController.js'

const router = express.Router()

router.get('/', CategoryController.getAll)
router.post('/', CategoryController.create)
router.put('/:id', CategoryController.update)
router.delete('/:id', CategoryController.remove)

export default router
