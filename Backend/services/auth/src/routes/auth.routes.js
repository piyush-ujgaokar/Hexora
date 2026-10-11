import {Router} from "express"
import { loginController } from "../controllers/auth.controller.js"
import { authMiddleware } from "../../../../gateway/src/middleware/auth.middleware.js"



const router=Router()


router.post("/login",loginController)

export default router