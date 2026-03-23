"use client"; 
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import DashboardHeader from "@/components/DashboardHeader";

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null); // use this to define the current user
  const [selectedMood, setSelectedMood] = useState<any>(null);
  const [notes, setNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [apiMessage, setApiMessage] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
  
    return () => unsubscribe();
  }, []);

  const handleSave = async () => {
    if (!selectedMood && !notes) return;
    setIsSaving(true);
    setApiMessage(null);
    setApiError(null);
    try {
      const emojiMap: Record<string, number> = {
        "Very Bad": 1, "Bad": 2, "Neutral": 3, "Good": 4, "Excellent": 5
      };
      const res = await fetch("http://localhost:3001/analyzeMood", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          text: notes, 
          emojiScore: selectedMood ? emojiMap[selectedMood.label] : 3 
        })
      });
      if (!res.ok) throw new Error("Server Error");
      const data = await res.json();
      setApiMessage(`Successfully analyzed! Mood score: ${data.moodScore}`);
      setSelectedMood(null);
      setNotes("");
    } catch (err: any) {
      setApiError("Failed to save entry");
    } finally {
      setIsSaving(false);
    }
  };

  const moods = [
    { label: "Very Bad", symbol: "😞", color: "border-amber-300" },
    { label: "Bad", symbol: "🙁", color: "border-rose-300" },
    { label: "Neutral", symbol: "😐", color: "border-slate-300" },
    { label: "Good", symbol: "🙂", color: "border-emerald-300" },
    { label: "Excellent", symbol: "😄", color: "border-indigo-300" }
  ];

  const recentEntries = [
    {
      date: "March 1, 2026",
      mood: "😄",
      text: "Finished my CSC-456 project proposal. Feeling accomplished!"
    },
    {
      date: "February 20, 2026",
      mood: "🙂",
      text: "Studied for midterms. Long day but made progress."
    },
    {
      date: "February 28, 2026",
      mood: "😐",
      text: "Had a productive study session at the library."
    }
  ];

  const ranges = ["7 Days", "30 Days", "90 Days", "All Time"];

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-50">
      <DashboardHeader />

      <div className="pt-20 pb-16 px-6">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em]">
                Dashboard
              </p>
              <h1 className="mt-2 text-3xl md:text-4xl font-display font-bold tracking-tight">
                Welcome back, Student
              </h1>
              <p className="mt-2 text-slate-600 dark:text-slate-400 text-sm md:text-base">
                Log today&apos;s mood and review how you&apos;ve been feeling over time.
              </p>
            </div>
            <div className="self-start md:self-auto px-4 py-2 rounded-full bg-slate-900 text-slate-50 text-xs font-semibold tracking-wide uppercase">
              MoodFLOW · Dashboard
            </div>
          </div>

          {/* Main content */}
          <div className="grid lg:grid-cols-[minmax(0,1.4fr),minmax(0,1fr)] gap-8 xl:gap-12">
            {/* Left column: log + recent */}
            <div className="space-y-8">
              {/* Log your mood */}
              <section className="glass rounded-3xl bg-white/80 dark:bg-slate-950/80 border border-slate-200/80 dark:border-slate-800/80 shadow-lg shadow-slate-900/5">
                <div className="px-6 pt-6 pb-5 border-b border-slate-100 dark:border-slate-900 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg md:text-xl font-display font-semibold flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-brand-500" />
                      Log Your Mood
                    </h2>
                    <p className="mt-1 text-xs md:text-sm text-slate-500 dark:text-slate-400">
                      Capture how you&apos;re feeling and what you worked on today.
                    </p>
                  </div>
                </div>

                <div className="px-6 pt-6 pb-6 space-y-6">
                  {/* Mood scale */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm font-medium">How are you feeling today?</p>
                      <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">
                        Very Bad — Excellent
                      </p>
                    </div>
                    <div className="grid grid-cols-5 gap-3">
                      {moods.map((mood) => (
                        <button
                          key={mood.label}
                          type="button"
                          onClick={() => setSelectedMood(mood)}
                          className={`relative flex flex-col items-center justify-center gap-2 rounded-2xl border-2 ${mood.color} bg-slate-50/80 dark:bg-slate-950/60 py-4 text-sm font-medium hover:-translate-y-1 hover:shadow-lg transition-all ${selectedMood?.label === mood.label ? 'ring-2 ring-brand-500 scale-105' : ''}`}
                        >
                          <span className="text-xl">{mood.symbol}</span>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400">
                            {mood.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="notes">
                      What did you work on today?
                    </label>
                    <textarea
                      id="notes"
                      rows={4}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Write your notes here..."
                      className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 px-4 py-3 text-sm resize-none placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/60 focus:border-brand-500/60"
                    />
                  </div>

                  {/* Date + action */}
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex items-center gap-3 text-sm">
                      <div className="px-3 py-2 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950/60">
                        <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                          Date
                        </p>
                        <p className="text-sm font-medium">Today · March 2, 2026</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <button 
                        onClick={handleSave} 
                        disabled={isSaving}
                        className="inline-flex items-center justify-center px-6 md:px-8 py-3 rounded-2xl text-sm md:text-base font-semibold text-white bg-gradient-brand shadow-lg shadow-brand-600/30 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSaving ? "Saving..." : "Save Entry"}
                      </button>
                      {apiMessage && <p className="text-sm text-emerald-600 font-medium">{apiMessage}</p>}
                      {apiError && <p className="text-sm text-red-500 font-medium">{apiError}</p>}
                    </div>
                  </div>
                </div>
              </section>

              {/* Recent entries */}
              <section className="glass rounded-3xl bg-white/80 dark:bg-slate-950/80 border border-slate-200/80 dark:border-slate-800/80 shadow-lg shadow-slate-900/5">
                <div className="px-6 pt-6 pb-4 border-b border-slate-100 dark:border-slate-900 flex items-center justify-between">
                  <h2 className="text-lg font-display font-semibold flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    Recent Entries
                  </h2>
                  <span className="text-xs text-slate-400">Last 3 days logged</span>
                </div>

                <div className="px-6 py-4 space-y-4">
                  {recentEntries.map((entry, idx) => (
                    <article
                      key={idx}
                      className="flex items-start gap-4 rounded-2xl border border-slate-100 dark:border-slate-900 bg-slate-50/80 dark:bg-slate-950/60 px-4 py-3"
                    >
                      <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-2xl bg-white dark:bg-slate-900 text-xl shadow-sm">
                        {entry.mood}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-3 mb-1.5">
                          <p className="text-xs font-semibold px-2 py-1 rounded-full bg-slate-900 text-slate-50">
                            {entry.date}
                          </p>
                          <div className="flex items-center gap-1.5 text-slate-400">
                            <div className="w-6 h-6 rounded-full border border-slate-300 dark:border-slate-700" />
                          </div>
                        </div>
                        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                          {entry.text}
                        </p>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            </div>

            {/* Right column: trends */}
            <section className="glass rounded-3xl bg-white/80 dark:bg-slate-950/80 border border-dashed border-slate-200 dark:border-slate-800 shadow-lg shadow-slate-900/5 flex flex-col">
              <div className="px-6 pt-6 pb-3 border-b border-slate-100 dark:border-slate-900 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-display font-semibold flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-purple-500" />
                    Mood Trends
                  </h2>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Visualize how your mood has changed over time.
                  </p>
                </div>
              </div>

              <div className="flex-1 flex flex-col px-6 pt-6 pb-4 gap-6">
                <div className="relative flex-1 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 bg-gradient-to-t from-brand-50 via-white to-white dark:from-brand-950/40 dark:via-slate-950 dark:to-slate-950 overflow-hidden">
                  <div className="absolute inset-x-6 top-4 flex items-center justify-between text-[11px] text-slate-400">
                    <span>— Mood Level</span>
                    <span>Higher</span>
                  </div>
                  {/* Simple illustrative graph */}
                  <svg
                    className="absolute inset-x-0 bottom-0 h-40 w-full text-brand-400/40"
                    viewBox="0 0 100 40"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M0,35 Q15,20 30,28 T60,18 T100,22 L100,40 L0,40 Z"
                      fill="currentColor"
                    />
                  </svg>
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-500/15 via-transparent to-transparent" />
                </div>

                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Past 7 days</span>
                    <span>Prototype preview · static data</span>
                  </div>
                  <div className="inline-flex flex-wrap gap-2">
                    {ranges.map((range, idx) => (
                      <button
                        key={range}
                        type="button"
                        className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border ${
                          idx === 0
                            ? "bg-brand-600 text-white border-brand-600 shadow-sm shadow-brand-600/30"
                            : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 bg-slate-50/50 dark:bg-slate-950/50"
                        }`}
                      >
                        {range}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}

