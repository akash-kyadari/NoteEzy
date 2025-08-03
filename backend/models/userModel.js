import mongoose from "mongoose";

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
      required: true,
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

// Avoid redefining the model in dev (for hot reload)
export default mongoose.models.User || mongoose.model("User", userSchema);
