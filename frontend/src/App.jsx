import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import LandingPage from "./pages/LandingPage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/DashBoard";
import useAuthStore from "./store/store.js";
import Room from "./pages/Room.jsx";
import ProfilePage from "./pages/profilePage.jsx";

function App() {
  const { isAuthenticated, checkAuth, loading } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, []);

  // 🧠 IMPORTANT: Don’t render any routes until auth check is done
  if (loading) {
    return <div className="text-center p-10 text-white">Loading...</div>;
  }

  return (
    <>
      <Toaster
        toastOptions={{
          duration: 2000, // 3 seconds for all toasts
          className: "",
          style: {
            background: "#333",
            color: "#fff",
          },
          success: {
            style: {
              background: "#22c55e",
            },
          },
          error: {
            style: {
              background: "#ef4444",
            },
          },
        }}
      />

      <Router>
        <Routes>
          <Route
            path="/"
            element={
              isAuthenticated ? <Navigate to="/dashboard" /> : <LandingPage />
            }
          />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/dashboard"
            element={
              // ✅ This is now safe because we don't render this until loading is false
              isAuthenticated ? <Dashboard /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/profile"
            element={
              // ✅ This is now safe because we don't render this until loading is false
              isAuthenticated ? <ProfilePage /> : <Navigate to="/" />
            }
          />
          <Route
            path="/room/:roomId"
            element={isAuthenticated ? <Room /> : <Navigate to="/login" />}
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
