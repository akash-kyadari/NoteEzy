import Room from "../models/roomModel.js";

// Utility to generate unique roomId
async function generateUniqueRoomId(length = 6) {
  let roomId,
    exists = true;

  while (exists) {
    roomId = Math.random()
      .toString(36)
      .substring(2, 2 + length);
    const room = await Room.findOne({ roomId });
    if (!room) exists = false;
  }

  return roomId;
}

export const createRoom = async (req, res) => {
  const { fullName, _id } = req.user;
  const userId = _id;
  const roomName = req.query.name;
  if (!userId || !fullName) {
    return res.status(400).json({ error: "Missing user info" });
  }

  try {
    const roomId = await generateUniqueRoomId();

    const newRoom = new Room({
      roomName,
      roomId,
      admin: userId,
    });

    await newRoom.save();

    // Correct populate usage
    await newRoom.populate([
      { path: "participants", select: "-password -__v" },
      { path: "admin", select: "-password -__v" },
    ]);

    res.status(201).json(newRoom);
  } catch (err) {
    console.error("Error in creating room:", err);
    res.status(500).json({ error: err.message || "Error creating room" });
  }
};
export const checkRoom = async (req, res) => {
  try {
    const room = await Room.findOne({ roomId: req.params.roomId })
      .populate("participants", "-password -__v")
      .populate("admin", "-password -__v");
    if (room) {
      return res.status(200).json({
        valid: true,
        roomId: room.roomId,
        roomName: room.roomName,
        admin: room.admin,
        participants: room.participants,
      });
    } else {
      return res.status(404).json({ valid: false, error: "Room not found" });
    }
  } catch (err) {
    return res.status(500).json({ valid: false, error: err.message });
  }
};

// controllers/roomController.js

// export const joinRoom = async (req, res) => {
//   try {
//     const { fullName, _id } = req.user;
//     const { roomId } = req.body;

//     if (!fullName || !_id) {
//       return res.status(401).json({ error: "Unauthorized user" });
//     }

//     if (!roomId || typeof roomId !== "string") {
//       return res.status(400).json({ error: "Invalid or missing roomId" });
//     }

//     const room = await Room.findOne({ roomId });

//     if (!room) {
//       return res.status(404).json({ error: "Room not found" });
//     }

//     const userId = _id.toString();
//     const alreadyJoined = room.participants.some(
//       (id) => id.toString() === userId
//     );

//     if (!alreadyJoined) {
//       room.participants.push(userId);
//       room.lastUpdated = new Date();
//       await room.save();
//     }

//     // Populate participants/admin with full user data
//     await room.populate([
//       { path: "adminId", select: "-password -__v" },
//       { path: "participants", select: "-password -__v" },
//     ]);

//     return res.status(200).json({
//       roomId: room.roomId,
//       adminId: room.adminId,
//       participants: room.participants,
//       whiteboardState: room.whiteboardState,
//       lastUpdated: room.lastUpdated,
//       createdAt: room.createdAt,
//       message: alreadyJoined ? "Already joined" : "Successfully joined",
//     });
//   } catch (err) {
//     console.error("Error joining room:", err);
//     return res.status(500).json({ error: "Internal server error" });
//   }
// };

// export const getRoomDetails = async (req, res) => {
//   const { roomId } = req.params;

//   try {
//     const room = await Room.findOne({ roomId })
//       .populate("adminId", "-password -__v")
//       .populate("participants", "-password -__v");

//     if (!room) {
//       return res.status(404).json({ error: "Room not found" });
//     }

//     res.status(200).json(room);
//   } catch (err) {
//     res.status(500).json({ error: "Failed to fetch room details" });
//   }
// };
