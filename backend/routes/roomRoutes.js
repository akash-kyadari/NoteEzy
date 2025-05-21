import express from "express";
import { createRoom, checkRoom } from "../controllers/roomController.js";
const router = express.Router();

router.get("/create/", createRoom);
router.get("/check/:roomId", checkRoom);
export default router;
