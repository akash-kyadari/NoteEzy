import Room from "../models/roomModel.js";

export default function socketHandlers(io) {
  io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);

    socket.on("join-room", async ({ roomId, userId }) => {
      console.log(`Socket ${socket.id} joined room ${roomId}`);
      socket.join(roomId);
      socket.userId = userId;
      let room = await Room.findOne({ roomId });
      socket.emit("joined-room", { roomId, currNotes: room.currNotes });
    });

    socket.on("note-change", async ({ roomId, content }) => {
      console.log(`Note update from ${socket.id} in room ${roomId}`);
      console.log("Received content:", content);
      try {
        await Room.findOneAndUpdate(
          { roomId },
          { currNotes: content },
          { new: true }
        );

        socket.to(roomId).emit("receive-note", content);
      } catch (err) {
        console.error("Error saving note change:", err);
        socket.emit("error", "Could not save note.");
      }
    });

    socket.on("leave-room", async (roomId) => {
      socket.leave(roomId);
      console.log(`User ${socket.id} left room ${roomId}`);
      // Remove user from participants in Room model
      if (socket.userId) {
        try {
          await Room.findOneAndUpdate(
            { roomId },
            { $pull: { participants: socket.userId } }
          );
          console.log(
            `Removed user ${socket.userId} from room ${roomId} participants`
          );
        } catch (err) {
          console.error("Error removing user from participants:", err);
        }
      }
    });
  });
}
