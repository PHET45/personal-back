import express from "express"
import { PostController } from "../controller/postController.js"
import { authMiddleware } from "../middleware/authMiddleware.js"

const router = express.Router()

// CRUD
router.get("/", PostController.getAll)
router.get("/:id", PostController.getById)
router.post("/", authMiddleware, PostController.create) // authMiddleware,
router.put("/:id",authMiddleware,PostController.update) // authMiddleware,
router.delete("/:id", authMiddleware,PostController.remove) // authMiddleware,

export default router
