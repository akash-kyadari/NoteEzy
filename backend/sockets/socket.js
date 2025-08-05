// server/socketHandlers.js
import Room from "../models/roomModel.js";

export default function socketHandlers(io) {
  const typingUsers = new Map(); // roomId -> userId

  async function isUserStillInRoom(roomId, userId) {
    const sockets = await io.in(roomId).fetchSockets();
    return sockets.some((s) => s.userId === userId);
  }

  io.on("connection", (socket) => {
    socket.on("join-room", async ({ roomId, userId, userName }) => {
      socket.join(roomId);
      socket.userId = userId;
      socket.roomId = roomId;
      socket.userName = userName;
      let room = await Room.findOne({ aid: roomId })
        .populate("members", "name _id")
        .populate("createdBy", "name _id");

      if (!room) {
        socket.emit("error", "Room not found");
        return;
      }

      const isMember = room.members.some(
        (m) => m._id.toString() === userId.toString()
      );
      if (!isMember) {
        room.members.push(userId);
        await room.save();
        room = await Room.findOne({ aid: roomId })
          .populate("members", "name _id")
          .populate("createdBy", "name _id");
      }

      socket.emit("joined-room", { currNotes: room.currNotes || "", room });

      io.to(roomId).emit("participants-update", {
        participants: room.members,
        admin: room.createdBy,
      });

      const typingUserId = typingUsers.get(roomId);
      if (typingUserId) {
        io.to(roomId).emit("typing-update", { userId: typingUserId });
      }
    });

    socket.on("note-change", async ({ roomId, content }) => {
      try {
        await Room.findOneAndUpdate(
          { aid: roomId },
          { currNotes: content },
          { new: true }
        );
        socket.to(roomId).emit("receive-note", content);
      } catch (err) {
        socket.emit("error", "Note update failed");
      }
    });

    // socket.on("typing-update", ({ roomId, userId }) => {
    //   typingUsers.set(roomId, userId);
    //   io.to(roomId).emit("typing-update", { userId });
    // });

    // socket.on("stop-typing", ({ roomId, userId }) => {
    //   if (typingUsers.get(roomId) === userId) {
    //     typingUsers.delete(roomId);
    //     io.to(roomId).emit("typing-update", { userId: null });
    //   }
    // });

    socket.on("leave-room", async (roomId) => {
      const { userId } = socket;
      if (!roomId || !userId) return;

      const stillInRoom = await isUserStillInRoom(roomId, userId);
      if (!stillInRoom) {
        const room = await Room.findOne({ aid: roomId })
          .populate("members", "name _id")
          .populate("createdBy", "name _id");
        if (room) {
          room.members = room.members.filter((id) => id.toString() !== userId);
          await room.save();
          io.to(roomId).emit("participants-update", {
            participants: room.members,
            admin: room.createdBy,
          });
        }
      }
    });

    socket.on("disconnect", async () => {
      const { roomId, userId } = socket;
      if (!roomId || !userId) return;

      const stillInRoom = await isUserStillInRoom(roomId, userId);
      if (!stillInRoom) {
        const room = await Room.findOne({ aid: roomId })
          .populate("members", "name _id")
          .populate("createdBy", "name _id");
        if (room) {
          await Room.updateOne(
            { aid: roomId },
            { $pull: { members: socket.userId } }
          );

          // Then reload room for latest state:
          const room = await Room.findOne({ aid: roomId })
            .populate("members", "name _id")
            .populate("createdBy", "name _id");

          io.to(roomId).emit("participants-update", {
            participants: room.members,
            admin: room.createdBy,
          });
        }
        if (typingUsers.get(roomId) === userId) {
          typingUsers.delete(roomId);
          io.to(roomId).emit("typing-update", { userId: null });
        }
      }
    });
  });
}
