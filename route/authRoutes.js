import express from "express";
import { login, register, profile, updateUserAvatar } from "../controller/authController.js";
import { authenticate } from "../middleware/authMiddleware.js";
import multer from "multer";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/login", login);
router.post("/register", register);
router.get("/profile", authenticate, profile);
router.post("/update-avatar", authenticate, upload.single("file"), updateUserAvatar);

export default router;
