import { Button } from "@/components/ui/button";
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        try {
            console.log("function called");
            e.preventDefault();
            setLoading(true);

            const formData = {
                name,
                email,
                password,
            };

            const response = await fetch("http://localhost:8000/api/v1/user/register", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    accept: "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (data) {
                if(data.success){
                    navigate("/")
                }
            }
        } catch (error) {
            console.log(`Error: ${error}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full h-screen bg-black flex items-center justify-center">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle>Signup to your account</CardTitle>
                    <CardDescription>
                        Enter your email below to Signup to your account
                    </CardDescription>
                    <CardAction>
                        <Button variant="link">
                            <Link to={"/"}>Login</Link>
                        </Button>
                    </CardAction>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    id="name"
                                    type="text"
                                    placeholder="xyz"
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="m@example.com"
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    placeholder="password"
                                />
                            </div>
                        </div>

                        <CardFooter className="flex-col gap-2 mt-5">
                            <Button type="submit" className="w-full">
                                {loading ? "Signup..." : "Signup"}
                            </Button>
                        </CardFooter>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default Signup;
