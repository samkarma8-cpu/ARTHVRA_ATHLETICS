"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  return (
    <Suspense fallback={<p className="text-center text-sm py-20">Loading…</p>}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/account";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Login failed.");
        return;
      }
      router.push(next);
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-max flex min-h-[70vh] items-center justify-center py-12">
      <div className="w-full max-w-md rounded-2xl border border-line bg-paper p-8">
        <h1 className="font-display text-2xl font-bold uppercase tracking-tight">Welcome back</h1>
        <p className="mt-1 text-sm text-ash">Sign in to your ARTHVRA account.</p>

        {error && (
          <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="label" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
              autoComplete="email"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <div className="flex items-center justify-between">
              <label className="label" htmlFor="password">Password</label>
              <Link href="/forgot-password" className="text-xs font-medium text-ink hover:text-ember">
                Forgot password?
              </Link>
            </div>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
              autoComplete="current-password"
              placeholder="••••••••"
            />
          </div>
          <button type="submit" disabled={loading} className="btn btn-primary w-full px-5 py-3 text-sm rounded-lg disabled:opacity-60">
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-ash">
          New here?{" "}
          <Link href="/register" className="font-semibold text-ink hover:text-ember">Create an account</Link>
        </p>
      </div>
    </div>
  );
}
