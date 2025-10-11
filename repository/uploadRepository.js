// server/repository/uploadRepository.js
import supabase from "../util/supabaseClient.js";

export const uploadRepository = {
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

  getUserProfile: async (userId) => {
    const { data, error } = await supabase
      .from("user_profiles")  // ดึงจาก view
      .select("*")
      .eq("id", userId)
      .single();

    if (error) throw error;
    return data;
  },
};
