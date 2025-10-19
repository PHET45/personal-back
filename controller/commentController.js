// server/controller/commentController.js
import { CommentService } from '../service/commentService.js'

export const CommentController = {
  async getNotifications(req, res) {
    try {
      const user_id = req.user.id // จาก token
      const notifications = await CommentService.getNotifications(user_id)
      res.json({ success: true, data: notifications })
    } catch (err) {
      res.status(400).json({ success: false, message: err.message })
    }
  },

  async getComments(req, res) {
    try {
      const { postId } = req.params
      const comments = await CommentService.getCommentsByPost(postId)
      res.json({ success: true, data: comments })
    } catch (err) {
      res.status(400).json({ success: false, message: err.message })
    }
  },

  async createComment(req, res) {
    try {
      const { post_id, comment_text } = req.body
      const user_id = req.user.id // ✅ ต้องดึงจาก token ก่อน

      const comment = await CommentService.addComment({
        post_id,
        user_id,
        comment_text,
      })

      res.json({
        success: true,
        data: {
          ...comment,
          user: {
            id: req.user.id,
            username: req.user.user_metadata.username,
            name: req.user.user_metadata.name,
          },
        },
      })
    } catch (err) {
      res.status(400).json({ success: false, message: err.message })
    }
  },

  async deleteComment(req, res) {
    try {
      const { id } = req.params
      const user_id = req.user.id // ✅ จาก token

      await CommentService.deleteComment(id, user_id)

      res.json({ success: true, message: 'Comment deleted successfully' })
    } catch (err) {
      res.status(400).json({ success: false, message: err.message })
    }
  },
}
