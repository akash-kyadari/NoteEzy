import mongoose from "mongoose";
import Room from "../models/roomModel.js";

export default function socketHandlers(io) {
  // Store current typing user per room
  const typingUsers = new Map(); // roomId -> userId

  async function isUserStillInRoom(roomId, userId) {
    const sockets = await io.in(roomId).fetchSockets();
    return sockets.some((s) => s.userId === userId);
  }

  io.on("connection", (socket) => {
    socket.on("join-room", async ({ roomId, userId }) => {
      socket.join(roomId);
      socket.userId = userId;
      socket.roomId = roomId;

      let room = await Room.findOne({ roomId })
        .populate("participants", "fullName _id")
        .populate("admin", "fullName _id");

      if (room && !room.participants.some((p) => p._id.toString() === userId)) {
        await Room.updateOne(
          { roomId },
          { $addToSet: { participants: new mongoose.Types.ObjectId(userId) } }
        );
        room = await Room.findOne({ roomId })
          .populate("participants", "fullName _id")
          .populate("admin", "fullName _id");
        io.to(roomId).emit("participants-update", {
          participants: room.participants,
          admin: room.admin,
        });
      }
      socket.emit("joined-room", { roomId, currNotes: room.currNotes });

      // Notify about current typing user if any
      const typingUserId = typingUsers.get(roomId);
      if (typingUserId) {
        io.to(roomId).emit("typing-update", { userId: typingUserId });
      }
    });

    socket.on("get-room-data", async ({ roomId }) => {
      const room = await Room.findOne({ roomId })
        .populate("participants", "fullName _id")
        .populate("admin", "fullName _id");
      if (room) {
        socket.emit("room-data", {
          participants: room.participants,
          admin: room.admin,
          currNotes: room.currNotes || "",
          roomName: room.roomName,
        });
      }
    });

    socket.on("note-change", async ({ roomId, content }) => {
      try {
        await Room.findOneAndUpdate(
          { roomId },
          { currNotes: content },
          { new: true }
        );
        io.to(roomId).emit("receive-note", content);
      } catch (err) {
        socket.emit("error", "Could not save note.");
      }
    });

    // New: user starts typing
    socket.on("start-typing", ({ roomId, userId }) => {
      // Only allow if no one else is typing
      if (!typingUsers.has(roomId)) {
        typingUsers.set(roomId, userId);
        io.to(roomId).emit("typing-update", { userId });
      } else {
        // Someone else is typing, reject this user typing?
        // Could notify user or ignore here
        socket.emit("typing-rejected", { reason: "Another user is typing" });
      }
    });

    // User stops typing
    socket.on("stop-typing", ({ roomId, userId }) => {
      const currentTypingUser = typingUsers.get(roomId);
      if (currentTypingUser === userId) {
        typingUsers.delete(roomId);
        io.to(roomId).emit("typing-update", { userId: null });
      }
    });

    socket.on("leave-room", async (roomId) => {
      socket.leave(roomId);
      if (socket.userId) {
        const stillInRoom = await isUserStillInRoom(roomId, socket.userId);
        if (!stillInRoom) {
          let room = await Room.findOne({ roomId });
          if (room) {
            room.participants = room.participants.filter(
              (id) => id.toString() !== socket.userId
            );
            await room.save();
            room = await Room.findOne({ roomId })
              .populate("participants", "fullName _id")
              .populate("admin", "fullName _id");
            io.to(roomId).emit("participants-update", {
              participants: room.participants,
              admin: room.admin,
            });
          }
          // Clear typing user if the leaving user was typing
          if (typingUsers.get(roomId) === socket.userId) {
            typingUsers.delete(roomId);
            io.to(roomId).emit("typing-update", { userId: null });
          }
        }
      }
    });

    socket.on("disconnect", async () => {
      const roomId = socket.roomId;
      socket.leave(roomId);

      if (socket.userId) {
        const stillInRoom = await isUserStillInRoom(roomId, socket.userId);
        if (!stillInRoom) {
          let room = await Room.findOne({ roomId });
          if (room) {
            room.participants = room.participants.filter(
              (id) => id.toString() !== socket.userId
            );
            await room.save();
            room = await Room.findOne({ roomId })
              .populate("participants", "fullName _id")
              .populate("admin", "fullName _id");
            io.to(roomId).emit("participants-update", {
              participants: room.participants,
              admin: room.admin,
            });
          }
          // Clear typing user if the disconnected user was typing
          if (typingUsers.get(roomId) === socket.userId) {
            typingUsers.delete(roomId);
            io.to(roomId).emit("typing-update", { userId: null });
          }
        }
      }
    });
  });
}
