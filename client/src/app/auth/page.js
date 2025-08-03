"use client";
import { useSearchParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
export default function AuthPage() {
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

    if (isLogin) {
      await login(form.email, form.password);
    } else {
      await signup(form.name, form.email, form.password);
    }
  };

  const handleGoogleLogin = () => {
    alert("Google Login not implemented");
  };

  return (
    <div className="min-h-[85vh] bg-stone-50 flex items-center justify-center p-4">
      <div className="grid md:grid-cols-2 shadow-xl bg-white rounded-xl max-w-5xl w-full overflow-hidden min-h-[600px]">
        {/* Left Info */}
        <div className="hidden md:flex flex-col justify-center bg-stone-100 p-10">
          <h2 className="text-4xl font-bold text-stone-700 mb-4">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h2>
          <p className="text-stone-600 text-base">
            {isLogin
              ? "Log in to access your dashboard and notes."
              : "Sign up and start your productivity journey with us."}
          </p>
        </div>

        {/* Right Form */}
        <form
          onSubmit={handleSubmit}
          className="p-10 flex flex-col justify-center gap-5 w-full bg-white"
        >
          <h3 className="text-3xl font-semibold text-stone-800 mb-2 text-center">
            {isLogin ? "Login" : "Sign Up"}
          </h3>

          {!isLogin && (
            <div>
              <label className="block text-sm text-stone-600 mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full border border-stone-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-stone-500"
              />
              {errors.name && (
                <p className="text-xs text-red-500 mt-1">{errors.name}</p>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm text-stone-600 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full border border-stone-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-stone-500"
            />
            {errors.email && (
              <p className="text-xs text-red-500 mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm text-stone-600 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full border border-stone-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-stone-500"
            />
            {errors.password && (
              <p className="text-xs text-red-500 mt-1">{errors.password}</p>
            )}
          </div>

          {!isLogin && (
            <div>
              <label className="block text-sm text-stone-600 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                className="w-full border border-stone-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-stone-500"
              />
              {errors.confirmPassword && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>
          )}

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="bg-stone-800 text-white py-2 rounded-md hover:bg-stone-900 transition font-semibold"
          >
            {loading ? "Please wait..." : isLogin ? "Login" : "Create Account"}
          </button>

          <div className="flex items-center justify-center text-center">
            <span className="text-stone-400 text-xs">────────</span>
            <span className="px-2 text-stone-500 text-sm">OR</span>
            <span className="text-stone-400 text-xs">────────</span>
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="border flex just justify-center items-center justify-items-center border-stone-300 rounded-md py-2 hover:bg-stone-100 transition"
          >
            <FcGoogle className="w-5 h-5 mr-2" />
            Continue with Google
          </button>

          <p className="text-sm text-center text-stone-500 mt-2">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={toggleForm}
              className="text-stone-700 underline font-medium"
            >
              {isLogin ? "Sign up" : "Login"}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
