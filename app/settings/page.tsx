"use client";

import { useEffect, useState } from "react";

export default function SettingsPage() {
const [name, setName] = useState("Jannik");
const [location, setLocation] = useState("Lippetal");
const [accent, setAccent] = useState("Blau");
const [saved, setSaved] = useState(false);

const applyAccentColor = (colorName: string) => {
let color = "#3b82f6";

switch (colorName) {
  case "Grün":
    color = "#22c55e";
    break;

  case "Orange":
    color = "#f97316";
    break;

  case "Rot":
    color = "#ef4444";
    break;

  case "Lila":
    color = "#9333ea";
    break;

  default:
    color = "#3b82f6";
}

document.documentElement.style.setProperty(
  "--accent",
  color
);

};

useEffect(() => {
const savedName =
localStorage.getItem("jannik-name");

const savedLocation =
  localStorage.getItem("jannik-location");

const savedAccent =
  localStorage.getItem("jannik-accent");

if (savedName) {
  setName(savedName);
}

if (savedLocation) {
  setLocation(savedLocation);
}

if (savedAccent) {
  setAccent(savedAccent);
  applyAccentColor(savedAccent);
}

}, []);

const saveSettings = () => {
localStorage.setItem(
"jannik-name",
name
);

localStorage.setItem(
  "jannik-location",
  location
);

localStorage.setItem(
  "jannik-accent",
  accent
);

applyAccentColor(accent);

setSaved(true);

setTimeout(() => {
  setSaved(false);
}, 2000);

};

const resetDashboard = () => {
const confirmed = window.confirm(
"Möchtest du wirklich alle Dashboard-Daten löschen?"
);

if (!confirmed) return;

localStorage.clear();

window.location.reload();

};

const exportData = () => {
const data = {
tasks:
localStorage.getItem(
"jannik-tasks"
),
notes:
localStorage.getItem(
"jannik-notes"
),
events:
localStorage.getItem(
"jannik-events"
),
settings: {
name,
location,
accent,
},
};

const blob = new Blob(
  [JSON.stringify(data, null, 2)],
  {
    type: "application/json",
  }
);

const url =
  URL.createObjectURL(blob);

const a =
  document.createElement("a");

a.href = url;
a.download =
  "janniks-dashboard-backup.json";

a.click();

URL.revokeObjectURL(url);

};

return (
<div className="p-6 md:p-8 pb-28 md:pb-8">
<div className="mb-10">
<h1 className="text-5xl font-bold">
⚙️ Einstellungen
</h1>

    <p className="text-zinc-400 mt-2">
      Passe dein Dashboard an.
    </p>
  </div>

  <div className="grid md:grid-cols-3 gap-6 mb-8">
    <div className="glass-card rounded-3xl p-6">
      <p className="accent-text text-sm">
        Benutzer
      </p>

      <h2 className="text-2xl font-bold mt-2">
        {name}
      </h2>
    </div>

    <div className="glass-card rounded-3xl p-6">
      <p className="text-green-400 text-sm">
        Standort
      </p>

      <h2 className="text-2xl font-bold mt-2">
        {location}
      </h2>
    </div>

    <div className="glass-card rounded-3xl p-6">
      <p className="text-orange-400 text-sm">
        Akzentfarbe
      </p>

      <h2 className="text-2xl font-bold mt-2">
        {accent}
      </h2>
    </div>
  </div>

  <div className="glass-card rounded-3xl p-6">
    <h2 className="text-2xl font-bold mb-6">
      Profil & Design
    </h2>

    <div className="space-y-6">
      <div>
        <label className="block mb-2">
          Name
        </label>

        <input
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
          className="
            w-full
            p-4
            rounded-2xl
            bg-black/20
            border
            border-white/10
          "
        />
      </div>

      <div>
        <label className="block mb-2">
          Wetter-Ort
        </label>

        <input
          value={location}
          onChange={(e) =>
            setLocation(e.target.value)
          }
          className="
            w-full
            p-4
            rounded-2xl
            bg-black/20
            border
            border-white/10
          "
        />
      </div>

      <div>
        <label className="block mb-2">
          Akzentfarbe
        </label>

        <select
          value={accent}
          onChange={(e) =>
            setAccent(e.target.value)
          }
          className="
            w-full
            p-4
            rounded-2xl
            bg-black/20
            border
            border-white/10
          "
        >
          <option>Blau</option>
          <option>Lila</option>
          <option>Grün</option>
          <option>Orange</option>
          <option>Rot</option>
        </select>
      </div>

      <button
        onClick={saveSettings}
        className="
          accent-gradient
          px-6
          py-4
          rounded-2xl
          font-semibold
        "
      >
        💾 Einstellungen speichern
      </button>

      {saved && (
        <div className="bg-green-500/20 text-green-400 p-4 rounded-2xl">
          ✅ Einstellungen gespeichert
        </div>
      )}
    </div>
  </div>

  <div className="grid md:grid-cols-2 gap-6 mt-8">
    <div className="glass-card rounded-3xl p-6">
      <h2 className="text-2xl font-bold mb-4">
        💾 Backup
      </h2>

      <button
        onClick={exportData}
        className="
          w-full
          bg-green-600
          rounded-2xl
          p-4
          font-semibold
        "
      >
        Backup herunterladen
      </button>
    </div>

    <div className="glass-card rounded-3xl p-6 border border-red-500/20">
      <h2 className="text-2xl font-bold mb-4">
        🗑️ Zurücksetzen
      </h2>

      <button
        onClick={resetDashboard}
        className="
          w-full
          bg-red-600
          rounded-2xl
          p-4
          font-semibold
        "
      >
        Dashboard zurücksetzen
      </button>
    </div>
  </div>
</div>

);
}