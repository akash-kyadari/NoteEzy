// socket.js
import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_BACKEND_URL, {
  withCredentials: true,
  transports: ["websocket"], // optional, but helps with dev
});

export default socket;
