import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

const router = express.Router();

/* ============================
   REGISTER API
============================ */
router.post("/register", async (req, res) => {
  try {
    const { name, email, mobile, password } = req.body;

    // Check existing user
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Hash password
    const hashedPass = await bcrypt.hash(password, 10);

    // Save user
    await User.create({
      name,
      email,
      mobile,
      password: hashedPass,
    });

    res.json({ message: "Account created successfully" });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

/* ============================
   LOGIN API
============================ */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Compare hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

export default router;
