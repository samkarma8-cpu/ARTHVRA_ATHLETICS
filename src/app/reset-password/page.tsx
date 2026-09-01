"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<p className="py-20 text-center text-sm">Loading…</p>}>
      <ResetPasswordForm />
    </Suspense>
  );
}

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not reset password.");
        return;
      }
      router.push("/account");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="container-max flex min-h-[70vh] items-center justify-center py-12">
        <div className="w-full max-w-md rounded-2xl border border-line p-8 text-center">
          <h1 className="font-display text-2xl font-bold uppercase">Invalid link</h1>
          <p className="mt-2 text-sm text-ash">This reset link is missing a token.</p>
          <Link href="/forgot-password" className="btn btn-primary mt-6 px-5 py-2.5 text-sm rounded-lg">
            Request a new link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-max flex min-h-[70vh] items-center justify-center py-12">
      <div className="w-full max-w-md rounded-2xl border border-line bg-paper p-8">
        <h1 className="font-display text-2xl font-bold uppercase tracking-tight">
          Set a new password
        </h1>
        {error && (
          <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
        )}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="label" htmlFor="password">
              New password
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
              autoComplete="new-password"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full px-5 py-3 text-sm rounded-lg disabled:opacity-60"
          >
            {loading ? "Saving…" : "Update password"}
          </button>
        </form>
      </div>
    </div>
  );
}
