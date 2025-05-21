// src/components/CollaborativeNote.js
import React, { useEffect, useState, useRef } from "react";
import { Clipboard, FileText } from "lucide-react";
import socket from "../socket.js";
import { useNavigate, useParams } from "react-router-dom";
import useAuthStore from "../store/store.js";

const CollaborativeNote = ({}) => {
  const [note, setNote] = useState("");
  const [joined, setJoined] = useState(false);
  const { roomId } = useParams();
  const userId = useAuthStore((state) => state?.userId);

  useEffect(() => {
    const handleConnect = () => {
      console.log("🔗 Socket connected, emitting join-room", roomId);
      socket.emit("join-room", { roomId, userId });
    };

    const handleJoinedRoom = ({ roomId, currNotes }) => {
      console.log("✅ joined-room event received");
      setNote(currNotes);
      setJoined(true);
    };

    socket.on("connect", handleConnect);
    socket.on("joined-room", handleJoinedRoom);

    // If socket is already connected (page reload, fast navigation), emit immediately
    if (socket.connected) {
      handleConnect();
    }

    socket.on("connect_error", (err) => {
      console.error("❌ Connection Error:", err.message);
    });

    socket.on("receive-note", (content) => {
      console.log("📥 Received update:", content);
      setNote(content);
    });

    return () => {
      socket.off("connect", handleConnect);
      socket.off("joined-room", handleJoinedRoom);
      socket.off("receive-note");
    };
  }, [roomId, userId]);

  const handleChange = (e) => {
    const newText = e.target.value;
    setNote(newText);
    console.log("joined?", joined);
    if (joined) {
      socket.emit("note-change", { roomId, content: newText });
      console.log("sent note change", newText);
    }
  };

  const iconRef = useRef(null);

  const handleCopy = (roomId1) => {
    navigator.clipboard.writeText(roomId1);

    // Trigger quick animation
    iconRef.current.classList.remove("scale-90");
    void iconRef.current.offsetWidth; // reflow
    iconRef.current.classList.add("scale-90");

    setTimeout(() => {
      iconRef.current.classList.remove("scale-90");
    }, 150);
  };
  const navigate = useNavigate();
  const handleLeaveRoom = () => {
    socket.emit("leave-room", roomId);
    setJoined(false);
    setNote("");
    // Optionally redirect to home or another page
    navigate("/");
  };
  return (
    <div className="flex flex-col max-w-4xl mx-auto mt-10 px-4 sm:px-6 lg:px-8 h-[79.55vh]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-gray-800">
          📝 Collaborative Notes
        </h1>

        <div className="flex items-center space-x-3 bg-white border border-gray-300 rounded-full px-3 py-1 shadow-sm">
          {/* Room ID Copy */}
          <div className="flex items-center space-x-2 max-w-[140px] truncate">
            <span className="text-sm text-gray-600 truncate">{roomId}</span>
            <button
              onClick={() => handleCopy(roomId)}
              className="text-gray-500 hover:text-blue-600 transition-transform duration-150 cursor-pointer"
              title="Copy Room ID"
            >
              <Clipboard
                ref={iconRef}
                className="w-4 h-4 transition-transform duration-150"
              />
            </button>
          </div>

          {/* Notes Copy */}
          <button
            onClick={() => handleCopy(note)}
            className="cursor-pointer flex items-center space-x-1 text-gray-500 hover:text-green-600 transition-transform duration-150 px-2 py-1 rounded-full border border-gray-300 hover:border-green-600"
            title="Copy Notes to Clipboard"
          >
            <FileText className="w-4 h-4" />
            <span className="text-sm select-none">Copy Notes</span>
          </button>
          {/* Leave Room Button */}
          <button
            onClick={handleLeaveRoom}
            className="ml-2 px-3 py-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
            title="Leave Room"
          >
            Leave Room
          </button>
        </div>
      </div>

      {/* Text Editor with lined paper effect */}
      <div className="flex-1 relative">
        <textarea
          value={note}
          onChange={handleChange}
          placeholder="Start typing your notes here..."
          className="w-full h-full  rounded-xl border border-gray-300 bg-white p-4 shadow-sm text-gray-800 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400 transition-all overflow-y-auto resize-none"
          style={{
            lineHeight: "24px",
            paddingTop: "2px",
            paddingBottom: "2px",
            backgroundImage:
              "repeating-linear-gradient(to bottom, transparent 0, transparent 23px, #cbd5e1 24px)",
            backgroundAttachment: "local",
            backgroundSize: "100% 24px",
          }}
        />
      </div>

      {/* Footer Note */}
      <div className="mt-2 text-right text-sm text-gray-400">
        🔄 Live collaboration enabled
      </div>
    </div>
  );
};

export default CollaborativeNote;
