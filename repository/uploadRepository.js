// server/repository/uploadRepository.js
import supabase from "../util/supabaseClient.js";

export const uploadRepository = {
  // ✅ Update profile_pic ใน users table
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

  // ✅ ดึงข้อมูลจาก view (แก้ไข filter เป็น user_id)
  getUserProfile: async (userId) => {
    const { data, error } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("user_id", userId)  // ✅ แก้เป็น user_id
      .single();

    if (error) throw error;
    return data;
  },

  // ✅ เพิ่ม: Update user metadata (name, username)
  updateUserMetadata: async (userId, { name, username }) => {
    const { data: userData, error: userError } = await supabase.auth.admin.updateUserById(
      userId,
      {
        user_metadata: { name, username }
      }
    );

    if (userError) throw userError;
    return userData;
  }
};