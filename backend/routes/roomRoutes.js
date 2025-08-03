import express from "express";
import { createRoom, checkRoom } from "../controllers/roomController.js";
const router = express.Router();

router.post("/create/", createRoom);
router.get("/check/:roomId", checkRoom);
export default router;
