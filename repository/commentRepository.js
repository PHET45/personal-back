// server/repository/commentRepository.js

import supabase from '../util/supabaseClient.js'

export const CommentRepository = {
  async getByPostId(postId) {
    // 1️⃣ ดึง comments ทั้งหมด
    const { data: comments, error: commentsErr } = await supabase
      .from('comments')
      .select('id, comment_text, user_id, post_id, created_at')
      .eq('post_id', postId)
      .order('created_at', { ascending: true })

    if (commentsErr) throw new Error('Failed to fetch comments')
    if (!comments?.length) return []

    // 2️⃣ ดึงข้อมูลผู้ใช้ทั้งหมดจาก auth.users
    const { data: users, error: usersErr } =
      await supabase.auth.admin.listUsers()

    if (usersErr) throw new Error('Failed to fetch users')

    // 3️⃣ สร้างแผนที่ผู้ใช้
    const usersById = users.users.reduce((acc, u) => {
      acc[u.id] = {
        id: u.id,
        name: u.user_metadata?.name || null,
        username: u.user_metadata?.username || null,
      }
      return acc
    }, {})

    // 4️⃣ รวมผลลัพธ์
    return comments.map((c) => ({
      ...c,
      user: usersById[c.user_id] || null,
    }))
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
