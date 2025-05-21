import React from "react";
import { UserCircle2 } from "lucide-react";
import useRoomStore from "../store/roomStore";
import useAuthStore from "../store/store"; // Import your auth store

const ParticipantsSidebar = () => {
  const participants = useRoomStore((state) => state.participants) || [];
  const admin = useRoomStore((state) => state.admin);
  const userId = useAuthStore((state) => state.userId); // Get current user ID

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100 bg-white">
        <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <UserCircle2 className="w-6 h-6 text-blue-500" />
          Participants
        </h2>
        <span className="text-xs text-gray-400">
          {participants.length} online
        </span>
      </div>
      {/* List */}
      <ul className="flex-1 overflow-y-auto px-4 py-2 space-y-2 bg-white">
        {participants.map((p) => {
          const isMe = String(p._id) === String(userId);
          const isAdmin = admin && String(p._id) === String(admin._id);
          return (
            <li
              key={p._id}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg ${
                isMe ? "bg-blue-50" : "hover:bg-gray-100"
              }`}
            >
              <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold bg-blue-200 text-blue-700">
                {p.fullName?.[0]?.toUpperCase() || "U"}
              </div>
              <span className="font-medium text-gray-700 px-2 py-1 rounded">
                {p.fullName || "Unknown"}
              </span>
              {isAdmin && (
                <span className="ml-auto text-xs text-blue-600 font-semibold bg-blue-100 px-2 py-0.5 rounded">
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

export default ParticipantsSidebar;
