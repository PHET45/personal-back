// server/service/uploadService.js
import supabase from "../util/supabaseClient.js";
import { uploadRepository } from "../repository/uploadRepository.js";

export const uploadService = {
  // ✅ Upload profile picture
  uploadProfilePic: async (userId, file) => {
    try {
      // Get current profile to delete old picture
      const currentProfile = await uploadRepository.getUserProfile(userId);
      
      // Delete old picture if exists
      if (currentProfile?.profile_pic) {
        const oldFileName = currentProfile.profile_pic.split('/').pop();
        try {
          await uploadRepository.deleteProfilePic(oldFileName);
        } catch (err) {
          console.log('Old picture not found, continuing...');
        }
      }

      // Upload new picture
      const fileName = `${userId}_${Date.now()}_${file.originalname}`;
      const { data: storageData, error: storageError } = await supabase.storage
        .from("avatars")
        .upload(fileName, file.buffer, { 
          contentType: file.mimetype,
          upsert: true 
        });

      if (storageError) throw storageError;

      // Get public URL
      const SUPABASE_URL = process.env.SUPABASE_URL;
      const profilePicUrl = `${SUPABASE_URL}/storage/v1/object/public/avatars/${fileName}`;

      // Update profile_pic in users table
      await uploadRepository.upsertProfilePic(userId, profilePicUrl);
      
      // Get updated profile
      const updatedProfile = await uploadRepository.getUserProfile(userId);
      return updatedProfile;
    } catch (error) {
      console.error('Upload service error:', error);
      throw error;
    }
  },

  // ✅ Get profile
  getProfile: async (userId) => {
    return await uploadRepository.getUserProfile(userId);
  },

  // ✅ Update profile info
  updateProfile: async (userId, { name, username }) => {
    try {
      // Update metadata using RPC
      await uploadRepository.updateUserMetadata(userId, { name, username });
      
      // Get updated profile
      const updatedProfile = await uploadRepository.getUserProfile(userId);
      return updatedProfile;
    } catch (error) {
      console.error('Update profile service error:', error);
      throw error;
    }
  }
};