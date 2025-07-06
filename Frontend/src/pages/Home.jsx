import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
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
import { useAuth } from "@/context/AuthContext";

const Home = () => {
    console.log("Home");
    const { user, setUserData, setLoggedIdFlag } = useAuth();
    const [loading, setLoading] = useState(false);
    const [allBlogs, setAllBlogs] = useState([]);
    const [updatedName, setUpdatedName] = useState();

    const navigate = useNavigate();

   

    const fetchAllBlog = async () => {
        setLoading(true);
        try {
            const response = await fetch("http://localhost:8000/api/v1/blog/", {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    accept: "application/json",
                },
            });

            const data = await response.json();

            if (data) {
                if (data?.success) {
                    setAllBlogs(data?.allBlogs);
                    toast(data?.message);
                }
            }
        } catch (error) {
            console.log(`Error: ${error}`);
        } finally {
            setLoading(false);
        }
    };

    const handleClick = () => {
        navigate("/create-blog");
    };

    const openBlog = (id) => {
        navigate(`/blog/${id}`);
    };

    const handleChanges = async () => {
        
        fetch("http://localhost:8000/api/v1/user/update", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                accept: "application/json",
            },
            body: JSON.stringify({ updatedName }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    setUserData(data?.updatedUser);
                    toast(data.message);
                }
            })
            .catch((err) => {
                console.log(`Error: ${err}`);
            });
    };

    const logout = () => {
        fetch("http://localhost:8000/api/v1/user/logout", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                accept: "application/json",
            },
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    setUserData({});
                    setLoggedIdFlag(false)
                    localStorage.removeItem("token")
                    navigate("/");
                }
            })
            .catch((err) => {
                console.log(`Error: ${err}`);
            });
    };

    useEffect(() => {
        fetchAllBlog();
    }, []);

    useEffect(() => {
        if (user) {
            setUpdatedName(user?.name);
        }
    }, [user]);

    return loading ? (
        <div className="w-full h-screen bg-black text-white flex items-center justify-center">
            <h1 className="text-2xl font-semibold">Loading...</h1>
        </div>
    ) : (
        <div className="w-full h-screen bg-black text-white px-16">
            <nav className="w-full flex items-center justify-between p-5">
                <div>
                    <h2 className="text-2xl font-semibold">Blogify</h2>
                </div>
                <div className="flex items-center justify-center gap-16">
                    <div className="flex items-center justify-center gap-5">
                        <Button onClick={handleClick} className={"bg-blue-500 cursor-pointer"}>
                            createBlog
                        </Button>
                        <Button onClick={logout} className={"bg-blue-500 cursor-pointer"}>
                            Logout
                        </Button>
                    </div>
                    <div className="flex items-center justify-center gap-5">
                        <h3>{user?.name || "Undefined"}</h3>
                        <div className="w-8 h-8 overflow-hidden">
                            <Dialog>
                                <form>
                                    <DialogTrigger asChild>
                                        <img
                                            src="https://cdn-icons-png.flaticon.com/512/219/219983.png"
                                            alt="profile_img"
                                            className="w-full h-full object-cover"
                                        />
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[425px]">
                                        <DialogHeader>
                                            <DialogTitle>Edit profile</DialogTitle>
                                            <DialogDescription>
                                                Make changes to your profile here. Click save when
                                                you&apos;re done.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="grid gap-4">
                                            <div className="grid gap-3">
                                                <Label htmlFor="name-1">Name</Label>

                                                <Input
                                                    id="name-1"
                                                    name="name"
                                                    value={updatedName}
                                                    onChange={(e) => setUpdatedName(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <DialogFooter>
                                            <DialogClose asChild>
                                                <Button variant="outline">Cancel</Button>
                                            </DialogClose>
                                            <Button onClick={handleChanges} type="submit">
                                                Save changes
                                            </Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </form>
                            </Dialog>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="w-full pt-10 flex flex-wrap gap-7">
                {/* cards */}
                {allBlogs.map((blog) => (
                    <div
                        key={blog._id}
                        className="w-52 h-46 rounded-2xl overflow-hidden bg-gray-900 p-2"
                        onClick={() => openBlog(blog._id)}
                    >
                        <div className="w-full h-[70%] rounded-2xl overflow-hidden">
                            <img
                                src={blog.coverImage}
                                alt={blog.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="w-full h-[30%] flex items-center justify-center">
                            {blog.title}
                        </div>
                    </div>
                ))}
            </div>

            <Toaster />
        </div>
    );
};

export default Home;
