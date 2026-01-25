import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useErrorStatus } from "../services/errorStatus";

const BACKEND_URL = "https://api.shop.drmcetit.com";

const Login: React.FC = () => {
  const { errorStatus } = useErrorStatus();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    try {
      const res = await axios.post(`${BACKEND_URL}/api/login/`, {
        email: email,
        password: password,
      });
      localStorage.setItem("accessToken", res.data.access);
      localStorage.setItem("refreshToken", res.data.refresh);
      navigate("/home");
    } catch (err: any) {
      console.log("LOGIN ERROR:", err?.response?.data || err.message || err);
      errorStatus(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
        <h1 className="text-2xl md:text-4xl font-bold tracking-tight uppercase whitespace-nowrap mb-12">
          THE TECHYS
          <span className="font-light italic text-stone-400 normal-case ml-1">
            Studio
          </span>
        </h1>

        <div className="w-full max-w-md text-center">
          <h1 className="text-2xl md:text-4xl font-semibold text-gray-900 mb-2">
            Sign in
          </h1>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black disabled:opacity-60 disabled:cursor-not-allowed"
            />

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black disabled:opacity-60 disabled:cursor-not-allowed"
            />

            <button
              type="submit"
              disabled={loading || !email || !password}
              className="w-full bg-gray-900 text-white py-3 rounded-md font-medium transition
                         hover:bg-gray-800
                         disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-gray-900"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="mt-6 text-sm text-gray-600">
            Don&apos;t Have an Account?{" "}
            <Link to="/signup" className="text-black font-medium underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;
