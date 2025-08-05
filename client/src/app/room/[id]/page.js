"use client";

import Editor from "@/components/Editor";
import { useAuthStore } from "@/stores/authStore";
import { useRoomStore } from "@/stores/roomStore";
import { MoveLeft, ClipboardCopy } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useRef, useState, useEffect } from "react";
import { io } from "socket.io-client";
import Button from "@/components/Button";
import toast from "react-hot-toast";

export default function RoomPage() {
  const editorRef = useRef();
  const router = useRouter();
  const params = useParams();
  const { user } = useAuthStore();

  const roomId = params.id;
  const { participants, admin, room, setRoom, setParticipants, setAdmin, setNotes } = useRoomStore();
  const [typingUserId, setTypingUserId] = useState(null);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!user?._id || !roomId) return;

    const socket = io(process.env.NEXT_PUBLIC_BACKEND_URL, {
      transports: ["websocket"],
    });

    socketRef.current = socket;

    socket.emit("join-room", { roomId, userId: user._id });

    socket.on("joined-room", ({ currNotes, room }) => {
      editorRef.current?.setEditorContent(currNotes);
      setRoom(room);
      setParticipants(room.participants || []);
      setAdmin(room.admin || null);
      toast.success(`Welcome to ${room.name}!`, { icon: '👋' });
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
  }, [roomId, user?._id, setRoom, setParticipants, setAdmin, setNotes]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(room?.aid || "");
      toast.success("Room ID copied to clipboard!", { icon: '📋' });
    } catch (err) {
      toast.error("Failed to copy room ID.", { icon: '❌' });
    }
  };

  if (!user) return null;

  return (
    <div className="w-full min-h-screen bg-gray-100 p-4 flex flex-col">
      <div className="max-w-screen-2xl mx-auto flex flex-col md:flex-row gap-6 flex-grow w-full">
        {/* Sidebar */}
        <aside className="bg-white rounded-xl border border-gray-200 p-6 shadow-lg flex flex-col w-full md:w-80">
          <div className="flex items-center gap-3 mb-6">
            <Button variant="ghost" size="icon" onClick={() => {
              toast.success("Left room successfully!");
              router.replace("/home");
            }} className="hover:bg-gray-100">
              <MoveLeft className="h-5 w-5 text-gray-600" />
            </Button>
            <h1 className="text-xl font-bold text-gray-800">Room Details</h1>
          </div>

          <div className="space-y-6 flex-1 overflow-y-auto">
            <div>
              <h2 className="text-lg font-semibold truncate text-gray-900 mb-1">{room?.name || "Untitled Room"}</h2>
              <p className="text-sm text-gray-600">{room?.description || "No description."}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-3">
              <div className="flex justify-between items-center text-sm font-medium text-gray-700">
                <span>Room ID</span>
                <Button variant="ghost" size="icon" onClick={handleCopy} className="hover:bg-gray-100">
                  <ClipboardCopy className="h-4 w-4 text-gray-600" />
                </Button>
              </div>
              <p className="text-xs break-all text-gray-500 font-mono bg-gray-100 p-2 rounded">{room?.aid}</p>
              <p className="text-sm text-gray-700"><strong>Admin:</strong> <span className="font-semibold">{admin?.name || "N/A"}</span></p>
              <p className="text-xs text-gray-500">
                Created: {room?.createdAt ? new Date(room.createdAt).toLocaleString() : "N/A"}
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-gray-800">Participants ({participants.length})</h3>
              <ul className="space-y-2">
                {participants.map((p) => (
                  <li key={p._id} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
                    <div className={`w-3 h-3 rounded-full ${typingUserId === p._id ? 'bg-blue-500 animate-pulse' : 'bg-green-500'}`} />
                    <span className="truncate text-sm font-medium text-gray-700">{p.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>

        {/* Main Editor Panel */}
        <main className="bg-white rounded-xl border border-gray-200 shadow-lg flex-1 flex flex-col">
          <div className="flex-1 overflow-hidden p-6">
            <Editor
              ref={editorRef}
              socket={socketRef.current}
              roomId={roomId}
              userId={user._id}
              initialContent={room?.currNotes}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
