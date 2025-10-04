import { LikeRepository } from '../repository/likeRepository.js'
import supabase from '../util/supabaseClient.js'

export const LikeService = {
  async toggleLike(user, postId) {
    const existing = await LikeRepository.findByUserAndPost(user.id, postId)

    if (existing) {
      // unlike
      await LikeRepository.delete(user.id, postId)
      
      // ✅ แก้: ใช้ RPC หรือ query ปกติ
      const { data: post } = await supabase
        .from('posts')
        .select('likes_count')
        .eq('id', postId)
        .single()
      
      await supabase
        .from('posts')
        .update({ likes_count: (post.likes_count || 1) - 1 })
        .eq('id', postId)
      
      return { liked: false }
    } else {
      // like
      await LikeRepository.insert(user.id, postId)
      
      
      const { data: post } = await supabase
        .from('posts')
        .select('likes_count')
        .eq('id', postId)
        .single()
      
      await supabase
        .from('posts')
        .update({ likes_count: (post.likes_count || 0) + 1 })
        .eq('id', postId)
      
      return { liked: true }
    }
  },

  async getPostLikes(postId) {
    const { data, error } = await supabase
      .from('posts')
      .select('likes_count')
      .eq('id', postId)
      .single()
    if (error) throw error
    return data.likes_count || 0
  },

  async getLikesWithUser(user, postId) {
    const likes_count = await this.getPostLikes(postId)
    if (!user) {
      return { likes_count }
    }

    const existing = await LikeRepository.findByUserAndPost(user.id, postId)
    return {
      likes_count,
      liked: !!existing,
    }
  }
}