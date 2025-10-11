// server/repository/uploadRepository.js
import supabase from "../util/supabaseClient.js";

export const uploadRepository = {
  // ✅ Update profile picture - แก้ไขเฉพาะ profile_pic
  upsertProfilePic: async (userId, profilePicUrl) => {
    try {
      const { data, error } = await supabase
        .from("users")
        .update({
          profile_pic: profilePicUrl
        })
        .eq("id", userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      console.error("Error in upsertProfilePic:", err.message);
      throw err;
    }
  },

  // ✅ Get user profile - ใช้ตรงจาก users table แทน view
  getUserProfile: async (userId) => {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) throw error;
    return data;
  },

  // ✅ Update user info (name, username) ใน users table
  updateUserInfo: async (userId, { name, username }) => {
    const { data, error } = await supabase
      .from("users")
      .update({ name, username })
      .eq("id", userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // ✅ Delete old profile picture
  deleteProfilePic: async (fileName) => {
    const { error } = await supabase.storage
      .from("avatars")
      .remove([fileName]);
    
    return true;
  }
};