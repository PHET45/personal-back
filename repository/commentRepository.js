// server/repository/commentRepository.js

import supabase from '../util/supabaseClient.js'

export const CommentRepository = {
    async getNotificationsByUserId(userId) {
    try {
      console.log('🔍 Fetching notifications for admin:', userId)

      // 1️⃣ ดึง comments ทั้งหมดที่ไม่ใช่ของ admin
      const { data: comments, error: commentsErr } = await supabase
        .from('comments')
        .select('id, comment_text, user_id, post_id, created_at')
        .neq('user_id', userId) // คนอื่นมา comment
        .order('created_at', { ascending: false })
        .limit(100) // จำกัดไม่เกิน 100 รายการ

      if (commentsErr) {
        console.error('❌ Error fetching comments:', commentsErr)
        throw new Error(`Failed to fetch comments: ${commentsErr.message}`)
      }

      if (!comments || comments.length === 0) {
        console.log('ℹ️ No comments found')
        return []
      }

      console.log(`✅ Found ${comments.length} comments from others`)

      // 2️⃣ ดึงข้อมูล posts ที่เกี่ยวข้อง
      const postIds = [...new Set(comments.map(c => c.post_id))]
      
      const { data: posts, error: postsErr } = await supabase
        .from('posts')
        .select('id, title, image, description')
        .in('id', postIds)

      if (postsErr) {
        console.error('❌ Error fetching posts:', postsErr)
        throw new Error(`Failed to fetch posts: ${postsErr.message}`)
      }

      // 3️⃣ ดึงข้อมูลผู้ใช้จาก table users
      const userIds = [...new Set(comments.map(c => c.user_id))]
      
      const { data: users, error: usersErr } = await supabase
        .from('users')
        .select('id, name, username, profile_pic')
        .in('id', userIds)

      if (usersErr) {
        console.error('❌ Error fetching users:', usersErr)
        throw new Error(`Failed to fetch users: ${usersErr.message}`)
      }

      const usersById = (users || []).reduce((acc, u) => {
        acc[u.id] = {
          id: u.id,
          name: u.name || null,
          username: u.username || null,
          profile_pic: u.profile_pic || null
        }
        return acc
      }, {})

      // 4️⃣ สร้าง post map
      const postsById = (posts || []).reduce((acc, p) => {
        acc[p.id] = {
          id: p.id,
          title: p.title,
          image_url: p.image, // แปลง image -> image_url
          description: p.description
        }
        return acc
      }, {})

      // 5️⃣ รวมข้อมูลทั้งหมด
      const notifications = comments.map((c) => ({
        ...c,
        user: usersById[c.user_id] || null,
        post: postsById[c.post_id] || null
      }))

      console.log(`✅ Returning ${notifications.length} notifications`)
      return notifications

    } catch (error) {
      console.error('❌ Error in getNotificationsByUserId:', error)
      throw error
    }
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
