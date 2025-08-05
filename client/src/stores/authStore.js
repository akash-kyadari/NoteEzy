// File: stores/useAuthStore.js
import { create } from "zustand";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
  user: null,
  status: "unauthenticated", // 'authenticated' | 'unauthenticated' | 'loading'
  loading: false,
  error: null,

  // LOGIN
  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(
        process.env.NEXT_PUBLIC_BACKEND_URL + "/api/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || "Login failed");
      //   console.log(data);
      set({ user: data.user, status: "authenticated", loading: false });
      return true;
    } catch (err) {
      console.error("Login Error:", err.message);
      set({
        error: err.message,
        loading: false,
        user: null,
        status: "unauthenticated",
      });
      return false;
    }
  },

  // SIGNUP
  signup: async (name, email, password) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(
        process.env.NEXT_PUBLIC_BACKEND_URL + "/api/auth/signup",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ name, email, password }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || "Signup failed");

      set({ user: data.user, status: "authenticated", loading: false });
      return true;
    } catch (err) {
      console.error("Signup Error:", err.message);
      set({
        error: err.message,
        loading: false,
        user: null,
        status: "unauthenticated",
      });
      return false;
    }
  },

  // FETCH USER
  fetchUser: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(
        process.env.NEXT_PUBLIC_BACKEND_URL + "/api/auth/me",
        {
          credentials: "include",
        }
      );
      const data = await res.json();

      if (!res.ok || !data.user)
        throw new Error(data.message || "Not authenticated");
      console.log("Fetched user:", data.user);
      set({ user: data.user, status: "authenticated", loading: false });
    } catch (err) {
      set({
        user: null,
        status: "unauthenticated",
        loading: false,
        error: " " || err.message,
      });
    }
  },

  // LOGOUT
  logout: async () => {
    const toastId = toast.loading("Logging out...");
    try {
      await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      toast.success("Logged out successfully!", { id: toastId });
    } catch (err) {
      console.warn("Logout error:", err.message);
      toast.error("Logout failed.", { id: toastId });
    } finally {
      set({
        user: null,
        status: "unauthenticated",
        loading: false,
        error: null,
      });
    }
  },
}));