import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useRoomStore from "../src/store/store";

const HomePage = () => {
  const [name, setName] = useState("");
  const [roomId, setRoomId] = useState("");
  const navigate = useNavigate();
  const setUserData = useRoomStore((state) => state.setUserData);

  const generateUserId = () => Math.random().toString(36).substring(2, 10);

  const handleCreateRoom = async () => {
    if (!name) return alert("Please enter your name");
    const userId = generateUserId();

    try {
      const res = await fetch(
        import.meta.env.VITE_BACKEND_URL + "/api/room/create",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ adminName: name, adminId: userId }),
        }
      );

      const data = await res.json();
      if (res.ok) {
        setUserData({
          name,
          userId,
          roomId: data.roomId,
          isAdmin: true,
        });
        navigate(`/room/${data.roomId}`);
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  const handleJoinRoom = async () => {
    if (!name || !roomId) return alert("Enter name and room ID");
    const userId = generateUserId();

    try {
      const res = await fetch(
        import.meta.env.VITE_BACKEND_URL + "/api/room/join",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userName: name, userId, roomId }),
        }
      );

      const data = await res.json();
      if (res.ok) {
        setUserData({
          name,
          userId,
          roomId,
          isAdmin: false,
        });
        navigate(`/room/${roomId}`);
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Welcome to NoteSync App</h1>

      <div style={{ marginBottom: "2rem" }}>
        <h2>Create Room</h2>
        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button onClick={handleCreateRoom} className="cursor-pointer">
          Create
        </button>
      </div>

      <div>
        <h2>Join Room</h2>
        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Room ID"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
        />
        <button onClick={handleJoinRoom} className="cursor-pointer">
          Join
        </button>
      </div>
    </div>
  );
};

export default HomePage;
