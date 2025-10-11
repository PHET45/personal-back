// server/controller/uploadController.js
import { uploadService } from '../service/uploadService.js';

export const uploadController = {
  // ✅ Upload profile picture
  updateProfilePic: async (req, res, next) => {
    try {
      const file = req.file;
      const userId = req.user.id;

      console.log('Upload request:', { userId, file: file?.originalname });

      if (!file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const profile = await uploadService.uploadProfilePic(userId, file);
      
      console.log('Upload success:', profile);
      
      res.json({ 
        message: "Profile picture updated successfully",
        profile 
      });
    } catch (err) {
      console.error('Upload controller error:', err);
      next(err);
    }
  },

  // ✅ Get profile
  getProfile: async (req, res, next) => {
    try {
      const userId = req.params.userId || req.user.id;
      
      console.log('Get profile request:', { userId });
      
      const profile = await uploadService.getProfile(userId);
      
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }

      res.json({ profile });
    } catch (err) {
      console.error('Get profile controller error:', err);
      next(err);
    }
  },

  // ✅ Update profile info
  updateProfileInfo: async (req, res, next) => {
    try {
      const userId = req.user.id;
      const { name, username } = req.body;

      console.log('Update profile request:', { userId, name, username });

      if (!name || !username) {
        return res.status(400).json({ 
          message: "Name and username are required" 
        });
      }

      const profile = await uploadService.updateProfile(userId, { name, username });
      
      console.log('Update success:', profile);
      
      res.json({ 
        message: "Profile updated successfully",
        profile 
      });
    } catch (err) {
      console.error('Update profile controller error:', err);
      next(err);
    }
  }
};