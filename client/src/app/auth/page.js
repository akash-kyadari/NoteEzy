"use client";

import { useSearchParams } from "next/navigation";
import React, { useState, useEffect, Suspense } from "react";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import Button from "@/components/Button";
import toast from "react-hot-toast";

function AuthPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialMode = searchParams.get("mode");
  const [isLogin, setIsLogin] = useState(initialMode !== "signup");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const { login, signup, loading, error, user } = useAuthStore();

  useEffect(() => {
    if (user) router.push("/home");
  }, [user, router]);

  useEffect(() => {
    const authError = searchParams.get("error");
    if (authError === "google_auth_failed") {
      toast.error(
        "Google authentication failed. Please try again or use another method."
      );
      // Optionally, remove the error parameter from the URL
      router.replace("/auth", undefined, { shallow: true });
    }
  }, [searchParams, router]);

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setForm({ name: "", email: "", password: "", confirmPassword: "" });
    setErrors({});
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const errs = {};
    if (!form.email.includes("@")) errs.email = "Enter a valid email.";
    if (form.password.length < 6)
      errs.password = "Password must be at least 6 characters.";
    if (!isLogin && form.password !== form.confirmPassword)
      errs.confirmPassword = "Passwords do not match.";
    if (!isLogin && !form.name.trim()) errs.name = "Name is required.";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) return setErrors(errs);

    const toastId = toast.loading(isLogin ? "Logging in..." : "Creating account...");

    if (isLogin) {
      const success = await login(form.email, form.password);
      if (success) {
        toast.success("Logged in successfully!", { id: toastId });
      } else {
        toast.error(error || "Login failed. Please check your credentials.", { id: toastId });
      }
    } else {
      const success = await signup(form.name, form.email, form.password);
      if (success) {
        toast.success("Account created successfully!", { id: toastId });
      } else {
        toast.error(error || "Signup failed. Please try again.", { id: toastId });
      }
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/google`;
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg border border-gray-200">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
          {isLogin ? "Welcome Back" : "Create an Account"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out"
              />
              {errors.name && (
                <p className="text-xs text-red-500 mt-1">{errors.name}</p>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out"
            />
            {errors.email && (
              <p className="text-xs text-red-500 mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out"
            />
            {errors.password && (
              <p className="text-xs text-red-500 mt-1">{errors.password}</p>
            )}
          </div>

          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out"
              />
              {errors.confirmPassword && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full py-3 text-lg bg-blue-500 text-white transition duration-200 ease-in-out"
          >
            {loading ? "Please wait..." : isLogin ? "Login" : "Create Account"}
          </Button>

          <div className="relative flex items-center justify-center my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-white text-gray-500">OR</span>
            </div>
          </div>

          <Button
            variant="outline"
            type="button"
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-2 py-3 text-lg border-gray-300 text-gray-700 hover:bg-gray-50 transition duration-200 ease-in-out"
          >
            <FcGoogle className="w-6 h-6" />
            Continue with Google
          </Button>

          <p className="text-sm text-center text-gray-600 mt-6">
            {isLogin ? "Don&apos;t have an account?" : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={toggleForm}
              className="font-medium text-blue-500 hover:text-blue-600 transition duration-200 ease-in-out"
            >
              {isLogin ? "Sign up" : "Login"}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}

export default function AuthPageWithSuspense() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthPage />
    </Suspense>
  );
}
