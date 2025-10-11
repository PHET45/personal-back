import express from "express";
import { login, register, profile } from "../controller/authController.js";
import { authenticate } from "../middleware/authMiddleware.js";


const router = express.Router();


router.post("/login", login);
router.post("/register", register);
router.get("/profile", authenticate, profile);


export default router;
