"use client";

import Image from "next/image";
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
    <div className="flex min-h-screen bg-paper">
      {/* Left side - HD Hero Image */}
      <div className="relative hidden w-1/2 overflow-hidden lg:block">
        <Image
          src="https://images.unsplash.com/photo-1521575107034-e3a7a6b6ede9?w=1000&q=80"
          alt="Join ARTHVRA"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white">
          <h2 className="font-display text-5xl font-bold uppercase tracking-tight">Join Us</h2>
          <p className="mt-3 text-lg font-light">Start your fitness journey today</p>
        </div>
      </div>

      {/* Right side - Registration Form */}
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

          <h1 className="font-display text-2xl font-bold uppercase tracking-tight">Create account</h1>
          <p className="mt-2 text-sm text-ash">Join ARTHVRA ATHLETICS.</p>

          {error && (
            <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
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
            <button type="submit" disabled={loading} className="btn btn-primary w-full px-4 py-3 text-sm rounded-lg font-semibold disabled:opacity-60">
              {loading ? "Creating account…" : "Create Account"}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-ash">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-ink hover:text-ember">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
