// server/service/uploadService.js
import supabase from "../util/supabaseClient.js";
import { uploadRepository } from "../repository/uploadRepository.js";

export const uploadService = {
  // ✅ Upload profile picture
  uploadProfilePic: async (userId, file) => {
    // ลบรูปเก่าก่อน (ถ้ามี)
    const profile = await uploadRepository.getUserProfile(userId);
    if (profile?.profile_pic) {
      const oldFileName = profile.profile_pic.split('/').pop();
      await supabase.storage.from("avatars").remove([oldFileName]);
    }

    // Upload รูปใหม่
    const fileName = `${userId}_${Date.now()}_${file.originalname}`;
    const { data: storageData, error: storageError } = await supabase.storage
      .from("avatars")
      .upload(fileName, file.buffer, { 
        contentType: file.mimetype,
        upsert: true 
      });

    if (storageError) throw storageError;

    const SUPABASE_URL = process.env.SUPABASE_URL;
    const profilePicUrl = `${SUPABASE_URL}/storage/v1/object/public/avatars/${fileName}`;

    // Update ใน users table
    const updatedUser = await uploadRepository.upsertProfilePic(userId, profilePicUrl);
    
    // ดึงข้อมูลล่าสุดจาก view
    const fullProfile = await uploadRepository.getUserProfile(userId);
    return fullProfile;
  },

  // ✅ Get profile
  getProfile: async (userId) => {
    return await uploadRepository.getUserProfile(userId);
  },

  // ✅ เพิ่ม: Update profile info
  updateProfile: async (userId, { name, username }) => {
    // Update metadata ใน auth.users
    await uploadRepository.updateUserMetadata(userId, { name, username });
    
    // Return ข้อมูลล่าสุด
    return await uploadRepository.getUserProfile(userId);
  }
};