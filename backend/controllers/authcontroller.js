import bcrypt from "bcryptjs";
import User from "../models/User.js";


// ==========================
// REGISTER
// ==========================

export const registerUser = async (req, res) => {

    try {

        const email = req.body.email?.trim().toLowerCase();
        const password = req.body.password;

        if (!email || !password || password.length < 6) {
            return res.status(400).json({
                message: "A valid email and a password of at least 6 characters are required"
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await User.create({
            email,
            password: hashedPassword
        });

        res.status(201).json({
            message: "Registration successful",
            user: {
                email: user.email
            }
        });

    } catch (error) {

        res.status(500).json({
            message: "Registration failed",
            error: error.message
        });

    }
};


// ==========================
// LOGIN
// ==========================

export const loginUser = async (req, res) => {

    try {

        const email = req.body.email?.trim().toLowerCase();
        const password = req.body.password;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        // Find user
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        // Compare password
        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordCorrect) {

            return res.status(401).json({
                message: "Invalid email or password"
            });

        }

        // Create email cookie
        res.cookie("email", user.email, {
            httpOnly: false,
            secure: false,
            sameSite: "lax",
            path: "/"
        });

        res.json({
            message: "Login successful",
            success: true
        });

    } catch (error) {

        res.status(500).json({
            message: "Login failed",
            error: error.message
        });

    }
};

export const logoutUser = (_req, res) => {
    res.clearCookie("email", { sameSite: "lax", path: "/" });
    res.json({ message: "Logout successful" });
};