import React, { useRef } from "react";
import { Clipboard, FileText } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import socket from "../socket";

const NotesEditor = ({ note, onNoteChange }) => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const iconRef = useRef(null);

  // Copy to clipboard with animation
  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    if (iconRef.current) {
      iconRef.current.classList.remove("scale-90");
      void iconRef.current.offsetWidth;
      iconRef.current.classList.add("scale-90");
      setTimeout(() => {
        iconRef.current.classList.remove("scale-90");
      }, 150);
    }
  };

  // Leave room and notify others
  const handleLeaveRoom = () => {
    socket.emit("leave-room", roomId);
    navigate("/");
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-white rounded-2xl shadow-xl flex flex-col h-[70vh] md:h-[80vh] p-0">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-2 px-4 py-3 border-b border-gray-200 rounded-t-2xl bg-white">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800 flex items-center gap-2">
          <span role="img" aria-label="notes">
            📝
          </span>{" "}
          Collaborative Notes
        </h1>
        <div className="flex items-center space-x-2 mt-2 md:mt-0">
          <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded font-mono">
            {roomId}
          </span>
          <button
            onClick={() => handleCopy(roomId)}
            className="text-gray-500 hover:text-blue-600 transition-transform duration-150 cursor-pointer"
            title="Copy Room ID"
          >
            <Clipboard
              ref={iconRef}
              className="w-5 h-5 transition-transform duration-150"
            />
          </button>
          <button
            onClick={() => handleCopy(note)}
            className="flex items-center space-x-1 text-gray-500 hover:text-green-600 transition px-2 py-1 rounded-full border border-gray-300 hover:border-green-600 bg-white"
            title="Copy Notes to Clipboard"
          >
            <FileText className="w-4 h-4" />
            <span className="text-xs md:text-sm select-none">Copy Notes</span>
          </button>
          <button
            onClick={handleLeaveRoom}
            className="px-3 py-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition text-xs md:text-base font-semibold ml-2"
            title="Leave Room"
          >
            Leave Room
          </button>
        </div>
      </div>
      {/* Textarea */}
      <div className="flex-1 relative p-2 md:p-6">
        <textarea
          value={note}
          onChange={(e) => onNoteChange(e.target.value)}
          placeholder="Start typing your notes here..."
          className="w-full h-full rounded-xl border border-gray-200 bg-white p-4 shadow-sm text-gray-800 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400 transition-all overflow-y-auto resize-none"
          style={{
            lineHeight: "24px",
            paddingTop: "2px",
            paddingBottom: "2px",
            backgroundImage:
              "repeating-linear-gradient(to bottom, transparent 0, transparent 23px, #e5e7eb 24px)",
            backgroundAttachment: "local",
            backgroundSize: "100% 24px",
          }}
        />
      </div>
      {/* Footer */}
      <div className="px-4 py-2 text-right text-xs text-gray-400 border-t border-gray-100 rounded-b-2xl bg-white">
        🔄 Live collaboration enabled
      </div>
    </div>
  );
};

export default NotesEditor;
