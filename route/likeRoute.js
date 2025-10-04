import express from 'express'
import { LikeController } from '../controller/likeController.js'
import { authenticate } from '../middleware/authMiddleware.js'

const router = express.Router()

router.post('/:postId/toggle', authenticate, LikeController.toggleLike)
router.get('/:postId', LikeController.getLikes)

export default router
