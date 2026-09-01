"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [devResetUrl, setDevResetUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setDevResetUrl("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not send reset link.");
        return;
      }
      setMessage(data.message || "If an account exists, a reset link has been sent.");
      if (data.devResetUrl) setDevResetUrl(data.devResetUrl);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-max flex min-h-[70vh] items-center justify-center py-12">
      <div className="w-full max-w-md rounded-2xl border border-line bg-paper p-8">
        <h1 className="font-display text-2xl font-bold uppercase tracking-tight">
          Forgot password
        </h1>
        <p className="mt-1 text-sm text-ash">Enter your email and we will send a reset link.</p>

        {error && (
          <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
        )}
        {message && (
          <p className="mt-4 rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            {message}
          </p>
        )}
        {devResetUrl && (
          <p className="mt-3 break-all text-sm">
            <Link href={devResetUrl} className="font-semibold text-ember hover:underline">
              Open reset link
            </Link>
          </p>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="label" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
              autoComplete="email"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full px-5 py-3 text-sm rounded-lg disabled:opacity-60"
          >
            {loading ? "Sending…" : "Send reset link"}
          </button>
        </form>
        <p className="mt-5 text-center text-sm text-ash">
          <Link href="/login" className="font-semibold text-ink hover:text-ember">
            Back to sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
