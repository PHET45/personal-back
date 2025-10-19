// server/service/commentService.js
import { CommentRepository } from '../repository/commentRepository.js'

export const CommentService = {
  async getNotifications(userId) {
    if (!userId) throw new Error('userId is required')
    return await CommentRepository.getNotificationsByUserId(userId)
  },
  async getCommentsByPost(postId) {
    if (!postId) throw new Error('postId is required')
    return await CommentRepository.getByPostId(postId)
  },

  async addComment(data) {
    const { post_id, user_id, comment_text } = data
    if (!post_id || !user_id || !comment_text)
      throw new Error('Missing required fields')

    return await CommentRepository.createComment(data)
  },

  async deleteComment(commentId, userId) {
    if (!commentId) throw new Error('Missing commentId')
    if (!userId) throw new Error('Unauthorized')
    return await CommentRepository.deleteComment(commentId, userId)
  },
}
