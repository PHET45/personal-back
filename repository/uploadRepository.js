// server/repository/uploadRepository.js
import supabase from "../util/supabaseClient.js";

export const uploadRepository = {
  updateProfilePic: async (userId, profilePicUrl) => {
    const { data, error } = await supabase
      .from('users')
      .update({ profile_pic: profilePicUrl })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data; // return updated user
  },

  getUserProfile: async (userId) => {
    const { data, error } = await supabase
      .from('user_profiles') // ใช้ view
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  }
};
