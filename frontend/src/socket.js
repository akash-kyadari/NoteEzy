// socket.js
import { io } from "socket.io-client";

const socket = io("http://localhost:3000", {
  withCredentials: true,
  transports: ["websocket"], // optional, but helps with dev
});

export default socket;
