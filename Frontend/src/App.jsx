import Login from "./pages/Login";
import Signup from "./pages/Signup.jsx";
import Home from "./pages/Home.jsx";
import CreateBlog from "./pages/CreateBlog.jsx";
import Blog from "./pages/Blog.jsx";
import { Route, Routes, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "./context/AuthContext";
import ProtectedRoute from "./ProtectedRoute.jsx";

function App() {
    console.log("App");

    const { setUserData, loggedIn } = useAuth();
    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    useEffect(() => {
      
        if (token) {
          
            fetch("http://localhost:8000/api/v1/user/me", {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    accept: "application/json",
                },
            })
                .then((res) => {
                    if (res.status === 401) {
                        localStorage.removeItem("token");
                        navigate("/");
                    }
                    return res.json();
                })
                .then((data) => {
                    if (data.success) {
                        // update state
                        setUserData(data?.user);
                        navigate("/home");
                    }
                })
                .catch((err) => {
                    console.log(`Error: ${err}`);
                   
                });
        }
    }, []);

    return (
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
                path="/home"
                element={
                    <ProtectedRoute>
                        <Home />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/create-blog"
                element={
                    <ProtectedRoute>
                        <CreateBlog />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/blog/:id"
                element={
                    <ProtectedRoute>
                        <Blog />
                    </ProtectedRoute>
                }
            />
        </Routes>
    );
}

export default App;
