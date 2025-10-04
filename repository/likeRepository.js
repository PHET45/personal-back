import supabase from '../util/supabaseClient.js'

export const LikeRepository = {
  async findByUserAndPost(userId, postId) {
    const { data, error } = await supabase
      .from('likes')
      .select('*')
      .eq('user_id', userId)
      .eq('post_id', postId)
      .single()

    if (error && error.code !== 'PGRST116') throw error
    return data
  },

  async insert(userId, postId) {
    const { data, error } = await supabase
      .from('likes')
      .insert({ user_id: userId, post_id: postId })
    if (error) throw error
    return data
  },

  async delete(userId, postId) {
    const { data, error } = await supabase
      .from('likes')
      .delete()
      .eq('user_id', userId)
      .eq('post_id', postId)
    if (error) throw error
    return data
  },

  async countByPost(postId) {
    const { count, error } = await supabase
      .from('likes')
      .select('*', { count: 'exact', head: true })
      .eq('post_id', postId)
    if (error) throw error
    return count
  }
}
