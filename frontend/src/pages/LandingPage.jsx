import React from "react";
import { useNavigate } from "react-router-dom";

const features = [
  {
    title: "Team Collaboration",
    desc: "Work together seamlessly in shared rooms. Collaborate in real-time with your team from anywhere.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-14 h-14 text-white"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path d="M17 20v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 20v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
  },
  {
    title: "Whiteboard Tools",
    desc: "Sketch, draw, and express ideas with precision tools built for digital creativity.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-14 h-14 text-white"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path d="M16.862 3.487a2.25 2.25 0 113.182 3.182L6.75 19.963 3 21l1.037-3.75L16.862 3.487z" />
      </svg>
    ),
  },
  {
    title: "Real-Time Chat",
    desc: "Stay in sync with instant messaging, file sharing, and focused discussions right where you collaborate.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-14 h-14 text-white"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path d="M7 8h10M7 12h4M21 12c0 3.866-4.03 7-9 7-1.59 0-3.078-.368-4.3-1.01L3 20l1.14-3.985C3.425 15.009 3 13.548 3 12c0-3.866 4.03-7 9-7s9 3.134 9 7z" />
      </svg>
    ),
  },
  {
    title: "Live Sync Engine",
    desc: "Every stroke, message, or update syncs across users instantly. No lag. No reloads.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-14 h-14"
      >
        <path d="M3 12a9 9 0 0115.9-5.6L18 3M21 12a9 9 0 01-15.9 5.6L6 21" />
      </svg>
    ),
  },
];

const LandingPage = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-gray-800 via-gray-900 to-gray-900 backdrop-blur-md border-b border-white/10 px-10 py-3 flex justify-between items-center shadow-md w-full">
        <h1 className="text-3xl font-extrabold tracking-wider text-white drop-shadow-md">
          WhiteboardApp
        </h1>
        <div className="space-x-6">
          <button
            className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-full font-semibold transition-all transform hover:scale-105 cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
          <button
            className="bg-white text-black font-semibold px-6 py-2 rounded-full hover:bg-gray-200 transition-all transform hover:scale-105 cursor-pointer"
            onClick={() => navigate("/signup")}
          >
            Sign Up
          </button>
        </div>
      </nav>

      {/* Hero */}
      <header className="w-full h-screen flex flex-col justify-center items-center text-center px-6 pt-20 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 bottom-0 bg-white/5 backdrop-blur-xl z-0" />
        <h1 className="text-6xl md:text-7xl font-extrabold z-10">
          Collaborate. Create. Connect.
        </h1>
        <p className="text-xl text-gray-300 mt-6 z-10 max-w-2xl">
          A real-time, room-based whiteboard platform designed to unlock team
          creativity and accelerate ideas.
        </p>
      </header>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-16">
        {features.map((feature, i) => (
          <div
            key={i}
            className="bg-white/5 p-8 rounded-2xl shadow-lg flex flex-col items-center text-center transition-transform hover:scale-105"
          >
            <div className="mb-6 text-indigo-400">{feature.icon}</div>
            <h3 className="text-2xl font-bold mb-2">{feature.title}</h3>
            <p className="text-gray-300">{feature.desc}</p>
          </div>
        ))}
      </section>

      {/* About Section */}
      <section className="max-w-4xl mx-auto text-center px-6 py-20 bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl shadow-lg">
        <h2 className="text-4xl font-bold mb-4">Why WhiteboardApp?</h2>
        <p className="text-lg text-gray-300">
          We built WhiteboardApp for people who think visually and work in sync.
          Whether you're brainstorming with your team, teaching students
          remotely, or pitching your startup, our platform keeps your ideas
          flowing.
        </p>
      </section>

      {/* Contact Section */}
      <section className="max-w-4xl text-center py-16 px-4 mx-auto">
        <h2 className="text-3xl font-bold">Contact Us</h2>
        <p className="mt-4 text-gray-400 text-lg">
          📧 <span className="font-semibold">support@whiteboardapp.com</span>
        </p>
        <p className="text-gray-400 text-lg">
          📞 <span className="font-semibold">+1 (123) 456-7890</span>
        </p>
      </section>

      {/* Footer */}
      <footer className="w-full bg-gray-900 text-center py-6 mt-12">
        <p className="text-gray-500 text-sm">
          &copy; 2025 WhiteboardApp. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;
