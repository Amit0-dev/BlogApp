import { deleteMediaOnCloudinary, getPublicId, uploadOnCloudinary } from "../utils/cloudinary.js";
import { Blog } from "../models/blog.model.js";
import { isValidObjectId } from "mongoose";

const createBlog = async (req, res) => {
    try {
        const { title, content } = req.body;

        if (!title || !content) {
            return res.status(400).json({
                message: "All fields are required",
            });
        }

        const coverImageLocalPath = req.file?.path;

        if (!coverImageLocalPath) {
            return res.status(400).json({
                message: "coverImage is required",
            });
        }

        // upload on cloudinary

        const image = await uploadOnCloudinary(coverImageLocalPath);

        if (!image) {
            return res.status(400).json({
                message: "Something went wrong while uploading the file on cloudinary",
            });
        }

        const blog = await Blog.create({
            title,
            content,
            coverImage: image?.url,
            author: req.user?._id,
        });

        if (!blog) {
            return res.status(400).json({
                message: "Blog not created",
                success: false,
            });
        }

        return res.status(200).json({
            message: "Blog created successfully",
            success: true,
            blog,
        });
    } catch (error) {
        return res.status(400).json({
            message: "Blog not created",
            success: false,
            error,
        });
    }
};
const updateBlog = async (req, res) => {
    try {
        const { id } = req.params;

        if (!isValidObjectId(id)) {
            return res.status(400).json({
                message: "Not a valid blog ID",
            });
        }

        const { title, content } = req.body;

        if (!title || !content) {
            return res.status(400).json({
                message: "All fields are required",
            });
        }

        const coverImageLocalPath = req.file?.path;

        // upload on cloudinary
        let image;
        if (coverImageLocalPath) {
            image = await uploadOnCloudinary(coverImageLocalPath);
        }

        const blog = await Blog.findById(id);

        if (!blog) {
            return res.status(400).json({
                message: "Blog does not exists",
            });
        }

        //delete the old coverImage from cloudinary

        if (image?.url) {
            const oldCoverImageUrl = blog?.coverImage;
            if (!oldCoverImageUrl) {
                return res.status(400).json({
                    message: "coverImage does not exists in blog",
                });
            }

            const publicId = getPublicId(oldCoverImageUrl);

            if (!publicId) {
                return res.status(400).json({
                    message: "Something went wrong while generating coverImage publicId",
                });
            }

            await deleteMediaOnCloudinary(publicId);

            const oldBlogDocument = await Blog.findByIdAndUpdate(id, {
                title,
                content,
                coverImage: image?.url,
            });

            if (!oldBlogDocument) {
                return res.status(400).json({
                    message: "Blog not updated something went wrong",
                });
            }

            const updatedBlog = await Blog.findById(oldBlogDocument?._id);

            if (!updatedBlog) {
                return res.status(400).json({
                    message: "Blog does not exists",
                });
            }

            return res.status(200).json({
                message: "Blog updated successfully",
                success: true,
                updatedBlog,
            });
        } else {
            const oldBlogDocument = await Blog.findByIdAndUpdate(id, {
                title,
                content,
            });

            if (!oldBlogDocument) {
                return res.status(400).json({
                    message: "Blog not updated something went wrong",
                });
            }

            const updatedBlog = await Blog.findById(oldBlogDocument?._id);

            if (!updatedBlog) {
                return res.status(400).json({
                    message: "Blog does not exists",
                });
            }

            return res.status(200).json({
                message: "Blog updated successfully",
                success: true,
                updatedBlog,
            });
        }
    } catch (error) {
        return res.status(400).json({
            message: "Blog not updated",
            success: false,
            error,
        });
    }
};
const deleteBlog = async (req, res) => {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
        return res.status(400).json({
            message: "Not a valid Blog ID",
        });
    }

    const deletedBlog = await Blog.findByIdAndDelete(id);

    if (!deletedBlog) {
        return res.status(400).json({
            message: "Blog not deleted something went wrong",
        });
    }

    const coverImageUrl = deletedBlog?.coverImage;

    if (!coverImageUrl) {
        return res.status(400).json({
            message: "coverImage is missing from blog",
        });
    }

    const publicId = getPublicId(coverImageUrl);

    await deleteMediaOnCloudinary(publicId);

    return res.status(200).json({
        message: "Blog deleted successfully",
        success: true,
        deletedBlog,
    });
};
const getBlogById = async (req, res) => {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
        return res.status(400).json({
            message: "Not a valid blog ID",
        });
    }

    const blog = await Blog.findById(id);

    if (!blog) {
        return res.status(400).json({
            message: "Blog does not exists",
        });
    }

    return res.status(200).json({
        message: "Blog fetched by ID successfully",
        success: true,
        blog,
    });
};
const getAllBlog = async (req, res) => {
    try {
        const allBlogs = await Blog.find({}).sort({ createdAt: -1 });

        if (allBlogs.length === 0) {
            return res.status(404).json({
                message: "No blogs found in the database",
                success: false,
            });
        }

        return res.status(200).json({
            message: "Fetched all blogs successfully",
            success: true,
            allBlogs,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Server error while fetching blogs",
            error: error.message,
        });
    }
};

export { createBlog, updateBlog, deleteBlog, getBlogById, getAllBlog };
