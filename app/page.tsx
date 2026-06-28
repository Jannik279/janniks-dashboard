"use client";

import { useEffect, useState } from "react";

type Task = {
  id: number;
  text: string;
  completed: boolean;
};

type Event = {
  id: number;
  title: string;
  date: string;
};

export default function Home() {
  const [time, setTime] = useState("");
  const [taskCount, setTaskCount] = useState(0);
  const [nextTask, setNextTask] = useState("");
  const [notePreview, setNotePreview] = useState("");

  const [temperature, setTemperature] = useState("--");
  const [weatherText, setWeatherText] = useState("Lädt...");

  const [nextEvent, setNextEvent] = useState<Event | null>(null);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();

      setTime(
        now.toLocaleTimeString("de-DE", {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    };

    updateClock();

    const interval = setInterval(updateClock, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    async function loadWeather() {
      try {
        const res = await fetch(
          "https://api.open-meteo.com/v1/forecast?latitude=51.657&longitude=8.142&current=temperature_2m,weather_code"
        );

        const data = await res.json();

        setTemperature(
          Math.round(data.current.temperature_2m).toString()
        );

        const code = data.current.weather_code;

        if (code === 0) {
          setWeatherText("Sonnig");
        } else if (code <= 3) {
          setWeatherText("Teilweise bewölkt");
        } else if (code <= 48) {
          setWeatherText("Nebelig");
        } else if (code <= 67) {
          setWeatherText("Regen");
        } else if (code <= 77) {
          setWeatherText("Schnee");
        } else {
          setWeatherText("Bewölkt");
        }
      } catch {
        setWeatherText("Nicht verfügbar");
      }
    }

    loadWeather();
  }, []);

  useEffect(() => {
    const savedTasks = localStorage.getItem("jannik-tasks");

    if (savedTasks) {
      const tasks: Task[] = JSON.parse(savedTasks);

      const openTasks = tasks.filter(
        (task) => !task.completed
      );

      setTaskCount(openTasks.length);

      if (openTasks.length > 0) {
        setNextTask(openTasks[0].text);
      }
    }

    const notes =
      localStorage.getItem("jannik-notes") || "";

    setNotePreview(notes.slice(0, 250));

    const savedEvents =
      localStorage.getItem("jannik-events");

    if (savedEvents) {
      const events: Event[] =
        JSON.parse(savedEvents);

      if (events.length > 0) {
        setNextEvent(events[0]);
      }
    }
  }, []);

  const today = new Date().toLocaleDateString(
    "de-DE",
    {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );

  return (
    <div className="p-6 md:p-8 pb-28 md:pb-8">
      {/* Hero */}
      <div className="mb-10 rounded-[32px] border border-white/10 bg-white/5 backdrop-blur-xl p-8">
        <div className="flex flex-col lg:flex-row justify-between gap-6">
          <div>
            <p className="text-zinc-400 mb-2">
              Willkommen zurück
            </p>

            <h1 className="text-5xl md:text-6xl font-bold">
              Hallo Jannik 👋
            </h1>

            <p className="text-zinc-300 mt-4">
              {today}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-2xl">
              👤
            </div>

            <div>
              <p className="font-bold text-xl">
                Jannik
              </p>

              <p className="text-green-400">
                🟢 Online
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Statistik Karten */}
      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl hover:scale-[1.02] transition">
          <p className="text-blue-400 text-sm">
            LIVE
          </p>

          <h3 className="mt-2 mb-3">
            🕒 Uhrzeit
          </h3>

          <p className="text-5xl font-bold">
            {time}
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl hover:scale-[1.02] transition">
          <p className="text-orange-400 text-sm">
            WETTER
          </p>

          <h3 className="mt-2 mb-3">
            🌤 Lippetal
          </h3>

          <p className="text-4xl font-bold">
            {temperature}°
          </p>

          <p className="text-zinc-400 mt-2">
            {weatherText}
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl hover:scale-[1.02] transition">
          <p className="text-green-400 text-sm">
            PRODUKTIVITÄT
          </p>

          <h3 className="mt-2 mb-3">
            ✅ Aufgaben
          </h3>

          <p className="text-5xl font-bold">
            {taskCount}
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl hover:scale-[1.02] transition">
          <p className="text-purple-400 text-sm">
            KALENDER
          </p>

          <h3 className="mt-2 mb-3">
            📅 Termin
          </h3>

          <p className="font-semibold">
            {nextEvent
              ? nextEvent.title
              : "Kein Termin"}
          </p>
        </div>
      </div>

      {/* Infos */}
      <div className="grid lg:grid-cols-2 gap-6 mt-8">
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl">
          <h2 className="text-2xl font-bold mb-4">
            🎯 Wichtigste Aufgabe
          </h2>

          <p className="text-zinc-300">
            {nextTask ||
              "Keine offenen Aufgaben"}
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl">
          <h2 className="text-2xl font-bold mb-4">
            📅 Nächster Termin
          </h2>

          {nextEvent ? (
            <>
              <p className="font-semibold text-lg">
                {nextEvent.title}
              </p>

              <p className="text-zinc-400">
                {nextEvent.date}
              </p>
            </>
          ) : (
            <p className="text-zinc-400">
              Kein Termin vorhanden
            </p>
          )}
        </div>
      </div>

      {/* Notiz */}
      <div className="mt-8 bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl">
        <h2 className="text-2xl font-bold mb-4">
          📝 Letzte Notiz
        </h2>

        <p className="text-zinc-300 whitespace-pre-wrap">
          {notePreview ||
            "Noch keine Notiz vorhanden."}
        </p>
      </div>

      {/* Schnellzugriffe */}
      <div className="mt-8 bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl">
        <h2 className="text-2xl font-bold mb-6">
          🚀 Schnellzugriffe
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <a
            href="https://chatgpt.com"
            target="_blank"
            rel="noreferrer"
            className="bg-blue-600 hover:scale-105 transition rounded-2xl p-5 text-center font-semibold"
          >
            🤖 ChatGPT
          </a>

          <a
            href="https://youtube.com"
            target="_blank"
            rel="noreferrer"
            className="bg-red-600 hover:scale-105 transition rounded-2xl p-5 text-center font-semibold"
          >
            ▶️ YouTube
          </a>

          <a
            href="https://mail.google.com"
            target="_blank"
            rel="noreferrer"
            className="bg-green-600 hover:scale-105 transition rounded-2xl p-5 text-center font-semibold"
          >
            📧 Gmail
          </a>

          <a
            href="https://calendar.google.com"
            target="_blank"
            rel="noreferrer"
            className="bg-orange-500 hover:scale-105 transition rounded-2xl p-5 text-center font-semibold"
          >
            📅 Kalender
          </a>
        </div>
      </div>
    </div>
  );
}