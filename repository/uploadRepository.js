// server/repository/uploadRepository.js
import supabase from "../util/supabaseClient.js";

export const uploadRepository = {
  // ✅ Update profile picture
 upsertProfilePic: async (userId, profilePicUrl) => {
  profilePicUrl = profilePicUrl.trim();

  // ดึง row เดิม
  const { data: existingUser } = await supabase
    .from("users")
    .select("name, username, role")
    .eq("id", userId)
    .single();

  const name = existingUser?.name || '';
  const username = existingUser?.username || `user_${userId.substring(0, 8)}`;
  const role = existingUser?.role || 'user'; // <-- default role

  const { data, error } = await supabase
    .from("users")
    .upsert(
      { id: userId, profile_pic: profilePicUrl, name, username, role },
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
    
    // ไม่ throw error ถ้าไฟล์ไม่มี
    return true;
  }
};