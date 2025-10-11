// server/controller/uploadController.js
import { uploadService } from '../service/uploadService.js';

export const uploadController = {
  // ✅ Upload profile picture
  updateProfilePic: async (req, res, next) => {
    try {
      const file = req.file;
      const userId = req.user.id;

      if (!file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const profile = await uploadService.uploadProfilePic(userId, file);
      res.json({ 
        message: "Profile picture updated successfully",
        profile 
      });
    } catch (err) {
      next(err);
    }
  },

  // ✅ Get profile
  getProfile: async (req, res, next) => {
    try {
      const userId = req.params.userId || req.user.id;
      const profile = await uploadService.getProfile(userId);
      
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }

      res.json({ profile });
    } catch (err) {
      next(err);
    }
  },

  // ✅ เพิ่ม: Update profile info (name, username)
  updateProfileInfo: async (req, res, next) => {
    try {
      const userId = req.user.id;
      const { name, username } = req.body;

      if (!name || !username) {
        return res.status(400).json({ 
          message: "Name and username are required" 
        });
      }

      const profile = await uploadService.updateProfile(userId, { name, username });
      res.json({ 
        message: "Profile updated successfully",
        profile 
      });
    } catch (err) {
      next(err);
    }
  }
};