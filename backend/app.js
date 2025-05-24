import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import http from "http";
import cors from "cors";
import cookieParser from "cookie-parser";
import { Server } from "socket.io"; // ✅ import Server from socket.io

import roomRouter from "./routes/roomRoutes.js";
import authRouter from "./routes/authRoute.js";
import socketHandler from "./sockets/socket.js";
import { protectRoute } from "./controllers/authController.js";
import handler from "./controllers/aichatController.js";

dotenv.config();

const app = express();

const server = http.createServer(app); // ✅ Use http server

// ✅ Setup CORS for frontend (Vite usually runs on 5173)
const corsOptions = {
  origin: "http://localhost:5173",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"],
  credentials: true,
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());

app.use("/api/room", protectRoute, roomRouter);
app.use("/api/auth", authRouter);
app.post("/api/chat-ai", protectRoute, handler);
// ✅ Setup Socket.IO and pass server instance
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST"],
  },
});
socketHandler(io); // ✅ Pass io to your socketHandler

// ✅ MongoDB connection
mongoose
  .connect(process.env.MONGODB_CONNECTION_URL, {})
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.log("❌ MongoDB connection error:", err));

// ✅ Start server using `server.listen` instead of `app.listen`
server.listen(3000, () => {
  console.log("🚀 Server is running on port 3000");
});
