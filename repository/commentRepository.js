// server/repository/commentRepository.js

import supabase from '../util/supabaseClient.js'

export const CommentRepository = {
async getByPostId(postId) {
  // ดึงคอมเมนต์
  const { data: comments, error: commentsErr } = await supabase
    .from('comments')
    .select('id, comment_text, user_id, post_id, created_at')
    .eq('post_id', postId)
    .order('created_at', { ascending: true });

  if (commentsErr) {
    console.error('Error fetching comments:', commentsErr);
    return [];
  }
  if (!comments || comments.length === 0) return [];

  // ดึงข้อมูลผู้ใช้ที่เกี่ยวข้องทั้งหมดพร้อมกันเพื่อประสิทธิภาพ
  const userIds = Array.from(new Set(comments.map(c => c.user_id).filter(Boolean)));
  if (userIds.length === 0) return comments;

  const { data: users, error: usersErr } = await supabase
    .from('users') // ถ้าตารางอยู่ใน schema auth และ Supabase client ชี้ได้ ให้ใช้ 'users' ปกติ
    .select('id, username, avatar')
    .in('id', userIds);

  if (usersErr) {
    console.error('Error fetching users:', usersErr);
    // ถ้าไม่อยากให้ล้มทั้งหมดยังสามารถคืน comments ได้โดยไม่มี user info
    return comments;
  }

  const usersById = users.reduce((acc, u) => {
    acc[u.id] = u;
    return acc;
  }, {});

  // ผนวกข้อมูลผู้ใช้กลับเข้าไปใน comment
  return comments.map(c => ({
    ...c,
    user: usersById[c.user_id] || null,
  }));
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
