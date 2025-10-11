// server/service/uploadService.js
import supabase from "../util/supabaseClient.js";
import { uploadRepository } from "../repository/uploadRepository.js";

export const uploadService = {
  uploadProfilePic: async (userId, file) => {
    try {
      console.log('📸 Starting upload for user:', userId);
      
      // ✅ ดึงข้อมูล auth metadata
      const { data: { user: authUser } } = await supabase.auth.getUser();
      const authMetadata = {
        name: authUser?.user_metadata?.name,
        username: authUser?.user_metadata?.username
      };
      
      let currentProfile;
      try {
        currentProfile = await uploadRepository.getUserProfile(userId);
      } catch (err) {
        console.log('No existing profile found, continuing...');
      }
      
      if (currentProfile?.profile_pic) {
        const urlParts = currentProfile.profile_pic.split('/');
        const oldFileName = urlParts[urlParts.length - 1];
        console.log('🗑️ Deleting old picture:', oldFileName);
        
        try {
          await uploadRepository.deleteProfilePic(oldFileName);
        } catch (err) {
          console.log('Old picture delete failed (may not exist)');
        }
      }

      const fileName = `${userId}_${Date.now()}_${file.originalname}`;
      console.log('⬆️ Uploading new picture:', fileName);
      
      const { data: storageData, error: storageError } = await supabase.storage
        .from("avatars")
        .upload(fileName, file.buffer, { 
          contentType: file.mimetype,
          upsert: true 
        });

      if (storageError) {
        console.error('Storage error:', storageError);
        throw storageError;
      }

      console.log('✅ Upload successful:', storageData);

      const SUPABASE_URL = process.env.SUPABASE_URL;
      const profilePicUrl = `${SUPABASE_URL}/storage/v1/object/public/avatars/${fileName}`;
      console.log('🔗 Public URL:', profilePicUrl);

      // ✅ ส่ง authMetadata ไปด้วย
      await uploadRepository.upsertProfilePic(userId, profilePicUrl, authMetadata);
      
      const updatedProfile = await uploadRepository.getUserProfile(userId);
      console.log('✅ Profile updated:', updatedProfile);
      
      return updatedProfile;
    } catch (error) {
      console.error('❌ Upload service error:', error);
      throw error;
    }
  },

  getProfile: async (userId) => {
    try {
      return await uploadRepository.getUserProfile(userId);
    } catch (error) {
      console.error('❌ Get profile error:', error);
      throw error;
    }
  },

  updateProfile: async (userId, { name, username }) => {
    try {
      console.log('📝 Updating profile for user:', userId, { name, username });
      
      await uploadRepository.updateUserInfo(userId, { name, username });
      
      const updatedProfile = await uploadRepository.getUserProfile(userId);
      console.log('✅ Profile info updated:', updatedProfile);
      
      return updatedProfile;
    } catch (error) {
      console.error('❌ Update profile error:', error);
      throw error;
    }
  }
};