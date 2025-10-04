import { LikeService } from '../service/likeService.js'

export const LikeController = {
async toggleLike(req, res) {
  try {
    const user = req.user
    const postId = req.params.postId
    const result = await LikeService.toggleLike(user, postId)
    res.json(result)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
},

  async getLikes(req, res) {
    try {
      const postId = req.params.postId
      const user = req.user || null // อาจจะ undefined ถ้าไม่ authenticate
      const result = await LikeService.getLikesWithUser(user, postId)
      res.json(result)
    } catch (err) {
      res.status(400).json({ error: err.message })
    }
  }
}
