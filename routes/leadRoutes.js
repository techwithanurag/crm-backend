import express from "express";
import Lead from "../models/Lead.js";

const router = express.Router();

// ✅ GET all leads
router.get("/", async (req, res) => {
  try {
    const leads = await Lead.find();
    res.json(leads);
  } catch (err) {
    console.error("❌ Error fetching leads:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

// ✅ POST create a new lead
router.post("/", async (req, res) => {
  try {
    console.log("📥 Incoming Lead Data:", req.body); // 👈 check what frontend sends

    const newLead = new Lead(req.body);
    await newLead.save();

    console.log("✅ Lead Saved:", newLead);
    res.status(201).json(newLead);
  } catch (err) {
    console.error("❌ Error saving lead:", err);
    res.status(500).json({
      message: "Server Error",
      error: err.message,
      stack: err.stack,
    });
  }
});

// ✅ DELETE a lead
router.delete("/:id", async (req, res) => {
  try {
    await Lead.findByIdAndDelete(req.params.id);
    res.json({ message: "Lead deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting lead:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

export default router;
