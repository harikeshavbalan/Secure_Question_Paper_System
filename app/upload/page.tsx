"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function UploadPage() {
  const router = useRouter();

  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleUpload() {
    if (!file) {
      setMessage("Please select a PDF file.");
      return;
    }

    if (file.type !== "application/pdf") {
      setMessage("Only PDF files are allowed.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setMessage("Please log in first.");
        setLoading(false);
        return;
      }

      const filePath = `${user.id}/${Date.now()}-${file.name}`;

      const { error: uploadError } = await supabase.storage
        .from("question-papers")
        .upload(filePath, file);

      if (uploadError) {
        setMessage(uploadError.message);
        setLoading(false);
        return;
      }

      const { error: insertError } = await supabase
        .from("question_papers")
        .insert({
          title: file.name,
          file_path: filePath,
          status: "pending",
          created_by: user.id,
        });

      if (insertError) {
        setMessage(insertError.message);
        setLoading(false);
        return;
      }

      setMessage(
        "Question paper uploaded successfully. Waiting for admin approval."
      );

      setFile(null);

      setTimeout(() => {
        router.push("/papers");
        router.refresh();
      }, 1500);
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong while uploading.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-2xl">
        <div className="rounded-2xl bg-slate-900 p-8 shadow-lg">
          <h1 className="text-3xl font-bold">
            Upload Question Paper
          </h1>

          <p className="mt-3 text-slate-400">
            Anyone with an account can upload a question paper.
            An admin must approve it before it is released.
          </p>

          <div className="mt-8">
            <label className="mb-2 block font-semibold">
              Select PDF file
            </label>

            <input
              type="file"
              accept="application/pdf"
              onChange={(event) => {
                setFile(event.target.files?.[0] || null);
                setMessage("");
              }}
              className="block w-full rounded-lg border border-slate-700 bg-slate-800 p-3 text-white"
            />
          </div>

          <button
            onClick={handleUpload}
            disabled={loading}
            className="mt-6 rounded-lg bg-blue-600 px-6 py-3 font-semibold transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Uploading..." : "Upload Paper"}
          </button>

          {message && (
            <p className="mt-5 rounded-lg bg-slate-800 p-4 text-blue-300">
              {message}
            </p>
          )}

          <button
            onClick={() => router.push("/dashboard")}
            className="mt-6 block text-slate-400 underline hover:text-white"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </main>
  );
}