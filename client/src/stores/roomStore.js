// lib/stores/roomStore.ts
import { create } from "zustand";
import { useAuthStore } from "./authStore";

export const useRoomStore = create((set) => ({
  room: null,
  notes: "",
  participants: [],
  admin: null,
  loading: false,
  error: null,

  setRoom: (room) => set({ room }),
  setNotes: (notes) => set({ notes }),
  setParticipants: (participants) => set({ participants }), // ✅
  setAdmin: (admin) => set({ admin }),

  createRoom: async ({ name, description }, router) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/room/create`,
        {
          method: "POST",
          credentials: "include", // Important if you’re using cookies/sessions
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, description }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.error || "Room creation failed");
      }

      const newRoom = await response.json();
      set({ room: newRoom, loading: false });
      const authStore = useAuthStore.getState();
      if (authStore.user) {
        useAuthStore.setState({
          user: {
            ...authStore.user,
            rooms: [...(authStore.user.rooms || []), newRoom],
          },
        });
      }
      router.push(`/room/${newRoom.aid}`);
    } catch (err) {
      alert(err.message);
      set({ loading: false, error: err.message });
    }
  },

  joinRoom: async (roomId, router) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/room/check/${roomId}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok || !data.valid) {
        throw new Error(data?.error || "Room not found");
      }

      set({
        room: {
          roomId: data.roomId,
          roomName: data.roomName,
          admin: data.admin,
          currNotes: data.currNotes,
          participants: data.participants,
        },
        loading: false,
      });
      const authStore = useAuthStore.getState();
      const existingRooms = authStore.user?.rooms || [];

      const alreadyInRooms = existingRooms.some((room) => room._id === roomId);
      const joinedRoom = {
        aid: data.roomId,
        name: data.roomName,
        createdBy: data.admin,
        description: data.description,
      };
      if (!alreadyInRooms) {
        useAuthStore.setState({
          user: {
            ...authStore.user,
            rooms: [...existingRooms, joinedRoom],
          },
        });
      }
      router.push(`/room/${roomId}`);
    } catch (err) {
      alert(err.message);
      set({ loading: false, error: err.message });
    }
  },
}));
