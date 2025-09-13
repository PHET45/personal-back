import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()
const supabaseUrl = process.env.SUPABASE_URL
const supabaseAnonKey = process.env.SUPABASE_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default supabase

export const PostRepository = {
  async getAll() {
    const { data, error } = await supabase
      .from('posts')
      .select(
        'id, title, description, image, date, likes_count, category_id, status_id, content,category:categories!posts_category_id_fkey ( id, name )'
      )
      .order('date', { ascending: false })
    if (error) throw error
    return data
  },

  async getById(id) {
    const { data, error } = await supabase
      .from('posts')
      .select(
        '*, category_id, status_id, comments(comment_text, created_at, users(username, profile_pic))'
      )
      .eq('id', id)
      .single()
    if (error) throw error
    return data
  },

  async create(post) {
    const { data, error } = await supabase.from('posts').insert([post]).select()
    if (error) throw error
    return data[0]
  },

  async update(id, post) {
    const { data, error } = await supabase
      .from('posts')
      .update(post)
      .eq('id', id)
      .select()
    if (error) throw error
    return data[0]
  },

  async delete(id) {
    const { error } = await supabase.from('posts').delete().eq('id', id)
    if (error) throw error
    return true
  },
}
