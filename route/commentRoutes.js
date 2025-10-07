// server/route/commentRoutes.js
import express from 'express'
import { CommentController } from '../controller/commentController.js'
import { authenticate } from '../middleware/authMiddleware.js'

const router = express.Router()

router.get('/', CommentController.getAllComments) 
router.get('/:postId', CommentController.getComments)
router.post('/', authenticate, CommentController.createComment)
router.delete('/:id', authenticate, CommentController.deleteComment) 

export default router
