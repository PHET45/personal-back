//route/postRoutes.js
import express from "express"
import { PostController } from "../controller/postController.js"
import { authenticate } from "../middleware/authMiddleware.js"

const router = express.Router()
router.get("/public/:id", PostController.getPublishedById)      // GET /posts/public/:id
router.get("/public", PostController.getAllPublished)           // GET /posts/public

// CRUD
router.get("/", authenticate, PostController.getAll)
router.get("/:id", authenticate, PostController.getById)
router.post("/", authenticate, PostController.create) // authMiddleware,
router.put("/:id",authenticate,PostController.update) // authMiddleware,
router.delete("/:id", authenticate,PostController.remove) // authMiddleware,

export default router
