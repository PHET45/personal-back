import express from 'express'
import { LikeController } from '../controller/likeController.js'
import { authenticate } from '../middleware/authMiddleware.js'

const router = express.Router()

// toggle ต้อง login
router.post('/:postId/toggle', authenticate, LikeController.toggleLike)

// getLikes: ถ้ามี token ก็เช็ค liked ได้ ถ้าไม่มี token ก็ได้แค่ likes_count
router.get('/:postId', (req, res, next) => {
  const auth = req.headers.authorization || ''
  if (auth.startsWith('Bearer ')) {
    return authenticate(req, res, next) // ถ้ามี token -> ส่งให้ middleware
  }
  next() // ถ้าไม่มี token -> ข้าม
}, LikeController.getLikes)

export default router
