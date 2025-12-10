import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import User from "../models/User.js";
import Lead from "../models/Lead.js";

const router = express.Router();

/* =========================
   ✅ REGISTER
========================= */
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

    const hashed = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      mobile,
      password: hashed,
    });

    res.status(201).json({
      message: "Account created successfully",
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        mobile: newUser.mobile,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

/* =========================
   ✅ LOGIN
========================= */
router.post("/login", async (req, res) => {
  try {
    let { email, password } = req.body;
    email = email.toLowerCase();

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Incorrect password" });

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
        mobile: user.mobile,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

/* =========================
   ✅ ADD LEAD
========================= */
router.post("/leads", async (req, res) => {
  try {
    const { userId, name, phone, status, email, source, notes, budget } = req.body;

    if (!userId || !name || !phone) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const lead = await Lead.create({
      userId,
      name,
      phone,
      email,
      source,
      notes,
      budget,
      status: status || "New",
    });

    res.status(201).json({ message: "Lead added", lead });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to save lead" });
  }
});

/* =========================
   ✅ GET USER LEADS
========================= */
router.get("/leads/user/:userId", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
      return res.json([]);
    }

    const leads = await Lead.find({ userId: req.params.userId }).sort({
      createdAt: -1,
    });

    res.json(leads);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to fetch leads" });
  }
});

/* =========================
   ✅ UPDATE LEAD STATUS
========================= */
router.patch("/leads/update/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const updated = await Lead.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Lead not found" });
    }

    res.json({ message: "Status updated", lead: updated });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to update status" });
  }
});

/* =========================
   ✅ DELETE LEAD
========================= */
router.delete("/leads/delete/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    await Lead.findByIdAndDelete(req.params.id);
    res.json({ message: "Lead deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Delete failed" });
  }
});

/* =========================
   ✅ ADMIN – FETCH ALL LEADS
========================= */
router.get("/admin/leads", async (req, res) => {
  try {
    const leads = await Lead.find()
      .sort({ createdAt: -1 })
      .populate("userId", "name email");

    res.json(leads);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to fetch admin leads" });
  }
});

export default router;
