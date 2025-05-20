import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom"; // Use useNavigate in React Router v6
import useAuthStore from "../store/store.js";

const LoginPage = () => {
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate(); // Initialize navigate function

  const [errorMessage, setErrorMessage] = useState(""); // State for error message

  const handleSubmit = async (e) => {
    e.preventDefault();

    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    // Await the login response to get the result
    const errorMessage = await login(email, password);

    if (errorMessage === true) {
      navigate("/dashboard"); // Navigate to the dashboard if login is successful
    } else {
      setErrorMessage(errorMessage); // Set the dynamic error message returned from the API
    }
  };

  const handleBack = () => {
    navigate("/"); // Navigate back to the landing page
  };

  return (
    <div className="bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white min-h-screen flex flex-col justify-center items-center py-10">
      {/* Back Button */}
      <button
        onClick={handleBack}
        className="absolute top-6 left-6 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full font-semibold transition-all transform hover:scale-105"
      >
        &larr; Back
      </button>

      {/* Login Form */}
      <div className="bg-white/10 p-10 rounded-2xl shadow-lg max-w-md w-full mt-20">
        <h2 className="text-4xl font-bold text-center text-white mb-8">
          Log In
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
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
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105"
            >
              Log In
            </button>
          </div>
        </form>

        {/* Sign Up Link */}
        <div className="text-center mt-6">
          <p className="text-gray-300">
            Don't have an account?
            <a href="/signup" className="text-indigo-400 hover:text-indigo-300">
              Sign up here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
