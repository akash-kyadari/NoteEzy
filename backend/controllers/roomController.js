import Room from "../models/roomModel.js";
import User from "../models/userModel.js";
// Utility to generate unique roomId
async function generateUniqueRoomId(length = 6) {
  let roomId,
    exists = true;

  while (exists) {
    roomId = Math.random()
      .toString(10)
      .substring(2, 2 + length);
    const room = await Room.findOne({ roomId });
    if (!room) exists = false;
  }

  return roomId;
}

export const createRoom = async (req, res) => {
  const { name, _id } = req.user;
  const userId = _id;
  //   console.log(req);
  const roomName = req.body.name;
  const description = req.body.description || "";
  if (!userId || !name) {
    return res.status(400).json({ error: "Missing user info" });
  }

  try {
    const roomId = await generateUniqueRoomId();

    const newRoom = new Room({
      name: roomName,
      description,
      aid: roomId,
      createdBy: userId,
    });

    await newRoom.save();

    // Correct populate usage
    await newRoom.populate([
      { path: "members", select: "-password -__v" },
      { path: "createdBy", select: "-password -__v" },
    ]);
    // Add room to user's rooms array
    await User.findByIdAndUpdate(userId, {
      $addToSet: { rooms: newRoom._id },
    });

    res.status(201).json(newRoom);
  } catch (err) {
    console.error("Error in creating room:", err);
    res.status(500).json({ error: err.message || "Error creating room" });
  }
};
export const checkRoom = async (req, res) => {
  //   console.log(req.params);
  try {
    const room = await Room.findOne({ aid: req.params.roomId })
      .populate("members", "-password -__v")
      .populate("createdBy", "-password -__v");
    if (room) {
      const userId = req.user._id;
      await User.findByIdAndUpdate(userId, {
        $addToSet: { rooms: room._id },
      });

      return res.status(200).json({
        valid: true,
        ...room,
      });
    } else {
      return res.status(404).json({ valid: false, error: "Room not found" });
    }
  } catch (err) {
    return res.status(500).json({ valid: false, error: err.message });
  }
};
