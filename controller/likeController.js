import { LikeService } from '../service/likeService.js'

export const LikeController = {
  async toggleLike(req, res) {
    try {
      const user = req.user
      const postId = req.params.postId
      const result = await LikeService.toggleLike(user, postId)
      const likes_count = await LikeService.getPostLikes(postId)
      res.json({ ...result, likes_count })
    } catch (err) {
      res.status(400).json({ error: err.message })
    }
  },

  async getLikes(req, res) {
    try {
      const postId = req.params.postId
      const likes_count = await LikeService.getPostLikes(postId)
      res.json({ likes_count })
    } catch (err) {
      res.status(400).json({ error: err.message })
    }
  }
}
