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
const isProduction = process.env.NODE_ENV === 'production';

// Validate required environment variables
const requiredEnvVars = ['DATABASE_URL'];
if (isProduction) {
  requiredEnvVars.push('JWT_SECRET');
}

const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
if (missingVars.length > 0) {
  console.error('❌ Missing required environment variables:', missingVars);
  process.exit(1);
}

// CORS configuration
const rawOrigins = process.env.FRONTEND_URL || "";
const allowedOrigins = rawOrigins.split(",").map(s => s.trim()).filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (mobile apps, postman, etc.)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.length === 0) {
        // no FRONTEND_URL configured => allow all (development only)
        if (!isProduction) {
          return callback(null, true);
        } else {
          return callback(new Error("CORS policy: No origins configured for production"), false);
        }
      }
      
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      
      return callback(new Error("CORS policy: This origin is not allowed"), false);
    },
    credentials: true,
  })
);

// Body parsing with limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Basic health route
app.get("/", (_, res) => {
  res.json({ 
    message: "Chef Claude server is running!",
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

// API routes
app.use("/api/recipe", recipeRouter);
app.use("/api/auth", authRouter);

// Serve frontend in production (if SERVE_FRONTEND is enabled)
if (process.env.SERVE_FRONTEND === "true") {
  const staticPath = path.join(process.cwd(), "frontend", "dist");
  console.log(`📁 Serving static files from: ${staticPath}`);
  
  app.use(express.static(staticPath));
  
  // Handle client-side routing - send index.html for all non-API routes
  app.get("*", (req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });
}

// Error handler middleware 
app.use(errorHandler);

const startServer = async () => {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(process.env.DATABASE_URL);
    console.log("✅ Connected to MongoDB");
    
    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔐 CORS origins: ${allowedOrigins.length ? allowedOrigins.join(', ') : 'All (development)'}`);
    });

    // Graceful shutdown
    const gracefulShutdown = async (signal) => {
      console.log(`📤 ${signal} received, shutting down gracefully`);
      server.close(async () => {
        console.log('📪 HTTP server closed');
        await mongoose.connection.close();
        console.log('📪 MongoDB connection closed');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    
  } catch (error) {
    console.error("❌ Failed to start server");
    console.error(error);
    process.exit(1);
  }
};

startServer();