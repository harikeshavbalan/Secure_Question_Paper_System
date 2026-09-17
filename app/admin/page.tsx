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

export default function AdminPage() {
  const [papers, setPapers] = useState<QuestionPaper[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [releaseTimes, setReleaseTimes] = useState<
    Record<string, string>
  >({});

  async function loadPapers() {
    setLoading(true);
    setMessage("");

    const { data, error } = await supabase
      .from("question_papers")
      .select(
        "id, title, status, release_time, created_at, file_path"
      )
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.error(error);
      setMessage(error.message);
    } else {
      setPapers(data || []);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadPapers();
  }, []);

  async function updatePaperStatus(
    paperId: string,
    status: "approved" | "rejected" | "draft"
  ) {
    setMessage("");

    const { error } = await supabase
      .from("question_papers")
      .update({
        status,
      })
      .eq("id", paperId);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage(`Paper ${status} successfully.`);
    loadPapers();
  }

  async function scheduleRelease(paperId: string) {
    const selectedTime = releaseTimes[paperId];

    if (!selectedTime) {
      setMessage("Please select a release date and time.");
      return;
    }

    const releaseDate = new Date(selectedTime);

    if (releaseDate.getTime() <= Date.now()) {
      setMessage("Release time must be in the future.");
      return;
    }

    const { error } = await supabase
      .from("question_papers")
      .update({
        status: "approved",
        release_time: releaseDate.toISOString(),
      })
      .eq("id", paperId);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Paper approved and release time scheduled.");
    loadPapers();
  }

  async function deletePaper(paperId: string, filePath: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this paper?"
    );

    if (!confirmed) return;

    const { error: storageError } = await supabase.storage
      .from("question-papers")
      .remove([filePath]);

    if (storageError) {
      console.error("Storage delete error:", storageError);
    }

    const { error } = await supabase
      .from("question_papers")
      .delete()
      .eq("id", paperId);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Paper deleted successfully.");
    loadPapers();
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-blue-400">
              Secure Question Paper System
            </p>

            <h1 className="mt-2 text-4xl font-bold">
              Admin Panel
            </h1>

            <p className="mt-2 text-slate-400">
              Approve, reject, edit, delete and schedule papers.
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              href="/dashboard"
              className="rounded-lg bg-slate-700 px-5 py-3 font-semibold hover:bg-slate-600"
            >
              Dashboard
            </Link>

            <button
              onClick={loadPapers}
              className="rounded-lg bg-blue-600 px-5 py-3 font-semibold hover:bg-blue-700"
            >
              Refresh
            </button>
          </div>
        </div>

        {message && (
          <div className="mt-6 rounded-lg border border-blue-700 bg-blue-950 p-4 text-blue-200">
            {message}
          </div>
        )}

        <div className="mt-10 overflow-x-auto rounded-2xl bg-slate-900 shadow-lg">
          <table className="w-full min-w-[1100px] border-collapse">
            <thead>
              <tr className="bg-slate-800 text-left">
                <th className="p-4">Title</th>
                <th className="p-4">Status</th>
                <th className="p-4">Created At</th>
                <th className="p-4">Release Timer</th>
                <th className="p-4">Schedule Release</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="p-6 text-center text-slate-400"
                  >
                    Loading papers...
                  </td>
                </tr>
              ) : papers.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="p-6 text-center text-slate-400"
                  >
                    No question papers found.
                  </td>
                </tr>
              ) : (
                papers.map((paper) => (
                  <tr
                    key={paper.id}
                    className="border-t border-slate-700"
                  >
                    <td className="p-4 font-semibold">
                      {paper.title}
                    </td>

                    <td className="p-4">
                      <span
                        className={`rounded-full px-3 py-1 text-sm font-semibold ${
                          paper.status === "approved"
                            ? "bg-green-900 text-green-200"
                            : paper.status === "rejected"
                            ? "bg-red-900 text-red-200"
                            : "bg-yellow-900 text-yellow-200"
                        }`}
                      >
                        {paper.status}
                      </span>
                    </td>

                    <td className="p-4 text-slate-400">
                      {new Date(
                        paper.created_at
                      ).toLocaleString()}
                    </td>

                    <td className="p-4">
                      <ReleaseTimer
                        releaseTime={paper.release_time}
                        status={paper.status}
                      />
                    </td>

                    <td className="p-4">
                      <div className="flex flex-col gap-2">
                        <input
                          type="datetime-local"
                          value={
                            releaseTimes[paper.id] || ""
                          }
                          onChange={(event) =>
                            setReleaseTimes({
                              ...releaseTimes,
                              [paper.id]: event.target.value,
                            })
                          }
                          className="rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-white"
                        />

                        <button
                          onClick={() =>
                            scheduleRelease(paper.id)
                          }
                          className="rounded-lg bg-purple-600 px-4 py-2 font-semibold hover:bg-purple-700"
                        >
                          Approve & Schedule
                        </button>
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() =>
                            updatePaperStatus(
                              paper.id,
                              "approved"
                            )
                          }
                          className="rounded-lg bg-green-600 px-3 py-2 font-semibold hover:bg-green-700"
                        >
                          Approve
                        </button>

                        <button
                          onClick={() =>
                            updatePaperStatus(
                              paper.id,
                              "rejected"
                            )
                          }
                          className="rounded-lg bg-red-600 px-3 py-2 font-semibold hover:bg-red-700"
                        >
                          Reject
                        </button>

                        <button
                          onClick={() =>
                            updatePaperStatus(
                              paper.id,
                              "draft"
                            )
                          }
                          className="rounded-lg bg-yellow-600 px-3 py-2 font-semibold hover:bg-yellow-700"
                        >
                          Draft
                        </button>

                        <button
                          onClick={() =>
                            deletePaper(
                              paper.id,
                              paper.file_path
                            )
                          }
                          className="rounded-lg bg-slate-600 px-3 py-2 font-semibold hover:bg-slate-500"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-8 rounded-2xl border border-yellow-700 bg-yellow-950 p-6">
          <h2 className="text-xl font-bold text-yellow-300">
            Security Notice
          </h2>

          <p className="mt-2 text-yellow-200">
            The timer shown here is a user interface countdown.
            Database access policies must also prevent viewers
            from accessing papers before the release time.
          </p>
        </div>
      </div>
    </main>
  );
}