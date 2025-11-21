import express from "express";
import Admin from "../models/Admin.js";
import bcrypt from "bcryptjs";

const router = express.Router();

/*
  ----------------------------------------------------
  CREATE ADMIN (Use once to create an admin account)
  After creation, DELETE this route immediately.
  ----------------------------------------------------
*/

router.get("/create-admin", async (req, res) => {
  try {
    const adminExists = await Admin.findOne({ username: "admin" });
    if (adminExists) {
      return res.send("Admin already exists. Remove this route.");
    }

    const admin = new Admin({
      username: "admin",
      password: "1234",
    });

    await admin.save();
    res.send("Admin created successfully!");
  } catch (error) {
    res.status(500).json({ message: "Error creating admin", error });
  }
});

/*
  ----------------------------------------------------
  ADMIN LOGIN (Real login with database)
  ----------------------------------------------------
*/

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if admin exists
    const admin = await Admin.findOne({ username });

    if (!admin) {
      return res.status(400).json({ message: "Admin not found" });
    }

    // Compare password with hashed password
    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    return res.json({
      message: "Login successful",
      adminId: admin._id,
    });

  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

export default router;
