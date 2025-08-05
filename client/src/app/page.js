"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/stores/authStore";
import Button from "@/components/Button";
import { PenTool, Sparkles, ShieldCheck, Users, Globe, Layers } from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const { user, loading } = useAuthStore();

  useEffect(() => {
    if (!loading && user) {
      router.replace("/home");
    }
  }, [user, loading, router]);

  if (loading) return null;

  return (
    <div className="bg-background text-text-dark">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center text-center px-6 pt-32 pb-24 bg-background">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 text-text-dark">
          Real-Time Collaborative Note-Taking
        </h1>
        <p className="text-lg md:text-xl max-w-3xl mb-10 text-text-light">
          Capture, organize, and share your thoughts effortlessly with a shared
          digital notebook. Seamless collaboration, powerful insights.
        </p>

        {!user && (
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/auth?mode=signup">
              <Button size="lg">Get Started for Free</Button>
            </Link>
            <Link href="/auth?mode=login">
              <Button variant="outline" size="lg">
                Login
              </Button>
            </Link>
          </div>
        )}
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <h2 className="text-4xl font-bold text-center mb-16 text-text-dark">
          Features Designed for Seamless Note-Taking
        </h2>
        <div className="grid gap-10 max-w-7xl mx-auto md:grid-cols-3">
          {[
            {
              icon: <PenTool className="w-8 h-8 text-primary mb-4" />,
              title: "Live Notes",
              desc: "Take notes in real-time with our rich text editor.",
            },
            {
              icon: <Sparkles className="w-8 h-8 text-primary mb-4" />,
              title: "Intuitive Editor",
              desc: "A powerful and easy-to-use editor for all your ideas.",
            },
            {
              icon: <ShieldCheck className="w-8 h-8 text-primary mb-4" />,
              title: "Secure & Private",
              desc: "Your notes are encrypted and private to your team.",
            },
            {
              icon: <Users className="w-8 h-8 text-primary mb-4" />,
              title: "Team Collaboration",
              desc: "Invite your team and collaborate on notes in real-time.",
            },
            {
              icon: <Globe className="w-8 h-8 text-primary mb-4" />,
              title: "Cross-Platform",
              desc: "Access your notes from any device, anywhere.",
            },
            {
              icon: <Layers className="w-8 h-8 text-primary mb-4" />,
              title: "Organized Workspaces",
              desc: "Keep your notes organized with multiple workspaces.",
            },
          ].map(({ icon, title, desc }, idx) => (
            <div
              key={idx}
              className="p-8 rounded-lg bg-background border border-gray-200 hover:shadow-lg transition-shadow"
            >
              {icon}
              <h3 className="text-xl font-bold mb-2 text-text-dark">{title}</h3>
              <p className="text-text-light">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      {!user && (
        <section className="py-20 px-6 bg-background text-center">
          <h2 className="text-4xl font-bold mb-4 text-text-dark">
            Ready to Start Note-Taking?
          </h2>
          <p className="mb-8 text-lg max-w-2xl mx-auto text-text-light">
            Create your free account today and start collaborating on notes with your team.
          </p>
          <Link href="/auth?mode=signup">
            <Button size="lg">Sign Up Now</Button>
          </Link>
        </section>
      )}
    </div>
  );
}