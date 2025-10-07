// server/repository/commentRepository.js

import supabase from '../util/supabaseClient.js'

export const CommentRepository = {
  // ดึงทุก comment
  async getAllComments() {
    const { data, error } = await supabase
      .from('comments')
      .select('id, comment_text, user_id, post_id, created_at')
      .order('created_at', { ascending: true })

    if (error) throw new Error(error.message)
    return data
  },

  async getByPostId(postId) {
    const { data, error } = await supabase
      .from('comments')
      .select('id, comment_text, user_id, post_id, created_at')
      .eq('post_id', postId)
      .order('created_at', { ascending: true })

    if (error) throw new Error(error.message)
    return data
  },

  async createComment({ post_id, user_id, comment_text }) {
    const { data, error } = await supabase
      .from('comments')
      .insert([{ post_id, user_id, comment_text }])
      .select()

    if (error) throw new Error(error.message)
    return data[0]
  },

  async deleteComment(commentId, userId) {
    // ✅ ลบ comment โดยเช็กว่า user_id ตรงกับคนลบ
    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', commentId)
      .eq('user_id', userId)

    if (error) throw new Error(error.message)
    return true
  },
}
