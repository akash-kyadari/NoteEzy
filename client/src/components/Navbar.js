"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { useState } from "react";
import Button from "@/components/Button";

export default function Navbar() {
  const { user, logout, loading } = useAuthStore();
  const [loggingOut, setLoggingOut] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
      router.push("/auth");
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <header className="h-16 w-full bg-white border-b border-gray-200 shadow-sm z-50 px-6 flex items-center justify-between">
      <Link href="/" className="text-lg font-bold text-gray-800">
        CollabCanvas
      </Link>

      <div className="flex items-center space-x-3">
        {loading ? (
          <span className="text-sm text-gray-400 animate-pulse">
            Loading...
          </span>
        ) : user ? (
          <>
            <Button
              onClick={() => router.push("/profile")}
              variant="outline"
              size="sm"
              className="text-gray-700 border-gray-300 hover:bg-gray-100 transition"
            >
              Profile
            </Button>
            <Button
              onClick={handleLogout}
              disabled={loggingOut}
              size="sm"
              className="bg-gray-800 text-white hover:bg-gray-900 transition"
            >
              {loggingOut ? "Logging out..." : "Logout"}
            </Button>
          </>
        ) : (
          <>
            <Link href="/auth">
              <Button
                size="sm"
                className="bg-gray-800 text-white hover:bg-gray-900 transition"
              >
                Login
              </Button>
            </Link>
            <Link href="/auth">
              <Button
                variant="outline"
                size="sm"
                className="border-gray-300 text-gray-700 hover:bg-gray-100 transition"
              >
                Sign Up
              </Button>
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
