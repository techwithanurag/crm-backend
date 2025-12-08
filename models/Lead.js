import mongoose from "mongoose";

const leadSchema = new mongoose.Schema(
  {
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },

    name: { type: String, required: true },
    phone: { type: String },
    email: { type: String },
    source: { type: String },
    budget: { type: String },
    notes: { type: String },

    status: {
      type: String,
      enum: [
        "New",
        "Follow-Up",
        "Qualified",
        "Won",
        "Lost",
        "RNR",
        "Stage 1",
        "Stage 2",
        "Stage 3"
      ],
      default: "New"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Lead", leadSchema);
