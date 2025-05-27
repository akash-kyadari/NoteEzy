import mongoose from "mongoose";
import Room from "../models/roomModel.js";

export default function socketHandlers(io) {
  // Helper to check if any sockets for a user are still in a room
  async function isUserStillInRoom(roomId, userId) {
    const sockets = await io.in(roomId).fetchSockets();
    return sockets.some((s) => s.userId === userId);
  }

  io.on("connection", (socket) => {
    // //console.log("New client connected:", socket.id);

    // Join room and update participants
    socket.on("join-room", async ({ roomId, userId }) => {
      ("joining room");
      socket.join(roomId);
      socket.userId = userId;
      socket.roomId = roomId;
      let room = await Room.findOne({ roomId })
        .populate("participants", "fullName _id")
        .populate("admin", "fullName _id"); // <-- populate admin
      // Use addToSet to avoid duplicates
      if (room && !room.participants.some((p) => p._id.toString() === userId)) {
        await Room.updateOne(
          { roomId },
          { $addToSet: { participants: new mongoose.Types.ObjectId(userId) } }
        );
        // After updating participants array:
        room = await Room.findOne({ roomId })
          .populate("participants", "fullName _id")
          .populate("admin", "fullName _id"); // <-- populate admin
        //console.log(room.participants);
        io.to(roomId).emit("participants-update", {
          participants: room.participants,
          admin: room.admin, // <-- send admin
        });
      }
      socket.emit("joined-room", { roomId, currNotes: room.currNotes });
    });

    // Send full room data (participants, notes, admin) to a client
    socket.on("get-room-data", async ({ roomId }) => {
      const room = await Room.findOne({ roomId })
        .populate("participants", "fullName _id")
        .populate("admin", "fullName _id"); // <-- populate admin
      if (room) {
        socket.emit("room-data", {
          participants: room.participants,
          admin: room.admin, // <-- send admin
          currNotes: room.currNotes || "",
          roomName: room.roomName,
        });
      }
    });

    // Handle collaborative note changes
    socket.on("note-change", async ({ roomId, content }) => {
      try {
        await Room.findOneAndUpdate(
          { roomId },
          { currNotes: content },
          { new: true }
        );
        //console.log("receive-note", content);
        io.to(roomId).emit("receive-note", content);
      } catch (err) {
        socket.emit("error", "Could not save note.");
      }
    });

    // Handle user leaving room
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
            // After updating participants array:
            room = await Room.findOne({ roomId })
              .populate("participants", "fullName _id")
              .populate("admin", "fullName _id"); // <-- populate admin
            io.to(roomId).emit("participants-update", {
              participants: room.participants,
              admin: room.admin, // <-- send admin
            });
          }
        }
      }
    });

    // Handle disconnect (auto-leave)
    socket.on("disconnect", async () => {
      //   setTimeout(async () => {
      //     for (const roomId of socket.rooms) {
      //       if (roomId !== socket.id && socket.userId) {
      //         const stillInRoom = await isUserStillInRoom(roomId, socket.userId);
      //         if (!stillInRoom) {
      //           let room = await Room.findOne({ roomId });
      //           if (room) {
      //             room.participants = room.participants.filter(
      //               (id) => id.toString() !== socket.userId
      //             );
      //             await room.save();
      //             // After updating participants array:
      //             room = await Room.findOne({ roomId })
      //               .populate("participants", "fullName _id")
      //               .populate("admin", "fullName _id"); // <-- populate admin
      //             io.to(roomId).emit("participants-update", {
      //               participants: room.participants,
      //               admin: room.admin, // <-- send admin
      //             });
      //           }
      //         }
      //       }
      //     }
      //   }, 500); // 500ms delay
      const roomId = socket.roomId;
      socket.leave(roomId);
      //console.log("client disconnected :" + socket.id);
      if (socket.userId) {
        const stillInRoom = await isUserStillInRoom(roomId, socket.userId);
        if (!stillInRoom) {
          let room = await Room.findOne({ roomId });
          if (room) {
            room.participants = room.participants.filter(
              (id) => id.toString() !== socket.userId
            );
            await room.save();
            // After updating participants array:
            room = await Room.findOne({ roomId })
              .populate("participants", "fullName _id")
              .populate("admin", "fullName _id"); // <-- populate admin
            io.to(roomId).emit("participants-update", {
              participants: room.participants,
              admin: room.admin, // <-- send admin
            });
          }
        }
      }
    });
  });
}
