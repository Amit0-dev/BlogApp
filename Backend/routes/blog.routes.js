import express from "express";
import {
    createBlog,
    deleteBlog,
    getAllBlog,
    getBlogById,
    updateBlog,
} from "../controllers/blog.controllers.js";
import { upload } from "../middleware/multer.middleware.js";
import { isAuthenticated } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/create-blog", upload.single("coverImage"), isAuthenticated, createBlog);
router.post("/update-blog/:id", upload.single("coverImage"), isAuthenticated, updateBlog);
router.post("/delete-blog/:id", deleteBlog);

router.get("/:id", getBlogById);
router.get("/", getAllBlog);

export default router;
