// server/controller/uploadController.js
import { uploadService } from '../service/uploadService.js';

export const uploadController = {
  updateProfilePic: async (req, res, next) => {
    try {
      const file = req.file;
      const userId = req.user.id; // ต้องได้จาก authenticate middleware

      if (!file) return res.status(400).json({ message: "No file uploaded" });

      const updatedUser = await uploadService.uploadProfilePic(userId, file);
      res.json({ user: updatedUser });
    } catch (err) {
      next(err);
    }
  },

  getProfile: async (req, res, next) => {
    try {
      const userId = req.params.userId;
      const profile = await uploadService.getProfile(userId);
      res.json({ profile });
    } catch (err) {
      next(err);
    }
  }
};
