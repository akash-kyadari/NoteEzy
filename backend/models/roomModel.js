// roomModel.js

import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
  roomName: {
    type: String,
    required: true,
  },
  roomId: {
    type: String,
    required: true,
    unique: true,
  },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  admin: {
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
