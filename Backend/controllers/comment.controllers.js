import { isValidObjectId } from "mongoose";
import { Comment } from "../models/comment.model.js";

const createComment = async (req, res) => {
    const { blogId } = req.params;

    if (!isValidObjectId(blogId)) {
        return res.status(400).json({
            message: "Invalid blog Id",
        });
    }

    const { content } = req.body;

    if (!content) {
        return res.status(400).json({
            message: "All fields are required",
        });
    }

    try {
        const contentDocument = await Comment.create({
            content,
            blogId: blogId,
            owner: req?.user?._id,
        });

        if (!contentDocument) {
            return res.status(400).json({
                message: "Something went wrong while creating comment",
            });
        }

        return res.status(200).json({
            message: "Comment created successfully",
            success: true,
            contentDocument,
        });
    } catch (error) {
        return res.status(400).json({
            message: "Comment does not created successfully",
            success: false,
            error,
        });
    }
};

const updateComment = async (req, res) => {
    const { commentId } = req.params;

    if (!isValidObjectId(commentId)) {
        return res.status(400).json({
            message: "Invalid Comment Id",
        });
    }

    const { content } = req.body;

    if (!content) {
        return res.status(400).json({
            message: "All fields are required",
        });
    }

    try {
        const updatedContentDocument = await Comment.findByIdAndUpdate(
            commentId,
            {
                $set: {content},
            },
            { new: true }
        );

        if (!updatedContentDocument) {
            return res.status(400).json({
                message: "Something went wrong while creating comment",
            });
        }

        return res.status(200).json({
            message: "Comment updated successfully",
            success: true,
            updatedContentDocument,
        });
    } catch (error) {
        return res.status(400).json({
            message: "Comment does not updated successfully",
            success: false,
            error,
        });
    }
};

const deleteComment = async (req, res) => {
    const { commentId } = req.params;

    if (!isValidObjectId(commentId)) {
        return res.status(400).json({
            message: "Invalid Comment Id",
        });
    }

    try {
        const deletedComment = await Comment.findByIdAndDelete(commentId);

        if (!deletedComment) {
            return res.status(400).json({
                message: "Comment does not deleted , something went wrong",
            });
        }

        return res.status(200).json({
            message: "Comment deleted successfully",
            success: true,
            deletedComment,
        });
    } catch (error) {
        return res.status(400).json({
            message: "Comment does not deleted successfully",
            success: false,
            error,
        });
    }
};

const getAllCommentsOnBlogById = async (req, res) => {
    const { blogId } = req.params;

    if (!isValidObjectId(blogId)) {
        return res.status(400).json({
            message: "Invalid blog Id",
        });
    }

    try {
        const comments = await Comment.find({ blogId: blogId }).populate("owner", "name");

        if (!comments) {
            return res.status(400).json({
                message: "Something went wrong while fetching comments",
            });
        }

        

        return res.status(200).json({
            message: "Comment fetched successfully",
            success: true,
            comments,
        });
    } catch (error) {
        return res.status(400).json({
            message: "Comment does not fetched successfully",
            success: false,
            error,
        });
    }
};

export { createComment, updateComment, deleteComment, getAllCommentsOnBlogById };
