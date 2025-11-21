import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // hashed password
});

// Hash password before saving
adminSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare passwords
adminSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

export default mongoose.model("Admin", adminSchema);
