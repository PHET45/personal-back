// server/route/uploadRoutes.js
import express from 'express';
import { uploadController } from '../controller/uploadController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import multer from "multer";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.put('/profile-pic', authenticate, upload.single('file'), uploadController.updateProfilePic);
router.get('/profile/:userId', authenticate, uploadController.getProfile);

export default router;

