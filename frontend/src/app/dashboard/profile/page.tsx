"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

import Navbar from "@/components/Navbar";

export default function ProfilePage() {
  const [firstName, setFirstName] = useState("Jordan");
  const [lastName, setLastName] = useState("Davis");
  const [displayName, setDisplayName] = useState("@jordan.d");
  const [bio, setBio] = useState("");
  const [email, setEmail] = useState("jordan.davis@email.com");
  
  const [saved, setSaved] = useState(true);

  useEffect(() => {
    if (saved) {
      const timer = setTimeout(() => setSaved(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [saved]);

  const navItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Mood log", href: "#" },
    { label: "Trends", href: "#" },
    { label: "Insights", href: "#" },
    { label: "Profile", href: "/dashboard/profile", active: true },
    { label: "Settings", href: "#" },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50 font-sans flex flex-col transition-colors duration-300">
      <Navbar />

      <div className="flex flex-1 max-w-7xl mx-auto w-full pt-24">
        {/* Sidebar */}
        <aside className="w-64 border-r border-slate-200 dark:border-slate-800 py-8 flex-col hidden md:flex shrink-0">
          <nav className="flex flex-col space-y-1 px-4">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  item.active
                    ? "bg-brand-600/10 text-brand-600 dark:text-brand-400"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200"
                }`}
              >
                <div className={`w-1.5 h-1.5 rounded-full ${item.active ? "bg-brand-600 dark:bg-brand-400" : "bg-slate-300 dark:bg-slate-600"}`} />
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 px-6 py-8 md:px-12 md:py-10">
          <div className="max-w-[700px]">
            {/* Success Banner */}
            <div className={`overflow-hidden transition-all duration-300 ${saved ? "max-h-16 opacity-100 mb-8" : "max-h-0 opacity-0 mb-0"}`}>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-600/10 border border-brand-600/20 rounded-full text-sm text-brand-700 dark:text-brand-400 font-medium">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-600 dark:bg-brand-400" />
                Changes saved successfully
              </div>
            </div>

            <div className="mb-8 pl-1">
              <h1 className="text-2xl md:text-3xl font-display font-semibold mb-2">Your profile</h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Manage how you appear in MoodFLOW</p>
            </div>

            {/* Profile Picture Section */}
            <section className="mb-8 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 bg-slate-50/50 dark:bg-slate-900/30">
              <h2 className="text-[11px] font-bold tracking-widest text-slate-500 uppercase mb-6">Profile Picture</h2>
              <div className="flex items-center gap-6">
                <div className="relative shrink-0">
                  <div className="w-20 h-20 rounded-full bg-brand-100 dark:bg-brand-900/40 text-brand-600 dark:text-brand-400 flex items-center justify-center text-2xl font-display font-bold shadow-inner">
                    JD
                  </div>
                  <div className="absolute bottom-0 right-0 w-6 h-6 bg-brand-600 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900 text-white">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="text-base font-semibold mb-1 text-slate-900 dark:text-slate-100">Jordan Davis</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Member since Jan 2025</p>
                  <div className="flex flex-wrap gap-3">
                    <button className="px-4 py-1.5 bg-brand-600 hover:bg-brand-500 text-white text-sm font-medium rounded-lg transition-colors shadow-sm">
                      Upload photo
                    </button>
                    <button className="px-4 py-1.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300 text-sm font-medium rounded-lg transition-colors">
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Display Name Section */}
            <section className="mb-8 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 bg-slate-50/50 dark:bg-slate-900/30">
              <h2 className="text-[11px] font-bold tracking-widest text-slate-500 uppercase mb-6">Display Name</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">First name</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full bg-white dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-slate-200 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Last name</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full bg-white dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-slate-200 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2 mb-6">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Display name</label>
                <div className="relative">
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    maxLength={30}
                    className="w-full bg-white dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-slate-200 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"
                  />
                </div>
                <p className="text-right text-[10px] text-slate-500 mt-1 font-medium">{displayName.length} / 30</p>
              </div>

              <div className="space-y-2 mb-6">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                  Bio <span className="text-slate-400 font-normal ml-1">optional</span>
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us a little about yourself..."
                  rows={3}
                  maxLength={160}
                  className="w-full bg-white dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-slate-200 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 resize-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600"
                />
                <p className="text-right text-[10px] text-slate-500 mt-1 font-medium">{bio.length} / 160</p>
              </div>

              <div className="space-y-2 mb-8 border-b border-slate-200 dark:border-slate-800 pb-8">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Email address</label>
                <input
                  type="email"
                  value={email}
                  disabled
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-500 dark:text-slate-500 cursor-not-allowed outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button className="px-5 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                  Discard
                </button>
                <button className="px-5 py-2.5 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-500 rounded-xl transition-all shadow-lg shadow-brand-600/20 active:scale-95">
                  Save changes
                </button>
              </div>
            </section>

            {/* Danger Zone */}
            <section className="mb-20 border border-rose-200 dark:border-rose-900/30 rounded-2xl p-6 md:p-8 bg-rose-50/30 dark:bg-rose-950/10">
              <h2 className="text-[11px] font-bold tracking-widest text-rose-600 dark:text-rose-500 uppercase mb-4">Danger Zone</h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 max-w-lg">
                Deleting your account is permanent. All your mood history, trends, and insights will be erased and cannot be recovered.
              </p>
              <button className="px-5 py-2.5 text-sm font-semibold text-rose-600 dark:text-rose-400 bg-white dark:bg-slate-950 border border-rose-200 dark:border-rose-900/50 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-colors">
                Delete account
              </button>
            </section>

          </div>
        </main>
      </div>
    </div>
  );
}
