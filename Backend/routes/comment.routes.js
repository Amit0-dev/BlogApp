import express from "express";
import { createComment, deleteComment, getAllCommentsOnBlogById, updateComment } from "../controllers/comment.controllers.js";
import {isAuthenticated} from "../middleware/auth.middleware.js"

const router = express.Router()

router.post("/c-create/:blogId",isAuthenticated, createComment)
router.post("/c-update/:commentId",isAuthenticated, updateComment)
router.post("/c-delete/:commentId",isAuthenticated, deleteComment)
router.get("/:blogId", getAllCommentsOnBlogById)

export default router