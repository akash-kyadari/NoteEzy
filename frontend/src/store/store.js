// src/store/authStore.js
import { create } from "zustand";

const useAuthStore = create((set) => ({
  userId: null,
  isAuthenticated: false,
  loading: true,

  // Action to set user data on successful login or signup
  setUserData: (userId, token) => set({ userId, token, isAuthenticated: true }),

  // Action to reset user data (e.g., on logout)
  resetUserData: () =>
    set({ userId: null, token: null, isAuthenticated: false }),

  // Action to login the user (this should call API and then set the user data)
  login: async (email, password) => {
    try {
      const res = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        credentials: "include", // Ensure cookies are sent
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      console.log(res);
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.msg); // Assuming the API returns a "msg" field
      }

      const data = await res.json();
      set({ userId: data.userId, token: data.token, isAuthenticated: true });
      return true; // Return true if login is successful
    } catch (err) {
      console.error(err.message);
      return err.message; // Return the error message dynamically
    }
  },

  // Action to signup the user (this should call API and then set the user data)
  signup: async (email, password, fullName) => {
    try {
      const res = await fetch("http://localhost:3000/api/auth/signup", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, fullName }), // include fullName
      });

      const responseData = await res.json();

      if (!res.ok) {
        throw new Error(responseData.msg || "Signup failed. Please try again.");
      }

      set({
        userId: responseData.userId,
        token: responseData.token,
        isAuthenticated: true,
      });

      return true;
    } catch (err) {
      console.error(err.message);
      return err.message;
    }
  },

  // Action to logout the user (clear cookies and reset store)
  logout: async () => {
    try {
      const res = await fetch("http://localhost:3000/api/auth/logout", {
        method: "POST",
        credentials: "include", // Ensure cookies are sent
      });

      if (!res.ok) {
        throw new Error("Logout failed");
      }

      // Clear user data in the store
      set({ userId: null, token: null, isAuthenticated: false });
      return true; // Return true if logout is successful
    } catch (err) {
      console.error(err);
      return false; // Return false if logout fails
    }
  },

  //   /returns the authenticated user if cookies/session are valid.

  checkAuth: async () => {
    console.log("Inside checkAuth...");

    set({ loading: true }); // ✅ Begin check
    try {
      const res = await fetch("http://localhost:3000/api/auth/me", {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) throw new Error();

      const data = await res.json();
      console.log("✅ checkAuth success:", data);
      set({
        userId: data.userId,
        isAuthenticated: true,
        loading: false, // ✅ Done
      });
    } catch (err) {
      console.error("checkAuth failed:", err.message);
      set({
        userId: null,
        isAuthenticated: false,
        loading: false, // ✅ Done (even on error)
      });
    }
  },
  roomData: null,
  roomLoading: false,
  roomError: "",

  fetchRoom: async (roomId) => {
    set({ roomLoading: true, roomError: "" });
    console.log("in fetch room/...");
    try {
      const res = await fetch(`http://localhost:3000/api/room/${roomId}`, {
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch room");
      console.log(data);
      set({ roomData: data, roomLoading: false });
    } catch (err) {
      set({ roomError: err.message, roomLoading: false });
    }
  },

  clearRoomData: () =>
    set({ roomData: null, roomError: "", roomLoading: false }),
  // Inside create() in store.js
  createRoom: async () => {
    try {
      const res = await fetch("http://localhost:3000/api/room/create", {
        method: "POST",
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Room creation failed");

      // Optional: set current room in state
      set({ roomData: data });
      return data.roomId; // return new roomId for navigation
    } catch (err) {
      console.error("createRoom error:", err.message);
      throw err;
    }
  },

  joinRoom: async (roomId) => {
    console.log("in join room");
    try {
      const res = await fetch(`http://localhost:3000/api/room/join`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomId }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Room not found");
      console.log(data);
      // Optional: set joined room data in store
      set({ roomData: data });
      return true;
    } catch (err) {
      console.error("joinRoom error:", err.message);
      throw err;
    }
  },
}));

export default useAuthStore;
