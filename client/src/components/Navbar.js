"use client";

import Link from "next/link";
import { useAuthStore } from "@/stores/authStore";
import Button from "./Button";
import { LogOut, User } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuthStore();

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm shadow-sm border-b border-gray-100">
      <div className="container mx-auto flex items-center justify-between p-4">
        <Link href={user ? "/home" : "/"}>
          <h1 className="text-2xl font-extrabold text-primary-dark">NoteZy</h1>
        </Link>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <Link href="/profile">
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-gray-100"
                >
                  <User className="h-5 w-5 text-text-dark" />
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={logout}
                className="hover:bg-gray-100"
              >
                <LogOut className="h-5 w-5 text-text-dark" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/auth?mode=login">
                <Button
                  variant="outline"
                  className="border-primary text-primary"
                >
                  Login
                </Button>
              </Link>
              <Link href="/auth?mode=signup">
                <Button className="bg-blue-500 text-white hover:bg-blue-600">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
