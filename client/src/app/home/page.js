"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { useRoomStore } from "@/stores/roomStore";
import { useAuthStore } from "@/stores/authStore";
import { FaChalkboardTeacher } from "react-icons/fa";
import { MdOutlineMeetingRoom } from "react-icons/md";
export default function HomePage() {
  const router = useRouter();
  const createDataRef = useRef({ name: "", description: "" });
  const roomCodeRef = useRef("");
  const { createRoom, joinRoom, loading } = useRoomStore();
  const user = useAuthStore((state) => state.user);

  const handleCreate = async () => {
    const { name, description } = createDataRef.current;
    if (!name.trim()) return alert("Room name is required");
    await createRoom({ name, description }, router);
  };

  const handleJoin = async () => {
    const code = roomCodeRef.current.trim();
    if (!code) return alert("Please enter a room code");
    await joinRoom(code, router);
  };

  return (
    <main className="min-h-screen bg-[#FAF9F6] text-gray-800 px-6 py-12 flex flex-col gap-20 items-center">
      {/* Header */}
      <section className="text-center max-w-3xl">
        <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl">
          Collaborate Visually in Real Time
        </h1>
        <p className="mt-5 text-lg text-gray-600 leading-relaxed">
          Create or join shared visual workspaces to brainstorm ideas, take
          notes, draw diagrams, or plan projects — together, in sync.
        </p>
      </section>

      {/* Create & Join Room */}
      <section className="grid w-full max-w-5xl grid-cols-1 md:grid-cols-2 gap-8">
        {/* Create Room */}
        <div className="rounded-2xl bg-white border border-gray-200 p-6 shadow-md hover:shadow-lg transition">
          <h2 className="text-2xl font-semibold mb-2">Create a Room</h2>
          <p className="text-sm text-gray-500 mb-4">
            Start a fresh session with a blank canvas.
          </p>
          <input
            type="text"
            placeholder="Room Name"
            className="w-full mb-3 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            onChange={(e) => (createDataRef.current.name = e.target.value)}
          />
          <textarea
            placeholder="Room Description"
            className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            rows={3}
            onChange={(e) =>
              (createDataRef.current.description = e.target.value)
            }
          />
          <button
            onClick={handleCreate}
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Room"}
          </button>
        </div>

        {/* Join Room */}
        <div className="rounded-2xl bg-white border border-gray-200 p-6 shadow-md hover:shadow-lg transition max-h-[230px]">
          <h2 className="text-2xl font-semibold mb-2">Join a Room</h2>
          <p className="text-sm text-gray-500 mb-4">
            Already have a code? Jump in and collaborate.
          </p>
          <input
            type="text"
            placeholder="Enter Room Code"
            className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            onChange={(e) => (roomCodeRef.current = e.target.value)}
          />
          <button
            onClick={handleJoin}
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {loading ? "Joining..." : "Join Room"}
          </button>
        </div>
      </section>

      {/* Recent Rooms Placeholder */}

      <section className="w-full max-w-6xl mx-auto mt-16 px-4">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 tracking-tight">
          Recently Joined Rooms
        </h3>

        {user === undefined || user === null ? (
          <div className="flex justify-center items-center h-40 text-gray-400 text-lg">
            Loading your rooms...
          </div>
        ) : user.rooms?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {user.rooms.map((room, i) => (
              <div
                key={room._id ?? room.aid ?? i}
                className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between p-5 min-h-[200px]"
              >
                {/* Header row */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold text-black-700 truncate">
                      {room.name || `Room ${i + 1}`}
                    </h2>
                    <p className="text-sm text-gray-500 mt-0.5">
                      Roomkhod by{" "}
                      <span className="font-medium text-gray-800">
                        {room.createdBy?.name || "Unknown"}
                      </span>
                    </p>
                  </div>

                  <button
                    onClick={() => router.push(`/room/${room.aid}`)}
                    className="bg-indigo-600 text-white text-sm px-4 py-1.5 rounded-md hover:bg-indigo-700 transition whitespace-nowrap"
                  >
                    Join
                  </button>
                </div>

                {/* Details section */}
                <div className="text-sm text-gray-700 space-y-3">
                  <div className="flex gap-2">
                    <span className="font-medium text-gray-500 min-w-[100px]">
                      Room Code:
                    </span>
                    <span className="font-mono text-indigo-700 truncate">
                      #{room.aid}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <span className="font-medium text-gray-500 min-w-[100px]">
                      Description:
                    </span>
                    <span className="text-gray-700">
                      {room.description || (
                        <span className="italic text-gray-400">
                          No description provided. This room allows
                          collaborative drawing, note-taking, and real-time
                          planning.
                        </span>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="border-2 border-dashed border-gray-300 rounded-2xl p-10 text-center text-gray-400">
            You haven’t joined any rooms yet.
          </div>
        )}
      </section>
    </main>
  );
}
