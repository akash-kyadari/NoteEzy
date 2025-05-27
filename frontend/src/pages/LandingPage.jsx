import React from "react";
import { useNavigate } from "react-router-dom";

import { FileText, Users, MessageCircle, History } from "lucide-react";

export const features = [
  {
    title: "Collaborative Notes",
    desc: "Write and edit notes with your team in real time. See changes as they happen.",
    icon: <FileText className="w-14 h-14 text-white" />,
  },
  {
    title: "Team Workspaces",
    desc: "Organize your notes by shared rooms or topics, making collaboration easy and structured.",
    icon: <Users className="w-14 h-14 text-white" />,
  },
  {
    title: "Real-Time Chat",
    desc: "Communicate alongside your notes. Discuss changes, tag teammates, and stay in sync.",
    icon: <MessageCircle className="w-14 h-14 text-white" />,
  },
  {
    title: "Sync & History",
    desc: "Automatic syncing and version history let you focus on content, not saving or backups.",
    icon: <History className="w-14 h-14 text-white" />,
  },
];

const LandingPage = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-gray-800 via-gray-900 to-gray-900 backdrop-blur-md border-b border-white/10 px-10 py-3 flex justify-between items-center shadow-md w-full">
        <h1 className="text-3xl font-extrabold tracking-wider text-white drop-shadow-md">
          NoteSync
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
          A real-time, room-based notes platform designed to unlock team
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
        <h2 className="text-4xl font-bold mb-4">Why NoteSync?</h2>
        <p className="text-lg text-gray-300">
          We built NoteSync for people who think visually and work in sync.
          Whether you're brainstorming with your team, teaching students
          remotely, or pitching your startup, our platform keeps your ideas
          flowing.
        </p>
      </section>

      {/* Contact Section */}
      <section className="max-w-4xl text-center py-16 px-4 mx-auto">
        <h2 className="text-3xl font-bold">Contact Us</h2>
        <p className="mt-4 text-gray-400 text-lg">
          📧 <span className="font-semibold">support@notesync.com</span>
        </p>
        <p className="text-gray-400 text-lg">
          📞 <span className="font-semibold">+1 (123) 456-7890</span>
        </p>
      </section>

      {/* Footer */}
      <footer className="w-full bg-gray-900 text-center py-6 mt-12">
        <p className="text-gray-500 text-sm">
          &copy; 2025 NoteSync. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;
