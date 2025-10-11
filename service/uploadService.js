// server/service/uploadService.js
import supabase from "../util/supabaseClient.js";
import { uploadRepository } from '../repository/uploadRepository.js';

export const uploadService = {
  uploadProfilePic: async (userId, file) => {
    const fileName = `${userId}_${Date.now()}_${file.originalname}`;
    const { data, error } = await supabase.storage
      .from('avatars')
      .upload(fileName, file.buffer, { contentType: file.mimetype });

    if (error) throw error;

    const profilePicUrl = `https://vrwgswqbjqgsqmbxhjuv.supabase.co/storage/v1/object/public/avatars/${fileName}`;

    const updatedUser = await uploadRepository.updateProfilePic(userId, profilePicUrl);
    return updatedUser;
  },

  getProfile: async (userId) => {
    return await uploadRepository.getUserProfile(userId);
  }
};

