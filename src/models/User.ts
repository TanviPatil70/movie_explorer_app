import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: String,
  passwordHash: String,
  favorites: { type: [Number], default: [] },
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
