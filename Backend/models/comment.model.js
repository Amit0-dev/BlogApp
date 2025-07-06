import mongoose, { Schema } from "mongoose";

const commentSchema = new mongoose.Schema({

    content: {
        type: String,
        required: true
    },
    blogId: {
        type: Schema.Types.ObjectId,
        ref: "Blog"
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }

}, {timestamps: true})

export const Comment = mongoose.model("Comment", commentSchema)