import bcrypt from "bcryptjs";
import { randomInt } from "node:crypto";
import User from "../models/User.js";
import sendOtpEmail from "../utils/sendEmail.js";

const OTP_LIFETIME_MS = 5 * 60 * 1000;


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

        const otp = String(randomInt(100000, 1000000));
        const otpHash = await bcrypt.hash(otp, 10);

        const user = await User.create({
            email,
            password: hashedPassword,
            otpHash,
            otpExpires: new Date(Date.now() + OTP_LIFETIME_MS),
            emailVerified: false
        });

        try {
            await sendOtpEmail(user.email, otp);
        } catch (error) {
            await User.deleteOne({ _id: user._id });
            throw error;
        }

        res.status(201).json({
            message: "Registration successful. Check your email for the verification code.",
            email: user.email
        });

    } catch (error) {
        console.error("Registration failed:", error.message);

        res.status(500).json({
            message: error.message || "Registration failed"
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

        if (!user.emailVerified) {
            return res.status(403).json({
                message: "Please verify your email before logging in"
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

export const verifyOtp = async (req, res) => {
    try {
        const email = req.body.email?.trim().toLowerCase();
        const otp = String(req.body.otp || "").trim();

        if (!email || !/^\d{6}$/.test(otp)) {
            return res.status(400).json({ message: "Email and a 6-digit OTP are required" });
        }

        const user = await User.findOne({ email });
        if (!user || !user.otpHash || !user.otpExpires) {
            return res.status(400).json({ message: "Verification code is invalid" });
        }

        if (user.otpExpires.getTime() < Date.now()) {
            return res.status(400).json({ message: "Verification code has expired" });
        }

        const isCorrect = await bcrypt.compare(otp, user.otpHash);
        if (!isCorrect) {
            return res.status(400).json({ message: "Verification code is invalid" });
        }

        user.emailVerified = true;
        user.otpHash = undefined;
        user.otpExpires = undefined;
        await user.save();

        // Auto-login: set the same cookie as the login endpoint
        res.cookie("email", user.email, {
            httpOnly: false,
            secure: false,
            sameSite: "lax",
            path: "/"
        });

        res.json({ message: "Email verified successfully" });
    } catch (error) {
        res.status(500).json({ message: "Email verification failed", error: error.message });
    }
};