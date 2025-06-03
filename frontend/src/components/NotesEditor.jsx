import React, { useRef } from "react";
import { Clipboard, FileText, Copy } from "lucide-react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import useRoomStore from "../store/roomStore";

const NotesEditor = ({
  note,
  onNoteChange,
  disabled = false,
  onBlur,
  typingUserId,
  userId,
}) => {
  const { roomId } = useParams();
  const iconRef = useRef(null);
  const roomIdIconRef = useRef(null);
  const participants = useRoomStore((state) => state.participants) || [];

  const handleCopy = (text, targetRef) => {
    navigator.clipboard.writeText(text);
    if (targetRef?.current) {
      targetRef.current.classList.remove("scale-90");
      void targetRef.current.offsetWidth;
      targetRef.current.classList.add("scale-90");
      setTimeout(() => {
        targetRef.current.classList.remove("scale-90");
      }, 200);
    }
    toast.success("Copied to clipboard!");
  };

  const typingUser = participants.find((p) => p._id === typingUserId);
  const typingName = typingUser?.fullName;

  return (
    <section className="w-full h-full flex flex-col relative p-4 bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <header className="mb-4 flex flex-wrap justify-between items-center gap-2 text-gray-700">
        <div className="flex items-center gap-2 text-xl font-semibold text-indigo-600">
          <FileText className="h-5 w-5" />
          <span>Notes</span>
          {typingUserId && typingUserId !== userId && (
            <span className="ml-2 text-sm text-yellow-600 font-medium flex items-center gap-1 animate-pulse">
              <TypingDots />
              <span>{typingName || "Someone"} is typing...</span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 ml-auto flex-wrap">
          <div className="flex items-center gap-1 text-sm text-gray-600 bg-white border border-gray-200 px-2 py-1 rounded-md">
            <span
              className="font-mono text-xs truncate max-w-[140px]"
              title={roomId}
            >
              {roomId}
            </span>
            <button
              title="Copy Room ID"
              onClick={() => handleCopy(roomId, roomIdIconRef)}
              className="hover:text-indigo-600"
            >
              <Copy
                ref={roomIdIconRef}
                className="h-4 w-4 transition-transform duration-150"
              />
            </button>
          </div>
          <button
            title="Copy Notes"
            onClick={() => handleCopy(note, iconRef)}
            className="p-2 rounded-md hover:bg-gray-100 active:bg-gray-200 transition flex items-center text-gray-700"
          >
            <Clipboard ref={iconRef} className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* Textarea with background lines */}
      <div className="flex-1 relative p-2 md:p-6">
        <textarea
          readOnly={disabled}
          placeholder="Start typing your notes here..."
          className="w-full h-full rounded-xl border border-gray-200 bg-white p-4 shadow-sm text-gray-800 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400 transition-all overflow-y-auto resize-none"
          style={{
            lineHeight: "24px",
            paddingTop: "2px",
            paddingBottom: "2px",
            backgroundImage:
              "repeating-linear-gradient(to bottom, transparent 0, transparent 22.7px, #fb9500de 24px)",
            backgroundAttachment: "local",
            backgroundSize: "100% 24px",
          }}
          value={note}
          onChange={(e) => onNoteChange(e.target.value)}
          onBlur={onBlur}
        />
      </div>
    </section>
  );
};

const TypingDots = () => (
  <div className="flex items-center space-x-1">
    <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
    <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
    <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-bounce" />
  </div>
);

export default NotesEditor;
