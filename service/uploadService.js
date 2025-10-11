// server/service/uploadService.js
import supabase from "../util/supabaseClient.js";
import { uploadRepository } from '../repository/uploadRepository.js';

export const uploadService = {
  generateSignedUrl: async (fileName) => {
    const { signedURL, error } = await supabase.storage
      .from('avatars')
      .createSignedUploadUrl(fileName, 60); // URL หมดอายุ 60 วินาที

    if (error) throw error;
    return signedURL;
  },

  updateProfilePic: async (userId, profilePicUrl) => {
    return await uploadRepository.updateProfilePic(userId, profilePicUrl);
  },

  getProfile: async (userId) => {
    return await uploadRepository.getUserProfile(userId);
  }
};
