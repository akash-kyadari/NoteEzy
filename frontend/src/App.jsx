import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/DashBoard";
import useAuthStore from "./store/store.js";
import CollaborativeNote from "./extra/Notes.jsx";
import Room from "./pages/Room.jsx";

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
          path="/room/:roomId"
          element={isAuthenticated ? <Room /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
