// server/repository/uploadRepository.js
import supabase from "../util/supabaseClient.js";

export const uploadRepository = {
  updateProfilePic: async (userId, profilePicUrl) => {
    const { error } = await supabase
      .from('users')
      .update({ profile_pic: profilePicUrl })
      .eq('id', userId);

    if (error) throw error;
    return { userId, profilePicUrl };
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
