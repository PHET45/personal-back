import express from "express"
import { PostController } from "../controller/postController.js"
import { authenticate } from "../middleware/authMiddleware.js"

const router = express.Router()

// CRUD
router.get("/", PostController.getAll)
router.get("/:id", PostController.getById)
router.post("/", authenticate, PostController.create) // authMiddleware,
router.put("/:id",authenticate,PostController.update) // authMiddleware,
router.delete("/:id", authenticate,PostController.remove) // authMiddleware,

export default router
