// server/controller/uploadController.js
import { uploadService } from '../service/uploadService.js';

export const uploadController = {
  // ✅ Upload profile picture
  updateProfilePic: async (req, res, next) => {
    try {
      const file = req.file;
      const userId = req.user.id;

      console.log('📥 Upload request:', {
        userId,
        fileName: file?.originalname,
        fileSize: file?.size,
        mimeType: file?.mimetype
      });

      if (!file) {
        console.log('❌ No file provided');
        return res.status(400).json({ message: "No file uploaded" });
      }

      const profile = await uploadService.uploadProfilePic(userId, file);
      
      console.log('✅ Upload completed successfully');
      
      res.json({ 
        message: "Profile picture updated successfully",
        profile 
      });
    } catch (err) {
      console.error('❌ Upload controller error:', {
        message: err.message,
        code: err.code,
        details: err.details,
        hint: err.hint
      });
      next(err);
    }
  },

  // ✅ Get profile
  getProfile: async (req, res, next) => {
    try {
      const userId = req.params.userId || req.user.id;
      
      console.log('📖 Get profile request:', { userId });
      
      const profile = await uploadService.getProfile(userId);
      
      if (!profile) {
        console.log('❌ Profile not found');
        return res.status(404).json({ message: "Profile not found" });
      }

      console.log('✅ Profile retrieved');
      res.json({ profile });
    } catch (err) {
      console.error('❌ Get profile error:', err.message);
      next(err);
    }
  },

  // ✅ Update profile info
  updateProfileInfo: async (req, res, next) => {
    try {
      const userId = req.user.id;
      const { name, username } = req.body;

      console.log('📝 Update profile request:', { userId, name, username });

      if (!name || !username) {
        console.log('❌ Missing required fields');
        return res.status(400).json({ 
          message: "Name and username are required" 
        });
      }

      const profile = await uploadService.updateProfile(userId, { name, username });
      
      console.log('✅ Profile updated successfully');
      
      res.json({ 
        message: "Profile updated successfully",
        profile 
      });
    } catch (err) {
      console.error('❌ Update profile error:', {
        message: err.message,
        code: err.code
      });
      
      // Handle unique constraint error
      if (err.code === '23505') {
        return res.status(400).json({
          message: "Username already exists"
        });
      }
      
      next(err);
    }
  }
};