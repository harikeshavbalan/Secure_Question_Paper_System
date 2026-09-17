"use client";

import { useEffect, useState } from "react";

type ReleaseTimerProps = {
  releaseTime: string | null;
  status: string;
};

export default function ReleaseTimer({
  releaseTime,
  status,
}: ReleaseTimerProps) {
  const [timeLeft, setTimeLeft] = useState("");
  const [released, setReleased] = useState(false);

  useEffect(() => {
    function calculateTimeLeft() {
      if (status !== "approved") {
        setTimeLeft("Not approved");
        setReleased(false);
        return;
      }

      if (!releaseTime) {
        setTimeLeft("Release time not scheduled");
        setReleased(false);
        return;
      }

      const now = Date.now();
      const release = new Date(releaseTime).getTime();
      const difference = release - now;

      if (difference <= 0) {
        setTimeLeft("Released");
        setReleased(true);
        return;
      }

      setReleased(false);

      const days = Math.floor(
        difference / (1000 * 60 * 60 * 24)
      );

      const hours = Math.floor(
        (difference / (1000 * 60 * 60)) % 24
      );

      const minutes = Math.floor(
        (difference / (1000 * 60)) % 60
      );

      const seconds = Math.floor(
        (difference / 1000) % 60
      );

      setTimeLeft(
        `${days}d ${hours}h ${minutes}m ${seconds}s`
      );
    }

    calculateTimeLeft();

    const timer = setInterval(
      calculateTimeLeft,
      1000
    );

    return () => clearInterval(timer);
  }, [releaseTime, status]);

  return (
    <div
      className={`rounded-lg border p-4 ${
        released
          ? "border-green-700 bg-green-950"
          : "border-yellow-700 bg-yellow-950"
      }`}
    >
      <p
        className={`text-sm font-semibold ${
          released
            ? "text-green-300"
            : "text-yellow-300"
        }`}
      >
        {released ? "Question Paper Released" : "Release Countdown"}
      </p>

      <p
        className={`mt-2 text-xl font-bold ${
          released
            ? "text-green-200"
            : "text-yellow-200"
        }`}
      >
        {timeLeft}
      </p>

      {releaseTime && (
        <p className="mt-2 text-sm text-slate-400">
          Release time:{" "}
          {new Date(releaseTime).toLocaleString()}
        </p>
      )}
    </div>
  );
}