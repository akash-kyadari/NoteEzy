import { Inter } from "next/font/google";
import "./globals.css";
import React from "react";
import AuthInit from "@/components/AuthInIt";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "NoteZy",
  description: "A real-time collaborative note-taking application.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-background text-text-dark`}>
        <AuthInit />
        <Navbar />
        <main className="min-h-[calc(100vh-4rem)]">{children}</main>
        <Footer />
        <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{
            duration: 3000,
            style: {
              background: '#333',
              color: '#fff',
            },
          }}
        />
        </body>
    </html>
  );
}