"use client";

import { useState } from "react";

function MoodButton({ label, emoji, selected, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center w-14 h-14 rounded-lg border-2 p-2 text-2xl transition-colors ${
        selected ? "border-purple-500 bg-purple-50" : "border-dashed border-gray-300"
      }`}
    >
      <span>{emoji}</span>
    </button>
  );
}

function RecentEntry({ date, moodEmoji, text }) {
  return (
    <div className="border rounded-md p-3 mb-3 bg-white shadow-sm">
      <div className="text-sm text-gray-500 mb-2">{date}</div>
      <div className="flex items-start gap-3">
        <div className="text-2xl">{moodEmoji}</div>
        <div className="text-gray-700">{text}</div>
      </div>
    </div>
  );
}

export default function Page() {
  const [selectedMood, setSelectedMood] = useState(null);
  const [note, setNote] = useState("");

  const [entries, setEntries] = useState([
    {
      date: "March 1, 2026",
      mood: "😄",
      text: "Finished my CSC-456 project proposal. Feeling accomplished!",
    },
    {
      date: "February 29, 2026",
      mood: "🙂",
      text: "Studied for midterms. Long day but made progress.",
    },
    {
      date: "February 28, 2026",
      mood: "😐",
      text: "Had a productive study session at the library.",
    },
  ]);

  function saveEntry() {
    if (!selectedMood) return;

    const today = new Date().toLocaleDateString(undefined, {
      month: "long",
      day: "numeric",
      year: "numeric",
    });

    setEntries((e) => [
      { date: today, mood: selectedMood, text: note || "" },
      ...e,
    ]);

    setNote("");
    setSelectedMood(null);
  }

  return (
    <div className="min-h-screen p-6" style={{ background: "#f7f7fb" }}>
      <div className="max-w-4xl mx-auto">

        <section className="bg-white rounded-lg p-6 mb-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Log Your Mood</h2>

          <div className="flex gap-3 mb-4">
            <MoodButton emoji="😞" selected={selectedMood === "😞"} onClick={() => setSelectedMood("😞")} />
            <MoodButton emoji="😐" selected={selectedMood === "😐"} onClick={() => setSelectedMood("😐")} />
            <MoodButton emoji="🙂" selected={selectedMood === "🙂"} onClick={() => setSelectedMood("🙂")} />
            <MoodButton emoji="😊" selected={selectedMood === "😊"} onClick={() => setSelectedMood("😊")} />
            <MoodButton emoji="😄" selected={selectedMood === "😄"} onClick={() => setSelectedMood("😄")} />
          </div>

          <textarea
            rows={4}
            placeholder="Write your notes here..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full border rounded-md p-3 mb-4"
          />

          <div className="text-sm text-gray-500 mb-4">
            {`Today - ${new Date().toLocaleDateString(undefined, {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}`}
          </div>

          <button
            onClick={saveEntry}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white py-3 rounded-md font-semibold"
          >
            Save Entry
          </button>
        </section>

        <section className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-md font-semibold mb-4">Recent Entries</h3>

          {entries.map((ent, idx) => (
            <RecentEntry
              key={idx}
              date={ent.date}
              moodEmoji={ent.mood}
              text={ent.text}
            />
          ))}
        </section>

      </div>
    </div>
  );
}
