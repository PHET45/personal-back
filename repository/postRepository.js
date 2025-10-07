import supabase from '../util/supabaseClient.js'

export const PostRepository = {
  async getAll() {
    const { data, error } = await supabase
      .from('posts')
      .select(
        'id, title, description, image, date, likes_count, category_id, status_id, content,category:categories!posts_category_id_fkey ( id, name ),status:statuses!posts_status_id_fkey ( id, status )'
      )
      .order('date', { ascending: false })
    if (error) throw error
    return data
  },

  async getById(id) {
  // 1. ดึง post + comments
  const { data: post, error: postError } = await supabase
    .from('posts')
    .select('*, category:categories!posts_category_id_fkey (id, name), comments(id, comment_text, created_at, user_id)')
    .eq('id', id)
    .single();

  if (postError) throw postError;

  // 2. ดึงข้อมูลผู้ใช้จาก auth.users
  const userIds = post.comments.map(c => c.user_id);
  const { data: users, error: userError } = await supabase
    .from('users') // Supabase Auth users table
    .select('id, username, profile_pic')
    .in('id', userIds);

  if (userError) throw userError;

  // 3. map username + profile_pic กลับไปที่ comments
  const commentsWithUser = post.comments.map(comment => {
    const user = users.find(u => u.id === comment.user_id);
    return {
      ...comment,
      username: user?.username || null,
      profile_pic: user?.profile_pic || null
    };
  });

  return {
    ...post,
    comments: commentsWithUser
  };
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
