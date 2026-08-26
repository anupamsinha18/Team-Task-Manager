const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  projects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Project" }],
  password: { type: String, required: true },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

const UserModel = mongoose.model("User", userSchema);
module.exports = UserModel;
