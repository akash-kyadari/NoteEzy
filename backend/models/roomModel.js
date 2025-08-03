import mongoose from "mongoose";

// Helper to generate 6-digit unique codes
function generateAID() {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit number
}

const roomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: String,

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Unique Room Join Code
    aid: {
      type: String,
      unique: true,
      required: true,
      default: generateAID,
    },
    currNotes: {
      type: String,
      default: "", // Start with empty note
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Room || mongoose.model("Room", roomSchema);
