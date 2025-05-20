import React, { useEffect, useRef } from "react";
import { io } from "socket.io-client";
import useRoomStore from "../src/store/store.js";

const WhiteboardPage = () => {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const drawing = useRef(false);
  const { name, userId, roomId, isAdmin, setSocket } = useRoomStore();

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext("2d");
    ctx.lineCap = "round";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 3;
    ctxRef.current = ctx;
  }, []);

  // Connect to socket
  useEffect(() => {
    const socket = io("http://localhost:3000");
    setSocket(socket);

    socket.emit("join-room", { roomId, userId });

    socket.on("draw", ({ x, y, type }) => {
      if (!ctxRef.current) return;
      if (type === "begin") ctxRef.current.beginPath();
      ctxRef.current.lineTo(x, y);
      ctxRef.current.stroke();
    });

    return () => socket.disconnect();
  }, [roomId, userId]);

  const startDrawing = ({ nativeEvent }) => {
    drawing.current = true;
    const { offsetX: x, offsetY: y } = nativeEvent;
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(x, y);
    useRoomStore
      .getState()
      .socket.emit("draw", { roomId, drawingData: { x, y, type: "begin" } });
  };

  const draw = ({ nativeEvent }) => {
    if (!drawing.current) return;
    const { offsetX: x, offsetY: y } = nativeEvent;
    ctxRef.current.lineTo(x, y);
    ctxRef.current.stroke();
    useRoomStore
      .getState()
      .socket.emit("draw", { roomId, drawingData: { x, y, type: "draw" } });
  };

  const stopDrawing = () => {
    drawing.current = false;
  };

  return (
    <div>
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        style={{ border: "1px solid black", display: "block" }}
      />
    </div>
  );
};

export default WhiteboardPage;
