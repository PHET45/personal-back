// server/service/uploadService.js
import supabase from "../util/supabaseClient.js";
import { uploadRepository } from "../repository/uploadRepository.js";

export const uploadService = {
  uploadProfilePic: async (userId, file) => {
    const fileName = `${userId}_${Date.now()}_${file.originalname}`;
    const { data: storageData, error: storageError } = await supabase.storage
      .from("avatars")
      .upload(fileName, file.buffer, { contentType: file.mimetype });

    if (storageError) throw storageError;

    const SUPABASE_URL = process.env.SUPABASE_URL;
    const profilePicUrl = `${SUPABASE_URL}/storage/v1/object/public/avatars/${fileName}`;

    const updatedUser = await uploadRepository.upsertProfilePic(userId, profilePicUrl);
    return updatedUser;
  },

  getProfile: async (userId) => {
    return await uploadRepository.getUserProfile(userId);
  },
};

