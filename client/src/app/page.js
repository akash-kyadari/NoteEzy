"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/stores/authStore";
import Button from "@/components/Button";
import {
  Sparkles,
  PenTool,
  ShieldCheck,
  LogIn,
  Users,
  Activity,
  Save,
  Globe,
  MessageSquareHeart,
  Layers,
} from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const loading = useAuthStore((state) => state.loading);

  useEffect(() => {
    if (!loading && user) {
      router.replace("/home");
    }
  }, [user, loading, router]);

  if (loading) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fef9f4] via-[#f8f5f0] to-[#fefaf7] text-gray-900">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center text-center px-6 pt-36 pb-32">
        <h1 className="text-6xl md:text-7xl font-extrabold mb-6 leading-tight tracking-tight text-[#5f443d]">
          Collaborate Visually. Create Seamlessly.
        </h1>
        <p className="text-lg md:text-xl max-w-3xl mb-10 text-[#6f4e37]">
          Mixtures is your modern team hub — combining drawing, writing, and
          brainstorming into one elegant digital canvas. Bring clarity to chaos
          with tools that feel effortless.
        </p>

        {!user && (
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/auth?mode=signup">
              <Button
                size="lg"
                className="bg-[#c89f84] text-white hover:bg-[#b88d73]"
              >
                Get Started
              </Button>
            </Link>
            <Link href="/auth?mode=login">
              <Button
                variant="outline"
                size="lg"
                className="border-[#c89f84] text-[#c89f84] hover:bg-[#fdf4ee]"
              >
                Login
              </Button>
            </Link>
          </div>
        )}
      </section>

      {/* Features */}
      <section className="py-28 px-6 bg-[#fffdfb] border-t border-[#eee0d8]">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-20 text-[#3e302b]">
          Everything You Need to Build Together
        </h2>
        <div className="grid gap-12 max-w-7xl mx-auto w-full md:grid-cols-3">
          {[
            {
              icon: <PenTool className="w-8 h-8 text-[#4f3832] mb-4" />,
              title: "Live Notes",
              desc: "Collaborate on notes in real-time with beautiful, responsive typography.",
            },
            {
              icon: <Sparkles className="w-8 h-8 text-[#4f3832] mb-4" />,
              title: "Sketch Canvas",
              desc: "Freehand brainstorm, draw ideas, or map concepts together.",
            },
            {
              icon: <ShieldCheck className="w-8 h-8 text-[#4f3832] mb-4" />,
              title: "Private & Secure",
              desc: "Everything is encrypted. Only collaborators see your work.",
            },
            {
              icon: (
                <MessageSquareHeart className="w-8 h-8 text-[#4f3832] mb-4" />
              ),
              title: "Built for Real Teams",
              desc: "Mixtures supports asynchronous teams and live sessions.",
            },
            {
              icon: <Globe className="w-8 h-8 text-[#4f3832] mb-4" />,
              title: "Works Anywhere",
              desc: "Optimized for mobile, tablets, and desktop. No installs needed.",
            },
            {
              icon: <Layers className="w-8 h-8 text-[#4f3832] mb-4" />,
              title: "Multiple Boards",
              desc: "Switch between pages, stacks, or boards — all in one room.",
            },
          ].map(({ icon, title, desc }, idx) => (
            <div
              key={idx}
              className="p-8 rounded-2xl bg-gradient-to-b from-[#fefaf7] to-white border border-[#f1e3db] shadow-sm hover:shadow-md transition"
            >
              {icon}
              <h3 className="text-2xl font-bold mb-4 text-[#3e302b]">
                {title}
              </h3>
              <p className="text-[#6a554c]">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-28 px-6 bg-gradient-to-b from-[#fffaf6] to-[#fefaf8]">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-20 text-[#3e302b]">
          Start in Seconds
        </h2>
        <div className="grid gap-12 max-w-6xl mx-auto w-full md:grid-cols-2">
          {[
            {
              icon: <LogIn className="w-6 h-6 text-[#a7725b] mb-2" />,
              step: "1. Sign In",
              desc: "Login securely with email or Google. No friction, no fluff.",
            },
            {
              icon: <Users className="w-6 h-6 text-[#a7725b] mb-2" />,
              step: "2. Create / Join Room",
              desc: "Invite friends, teams, or peers. Stay in sync, wherever you are.",
            },
            {
              icon: <Activity className="w-6 h-6 text-[#a7725b] mb-2" />,
              step: "3. Collaborate Instantly",
              desc: "Switch between notes, sketches, and discussions seamlessly.",
            },
            {
              icon: <Save className="w-6 h-6 text-[#a7725b] mb-2" />,
              step: "4. Auto Save, Always",
              desc: "Never lose a thought. Everything syncs live, across devices.",
            },
          ].map(({ icon, step, desc }, idx) => (
            <div
              key={idx}
              className="bg-white p-8 rounded-2xl border border-[#ecd8cd] shadow-sm hover:shadow-md transition"
            >
              {icon}
              <h4 className="text-xl font-semibold mb-2 text-[#3e302b]">
                {step}
              </h4>
              <p className="text-[#6f4e37]">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      {!user && (
        <section className="py-24 px-6 bg-[#fdf7f1] text-center">
          <h2 className="text-4xl font-bold mb-4 text-[#5f443d]">
            Designed for Creative Collaboration
          </h2>
          <p className="mb-10 text-lg max-w-2xl mx-auto text-[#7a5c4b]">
            Whether you're an educator, founder, designer, or dreamer — Mixtures
            helps teams think better together.
          </p>
          <Link href="/auth">
            <Button
              size="lg"
              className="bg-[#c89f84] text-white hover:bg-[#b88d73]"
            >
              Create Your Free Account
            </Button>
          </Link>
        </section>
      )}
    </div>
  );
}
