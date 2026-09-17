"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(event: React.FormEvent) {
    event.preventDefault();

    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#020617] px-6">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md rounded-2xl bg-slate-900 p-8 shadow-xl"
      >
        <h1 className="text-3xl font-bold text-white">
          Login
        </h1>

        <p className="mt-2 text-slate-400">
          Secure Question Paper System
        </p>

        <label className="mt-8 block text-sm font-semibold text-white">
          Email
        </label>

        <input
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="admin@example.com"
          className="mt-2 w-full rounded-lg bg-slate-800 p-3 text-white outline-none"
        />

        <label className="mt-5 block text-sm font-semibold text-white">
          Password
        </label>

        <input
          type="password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Enter password"
          className="mt-2 w-full rounded-lg bg-slate-800 p-3 text-white outline-none"
        />

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-lg bg-blue-600 px-5 py-3 font-bold text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {message && (
          <p className="mt-4 text-red-400">
            {message}
          </p>
        )}

        <Link
          href="/"
          className="mt-6 block text-center text-blue-400 hover:text-blue-300"
        >
          ← Back to Home
        </Link>
      </form>
    </main>
  );
}