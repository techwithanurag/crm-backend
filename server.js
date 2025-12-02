import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/", authRoutes);

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ MongoDB Error:", err));

// Home route (optional)
app.get("/", (req, res) => {
  res.send("CRM Backend Running");
});

// Server Startup
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
