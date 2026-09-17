"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-6 border-b border-gray-800">
        <h1 className="text-2xl font-bold text-blue-400">
          SecurePaper
        </h1>

        <div className="flex gap-4">
          <button
            onClick={() => router.push("/login")}
            className="rounded-lg border border-gray-600 px-5 py-2 hover:bg-gray-800"
          >
            Login
          </button>

          <button
            onClick={() => router.push("/login")}
            className="rounded-lg bg-blue-600 px-5 py-2 hover:bg-blue-700"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex min-h-[75vh] flex-col items-center justify-center px-6 text-center">
        <div className="mb-5 rounded-full border border-blue-500/40 bg-blue-500/10 px-4 py-2 text-sm text-blue-300">
          Secure Management of Examination Question Papers
        </div>

        <h2 className="max-w-4xl text-4xl font-extrabold leading-tight md:text-6xl">
          Protect Question Papers.
          <span className="text-blue-500"> Prevent Leakage.</span>
        </h2>

        <p className="mt-6 max-w-2xl text-lg text-gray-400">
          A secure digital platform for uploading, managing, storing,
          and controlling examination question papers with authentication
          and access control.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <button
            onClick={() => router.push("/login")}
            className="rounded-lg bg-blue-600 px-8 py-3 font-semibold hover:bg-blue-700"
          >
            Start Securely
          </button>

          <button
            onClick={() => router.push("/dashboard")}
            className="rounded-lg border border-gray-600 px-8 py-3 font-semibold hover:bg-gray-800"
          >
            View Dashboard
          </button>
        </div>
      </section>

      {/* Features */}
      <section className="grid gap-6 px-8 pb-16 md:grid-cols-3">
        <div className="rounded-xl border border-gray-800 bg-gray-950 p-6">
          <div className="mb-4 text-3xl">🔐</div>
          <h3 className="mb-2 text-xl font-bold">Secure Authentication</h3>
          <p className="text-gray-400">
            Only authenticated users can access the application.
          </p>
        </div>

        <div className="rounded-xl border border-gray-800 bg-gray-950 p-6">
          <div className="mb-4 text-3xl">📄</div>
          <h3 className="mb-2 text-xl font-bold">Question Paper Management</h3>
          <p className="text-gray-400">
            Upload and manage examination question papers digitally.
          </p>
        </div>

        <div className="rounded-xl border border-gray-800 bg-gray-950 p-6">
          <div className="mb-4 text-3xl">🛡️</div>
          <h3 className="mb-2 text-xl font-bold">Controlled Access</h3>
          <p className="text-gray-400">
            Manage access to sensitive examination documents.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-6 text-center text-gray-500">
        © 2026 SecurePaper. Academic Project.
      </footer>
    </main>
  );
}