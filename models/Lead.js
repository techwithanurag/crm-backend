import mongoose from "mongoose";

const LeadSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    status: { type: String, default: "New" },
  },
  { timestamps: true }
);

export default mongoose.model("Lead", LeadSchema);
