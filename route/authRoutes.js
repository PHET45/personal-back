//route/authRoutes.js
import express from "express";
import { login, register, profile, authController } from "../controller/authController.js";
import { authenticate } from "../middleware/authMiddleware.js";


const router = express.Router();


router.post("/login", login);
router.post("/register", register);
router.get("/profile", authenticate, profile);
router.post("/change-password", authenticate, authController.changePassword);

export default router;
