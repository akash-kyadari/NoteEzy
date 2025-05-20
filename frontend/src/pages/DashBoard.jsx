import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/store.js";
import socket from "../socket"; //
const Dashboard = () => {
  const navigate = useNavigate();
  const joinRoomRef = useRef(null);

  const { isAuthenticated, logout, loading, createRoom, joinRoom, userId } =
    useAuthStore();
  const recentRooms = [
    { id: "room-abc123", name: "Design Sprint" },
    { id: "room-def456", name: "Team Planning" },
    { id: "room-ghi789", name: "Marketing Board" },
  ];

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/login");
    }

    if (isAuthenticated && !socket.connected) {
      socket.connect();
    }

    // REMOVE socket.disconnect() from here!
  }, [isAuthenticated, loading]);

  const handleCreateRoom = async () => {
    try {
      const newRoomId = await createRoom();
      // REMOVE socket.emit("join-room", ...)
      navigate(`/room/${newRoomId}`);
    } catch (err) {
      alert(`Failed to create room: ${err.message}`);
    }
  };

  const handleJoinRoom = async () => {
    const enteredRoomId = joinRoomRef.current.value.trim();
    if (!enteredRoomId) return alert("Please enter a room ID");

    try {
      await joinRoom(enteredRoomId);
      // REMOVE socket.emit("join-room", ...)
      navigate(`/room/${enteredRoomId}`);
    } catch (err) {
      alert(`Failed to join room: ${err.message}`);
    }
  };

  const handleJoinRecentRoom = async (roomId) => {
    try {
      await joinRoom(roomId);
      // REMOVE socket.emit("join-room", ...)
      navigate(`/room/${roomId}`);
    } catch (err) {
      alert(`Could not join recent room: ${err.message}`);
    }
  };

  const handleLogout = async () => {
    const success = await logout();
    if (success) {
      socket.disconnect(); // ✅ disconnect on logout only
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white pb-16">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-gray-800 via-gray-900 to-gray-900 backdrop-blur border-b border-white/10 px-6 md:px-10 py-4 flex justify-between items-center shadow-md">
        <h1 className="text-3xl font-extrabold tracking-wide text-white drop-shadow">
          WhiteboardApp
        </h1>
        <div className="space-x-4 flex items-center">
          {!isAuthenticated ? (
            <>
              <button
                className="bg-white/10 hover:bg-white/20 text-white px-5 py-2 rounded-full font-semibold transition-all"
                onClick={() => navigate("/login")}
              >
                Login
              </button>
              <button
                className="bg-white text-black font-semibold px-5 py-2 rounded-full hover:bg-gray-200 transition-all"
                onClick={() => navigate("/signup")}
              >
                Sign Up
              </button>
            </>
          ) : (
            <>
              <div className="text-xl">👤</div>
              <button
                className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-full font-semibold transition-all"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto text-center pt-32 px-6">
        <h1 className="text-4xl font-bold mb-4">Welcome Back 👋</h1>
        <p className="text-gray-300 mb-10">Choose an option to get started:</p>

        <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-12">
          <button
            onClick={handleCreateRoom}
            className="bg-indigo-500 hover:bg-indigo-600 px-6 py-3 rounded-lg font-semibold transition"
          >
            ➕ Create New Room
          </button>

          <div className="flex gap-2 items-center">
            <input
              ref={joinRoomRef}
              type="text"
              placeholder="Enter Room ID"
              className="bg-gray-700 text-white px-4 py-2 rounded-md outline-none"
            />
            <button
              onClick={handleJoinRoom}
              className="bg-white text-black font-semibold px-4 py-2 rounded-md hover:bg-gray-200 transition"
            >
              Join
            </button>
          </div>
        </div>

        {/* Recent Collaborations */}
        <div className="bg-white/5 p-6 rounded-lg shadow-md text-left">
          <h2 className="text-2xl font-bold mb-4">🕘 Recent Collaborations</h2>
          <ul className="space-y-2">
            {recentRooms.map((room) => (
              <li
                key={room.id}
                className="flex justify-between items-center bg-gray-800 px-4 py-2 rounded-md hover:bg-gray-700 transition cursor-pointer"
                onClick={() => handleJoinRecentRoom(room.id)}
              >
                <span>{room.name}</span>
                <span className="text-sm text-gray-400">{room.id}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
