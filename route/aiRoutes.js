import express from "express"
import { AiController } from "../controller/aiController.js"

const router = express.Router()
router.post("/ask", AiController.ask)

export default router
