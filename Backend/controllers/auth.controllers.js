import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const register = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({
            message: "All fields are required",
        });
    }

    try {
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "User is already exists",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        if (!user) {
            return res.status(400).json({
                message: "Something went wrong while creating user",
            });
        }

        return res.status(200).json({
            message: "User created successfully",
            success: true,
        });
    } catch (error) {
        return res.status(400).json({
            message: "Something went wrong",
            error,
        });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            message: "All fields are required",
        });
    }

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message: "User does not exists",
            });
        }

        const matched = await bcrypt.compare(password, user.password);

        if (!matched) {
            return res.status(400).json({
                message: "Invalid Credentials",
            });
        }

        const token = jwt.sign(
            {
                id: user._id,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d",
            }
        );

        const loggedInUser = await User.findById(user._id).select("-password");

        const options = {
            httpOnly: true,
            secure: true,
        };

        return res.status(200).cookie("token", token, options).json({
            message: "User loggedIn successfully",
            loggedInUser,
            success: true,
        });
    } catch (error) {
        return res.status(400).json({
            message: "Something went wrong",
            error,
        });
    }
};
const updateProfile = async (req, res) => {
    const { updatedName } = req.body;

    if (!updatedName) {
        return res.status(400).json({
            message: "All fields are required",
        });
    }

    try {
        const email = req?.user?.email;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message: "User does not exists",
            });
        }

        const updatedUser = await User.findByIdAndUpdate(user._id, {
            name: updatedName,
        });

        if (!updatedUser) {
            return res.status(400).json({
                message: "User does not exists",
            });
        }

        return res.status(200).json({
            message: "User Profile Updated successfully",
            success: true,
        });
    } catch (error) {
        return res.status(400).json({
            message: "Something went wrong",
            error,
        });
    }
};

const logout = async (req, res) => {
    const options = {
        httpOnly: true,
        secure: true,
    };

    return res.status(200).clearCookie("token", options).json({
        message: "User loggedOut successfully",
        success: true,
    });
};

const loggedInUser = async (req, res) => {
    return res.status(200).json({
        message: "loggedIn user",
        user: req?.user,
        success: true,
    });
};

export { register, login, logout, loggedInUser, updateProfile };
