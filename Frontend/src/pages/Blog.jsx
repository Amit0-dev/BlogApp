import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

const Blog = () => {
    const params = useParams();

    const [loading, setLoading] = useState(false);
    const [blogData, setBlogData] = useState({});

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

    return (
        <div className="w-full h-screen">
            {loading ? (
                <div className="w-full h-screen bg-black text-white flex items-center justify-center">
                    <h1 className="text-2xl font-semibold">Loading...</h1>
                </div>
            ) : (
                <div className="w-full min-h-screen bg-black text-white flex justify-center">
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
                            <p className="font-medium">
                                {blogData.content}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <Toaster />
        </div>
    );
};

export default Blog;
