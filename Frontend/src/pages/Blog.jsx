import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/AuthContext";

const Blog = () => {
    const params = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [blogData, setBlogData] = useState({});

    const [isOpen, setIsOpen] = useState(false);
    const [isFileChanged, setIsFileChanged] = useState(false);

    const [updatedTitle, setUpdatedTitle] = useState("");
    const [updatedContent, setUpdatedContent] = useState("");
    const [updatedCoverImage, setUpdatedCoverImage] = useState(null);
    // for preview the image..
    const [imageLocalUrl, setImageLocalUrl] = useState(null);

    // state for handling comments functionality...
    const [commentContent, setCommentContent] = useState("");
    const [allComments, setAllComments] = useState([]);
    const [updatedComment, setUpdatedComment] = useState("");
    const [commentLoading, setCommentLoading] = useState(false);
    const { user } = useAuth();

    const updateBlog = async () => {
        try {
            const formData = new FormData();
            formData.append("title", updatedTitle ? updatedTitle : blogData.title);
            formData.append("content", updatedContent ? updatedContent : blogData.content);
            if (updatedCoverImage) {
                formData.append("coverImage", updatedCoverImage);
            }

            const response = await fetch(
                `http://localhost:8000/api/v1/blog/update-blog/${blogData?._id}`,
                {
                    method: "POST",
                    credentials: "include",
                    body: formData,
                }
            );

            const data = await response.json();

            if (data) {
                if (data.success) {
                    setBlogData(data.updatedBlog);
                    toast(data.message);
                }
            }
        } catch (error) {
            console.log(`Error : ${error}`);
        }
    };
    const deleteBlog = async () => {
        try {
            const response = await fetch(
                `http://localhost:8000/api/v1/blog/delete-blog/${blogData?._id}`,
                {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                        accept: "application/json",
                    },
                }
            );

            const data = await response.json();

            if (data) {
                if (data.success) {
                    setBlogData({});

                    navigate("/home");
                }
            }
        } catch (error) {
            console.log(`Error: ${error}`);
        }
    };

    useEffect(() => {
        setLoading(true);

        fetch(`http://localhost:8000/api/v1/blog/${params.id}`, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                accept: "application/json",
            },
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    setBlogData(data?.blog);
                    toast(data?.message);
                }
            })
            .catch((err) => {
                console.log(`Error: ${err}`);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        if (blogData) {
            setUpdatedContent(blogData.content);
            setUpdatedTitle(blogData.title);
        }
    }, [blogData]);

    const createComment = async (e) => {
        setCommentLoading(true);
        e.preventDefault();

        const formData = {
            content: commentContent,
        };

        try {
            const response = await fetch(
                `http://localhost:8000/api/v1/comment/c-create/${blogData?._id}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        accept: "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify(formData),
                }
            );

            const data = await response.json();

            if (data) {
                if (data?.success) {
                    setCommentContent("");
                    toast(data?.message);

                    getAllComments();
                }
            }
        } catch (error) {
            console.log(`Error: ${error}`);
        } finally {
            setCommentLoading(false);
        }
    };

    const getAllComments = async () => {
        try {
            setCommentLoading(true);

            if (blogData?._id) {
                const response = await fetch(
                    `http://localhost:8000/api/v1/comment/${blogData?._id}`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            accept: "application/json",
                        },
                        credentials: "include",
                    }
                );

                const data = await response.json();

                if (data) {
                    if (data?.success) {
                        setAllComments(data?.comments);

                        toast(data?.message);
                    }
                }
            }
        } catch (error) {
            console.log(`Error: ${error}`);
        } finally {
            setCommentLoading(false);
        }
    };

    const updateComment = async (id) => {
        try {
            const formData = {
                content: updatedComment,
            };

            const response = await fetch(`http://localhost:8000/api/v1/comment/c-update/${id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    accept: "application/json",
                },
                credentials: "include",
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (data) {
                if (data?.success) {
                    toast(data?.message);
                    getAllComments();
                }
            }
        } catch (error) {
            console.log(`Error: ${error}`);
        }
    };

    const deleteComment = async (id) => {
        try {
            const response = await fetch(`http://localhost:8000/api/v1/comment/c-delete/${id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    accept: "application/json",
                },
                credentials: "include",
            });

            const data = await response.json();

            if (data) {
                if (data?.success) {
                    toast(data?.message);
                    getAllComments();
                }
            }
        } catch (error) {
            console.log(`Error: ${error}`);
        }
    };

    useEffect(() => {
        if (!blogData?._id) return;
        else getAllComments();
    }, [blogData]);

    return (
        <div className="w-full h-screen">
            {loading ? (
                <div className="w-full h-screen bg-black text-white flex items-center justify-center">
                    <h1 className="text-2xl font-semibold">Loading...</h1>
                </div>
            ) : (
                <div
                    className={`relative w-full min-h-screen bg-black text-white flex justify-center flex-col items-center ${
                        isOpen ? "blur-sm" : "blur-none"
                    } transition-all duration-300`}
                >
                    
                    {blogData && user && (
                        blogData?.author === user?._id &&(
                        <div className="absolute top-60 right-32 flex gap-5">
                            <Dialog open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
                                <form>
                                    <DialogTrigger asChild>
                                        <Button
                                            onClick={() => setIsOpen(true)}
                                            className={
                                                " px-8 bg-blue-500 cursor-pointer font-medium"
                                            }
                                        >
                                            Edit
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[425px]">
                                        <DialogHeader>
                                            <DialogTitle>Edit Blog</DialogTitle>
                                            <DialogDescription>
                                                Make changes to your Blog here. Click save when
                                                you&apos;re done.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="grid gap-4">
                                            <div className="grid gap-3">
                                                <Label htmlFor="title">Title</Label>
                                                <Input
                                                    value={updatedTitle}
                                                    onChange={(e) =>
                                                        setUpdatedTitle(e.target.value)
                                                    }
                                                    id="title"
                                                    name="title"
                                                />
                                            </div>
                                            <div className="flex justify-center">
                                                {isFileChanged ? (
                                                    <div className="w-32 h-28 overflow-hidden">
                                                        <img
                                                            className="w-full h-full object-contain"
                                                            src={imageLocalUrl}
                                                            alt={updatedCoverImage.name}
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="w-32 h-28 overflow-hidden">
                                                        <img
                                                            className="w-full h-full object-contain"
                                                            src={blogData.coverImage}
                                                            alt={blogData.title}
                                                        />
                                                    </div>
                                                )}
                                            </div>

                                            <div className="grid gap-4">
                                                <Label htmlFor="CoverImage">CoverImage</Label>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => {
                                                        const file = e.target.files[0];
                                                        if (file) {
                                                            setUpdatedCoverImage(file);
                                                            setImageLocalUrl(
                                                                URL.createObjectURL(file)
                                                            );
                                                            setIsFileChanged(true);
                                                        }
                                                    }}
                                                />
                                            </div>

                                            <div className="grid gap-4">
                                                <Label htmlFor="content">Content</Label>
                                                <Textarea
                                                    value={updatedContent}
                                                    onChange={(e) =>
                                                        setUpdatedContent(e.target.value)
                                                    }
                                                    id="content"
                                                    name="content"
                                                    className={"w-94 h-20"}
                                                />
                                            </div>
                                        </div>
                                        <DialogFooter>
                                            <DialogClose asChild>
                                                <Button
                                                    onClick={() => setIsOpen(false)}
                                                    variant="outline"
                                                >
                                                    Cancel
                                                </Button>
                                            </DialogClose>
                                            <Button onClick={updateBlog} type="submit">
                                                Save changes
                                            </Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </form>
                            </Dialog>

                            <Button
                                onClick={deleteBlog}
                                className={" px-8 bg-blue-500 cursor-pointer font-medium"}
                            >
                                Delete
                            </Button>
                        </div>
                    ))}

                    <div className="w-2/3 flex flex-col gap-5 pt-10">
                        <div className="text-center">
                            <h2 className="text-7xl">{blogData.title}</h2>
                        </div>

                        <div className="mt-10 w-full max-w-[600px] mx-auto">
                            <img
                                className="w-full aspect-video object-cover rounded-lg"
                                src={blogData.coverImage}
                                alt={blogData.title}
                            />
                        </div>

                        <div className="mt-5 leading-relaxed text-center text-white">
                            <p className="font-medium">{blogData.content}</p>
                        </div>
                    </div>

                    {/* comment section  */}
                    <div className="mt-10 w-2/3">
                        <form
                            onSubmit={createComment}
                            className="w-full flex flex-col gap-2 items-start"
                        >
                            <div className="flex gap-5 items-center justify-center">
                                <label htmlFor="comment" className="text-xl font-semibold">
                                    Comment:
                                </label>
                                <div className="flex items-center justify-center bg-gray-800 w-8 h-8 rounded-full">
                                    <h3 className="text-lg font-medium">{allComments.length}</h3>
                                </div>
                            </div>
                            <input
                                id="comment"
                                className="outline-none border-[1px] w-full rounded-md px-5 py-2 font-medium text-sm"
                                type="text"
                                placeholder="Write your comment..."
                                value={commentContent}
                                onChange={(e) => {
                                    setCommentContent(e.target.value);
                                }}
                            />

                            <Button type={"submit"} className={"bg-blue-500 cursor-pointer"}>
                                {commentLoading ? "Creating..." : "Create"}
                            </Button>
                        </form>

                        {/* comment display section  */}
                        <div className="mt-5 w-full flex flex-col gap-3">
                            {!commentLoading &&
                                allComments.map((comment) => (
                                    <div
                                        key={comment._id}
                                        className="w-full bg-gray-900 flex items-center justify-between py-2 px-6 rounded-md"
                                    >
                                        <div>
                                            <p>@{comment?.owner.name}</p>
                                            <h2>- {comment.content}</h2>
                                        </div>
                                        <div className="flex gap-3">
                                            {user?._id === comment.owner?._id && (
                                                <>
                                                    <Dialog>
                                                        <form>
                                                            <DialogTrigger asChild>
                                                                <Button
                                                                    onClick={() =>
                                                                        setUpdatedComment(
                                                                            comment.content
                                                                        )
                                                                    }
                                                                    className={
                                                                        "bg-blue-500 cursor-pointer"
                                                                    }
                                                                >
                                                                    Edit
                                                                </Button>
                                                            </DialogTrigger>
                                                            <DialogContent className="sm:max-w-[425px]">
                                                                <DialogHeader>
                                                                    <DialogTitle>
                                                                        Edit Comment
                                                                    </DialogTitle>
                                                                    <DialogDescription></DialogDescription>
                                                                </DialogHeader>
                                                                <div className="grid gap-4">
                                                                    <div className="grid gap-3">
                                                                        <Label htmlFor="comment">
                                                                            Comment
                                                                        </Label>
                                                                        <Input
                                                                            id="comment"
                                                                            name="comment"
                                                                            value={updatedComment}
                                                                            onChange={(e) =>
                                                                                setUpdatedComment(
                                                                                    e.target.value
                                                                                )
                                                                            }
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <DialogFooter>
                                                                    <DialogClose asChild>
                                                                        <Button variant="outline">
                                                                            Cancel
                                                                        </Button>
                                                                    </DialogClose>
                                                                    <Button
                                                                        onClick={() =>
                                                                            updateComment(
                                                                                comment._id
                                                                            )
                                                                        }
                                                                        type="submit"
                                                                    >
                                                                        Save changes
                                                                    </Button>
                                                                </DialogFooter>
                                                            </DialogContent>
                                                        </form>
                                                    </Dialog>

                                                    <Button
                                                        onClick={() => deleteComment(comment._id)}
                                                        className={"bg-blue-500 cursor-pointer"}
                                                    >
                                                        Delete
                                                    </Button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                </div>
            )}

            <Toaster />
        </div>
    );
};

export default Blog;
