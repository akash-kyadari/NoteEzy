import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: false, // Not required for Google Auth
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true, // Allows null values, but unique for non-null
    },
    avatar: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      default: "",
    },
    rooms: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Room", // Reference to Room schema
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Method to generate JWT token for user
userSchema.methods.generateAuthToken = function() {
  const token = jwt.sign({ userId: this._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
  return token;
};

// Avoid redefining the model in dev (for hot reload)
export default mongoose.models.User || mongoose.model("User", userSchema);
