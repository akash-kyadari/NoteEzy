import React from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/store.js";
import { ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";

const ProfilePage = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = async () => {
    const result = await logout();
    if (result) {
      toast.success("successfully logged out");
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-neutral-900 to-gray-800 flex items-center justify-center px-4 py-8 relative">
      {/* Back button in top-left */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-6 left-6 flex items-center gap-1 text-gray-400 hover:text-white transition cursor-pointer"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="text-sm font-medium">Back</span>
      </button>

      <div className="bg-gray-900 text-white rounded-2xl shadow-xl max-w-lg w-full p-8">
        <div className="flex flex-col items-center gap-4 mb-6">
          <div className="w-28 h-28 rounded-full flex items-center justify-center bg-gray-700 text-gray-200 text-5xl font-bold uppercase shadow-inner">
            {user.fullName?.[0] || user.name?.[0] || "U"}
          </div>
          <h2 className="text-3xl font-semibold">
            {user.fullName || user.name || "User"}
          </h2>
          <p className="text-gray-400 text-sm">{user.email}</p>
        </div>

        <div className="border-t border-gray-700 pt-4 text-sm space-y-2">
          <div>
            <span className="font-medium text-gray-400">User ID:</span>{" "}
            <span className="text-gray-300">{user.userId || user._id}</span>
          </div>
          <div>
            <span className="font-medium text-gray-400">Joined:</span>{" "}
            <span className="text-gray-300">
              {user.createdAt
                ? new Date(user.createdAt).toLocaleDateString()
                : "N/A"}
            </span>
          </div>
        </div>

        <div className="mt-8 flex justify-center gap-4">
          <button
            onClick={() => alert("Edit functionality not implemented yet")}
            className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition text-sm font-medium text-gray-200"
          >
            Edit Profile
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 transition text-sm font-medium text-white"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
