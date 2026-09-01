"use client";

import Image from "next/image";
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
    <div className="flex min-h-screen bg-paper">
      {/* Left side - HD Hero Image */}
      <div className="relative hidden w-1/2 overflow-hidden lg:block">
        <Image
          src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1000&q=80"
          alt="Fitness and Athletics"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white">
          <h2 className="font-display text-5xl font-bold uppercase tracking-tight">ARTHVRA</h2>
          <p className="mt-3 text-lg font-light">Made to Move</p>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="flex w-full items-center justify-center lg:w-1/2">
        <div className="w-full max-w-sm px-6 sm:px-8">
          {/* Logo */}
          <div className="mb-8 flex justify-center lg:justify-start">
            <Image
              src="/logo-mark.svg"
              alt="ARTHVRA Athletics"
              width={56}
              height={56}
            />
          </div>

          <h1 className="font-display text-2xl font-bold uppercase tracking-tight">Welcome back</h1>
          <p className="mt-2 text-sm text-ash">Sign in to your ARTHVRA admin account.</p>

          {error && (
            <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
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
                placeholder="admin@arthvra.com"
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
            <button type="submit" disabled={loading} className="btn btn-primary w-full px-4 py-3 text-sm rounded-lg font-semibold disabled:opacity-60">
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-ash">
            New here?{" "}
            <Link href="/register" className="font-semibold text-ink hover:text-ember">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
