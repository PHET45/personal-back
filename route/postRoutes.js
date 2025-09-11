import express from "express"
import { PostController } from "../controller/postController.js"
// import { authMiddleware } from "../middleware/authMiddleware.js"

const router = express.Router()

// CRUD
router.get("/", PostController.getAll)
router.get("/:id", PostController.getById)
router.post("/",  PostController.create) // authMiddleware,
router.put("/:id",PostController.update) // authMiddleware,
router.delete("/:id", PostController.remove) // authMiddleware,

export default router
