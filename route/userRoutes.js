import express from 'express'
import { UserController } from '../controller/userController.js'
import { authenticate } from '../middleware/authMiddleware.js'

const router = express.Router()

// CRUD
router.get('/:id', authenticate, UserController.getById)


export default router
