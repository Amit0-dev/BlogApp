import express from "express"
import {register, login, logout, loggedInUser, updateProfile} from "../controllers/auth.controllers.js"
import { isAuthenticated } from "../middleware/auth.middleware.js"

const router = express.Router()

router.post("/register", register)
router.post("/login", login)
router.post("/logout", isAuthenticated,  logout)

router.post("/update", isAuthenticated, updateProfile)

router.get("/me", isAuthenticated, loggedInUser)

export default router