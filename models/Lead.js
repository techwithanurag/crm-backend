import mongoose from "mongoose";

const leadSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    status: { type: String, required: true },
    notes: { type: String },
    nextFollowUp: { type: String },
  },
  { timestamps: true }
);

const Lead = mongoose.model("Lead", leadSchema);

export default Lead;
