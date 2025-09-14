import express from "express";
import dotenv from "dotenv";
import authRouter from "./routes/auth.js";
import recipeRouter from "./routes/recipe.js";
import mongoose from 'mongoose';
import cors from "cors";
import { errorHandler } from "./middleware/errorHandler.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use(express.json()); // ✅ Keep this here

app.get("/", (_, res) => {
  res.json({message: "Chef claude server is running!"});
});

// Routes
app.use("/api/recipe", recipeRouter);
app.use("/api/auth", authRouter);

// Error handler should be AFTER all routes
app.use(errorHandler); // ✅ Move this to the end

const startServer = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    console.log("✅ Connected to MongoDB");
   
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to connect to the database");
    console.error(error);
    process.exit(1);
  }
};

startServer();