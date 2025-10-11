// server/controller/uploadController.js
import { uploadService } from '../service/uploadService.js';

export const uploadController = {
  getSignedUrl: async (req, res, next) => {
    try {
      const { fileName } = req.body;
      if (!fileName) return res.status(400).json({ message: 'Missing fileName' });

      const signedUrl = await uploadService.generateSignedUrl(fileName);
      res.json({ signedUrl });
    } catch (err) {
      next(err);
    }
  },

  updateProfilePic: async (req, res, next) => {
    try {
      const { userId, profilePicUrl } = req.body;
      if (!userId || !profilePicUrl) return res.status(400).json({ message: 'Missing parameters' });

      const updatedUser = await uploadService.updateProfilePic(userId, profilePicUrl);
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
