// File: stores/useAuthStore.js
import { create } from "zustand";

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
    } catch (err) {
      console.error("Login Error:", err.message);
      set({
        error: err.message,
        loading: false,
        user: null,
        status: "unauthenticated",
      });
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
    } catch (err) {
      console.error("Signup Error:", err.message);
      set({
        error: err.message,
        loading: false,
        user: null,
        status: "unauthenticated",
      });
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
    try {
      await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.warn("Logout error:", err.message);
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
