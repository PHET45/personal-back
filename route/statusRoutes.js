import { StatusController } from "../controller/statusController.js"; 
import express from "express"

const router = express.Router()

router.get("/", StatusController.getAll)

export default router