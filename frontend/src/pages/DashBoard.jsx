import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/store.js";
import useRoomStore from "../store/roomStore.js";
import socket from "../socket";
import { User } from "lucide-react";
const Dashboard = () => {
  const navigate = useNavigate();
  const joinRoomRef = useRef(null);
  const createRoomRef = useRef(null);

  const { isAuthenticated, logout, loading } = useAuthStore();
  // FIX: Get createRoom as a function from the store
  const createRoom = useRoomStore((state) => state.createRoom);
  const checkRoomId = useRoomStore((state) => state.checkRoomId);
  const [creatingRoom, setCreatingRoom] = useState(false);

  const recentRooms = [
    { id: "room-abc123", name: "Design Sprint" },
    { id: "room-def456", name: "Team Planning" },
    { id: "room-ghi789", name: "Marketing Board" },
  ];

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/login");
      return;
    }
    if (isAuthenticated && !socket.connected) {
      socket.connect();
    }
  }, [isAuthenticated, loading, navigate]);

  const handleCreateRoom = async () => {
    const roomName = createRoomRef.current.value.trim();
    if (!roomName) {
      toast.error("Please enter a room name");
      return;
    }
    setCreatingRoom(true);
    try {
      const newRoomId = await createRoom(roomName);
      createRoomRef.current.value = "";
      toast.success("Room created successfully!");
      navigate(`/room/${newRoomId}`);
    } catch (err) {
      toast.error(`Failed to create room: ${err.message}`);
    } finally {
      setCreatingRoom(false);
    }
  };

  const handleJoinRoom = async () => {
    const enteredRoomId = joinRoomRef.current.value.trim();
    if (!enteredRoomId) {
      toast.error("Please enter a room ID");
      return;
    }
    const isValid = await checkRoomId(enteredRoomId);
    if (!isValid) {
      toast.error("Room ID not found!");
      return;
    }
    navigate(`/room/${enteredRoomId}`);
  };

  const handleJoinRecentRoom = (roomId) => {
    navigate(`/room/${roomId}`);
  };

  const handleLogout = async () => {
    const success = await logout();
    if (success) {
      socket.disconnect();
      toast.success("successfully logged out");
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white pb-16">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-gray-800 via-gray-900 to-gray-900 backdrop-blur border-b border-white/10 px-6 md:px-10 py-4 flex justify-between items-center shadow-md">
        <h1 className="text-3xl font-extrabold tracking-wide text-white drop-shadow">
          NoteSync
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
              <button
                onClick={() => navigate("/profile")}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-800 text-xl transition duration-200 shadow-sm cursor-pointer"
                aria-label="Go to profile"
              >
                <User className="w-5 h-5" />
              </button>{" "}
              <button
                className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-full font-semibold transition-all cursor-pointer"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto pt-36 px-4">
        <h1 className="text-5xl font-extrabold mb-4 text-center drop-shadow-lg">
          Welcome to <span className="text-indigo-400">NoteSync</span>!
        </h1>
        <p className="text-gray-300 mb-12 text-center text-lg">
          Collaborate in real-time with your team. Create a new room or join an
          existing one to get started!
        </p>

        <div className="flex flex-col md:flex-row justify-center items-stretch gap-10 mb-16">
          {/* Create Room (Left) */}
          <div className="flex-1 bg-gradient-to-br from-indigo-900/60 via-indigo-800/60 to-gray-900/60 rounded-xl shadow-lg p-8 flex flex-col items-center justify-center">
            <h2 className="text-2xl font-bold mb-4 text-indigo-300">
              Create a New Room
            </h2>
            <p className="text-gray-400 mb-6 text-center">
              Start a fresh collaboration space for your team or project.
            </p>
            <div className="flex w-full gap-2 mb-2">
              <input
                ref={createRoomRef}
                type="text"
                placeholder="Enter Room Name"
                className="flex-1 bg-gray-700 text-white px-4 py-2 rounded-md outline-none"
                disabled={creatingRoom}
              />
              <button
                onClick={handleCreateRoom}
                className="bg-indigo-500 hover:bg-indigo-600 px-6 py-2 rounded-lg font-semibold transition"
                disabled={creatingRoom}
              >
                {creatingRoom ? "Creating..." : "Create"}
              </button>
            </div>
            <span className="text-xs text-gray-500">Room name is required</span>
          </div>

          {/* Join Room (Right) */}
          <div className="flex-1 bg-gradient-to-br from-gray-900/60 via-gray-800/60 to-indigo-900/60 rounded-xl shadow-lg p-8 flex flex-col items-center justify-center">
            <h2 className="text-2xl font-bold mb-4 text-indigo-300">
              Join a Room
            </h2>
            <p className="text-gray-400 mb-6 text-center">
              Already have a room ID? Enter it below to join your team.
            </p>
            <div className="flex w-full gap-2 mb-2">
              <input
                ref={joinRoomRef}
                type="text"
                placeholder="Enter Room ID"
                className="flex-1 bg-gray-700 text-white px-4 py-2 rounded-md outline-none"
              />
              <button
                onClick={handleJoinRoom}
                className="bg-white text-black font-semibold px-4 py-2 rounded-md hover:bg-gray-200 transition"
              >
                Join
              </button>
            </div>
            <span className="text-xs text-gray-500">Room ID is required</span>
          </div>
        </div>

        {/* Recent Collaborations */}
        <div className="bg-white/5 p-6 rounded-lg shadow-md text-left max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-4 text-indigo-200">
            🕘 Recent Collaborations
          </h2>
          {/* <ul className="space-y-2">
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
          </ul> */}
          <p className="text-gray-400 italic">Coming soon...</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
