

import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "../../components/Toast.jsx"; 
import { useAuth } from "../../context/AuthContext.jsx"; // or Zustand store

const SignIn = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { setUser } = useAuth(); // update auth state

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post("/api/auth/login", form);
      setUser(data.data); // save JWT or user info in context/store
      showToast("Logged in successfully", "success");
      navigate("/");
    } catch (err) {
      showToast(err.response?.data?.error || "Login failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-6 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-semibold mb-6 text-center">Sign In</h2>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
      <p className="text-sm text-gray-600 mt-4 text-center">
        Don't have an account?{" "}
        <Link to="/signup" className="text-indigo-600 hover:underline">
          Sign Up
        </Link>
      </p>
      <p className="text-sm text-gray-600 mt-2 text-center">
        <Link to="/forgot-password" className="text-indigo-600 hover:underline">
          Forgot Password?
        </Link>
      </p>
    </div>
  );
};

export default SignIn;
