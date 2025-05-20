// roomModel.js

import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
  roomId: {
    type: String,
    required: true,
    unique: true,
  },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }, // ✅ use minimal embedded schema
  whiteboardState: {
    type: Array,
    default: [],
  },
  currNotes: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

const Room = mongoose.model("Room", roomSchema);
export default Room;
