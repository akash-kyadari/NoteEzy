import { create } from "zustand";

const useAuthStore = create((set) => ({
  userId: null,
  user: null, // <-- new state for user details
  isAuthenticated: false,
  loading: true,

  setUserData: (userId, user, token) =>
    set({ userId, user, token, isAuthenticated: true }),

  resetUserData: () =>
    set({ userId: null, user: null, token: null, isAuthenticated: false }),

  login: async (email, password) => {
    try {
      const res = await fetch(
        import.meta.env.VITE_BACKEND_URL + "/api/auth/login",
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );
      console.log(res);
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.msg);
      }

      const data = await res.json();

      // set userId, user and token here
      set({
        userId: data.user._id, // assuming user._id
        user: data.user,
        token: data.token,
        isAuthenticated: true,
      });
      return true;
    } catch (err) {
      console.error(err.message);
      return err.message;
    }
  },

  signup: async (email, password, fullName) => {
    try {
      const res = await fetch(
        import.meta.env.VITE_BACKEND_URL + "/api/auth/signup",
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, fullName }),
        }
      );

      const responseData = await res.json();

      if (!res.ok) {
        throw new Error(responseData.msg || "Signup failed. Please try again.");
      }

      set({
        userId: responseData.user._id,
        user: responseData.user,
        token: responseData.token,
        isAuthenticated: true,
      });

      return true;
    } catch (err) {
      console.error(err.message);
      return err.message;
    }
  },

  logout: async () => {
    try {
      const res = await fetch(
        import.meta.env.VITE_BACKEND_URL + "/api/auth/logout",
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (!res.ok) {
        throw new Error("Logout failed");
      }

      set({ userId: null, user: null, token: null, isAuthenticated: false });
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  },

  checkAuth: async () => {
    console.log("Inside checkAuth...");

    set({ loading: true });
    try {
      const res = await fetch(
        import.meta.env.VITE_BACKEND_URL + "/api/auth/me",
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!res.ok) throw new Error();

      const data = await res.json();
      console.log("✅ checkAuth success:", data);

      // Here, assuming data contains user details directly
      set({
        userId: data._id,
        user: data,
        isAuthenticated: true,
        loading: false,
      });
    } catch (err) {
      console.error("checkAuth failed:", err.message);
      set({
        userId: null,
        user: null,
        isAuthenticated: false,
        loading: false,
      });
    }
  },
}));

export default useAuthStore;
