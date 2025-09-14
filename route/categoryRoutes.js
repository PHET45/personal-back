import express from "express"
import { CategoryController } from "../controller/categoryController.js"

const router = express.Router()

router.get("/", CategoryController.getAll)

export default router