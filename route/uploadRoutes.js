// server/route/uploadRoutes.js
import express from 'express';
import { uploadController } from '../controller/uploadController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import multer from "multer";

const router = express.Router();
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});
// ✅ Upload profile picture
router.put('/profile-pic', authenticate, upload.single('file'), uploadController.updateProfilePic);

// ✅ Get own profile
router.get('/profile', authenticate, uploadController.getProfile);

// ✅ Get other user's profile
router.get('/profile/:userId', uploadController.getPublicProfile);

// ✅ Update profile info (name, username)
router.put('/profile', authenticate, uploadController.updateProfileInfo);

export default router;
