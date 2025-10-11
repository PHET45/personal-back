// server/repository/uploadRepository.js
import supabase from "../util/supabaseClient.js";

export const uploadRepository = {
  // ✅ Update profile picture
  upsertProfilePic: async (userId, profilePicUrl) => {
    const { data, error } = await supabase
      .from("users")
      .upsert(
        { id: userId, profile_pic: profilePicUrl },
        { onConflict: "id" }
      )
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // ✅ Get user profile from view
  getUserProfile: async (userId) => {
    const { data, error } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error) throw error;
    return data;
  },

  // ✅ Update user metadata (ใช้ RPC)
  updateUserMetadata: async (userId, { name, username }) => {
    const { data, error } = await supabase.rpc('update_user_metadata', {
      p_user_id: userId,
      p_name: name,
      p_username: username
    });

    if (error) throw error;
    return data;
  },

  // ✅ Delete old profile picture
  deleteProfilePic: async (fileName) => {
    const { error } = await supabase.storage
      .from("avatars")
      .remove([fileName]);
    
    if (error) throw error;
    return true;
  }
};