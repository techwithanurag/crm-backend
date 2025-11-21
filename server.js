import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

// Routes
import adminRoutes from "./routes/adminRoutes.js";
import leadRoutes from "./routes/leadRoutes.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use("/api/admin", adminRoutes);
app.use("/api/leads", leadRoutes);

// MongoDB Login
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("Mongo Error:", err));

// Default Route
app.get("/", (req, res) => {
  res.send("CRM Backend is running successfully 🚀");
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
