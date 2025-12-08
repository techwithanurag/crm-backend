console.log("📌 Lead Routes Loaded");
import express from "express";
import Lead from "../models/Lead.js";

const router = express.Router();

/**
 * CREATE new lead
 * POST /leads
 */
router.post("/", async (req, res) => {
  try {
    const { userId, name, phone, status } = req.body;

    if (!userId || !name || !phone) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const lead = new Lead(req.body);
    await lead.save();

    res.status(201).json(lead);
  } catch (err) {
    res.status(500).json({
      message: "Error adding lead",
      error: err.message,
    });
  }
});

/**
 * GET leads belonging to a user
 * GET /leads/user/:userId
 */
router.get("/user/:userId", async (req, res) => {
  try {
    const leads = await Lead.find({ userId: req.params.userId }).sort({
      createdAt: -1,
    });
    res.json(leads);
  } catch (err) {
    res.status(500).json({ message: "Error fetching leads", error: err.message });
  }
});

/**
 * UPDATE lead status
 * PATCH /leads/status/:id
 */
router.patch("/update/:id", async (req, res) => {
  console.log("PATCH HIT", req.params.id, req.body);

  try {
    const updatedLead = await Lead.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    if (!updatedLead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    res.json({ message: "Status updated", lead: updatedLead });

  } catch (err) {
    res.status(500).json({
      message: "Error updating lead",
      error: err.message,
    });
  }
});



/**
 * DELETE a lead permanently
 * DELETE /leads/:id
 */
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Lead.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Lead not found" });
    }
    res.json({ message: "Lead deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting lead", error: err.message });
  }
});

export default router;
