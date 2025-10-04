import { LikeRepository } from '../repository/likeRepository.js'
import supabase from '../util/supabaseClient.js'

export const LikeService = {
  async toggleLike(user, postId) {
    const existing = await LikeRepository.findByUserAndPost(user.id, postId)

    if (existing) {
      // unlike
      await LikeRepository.delete(user.id, postId)
      
      const { data: post } = await supabase
        .from('posts')
        .select('likes_count')
        .eq('id', postId)
        .single()
      
      const newCount = Math.max((post.likes_count || 1) - 1, 0)
      
      await supabase
        .from('posts')
        .update({ likes_count: newCount })
        .eq('id', postId)
      
      return { liked: false, likes_count: newCount } // return ค่าใหม่
    } else {
      // like
      await LikeRepository.insert(user.id, postId)
      
      const { data: post } = await supabase
        .from('posts')
        .select('likes_count')
        .eq('id', postId)
        .single()
      
      const newCount = (post.likes_count || 0) + 1
      
      await supabase
        .from('posts')
        .update({ likes_count: newCount })
        .eq('id', postId)
      
      return { liked: true, likes_count: newCount } // return ค่าใหม่
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