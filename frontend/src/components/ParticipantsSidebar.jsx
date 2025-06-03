import React from "react";
import { LogOut, UserCircle2 } from "lucide-react";
import useRoomStore from "../store/roomStore";
import useAuthStore from "../store/store";
import toast from "react-hot-toast";
import socket from "../socket";
import { useNavigate } from "react-router-dom";

const ParticipantsSidebar = ({ typingUserId }) => {
  const participants = useRoomStore((state) => state.participants) || [];
  const admin = useRoomStore((state) => state.admin);
  const userId = useAuthStore((state) => state.userId);
  const navigate = useNavigate();

  const handleLeave = () => {
    socket.emit("leave-room", useRoomStore.getState().roomId);
    toast.success("You left the room.");
    navigate("/");
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100 bg-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <UserCircle2 className="w-6 h-6 text-blue-500" />
          <h2 className="text-lg font-semibold text-gray-800">Participants</h2>
          <span className="text-xs text-gray-400">
            {participants.length} online
          </span>
        </div>
        <button
          onClick={handleLeave}
          className="flex items-center gap-1 text-xs text-red-600 hover:text-red-700 px-2 py-1 border border-red-200 rounded hover:bg-red-50 transition"
        >
          <LogOut className="w-4 h-4" />
          Leave
        </button>
      </div>

      {/* List */}
      <ul className="flex-1 overflow-y-auto px-4 py-2 space-y-2 bg-white">
        {participants.map((p) => {
          const isMe = String(p._id) === String(userId);
          const isAdmin = admin && String(p._id) === String(admin._id);
          const isTyping =
            typingUserId && String(p._id) === String(typingUserId);

          return (
            <li
              key={p._id}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg ${
                isMe ? "bg-blue-50" : "hover:bg-gray-100"
              } transition`}
            >
              <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold bg-blue-200 text-blue-700 select-none">
                {p.fullName?.[0]?.toUpperCase() || "U"}
              </div>

              <div className="flex flex-col flex-grow min-w-0">
                <span className="font-medium text-gray-700 truncate">
                  {p.fullName || "Unknown"}
                </span>
                {isTyping && (
                  <span className="text-green-600 font-medium text-xs flex items-center gap-1 animate-pulse">
                    <TypingDots />
                    typing...
                  </span>
                )}
              </div>

              {isAdmin && (
                <span className="ml-auto text-xs text-blue-600 font-semibold bg-blue-100 px-2 py-0.5 rounded select-none">
                  Admin
                </span>
              )}
            </li>
          );
        })}

        {participants.length === 0 && (
          <li className="text-gray-400 text-sm text-center py-8">
            No participants yet
          </li>
        )}
      </ul>

      {/* Footer */}
      <div className="px-6 py-3 border-t border-gray-100 bg-white text-xs text-gray-400 text-center">
        Invite friends to collaborate!
      </div>
    </div>
  );
};

const TypingDots = () => (
  <div className="flex items-center space-x-1">
    <div className="w-1.5 h-1.5 bg-green-600 rounded-full animate-bounce [animation-delay:-0.3s]" />
    <div className="w-1.5 h-1.5 bg-green-600 rounded-full animate-bounce [animation-delay:-0.15s]" />
    <div className="w-1.5 h-1.5 bg-green-600 rounded-full animate-bounce" />
  </div>
);

export default ParticipantsSidebar;
