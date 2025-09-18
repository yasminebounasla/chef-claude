// backend/index.js
import express from "express";
import dotenv from "dotenv";
import authRouter from "./routes/auth.js";
import recipeRouter from "./routes/recipe.js";
import mongoose from "mongoose";
import cors from "cors";
import { errorHandler } from "./middleware/errorHandler.js";
import path from "path";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

const rawOrigins = process.env.FRONTEND_URL || ""; 
const allowedOrigins = rawOrigins.split(",").map(s => s.trim()).filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin 
      if (!origin) return callback(null, true);
      if (allowedOrigins.length === 0) {
        // no FRONTEND_URL configured => allow all (dev)
        return callback(null, true);
      }
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("CORS policy: This origin is not allowed"), false);
    },
    credentials: true,
  })
);

app.use(express.json());

// Basic health route
app.get("/", (_, res) => {
  res.json({ message: "Chef Claude server is running!" });
});

// API routes
app.use("/api/recipe", recipeRouter);
app.use("/api/auth", authRouter);

// To enable, set SERVE_FRONTEND=true and ensure 'frontend/dist' exists (built).
if (process.env.SERVE_FRONTEND === "true") {
  const staticPath = path.join(process.cwd(), "frontend", "dist");
  app.use(express.static(staticPath));
  app.get("*", (req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });
}

// Error handler middleware
app.use(errorHandler);

const startServer = async () => {
  try {
    if (!process.env.DATABASE_URL) {
      console.warn("⚠️  DATABASE_URL not set. Please set it in environment variables.");
    }
    await mongoose.connect(process.env.DATABASE_URL, {
      useNewUrlParser: true, useUnifiedTopology: true
    });
    console.log("✅ Connected to MongoDB");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to connect to the database");
    console.error(error);
    process.exit(1);
  }
};

startServer();
