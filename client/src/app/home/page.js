"use client";

import { useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useRoomStore } from "@/stores/roomStore";
import { useAuthStore } from "@/stores/authStore";
import Button from "@/components/Button";

export default function HomePage() {
  const router = useRouter();
  const createDataRef = useRef({ name: "", description: "" });
  const roomCodeRef = useRef("");
  const { createRoom, joinRoom, loading } = useRoomStore();
  const { user, loading: authLoading } = useAuthStore();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/");
    }
  }, [user, authLoading, router]);

  if (authLoading || !user) {
    return null; // Or a loading spinner
  }

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
    <main className="min-h-[calc(100vh-4rem)] bg-gray-50 text-gray-800 px-6 py-12">
      <div className="container mx-auto">
        {/* Header */}
        <section className="text-center max-w-3xl mx-auto mb-16 pt-8">
          <h1 className="text-5xl font-extrabold text-gray-900 sm:text-6xl leading-tight">
            Welcome, <span className="text-primary">{user?.name || "User"}</span>!
          </h1>
          <p className="mt-6 text-xl text-gray-600 leading-relaxed">
            Create a new room to start collaborating or join an existing one using a room code.
          </p>
        </section>

        {/* Create & Join Room */}
        <section className="grid w-full max-w-4xl mx-auto grid-cols-1 md:grid-cols-2 gap-8">
          {/* Create Room */}
          <div key="create-room" className="rounded-xl bg-white border border-gray-200 p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Create a New Room</h2>
            <div className="space-y-5">
              <input
                type="text"
                placeholder="Room Name"
                className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-gray-700 placeholder-gray-400"
                onChange={(e) => (createDataRef.current.name = e.target.value)}
              />
              <textarea
                placeholder="Room Description (optional)"
                className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-gray-700 placeholder-gray-400"
                rows={4}
                onChange={(e) => (createDataRef.current.description = e.target.value)}
              />
              <Button onClick={handleCreate} disabled={loading} className="w-full py-3 text-lg">
                {loading ? "Creating..." : "Create Room"}
              </Button>
            </div>
          </div>

          {/* Join Room */}
          <div key="join-room" className="rounded-xl bg-white border border-gray-200 p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Join a Room</h2>
            <div className="space-y-5">
              <input
                type="text"
                placeholder="Enter Room Code"
                className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-gray-700 placeholder-gray-400"
                onChange={(e) => (roomCodeRef.current = e.target.value)}
              />
              <Button onClick={handleJoin} disabled={loading} className="w-full py-3 text-lg">
                {loading ? "Joining..." : "Join Room"}
              </Button>
            </div>
          </div>
        </section>

        {/* Recent Rooms */}
        <section className="w-full max-w-4xl mx-auto mt-16">
          <h3 className="text-3xl font-bold text-gray-900 mb-8">Recent Rooms</h3>
          {user?.rooms?.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {user.rooms.map((room) => (
                <div
                  key={room._id}
                  className="bg-white rounded-xl border border-gray-200 shadow-lg p-6 flex flex-col justify-between hover:shadow-xl transition-shadow duration-300"
                >
                  <div>
                    <h4 className="text-xl font-semibold text-gray-800 truncate mb-2">{room.name}</h4>
                    <p className="text-sm text-gray-500 mb-3">Created by {room.createdBy?.name || "Unknown"}</p>
                    <p className="text-base text-gray-600 mb-4 line-clamp-3">{room.description || "No description"}</p>
                  </div>
                  <Button onClick={() => router.push(`/room/${room.aid}`)} className="mt-auto w-full py-2">
                    Join Room
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-10 text-center text-gray-500 bg-white/50">
              <p className="text-lg">You haven't joined any rooms yet.</p>
            </div>
          )}
        </section>

        {/* How to Use */}
        <section className="w-full max-w-4xl mx-auto mt-16">
          <h3 className="text-3xl font-bold text-gray-900 mb-8">How to Use</h3>
          <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-lg">
            <ul className="space-y-5 text-gray-700 text-lg">
              <li key="how-to-1" className="flex items-start">
                <span className="font-bold mr-3 text-primary">1.</span>
                <span>
                  <span className="font-semibold">Create a Room:</span> Give your room a name and an optional description, then click "Create Room."
                </span>
              </li>
              <li key="how-to-2" className="flex items-start">
                <span className="font-bold mr-3 text-primary">2.</span>
                <span>
                  <span className="font-semibold">Join a Room:</span> Enter the room code you received and click "Join Room."
                </span>
              </li>
              <li key="how-to-3" className="flex items-start">
                <span className="font-bold mr-3 text-primary">3.</span>
                <span>
                  <span className="font-semibold">Collaborate:</span> Once in a room, you can use the editor to write and format text, and your changes will be visible to everyone in the room in real-time.
                </span>
              </li>
            </ul>
          </div>
        </section>

        {/* Use Cases */}
        <section className="w-full max-w-4xl mx-auto mt-16">
          <h3 className="text-3xl font-bold text-gray-900 mb-8">Use Cases</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div key="use-case-1" className="bg-white rounded-xl border border-gray-200 p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <h4 className="text-xl font-semibold mb-3 text-gray-800">Brainstorming</h4>
              <p className="text-gray-600">Capture ideas and organize them in a shared space. Perfect for team meetings and creative sessions.</p>
            </div>
            <div key="use-case-2" className="bg-white rounded-xl border border-gray-200 p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <h4 className="text-xl font-semibold mb-3 text-gray-800">Meeting Notes</h4>
              <p className="text-gray-600">Take collaborative notes during meetings to ensure everyone is on the same page.</p>
            </div>
            <div key="use-case-3" className="bg-white rounded-xl border border-gray-200 p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <h4 className="text-xl font-semibold mb-3 text-gray-800">Code Snippets</h4>
              <p className="text-gray-600">Share and discuss code snippets with your team in a formatted and readable way.</p>
            </div>
            <div key="use-case-4" className="bg-white rounded-xl border border-gray-200 p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <h4 className="text-xl font-semibold mb-3 text-gray-800">Project Planning</h4>
              <p className="text-gray-600">Outline project plans, create to-do lists, and assign tasks to team members.</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}