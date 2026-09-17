"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type UserRole = "admin" | "uploader" | "viewer";

export default function DashboardPage() {
  const router = useRouter();

  const [role, setRole] = useState<UserRole | null>(null);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    loadUserDetails();
  }, []);

  async function loadUserDetails() {
    setLoading(true);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      router.replace("/login");
      return;
    }

    setEmail(user.email || "");

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profileError) {
      console.error("Profile loading error:", profileError.message);
      setLoading(false);
      return;
    }

    setRole(profile.role as UserRole);
    setLoading(false);
  }

  async function handleLogout() {
    setLoggingOut(true);

    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Logout error:", error.message);
      setLoggingOut(false);
      return;
    }

    router.replace("/login");
    router.refresh();
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="text-center">
          <div className="text-xl font-semibold">
            Loading dashboard...
          </div>

          <p className="mt-2 text-slate-400">
            Checking your account permissions.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-blue-400">
              Secure Question Paper System
            </p>

            <h1 className="mt-2 text-4xl font-bold">
              Dashboard
            </h1>

            <p className="mt-2 text-slate-400">
              Manage examination question papers securely.
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <span className="text-sm text-slate-400">
                Logged in as:
              </span>

              <span className="text-sm font-semibold text-white">
                {email}
              </span>

              <span
                className={`rounded-full px-3 py-1 text-sm font-bold ${
                  role === "admin"
                    ? "bg-purple-600 text-white"
                    : role === "uploader"
                    ? "bg-blue-600 text-white"
                    : "bg-green-600 text-white"
                }`}
              >
                {role?.toUpperCase()}
              </span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="rounded-lg bg-red-600 px-5 py-3 font-semibold transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loggingOut ? "Logging out..." : "Logout"}
          </button>
        </div>

        {/* Admin Dashboard */}
        {role === "admin" && (
          <section className="mt-12">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-purple-300">
                Admin Functions
              </h2>

              <p className="mt-2 text-slate-400">
                You can manage, approve, reject, edit and delete question
                papers.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {/* View All Papers */}
              <div className="rounded-2xl bg-slate-900 p-6 shadow-lg">
                <h3 className="text-xl font-bold">
                  All Question Papers
                </h3>

                <p className="mt-3 text-slate-400">
                  View every uploaded question paper and its status.
                </p>

                <Link
                  href="/admin"
                  className="mt-6 inline-block rounded-lg bg-purple-600 px-5 py-3 font-semibold transition hover:bg-purple-700"
                >
                  Manage Papers
                </Link>
              </div>

              {/* Approve/Reject */}
              <div className="rounded-2xl bg-slate-900 p-6 shadow-lg">
                <h3 className="text-xl font-bold">
                  Approve or Reject
                </h3>

                <p className="mt-3 text-slate-400">
                  Review uploaded papers and approve or reject them.
                </p>

                <Link
                  href="/admin"
                  className="mt-6 inline-block rounded-lg bg-green-600 px-5 py-3 font-semibold transition hover:bg-green-700"
                >
                  Review Papers
                </Link>
              </div>

              {/* Edit/Delete */}
              <div className="rounded-2xl bg-slate-900 p-6 shadow-lg">
                <h3 className="text-xl font-bold">
                  Edit and Delete
                </h3>

                <p className="mt-3 text-slate-400">
                  Modify paper details or delete uploaded papers.
                </p>

                <Link
                  href="/admin"
                  className="mt-6 inline-block rounded-lg bg-red-600 px-5 py-3 font-semibold transition hover:bg-red-700"
                >
                  Admin Controls
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Uploader Dashboard */}
        {role === "uploader" && (
          <section className="mt-12">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-blue-300">
                Uploader Functions
              </h2>

              <p className="mt-2 text-slate-400">
                You can upload question papers and view their status.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Upload */}
              <div className="rounded-2xl bg-slate-900 p-6 shadow-lg">
                <h3 className="text-xl font-bold">
                  Upload Question Paper
                </h3>

                <p className="mt-3 text-slate-400">
                  Upload a question paper for admin verification.
                </p>

                <Link
                  href="/upload"
                  className="mt-6 inline-block rounded-lg bg-blue-600 px-5 py-3 font-semibold transition hover:bg-blue-700"
                >
                  Upload Paper
                </Link>
              </div>

              {/* View Papers */}
              <div className="rounded-2xl bg-slate-900 p-6 shadow-lg">
                <h3 className="text-xl font-bold">
                  View Question Papers
                </h3>

                <p className="mt-3 text-slate-400">
                  View uploaded papers and their approval status.
                </p>

                <Link
                  href="/papers"
                  className="mt-6 inline-block rounded-lg bg-green-600 px-5 py-3 font-semibold transition hover:bg-green-700"
                >
                  View Papers
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Viewer Dashboard */}
        {role === "viewer" && (
          <section className="mt-12">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-green-300">
                Viewer Functions
              </h2>

              <p className="mt-2 text-slate-400">
                You can only view question papers approved by the admin.
              </p>
            </div>

            <div className="max-w-xl rounded-2xl bg-slate-900 p-6 shadow-lg">
              <h3 className="text-xl font-bold">
                Approved Question Papers
              </h3>

              <p className="mt-3 text-slate-400">
                Access question papers that have been approved by the admin.
              </p>

              <Link
                href="/papers"
                className="mt-6 inline-block rounded-lg bg-green-600 px-5 py-3 font-semibold transition hover:bg-green-700"
              >
                View Approved Papers
              </Link>
            </div>
          </section>
        )}

        {/* Unknown Role */}
        {!role && (
          <div className="mt-12 rounded-2xl border border-red-700 bg-red-950 p-6">
            <h2 className="text-xl font-bold text-red-300">
              Role Not Assigned
            </h2>

            <p className="mt-2 text-red-200">
              Your account does not have a valid role. Contact the
              administrator.
            </p>
          </div>
        )}

        {/* Security Notice */}
        <div className="mt-12 rounded-2xl border border-yellow-700 bg-yellow-950 p-6">
          <h2 className="text-xl font-bold text-yellow-300">
            Security Notice
          </h2>

          <p className="mt-2 text-yellow-200">
            Uploaded question papers must be reviewed by the administrator
            before they are visible to viewers.
          </p>

          <p className="mt-2 text-yellow-200">
            This is an academic project demo. Do not upload real examination
            question papers yet.
          </p>
        </div>
      </div>
    </main>
  );
}