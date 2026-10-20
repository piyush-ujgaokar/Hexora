import {Router} from "express"
import { addCreditsController, deductCreditsController, loginController, logoutController } from "../controllers/auth.controller.js"

const router=Router()


router.post("/login",loginController)
router.get("/logout",logoutController)

router.post("/user/deduct-credits",deductCreditsController)
router.post("/user/add-credits",addCreditsController)




export default router