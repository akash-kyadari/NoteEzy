"use client";

import Editor from "@/components/Editor";
import { useAuthStore } from "@/stores/authStore";
import { useRoomStore } from "@/stores/roomStore";
import { MoveLeft } from "lucide-react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useRef, useState, useEffect, use } from "react";
import { io } from "socket.io-client";

export default function RoomPage({}) {
  const editorRef = useRef();
  const router = useRouter();
  const params = useParams();
  const user = useAuthStore((state) => state.user); // Replace with auth

  const roomId = params.id;
  const userId = user?._id;
  const participants = useRoomStore((state) => state.participants);
  const admin = useRoomStore((state) => state.admin);
  const room = useRoomStore((state) => state.room);
  const setRoom = useRoomStore((state) => state.setRoom);
  const setParticipants = useRoomStore((state) => state.setParticipants);
  const setAdmin = useRoomStore((state) => state.setAdmin);
  const setNotes = useRoomStore((state) => state.setNotes);
  const [activeView, setActiveView] = useState("notes");

  const [typingUserId, setTypingUserId] = useState(null);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!user?._id || !roomId) return; // Wait until both are ready

    const socket = io(process.env.NEXT_PUBLIC_BACKEND_URL, {
      transports: ["websocket"],
    });

    socketRef.current = socket;

    socket.emit("join-room", { roomId, userId: user._id });
    console.log("Joining room:", roomId, "as", user._id);

    socket.on("joined-room", ({ currNotes, room }) => {
      editorRef.current?.setEditorContent(currNotes);
      setRoom(room); // Store full room data globally
      setParticipants(room.participants || []); // optional fallback
      setAdmin(room.admin || null); // optional fallback
    });

    socket.on("receive-note", (content) => {
      editorRef.current?.setEditorContent(content);
      setNotes(content);
    });

    socket.on("participants-update", ({ participants, admin }) => {
      setParticipants(participants);
      setAdmin(admin);
    });

    socket.on("typing-update", ({ userId }) => {
      setTypingUserId(userId);
    });

    return () => {
      socket.disconnect();
    };
  }, [roomId, user?._id]); // re-run only when user ID is ready
  if (!user) return null;
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(room?.aid || "");
    } catch (err) {
      alert("Failed to copy room ID.");
    }
  };
  console.log(room);
  console.log("in room page");
  return (
    <div className="w-full min-h-screen px-3 py-4 bg-gradient-to-br from-[#f7f5f8] via-[#e7eaf1] to-[#dce3ea]">
      <div className="max-w-[95rem] mx-auto flex flex-col md:flex-row gap-5 min-h-[calc(100vh-6rem)] md:h-[100vh]">
        {/* Sidebar */}
        <aside className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl flex  flex-1 flex-col justify-between w-full md:min-w-[300px] md:max-w-[360px] flex-shrink-0">
          <div className="space-y-8 overflow-auto pr-1">
            <div className="flex items-center  mb-3  gap-2">
              <button
                onClick={() => router.replace("/home")}
                className="m-3 hover:bg-[#afafade6] rounded-full p-2 transition cursor-pointer"
              >
                <MoveLeft />
              </button>
              <h1 className="text-3xl font-bold text-gray-900">
                {" "}
                Room Details
              </h1>
            </div>
            {/* Room Info */}
            <div>
              <h2 className="text-2xl font-bold truncate text-gray-900">
                {room?.name || "Untitled Room"}
              </h2>
              <p className="text-sm text-gray-600">
                {room?.description || "No description provided."}
              </p>
            </div>

            {/* Room Meta */}
            <div className="bg-[#f9f9fc] p-4 rounded-xl space-y-2 shadow-inner">
              <div className="flex justify-between items-center text-sm font-semibold text-gray-700">
                <span>Room ID</span>
                <button
                  onClick={handleCopy}
                  className="text-indigo-600 text-xs hover:underline"
                >
                  Copy
                </button>
              </div>
              <p className="text-xs break-all text-gray-500">{room?.aid}</p>
              <p className="text-sm">
                <strong>Admin:</strong> {admin?.name || "—"}
              </p>
              <p className="text-xs text-gray-500">
                Created:{" "}
                {room?.createdAt
                  ? new Date(room.createdAt).toLocaleString()
                  : "—"}
              </p>
            </div>

            {/* Participants (unchanged) */}
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-800">Participants</h3>
              <ul className="space-y-2 overflow-y-auto max-h-64 pr-1">
                {participants.map((p) => (
                  <li
                    key={p._id}
                    className="flex items-center gap-3 p-2 bg-white rounded-lg shadow-sm hover:shadow-md transition"
                  >
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="truncate text-sm font-medium text-gray-700">
                      {p.name}
                    </span>
                    {typingUserId === p._id && (
                      <span className="text-xs text-indigo-500 ml-auto animate-pulse">
                        typing…
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>

        {/* Main Editor Panel */}
        <main className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-2xl flex flex-col w-full min-h-[calc(100vh-6rem)]">
          {/* Toggle */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setActiveView("notes")}
              className={`px-5 py-2 text-sm font-semibold rounded-full transition ${
                activeView === "notes"
                  ? "bg-indigo-600 text-white shadow-md"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Notes
            </button>
            {/* <button
              onClick={() => setActiveView("drawing")}
              className={`px-5 py-2 text-sm font-semibold rounded-full transition ${
                activeView === "drawing"
                  ? "bg-indigo-600 text-white shadow-md"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Drawing
            </button> */}
          </div>

          {/* Editor/Drawing Switch */}
          <div className="flex-1 overflow-hidden rounded-xl bg-white shadow-inner p-4">
            {activeView === "notes" ? (
              <Editor
                ref={editorRef}
                socket={socketRef.current}
                roomId={roomId}
                userId={userId}
                initialContent={room?.currNotes}
              />
            ) : (
              <DrawingBoard
                socket={socketRef.current}
                roomId={roomId}
                userId={userId}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
