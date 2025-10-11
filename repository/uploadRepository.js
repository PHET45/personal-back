// server/repository/uploadRepository.js
export const uploadRepository = {
  // ✅ Update profile picture with auth metadata
  upsertProfilePic: async (userId, profilePicUrl, authMetadata = {}) => {
    try {
      const { data: existingUser } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .maybeSingle(); // ใช้ maybeSingle แทน single เพื่อไม่ error ถ้าไม่เจอ

      const userData = {
        id: userId,
        profile_pic: profilePicUrl,
        username: existingUser?.username || authMetadata.username || `user_${Date.now()}`,
        name: existingUser?.name || authMetadata.name || 'User',
        role: existingUser?.role || 'user'
      };

      const { data, error } = await supabase
        .from("users")
        .upsert(userData, { 
          onConflict: 'id',
          ignoreDuplicates: false 
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      console.error("Error in upsertProfilePic:", err.message);
      throw err;
    }
  },

  getUserProfile: async (userId) => {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .maybeSingle();

    if (error) throw error;
    
    // ถ้าไม่เจอ return null
    return data;
  },

  updateUserInfo: async (userId, { name, username }) => {
    const { data, error } = await supabase
      .from("users")
      .upsert(
        { 
          id: userId, 
          name, 
          username,
          role: 'user' 
        },
        { 
          onConflict: 'id',
          ignoreDuplicates: false 
        }
      )
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  deleteProfilePic: async (fileName) => {
    const { error } = await supabase.storage
      .from("avatars")
      .remove([fileName]);
    
    return true;
  }
};