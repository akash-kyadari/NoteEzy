"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";

export default function AuthInit() {
  const fetchUser = useAuthStore((s) => s.fetchUser);
  const user = useAuthStore((s) => s.user);
  const status = useAuthStore((s) => s.status); // Optional: useful for debugging

  useEffect(() => {
    // Call fetchUser on mount
    fetchUser().then(() => {
      console.log("fetchUser completed");
    });
  }, [fetchUser]);

  // Log separately to see when Zustand state changes
  useEffect(() => {
    console.log("Auth user updated:", user);
    console.log("Auth status:", status);
  }, [user, status]);

  return null;
}
