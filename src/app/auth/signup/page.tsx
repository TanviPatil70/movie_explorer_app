"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const router = useRouter();

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setEmail(val);
    setErrors((prev) => ({
      ...prev,
      email: validateEmail(val) ? "" : "Please enter a valid email",
    }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPassword(val);
    setErrors((prev) => ({
      ...prev,
      password:
        val.length >= 6 ? "" : "Password must be at least 6 characters long",
    }));
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Final validation before submit
    if (!validateEmail(email) || password.length < 6) {
      setErrors({
        email: !validateEmail(email) ? "Please enter a valid email" : "",
        password:
          password.length < 6 ? "Password must be at least 6 characters long" : "",
      });
      return;
    }

    setMessage("");
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Signup successful! Redirecting...");
        setEmail("");
        setPassword("");
        setName("");
        setErrors({});
        setTimeout(() => router.push("/auth/signin"), 1500);
      } else {
        setMessage(data.error || "Signup failed");
      }
    } catch (err) {
      setMessage("An error occurred. Please try again.");
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="bg-white dark:bg-gray-800 px-10 py-12 rounded-3xl shadow-2xl w-full max-w-md flex flex-col items-center border border-gray-200 dark:border-gray-700">
        {/* Brand */}
        <div className="mb-3 flex items-center gap-3">
          <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900 shadow">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L15 8H9L12 2Z" fill="#6366f1" />
              <rect x="6" y="10" width="12" height="10" rx="2" fill="#6366f1" />
            </svg>
          </span>
          <span className="text-2xl font-extrabold text-indigo-700 dark:text-indigo-200 tracking-tight select-none">CineFlix</span>
        </div>
        {/* Title */}
        <h1 className="text-3xl font-extrabold mb-6 text-gray-900 dark:text-white text-center tracking-tight">Create your account</h1>

        {message && (
          <p
            className={`mb-4 text-center ${
              message.startsWith("Signup successful") ? "text-green-600" : "text-red-500"
            }`}
          >
            {message}
          </p>
        )}

        <form onSubmit={onSubmit} className="w-full flex flex-col gap-4">
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={handleNameChange}
            className="p-3 rounded-xl bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-700 transition"
            required
          />
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={handleEmailChange}
            className={`p-3 rounded-xl bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white border ${
              errors.email ? "border-red-500 dark:border-red-400" : "border-gray-300 dark:border-gray-600"
            } focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-700 transition`}
            required
          />
          {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
          <input
            type="password"
            placeholder="Choose a password"
            value={password}
            onChange={handlePasswordChange}
            className={`p-3 rounded-xl bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white border ${
              errors.password ? "border-red-500 dark:border-red-400" : "border-gray-300 dark:border-gray-600"
            } focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-700 transition`}
            required
          />
          {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password}</p>}
          <button
            type="submit"
            disabled={!!errors.email || !!errors.password}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl w-full font-bold shadow-md hover:shadow-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Create Account
          </button>
        </form>

        {/* Existing account prompt */}
        <div className="text-center mt-6">
          <span className="text-gray-500 dark:text-gray-400 text-sm">
            Already have an account?
          </span>
          <button
            onClick={() => router.push("/auth/signin")}
            className="ml-2 text-indigo-600 dark:text-indigo-400 hover:underline font-bold text-sm"
            type="button"
          >
            Sign In
          </button>
        </div>
      </div>
    </main>
  );
}
