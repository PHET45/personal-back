// server/repository/uploadRepository.js
import supabase from "../util/supabaseClient.js";

export const uploadRepository = {
  // ✅ Upsert with auth metadata sync
  upsertProfilePic: async (userId, profilePicUrl, authMetadata = {}) => {
    try {
      const { data: existingUser } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      const userData = {
        id: userId,
        profile_pic: profilePicUrl,
        username: authMetadata.username || existingUser?.username || `user_${Date.now()}`,
        name: authMetadata.name || existingUser?.name || 'User',
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
    return data;
  },

  // ✅ Update และ sync กับ Supabase Auth
  updateUserInfo: async (userId, { name, username }) => {
    try {
      // 1. Update ใน users table
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

      // 2. ✅ Update ใน Supabase Auth user_metadata
      const { error: authError } = await supabase.auth.updateUser({
        data: {
          name,
          username
        }
      });

      if (authError) {
        console.error('Failed to sync with auth:', authError);
        // ไม่ throw error เพราะ users table อัปเดตสำเร็จแล้ว
      }

      return data;
    } catch (err) {
      console.error("Error in updateUserInfo:", err.message);
      throw err;
    }
  },

  deleteProfilePic: async (fileName) => {
    const { error } = await supabase.storage
      .from("avatars")
      .remove([fileName]);
    
    return true;
  }
};