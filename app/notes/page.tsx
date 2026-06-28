"use client";

import { useEffect, useState } from "react";

export default function NotesPage() {
  const [note, setNote] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const savedNote = localStorage.getItem("jannik-notes");

    if (savedNote) {
      setNote(savedNote);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("jannik-notes", note);

    setSaved(true);

    const timeout = setTimeout(() => {
      setSaved(false);
    }, 1500);

    return () => clearTimeout(timeout);
  }, [note]);

  const wordCount = note
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

  const charCount = note.length;

  return (
    <div className="p-6 md:p-8 pb-28 md:pb-8">
      <div className="mb-10">
        <h1 className="text-4xl md:text-5xl font-bold">
          📝 Notizen
        </h1>

        <p className="text-zinc-300 mt-2">
          Alle Änderungen werden automatisch gespeichert.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-6">
          <p className="text-blue-400 text-sm mb-2">
            Wörter
          </p>

          <p className="text-4xl font-bold">
            {wordCount}
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-6">
          <p className="text-purple-400 text-sm mb-2">
            Zeichen
          </p>

          <p className="text-4xl font-bold">
            {charCount}
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-6">
          <p className="text-green-400 text-sm mb-2">
            Status
          </p>

          <p className="text-xl font-bold">
            {saved ? "✅ Gespeichert" : "✍️ Bearbeiten"}
          </p>
        </div>
      </div>

      <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">
            Meine Notizen
          </h2>

          {saved && (
            <div className="bg-green-500/20 text-green-400 px-4 py-2 rounded-xl">
              Gespeichert
            </div>
          )}
        </div>

        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Schreibe hier deine Ideen, Gedanken, Notizen oder Pläne..."
          className="
            w-full
            h-[500px]
            bg-black/20
            border
            border-white/10
            rounded-2xl
            p-6
            outline-none
            resize-none
            text-white
          "
        />
      </div>
    </div>
  );
}