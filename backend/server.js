import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";

const backendDirectory = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(backendDirectory, ".env"), override: true });

const app = express();
const port = process.env.PORT || 5000;
const allowedOrigins = new Set([
    process.env.FRONTEND_URL || "http://localhost:5173",
    "http://localhost:5173",
    "http://127.0.0.1:5173"
]);

const isLocalFrontend = (origin) => {
    try {
        const url = new URL(origin);
        return ["localhost", "127.0.0.1"].includes(url.hostname) && url.port !== "";
    } catch {
        return false;
    }
};

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.has(origin) || isLocalFrontend(origin)) {
            return callback(null, true);
        }

        return callback(new Error("Origin is not allowed by the API"));
    },
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.get("/", (_req, res) => {
    res.json({ message: "Backend is running" });
});

app.use("/api/auth", authRoutes);

const startServer = async () => {
    await connectDB();
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
};

startServer().catch((error) => {
    console.error("Server startup failed:", error.message);
    process.exit(1);
});