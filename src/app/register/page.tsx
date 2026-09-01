"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Registration failed.");
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

  return (
    <div className="container-max flex min-h-[70vh] items-center justify-center py-12">
      <div className="w-full max-w-md rounded-2xl border border-line bg-paper p-8">
        <h1 className="font-display text-2xl font-bold uppercase tracking-tight">Create account</h1>
        <p className="mt-1 text-sm text-ash">Join ARTHVRA ATHLETICS.</p>

        {error && (
          <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="label" htmlFor="name">Full name</label>
            <input
              id="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input"
              autoComplete="name"
              placeholder="John Kamau"
            />
          </div>
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
            <label className="label" htmlFor="phone">Phone (optional)</label>
            <input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="input"
              autoComplete="tel"
              placeholder="07xxxxxxxx"
            />
          </div>
          <div>
            <label className="label" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
              autoComplete="new-password"
              placeholder="At least 6 characters"
            />
          </div>
          <button type="submit" disabled={loading} className="btn btn-primary w-full px-5 py-3 text-sm rounded-lg disabled:opacity-60">
            {loading ? "Creating account…" : "Create Account"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-ash">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-ink hover:text-ember">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
