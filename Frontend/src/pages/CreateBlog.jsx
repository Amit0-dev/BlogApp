import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import React, { useState } from "react";
import { toast } from "sonner"

const CreateBlog = () => {
    const [coverImage, setCoverImage] = useState({});
    const [content, setContent] = useState("");
    const [title, setTitle] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            setLoading(true);

            const formData = new FormData()
            formData.append('title', title)
            formData.append('content', content)
            formData.append('coverImage', coverImage)

            const response = await fetch("http://localhost:8000/api/v1/blog/create-blog", {
                method: "POST",
                credentials: "include",
                body: formData,
            });

            const data = await response.json();

            if (data) {
                if (data?.success) {
                    toast(data?.message)
                }
            }
        } catch (error) {
            console.log(`Error: ${error}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full h-screen bg-black text-white flex pt-20 justify-center">
            <form onSubmit={handleSubmit} encType='multipart/form-data' className="w-1/2 flex flex-col gap-7">
                <div className="flex gap-7 items-center">
                    <label htmlFor="coverImage" className="text-xl font-semibold">
                        CoverImage:
                    </label>
                    <input
                        onChange={(e) => setCoverImage(e.target.files[0])}
                        type="file"
                        className="bg-gray-900"
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="title" className="text-xl font-semibold">
                        Title:
                    </label>
                    <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        type="text"
                        placeholder="Title..."
                        className="border-2 font-medium p-3"
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="content" className="text-xl font-semibold">
                        Content:
                    </label>
                    <textarea
                        name="content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        id="content"
                        className=" border-2 h-70 p-5 font-medium"
                        placeholder="Write Something here..."
                    ></textarea>
                </div>

                <Button type="submit" className={"bg-blue-500 cursor-pointer"}>
                    {loading ? "Creating..." : "Create"}
                </Button>
            </form>

            <Toaster />
        </div>
    );
};

export default CreateBlog;
