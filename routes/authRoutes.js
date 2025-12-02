import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Lead from "../models/Lead.js";

const router = express.Router();


// ===================== REGISTER API =====================
router.post("/register", async (req, res) => {
  try {
    let { name, email, mobile, password } = req.body;

    if (!name || !email || !mobile || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    email = email.toLowerCase();

    const existedUser = await User.findOne({ email });
    if (existedUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      mobile,
      password: hashedPassword,
    });

    res.json({ 
      message: "Account created successfully",
      user: { _id: newUser._id, name, email }
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});



// ===================== LOGIN API =====================
router.post("/login", async (req, res) => {
  try {
    let { email, password } = req.body;
    email = email.toLowerCase();

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Incorrect password" });

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile
      }
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});



// ===================== SAVE LEAD API =====================
router.post("/lead", async (req, res) => {
  try {
    const { userId, name, phone } = req.body;

    if (!userId || !name || !phone) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const lead = new Lead({ userId, name, phone });
    await lead.save();

    res.json({ message: "Lead saved successfully" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to save lead" });
  }
});



// ===================== FETCH LEADS API =====================
router.get("/leads/:userId", async (req, res) => {
  try {
    const leads = await Lead.find({ userId: req.params.userId }).sort({
      createdAt: -1,
    });

    res.json(leads);

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to fetch leads" });
  }
});



// ===================== GET PROFILE API =====================
router.get("/profile/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to fetch profile" });
  }
});



export default router;
