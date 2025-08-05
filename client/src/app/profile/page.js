"use client";

import { MoveLeft } from "lucide-react";
import Button from "@/components/Button";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/auth");
  };

  if (!user) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Please log in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg border border-gray-200 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary to-blue-500"></div>
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="hover:bg-gray-100"
          >
            <MoveLeft className="h-5 w-5 text-gray-600" />
          </Button>
          <h2 className="text-3xl font-bold text-center text-gray-800 flex-1">
            Your Profile
          </h2>
        </div>
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center text-white text-2xl font-bold">
                {user.name ? user.name.charAt(0).toUpperCase() : "?"}
              </div>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <p className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-gray-800 font-semibold">
                {user.name}
              </p>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <p className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-gray-800">
              {user.email}
            </p>
          </div>
          {user.rooms && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rooms Joined
              </label>
              <p className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-gray-800">
                {user.rooms.length}
              </p>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="w-full py-3 px-4 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-200 ease-in-out"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
