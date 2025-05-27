import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../store/store.js";
import toast from "react-hot-toast";

const SignupPage = () => {
  const fullNameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const signup = useAuthStore((state) => state.signup);
  const navigate = useNavigate();

  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fullName = fullNameRef.current.value;
    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    const errorMessage = await signup(email, password, fullName);

    if (errorMessage === true) {
      toast.success("successfully signed up");
      navigate("/dashboard");
    } else {
      setErrorMessage(errorMessage);
    }
  };

  const handleBack = () => {
    navigate("/");
  };

  return (
    <div className="bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white min-h-screen flex flex-col justify-center items-center py-10">
      <button
        onClick={handleBack}
        className="absolute top-6 left-6 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full font-semibold transition-all transform hover:scale-105 cursor-pointer"
      >
        &larr; Back
      </button>

      <div className="bg-white/10 p-10 rounded-2xl shadow-lg max-w-md w-full mt-20">
        <h2 className="text-4xl font-bold text-center text-white mb-8">
          Sign Up
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6 cursor-pointer">
          {/* Full Name Input */}
          <div>
            <label
              htmlFor="fullName"
              className="block text-lg text-gray-300 mb-2"
            >
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              ref={fullNameRef}
              required
              className="w-full px-4 py-3 text-white bg-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-lg text-gray-300 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              ref={emailRef}
              required
              className="w-full px-4 py-3 text-white bg-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Password Input */}
          <div>
            <label
              htmlFor="password"
              className="block text-lg text-gray-300 mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              ref={passwordRef}
              required
              className="w-full px-4 py-3 text-white bg-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="text-red-500 text-sm mt-2">{errorMessage}</div>
          )}

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 cursor-pointer"
            >
              Sign Up
            </button>
          </div>
        </form>

        {/* Login Link */}
        <div className="text-center mt-6">
          <p className="text-gray-300">
            Already have an account?{" "}
            <Link to="/login" className="text-indigo-400 hover:text-indigo-300">
              Log in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
