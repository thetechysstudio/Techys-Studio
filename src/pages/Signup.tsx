import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { showToast } from "../components/toast";

const BACKEND_URL = "https://api.shop.drmcetit.com/api";

const Signup: React.FC = () => {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrorMsg("");

        if (!name || !email || !password || !confirmPassword) {
            setErrorMsg("Please fill all fields.");
            return;
        }

        if (password !== confirmPassword) {
            setErrorMsg("Passwords do not match.");
            return;
        }

        try {
            setLoading(true);

            // ✅ API call
            const res = await axios.post(`${BACKEND_URL}/signup/`, {
                username : name,
                email,
                password,
                confirmPassword,
            });

            // If your API returns token/user, you can store it here.
            // localStorage.setItem("token", res.data?.token);

            // ✅ redirect after success
            navigate("/login");
            showToast("Signup successful, now you can Login", "success");
        } catch (err: any) {
            // setErrorMsg(getErrorMessage(err)); // ✅ always a string now
            showToast(err?.response?.data?.error || err.message || err || err.data.error, "alert");
        }
        finally {
            setLoading(false);
        }
    };

    const getErrorMessage = (err: any) => {
        // axios error common shapes
        const data = err?.response?.data;

        if (typeof data === "string") return data;

        // if backend sends: { error: "..." }
        if (typeof data?.error === "string") return data.error;

        // if backend sends: { message: "..." } or { detail: "..." }
        if (typeof data?.message === "string") return data.message;
        if (typeof data?.detail === "string") return data.detail;

        // if backend sends: { error: { ... } } or any object
        if (data && typeof data === "object") return JSON.stringify(data);

        return err?.message || "Signup failed. Please try again.";
    };


    return (
        <>
            <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
                <h1 className="text-2xl md:text-4xl font-bold tracking-tight uppercase whitespace-nowrap mb-5 ">
                    THE TECHYS
                    <span className="font-light italic text-stone-400 normal-case ml-1">
                        Studio
                    </span>
                </h1>

                <div className="w-full max-w-md text-center">
                    {/* Heading */}
                    <h1 className="mb-4 text-2xl md:text-4xl font-semibold text-gray-900">
                        Sign up
                    </h1>

                    {/* Error */}
                    {errorMsg && (
                        <p className="mb-3 text-sm text-red-600 text-left">{errorMsg}</p>
                    )}

                    {/* Form */}
                    <form className="space-y-4" onSubmit={handleSignup}>
                        <input
                            type="text"
                            placeholder="Enter your name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                        />

                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                        />

                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                        />

                        <input
                            type="password"
                            placeholder="Confirm your password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                        />

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gray-900 text-white py-3 rounded-md font-medium hover:bg-gray-800 transition disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {loading ? "Creating account..." : "Sign up"}
                        </button>
                    </form>

                    {/* Footer */}
                    <p className="mt-6 text-sm text-gray-600">
                        Already have an Account?{" "}
                        <Link to="/login" className="text-black font-medium underline">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </>
    );
};

export default Signup;
