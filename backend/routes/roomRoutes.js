import express from "express";
import {
  createRoom,
  getRoomDetails,
  joinRoom,
} from "../controllers/roomController.js";
const router = express.Router();

router.post("/create", createRoom);

router.post("/join", joinRoom);
router.get("/:roomId", getRoomDetails);

export default router;
