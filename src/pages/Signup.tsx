import React from "react";
import { Link } from "react-router-dom";

const Signup: React.FC = () => {
    return (
        <>
            <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
                <h1
                    className="text-2xl md:text-4xl font-bold tracking-tight uppercase whitespace-nowrap mb-5 "
                >
                    THE TECHYS
                    <span className="font-light italic text-stone-400 normal-case ml-1">
                        Studio
                    </span>
                </h1>
                <div className="w-full max-w-md text-center">
                    {/* Heading */}
                    <h1 className="mb-4 text-2xl md:text-4xl font-semibold text-gray-900 mb-2">
                        Sign up
                    </h1>


                    {/* Form */}
                    <form className="space-y-4">
                        <input
                            type="text"
                            placeholder="Enter your name"
                            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                        />

                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                        />

                        <input
                            type="password"
                            placeholder="Enter your password"
                            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                        />

                        <input
                            type="password"
                            placeholder="Confirm your password"
                            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                        />

                        <button
                            type="submit"
                            className="w-full bg-gray-900 text-white py-3 rounded-md font-medium hover:bg-gray-800 transition"
                        >
                            Sign up
                        </button>
                    </form>

                    {/* Footer */}
                    <p className="mt-6 text-sm text-gray-600">
                        Already have an Account?{" "}
                        <Link
                            to="/login"
                            className="text-black font-medium underline"
                        >
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </>
    );
};

export default Signup;       
