import React from "react";

export default function Footer() {
  return (
    <footer className="bg-[#fdf9f6] border-t border-stone-200 py-4 text-stone-600 ">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-center md:text-left">
          <h3 className="text-xl font-semibold text-stone-800 mb-1">
            CollabCanvas
          </h3>
          <p className="text-sm max-w-sm">
            Real‑time collaboration for expressive teams. Build, brainstorm, and
            create without limits.
          </p>
        </div>

        <div className="flex items-center gap-6 text-sm">
          <a
            href="#"
            className="hover:underline hover:text-stone-800 transition"
          >
            About
          </a>
          <a
            href="#"
            className="hover:underline hover:text-stone-800 transition"
          >
            Privacy
          </a>
          <a
            href="#"
            className="hover:underline hover:text-stone-800 transition"
          >
            Terms
          </a>
          <a
            href="#"
            className="hover:underline hover:text-stone-800 transition"
          >
            Contact
          </a>
        </div>
      </div>

      <div className="mt-8 text-center text-xs text-stone-400">
        &copy; {new Date().getFullYear()} CollabCanvas. All rights reserved.
      </div>
    </footer>
  );
}
