"use client";

import Link from "next/link";
import { useState } from "react";
import { Mail, Lock } from "lucide-react";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log({ email, password });
  }

  return (
    <main className="min-h-screen bg-[#f8f8fb] text-slate-900 flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white flex items-center justify-center font-bold text-2xl shadow-lg shadow-violet-500/20">
            M
          </div>
          <span className="text-4xl font-extrabold tracking-tight text-slate-900">
            MoodFLOW
          </span>
        </div>

        <div className="rounded-[32px] bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)] border border-slate-100 px-8 py-10">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
              Sign up for a new account
            </h1>
            <p className="mt-3 text-base text-slate-500">
              Welcome! Please enter your details to create a new account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Email address
              </label>
              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-4 focus-within:ring-2 focus-within:ring-violet-500/20 focus-within:border-violet-400 transition">
                <Mail className="w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent outline-none text-slate-700 placeholder:text-slate-400"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Password
              </label>
              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-4 focus-within:ring-2 focus-within:ring-violet-500/20 focus-within:border-violet-400 transition">
                <Lock className="w-5 h-5 text-slate-400" />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent outline-none text-slate-700 placeholder:text-slate-400"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Confirm Password
              </label>
              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-4 focus-within:ring-2 focus-within:ring-violet-500/20 focus-within:border-violet-400 transition">
                <Lock className="w-5 h-5 text-slate-400" />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent outline-none text-slate-700 placeholder:text-slate-400"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-4 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-500 py-4 text-white font-semibold text-lg shadow-[0_12px_30px_rgba(139,92,246,0.28)] hover:scale-[1.01] transition"
            >
              Sign Up
            </button>

            
          </form>

          <div className="flex items-center gap-4 my-8">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-sm text-slate-400 font-medium">or</span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          <button
            type="button"
            className="w-full rounded-2xl border border-slate-200 bg-white py-4 text-slate-700 font-medium hover:bg-slate-50 transition"
          >
            Sign up with Google
          </button>
          
          <div className="text-center mt-4">
            <Link
              href="/login"
              className="text-sm font-semibold text-violet-600 hover:text-violet-700 transition"
            >
              Sign in
            </Link>
          </div>
        </div>

        <div className="mt-10 h-5 w-full rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500 opacity-90" />
      </div>
    </main>
  );
}
