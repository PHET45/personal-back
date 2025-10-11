// server/route/uploadRoutes.js
import express from 'express';
import { uploadController } from '../controller/uploadController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/signed-url', authenticate, uploadController.getSignedUrl);
router.put('/profile-pic', authenticate, uploadController.updateProfilePic);
router.get('/profile/:userId', authenticate, uploadController.getProfile);

export default router;
