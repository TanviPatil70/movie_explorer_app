"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });
    if (res?.error) {
      setError("Invalid email or password");
    } else {
      router.push("/");
    }
  };

  return (
    <main className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="bg-white dark:bg-gray-800 px-10 py-12 rounded-3xl shadow-2xl w-full max-w-md flex flex-col items-center relative border border-gray-200 dark:border-gray-700">
        {/* Brand/Logo section */}
        <div className="mb-3 flex items-center gap-3">
          <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900 shadow">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L15 8H9L12 2Z" fill="#6366f1"/>
              <rect x="6" y="10" width="12" height="10" rx="2" fill="#6366f1"/>
            </svg>
          </span>
          <span className="text-2xl font-extrabold text-indigo-700 dark:text-indigo-200 tracking-tight select-none">CineFlix</span>
        </div>
        {/* Title */}
        <h1 className="text-3xl font-extrabold mb-2 text-gray-900 dark:text-white text-center tracking-tight">Sign In</h1>
        <p className="mb-6 text-gray-500 dark:text-gray-400 text-sm text-center">
          Welcome back! Please login to continue.
        </p>
        {error && <p className="mb-3 text-red-500 text-center">{error}</p>}
        <form onSubmit={onSubmit} className="w-full flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-3 rounded-xl bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-700 text-base transition"
            required
          />
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-3 rounded-xl bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-700 text-base transition"
            required
          />
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold shadow-md hover:shadow-xl text-base transition"
          >
            Sign In
          </button>
        </form>
        {/* New account prompt */}
        <div className="text-center mt-6">
          <span className="text-gray-500 dark:text-gray-400 text-sm">
            Don&apos;t have an account?
          </span>
          <button
            onClick={() => router.push("/auth/signup")}
            className="ml-2 text-indigo-600 dark:text-indigo-400 hover:underline font-bold text-sm"
            type="button"
          >
            Sign Up
          </button>
        </div>
      </div>
    </main>
  );
}
