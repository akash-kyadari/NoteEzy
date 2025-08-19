import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import http from "http";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";
import "./config/passport.js"; // Import the new passport configuration
import { Server } from "socket.io"; // ✅ import Server from socket.io

import roomRouter from "./routes/roomRoutes.js";
import authRouter from "./routes/authRoute.js";
import socketHandler from "./sockets/socket.js";
import { protectRoute } from "./controllers/authController.js";
import handler from "./controllers/aichatController.js";

const app = express();

const server = http.createServer(app); // ✅ Use http server

// ✅ Setup CORS for frontend (Vite usually runs on 5173)
const corsOptions = {
  origin: process.env.FRONTEND_URL,
  methods: ["GET", "POST"],
  credentials: true,
};
app.use(cors(corsOptions));

import helmet from "helmet";
import compression from "compression";

app.use(express.json());
app.use(cookieParser());

// Request logger
if (process.env.NODE_ENV !== "production") {
  app.use((req, res, next) => {
    // console.log(`${req.method} ${req.url}`);
    next();
  });
}

// Production-ready middleware
app.use(helmet());
app.use(compression());

// Session middleware for Passport
app.use(
  session({
    secret: process.env.SESSION_SECRET, // Use a strong secret from .env
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === "production" }, // Use secure cookies in production
  })
);

// Initialize Passport and session
app.use(passport.initialize());
app.use(passport.session());
app.get("/dummy", (req, res) => {
  res.json({ msg: "Api is working" });
});
app.use("/api/room", protectRoute, roomRouter);
app.use("/api/auth", authRouter);
app.post("/api/chat-ai", protectRoute, handler);
// ✅ Setup Socket.IO and pass server instance
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
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
server.listen(process.env.PORT, () => {
  console.log("🚀 Server is running on port " + process.env.PORT);
});
