import express from "express"
import { chat } from "../src/controllers/ai.controller.js"



const router=express.Router()


router.post("/chat",chat)



export default router