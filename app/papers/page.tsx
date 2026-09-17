"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import ReleaseTimer from "@/app/components/ReleaseTimer";

type QuestionPaper = {
  id: string;
  title: string;
  status: string;
  release_time: string | null;
  created_at: string;
  file_path: string;
};

export default function PapersPage() {
  const [papers, setPapers] = useState<QuestionPaper[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [currentTime, setCurrentTime] = useState(
    Date.now()
  );

  /*
   * Update the current time every second.
   * This makes the View button become active
   * automatically when the release time arrives.
   */
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  /*
   * Load only approved question papers.
   */
  async function loadPapers() {
    setLoading(true);
    setMessage("");

    const {
      data,
      error,
    } = await supabase
      .from("question_papers")
      .select(
        "id, title, status, release_time, created_at, file_path"
      )
      .eq("status", "approved")
      .order("release_time", {
        ascending: true,
      });

    if (error) {
      console.error("Error loading papers:", error.message);
      setMessage(error.message);
    } else {
      setPapers(data || []);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadPapers();
  }, []);

  /*
   * Check whether the question paper is released.
   */
  function isPaperReleased(
    paper: QuestionPaper
  ): boolean {
    if (paper.status !== "approved") {
      return false;
    }

    if (!paper.release_time) {
      return false;
    }

    const releaseTime = new Date(
      paper.release_time
    ).getTime();

    return currentTime >= releaseTime;
  }

  /*
   * Open the question paper using a temporary signed URL.
   */
  async function viewPaper(
    paper: QuestionPaper
  ) {
    setMessage("");

    if (paper.status !== "approved") {
      setMessage(
        "This question paper has not been approved."
      );
      return;
    }

    if (!paper.release_time) {
      setMessage(
        "This question paper has no release time."
      );
      return;
    }

    const releaseTime = new Date(
      paper.release_time
    ).getTime();

    if (Date.now() < releaseTime) {
      setMessage(
        "This question paper is not released yet."
      );
      return;
    }

    const {
      data,
      error,
    } = await supabase.storage
      .from("question-papers")
      .createSignedUrl(
        paper.file_path,
        300
      );

    if (error || !data?.signedUrl) {
      setMessage(
        error?.message ||
          "Unable to open the question paper."
      );
      return;
    }

    window.open(
      data.signedUrl,
      "_blank",
      "noopener,noreferrer"
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-blue-400">
              Secure Question Paper System
            </p>

            <h1 className="mt-2 text-4xl font-bold">
              Released Question Papers
            </h1>

            <p className="mt-2 text-slate-400">
              Only approved papers are displayed here.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={loadPapers}
              className="rounded-lg bg-blue-600 px-5 py-3 font-semibold transition hover:bg-blue-700"
            >
              Refresh
            </button>

            <Link
              href="/dashboard"
              className="rounded-lg bg-slate-700 px-5 py-3 font-semibold transition hover:bg-slate-600"
            >
              Dashboard
            </Link>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className="mt-6 rounded-lg border border-yellow-700 bg-yellow-950 p-4 text-yellow-200">
            {message}
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <p className="mt-10 text-slate-400">
            Loading question papers...
          </p>
        ) : papers.length === 0 ? (
          <div className="mt-10 rounded-2xl bg-slate-900 p-8 text-center text-slate-400">
            No approved question papers found.
          </div>
        ) : (
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {papers.map((paper) => {
              const released =
                isPaperReleased(paper);

              return (
                <div
                  key={paper.id}
                  className="rounded-2xl bg-slate-900 p-6 shadow-lg"
                >
                  {/* Paper title */}
                  <h2 className="text-2xl font-bold">
                    {paper.title}
                  </h2>

                  {/* Upload date */}
                  <p className="mt-2 text-sm text-slate-400">
                    Uploaded on{" "}
                    {new Date(
                      paper.created_at
                    ).toLocaleString()}
                  </p>

                  {/* Approval status */}
                  <div className="mt-4">
                    <span className="rounded-full bg-green-700 px-3 py-1 text-sm font-semibold text-green-100">
                      Approved
                    </span>
                  </div>

                  {/* Release timer */}
                  <div className="mt-5">
                    <ReleaseTimer
                      releaseTime={paper.release_time}
                      status={paper.status}
                    />
                  </div>

                  {/* View button */}
                  <button
                    onClick={() => viewPaper(paper)}
                    disabled={!released}
                    className="mt-6 rounded-lg bg-blue-600 px-5 py-3 font-semibold transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
                  >
                    {released
                      ? "View Question Paper"
                      : "Not Released Yet"}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}