"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

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
  const [showClock, setShowClock] =
  useState(false);
const [clockMode, setClockMode] =
  useState<
    "digital" |
    "analog" |
    "stopwatch" |
    "timer"
  >("digital");

const [stopwatchTime, setStopwatchTime] =
  useState(0);

const [stopwatchRunning, setStopwatchRunning] =
  useState(false);

const [timerMinutes, setTimerMinutes] =
  useState(5);

const [timerInputSeconds, setTimerInputSeconds] =
  useState(0);

const [timerSeconds, setTimerSeconds] =
  useState(300);

const [timerRunning, setTimerRunning] =
  useState(false);

const [seconds, setSeconds] =
  useState("00");
  const [taskCount, setTaskCount] = useState(0);
  const [nextTask, setNextTask] = useState("");
  const [notePreview, setNotePreview] = useState("");

  const [temperature, setTemperature] = useState("--");
  const [weatherText, setWeatherText] = useState("Lädt...");

  const [nextEvent, setNextEvent] = useState<Event | null>(null);

  const [username, setUsername] =
  useState("Benutzer");
  const [background, setBackground] =
  useState("default");
  const [focusMode, setFocusMode] =
  useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  useEffect(() => {
  const savedBackground =
    localStorage.getItem(
      "jannik-background"
    );

  if (savedBackground) {
    setBackground(savedBackground);
  }
}, []);

  async function loadProfile() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data } = await supabase
      .from("profiles")
      .select("username")
      .eq("id", user.id)
      .single();

    if (data) {
      setUsername(data.username);
    }
  }
  function changeBackground(
  bg: string
) {
  setBackground(bg);

  localStorage.setItem(
    "jannik-background",
    bg
  );
}

  useEffect(() => {
  const handleEsc = (
    event: KeyboardEvent
  ) => {
    if (event.key === "Escape") {
      setShowClock(false);
    }
  };

  window.addEventListener(
    "keydown",
    handleEsc
  );

  return () =>
    window.removeEventListener(
      "keydown",
      handleEsc
    );
}, []);

useEffect(() => {
  let interval: NodeJS.Timeout;

  if (stopwatchRunning) {
    interval = setInterval(() => {
      setStopwatchTime(
        (prev) => prev + 10
      );
    }, 10);
  }

  return () =>
    clearInterval(interval);
}, [stopwatchRunning]);

useEffect(() => {
  let interval: NodeJS.Timeout;

  if (
    timerRunning &&
    timerSeconds > 0
  ) {
    interval = setInterval(() => {
      setTimerSeconds(
        (prev) => prev - 1
      );
    }, 1000);
  }

  if (
    timerRunning &&
    timerSeconds === 0
  ) {
    setTimerRunning(false);

    alert(
      "⏰ Zeit abgelaufen!"
    );
  }

  return () =>
    clearInterval(interval);
}, [timerRunning, timerSeconds]);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();

setTime(
  now.toLocaleTimeString("de-DE", {
    hour: "2-digit",
    minute: "2-digit",
  })
);

setSeconds(
  now
    .getSeconds()
    .toString()
    .padStart(2, "0")
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
const backgrounds = {
  default:
    "bg-gradient-to-br from-zinc-950 to-black",

  blue:
    "bg-gradient-to-br from-blue-900 to-black",

  purple:
    "bg-gradient-to-br from-purple-900 to-black",

  green:
    "bg-gradient-to-br from-green-900 to-black",

  sunset:
    "bg-gradient-to-br from-orange-500 via-red-600 to-black",
};
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
  <div
    className={`
      min-h-screen
      p-6
      md:p-8
      pb-28
      md:pb-8
      ${
        backgrounds[
          background as keyof typeof backgrounds
        ]
      }
    `}
  >
      {/* Hero */}
      <div className="mb-10 rounded-[32px] border border-white/10 bg-white/5 backdrop-blur-xl p-8">
        <div className="flex flex-col lg:flex-row justify-between gap-6">
          <div>
            <p className="text-zinc-400 mb-2">
              Willkommen zurück
            </p>

            <h1 className="text-5xl md:text-6xl font-bold">
              Hallo {username} 👋
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
                {username}
              </p>

              <p className="text-green-400">
                🟢 Online
              </p>
            </div>
          </div>
        </div>
        <div className="mt-8">
      <button
        onClick={() =>
          setFocusMode(true)
        }
        className="
          bg-indigo-600
          hover:bg-indigo-500
          px-6
          py-3
          rounded-2xl
          font-bold
        "
      >
        🌙 Fokus-Modus starten
      </button>
    </div>
      </div>

      {/* Statistik Karten */}
      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
        <div
            onClick={() =>
              setShowClock(true)
            }
            className="
              bg-white/5
              border
              border-white/10
              rounded-3xl
              p-6
              backdrop-blur-xl
              hover:scale-[1.02]
              transition
              cursor-pointer
            "
          >
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
      <div className="mt-8 bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl">

  <h2 className="text-2xl font-bold mb-6">
    🎨 Hintergrund
  </h2>

  <div className="flex flex-wrap gap-4">

    <button
      onClick={() =>
        changeBackground("default")
      }
      className="w-12 h-12 rounded-full bg-black border"
    />

    <button
      onClick={() =>
        changeBackground("blue")
      }
      className="w-12 h-12 rounded-full bg-blue-700"
    />

    <button
      onClick={() =>
        changeBackground("purple")
      }
      className="w-12 h-12 rounded-full bg-purple-700"
    />

    <button
      onClick={() =>
        changeBackground("green")
      }
      className="w-12 h-12 rounded-full bg-green-700"
    />

    <button
      onClick={() =>
        changeBackground("sunset")
      }
      className="w-12 h-12 rounded-full bg-orange-500"
    />

  </div>

</div>
{focusMode && (
  <div
    className="
      fixed
      inset-0
      z-[99999]
      bg-black
      flex
      flex-col
      items-center
      justify-center
    "
  >
    <button
      onClick={() =>
        setFocusMode(false)
      }
      className="
        absolute
        top-6
        right-6
        text-4xl
      "
    >
      ✖
    </button>

    <p className="text-zinc-500 mb-8">
      Fokus-Modus
    </p>

    <div className="text-center">
      <div
        className="
          text-yellow-400
          text-[180px]
          md:text-[300px]
          font-bold
          leading-none
        "
      >
        {time}
      </div>

      <div
        className="
          text-zinc-400
          text-4xl
          mt-6
        "
      >
        {today}
      </div>
    </div>
  </div>
)}

     {showClock && (
  <div
    className="
      fixed
      inset-0
      z-[9999]
      bg-black
      flex
      flex-col
      items-center
      justify-center
    "
  >
    <button
      onClick={() =>
        setShowClock(false)
      }
      className="
        absolute
        top-6
        right-6
        text-4xl
      "
    >
      ✖
    </button>

<div className="absolute top-6 left-6 flex gap-3 flex-wrap">

  <button
    onClick={() => setClockMode("digital")}
    className="px-4 py-2 rounded-xl bg-yellow-500 text-black font-bold"
  >
    🕒 Digital
  </button>

  <button
    onClick={() => setClockMode("analog")}
    className="px-4 py-2 rounded-xl bg-yellow-500 text-black font-bold"
  >
    🕰 Analog
  </button>

  <button
    onClick={() => setClockMode("stopwatch")}
    className="px-4 py-2 rounded-xl bg-yellow-500 text-black font-bold"
  >
    ⏱ Stoppuhr
  </button>

  <button
    onClick={() => setClockMode("timer")}
    className="px-4 py-2 rounded-xl bg-yellow-500 text-black font-bold"
  >
    ⏲ Timer
  </button>

</div>

{clockMode === "stopwatch" && (
  <div className="text-center">
    <div className="text-[120px] font-bold text-yellow-400">
      {new Date(stopwatchTime)
        .toISOString()
        .slice(11, 23)}
    </div>

    <div className="flex gap-4 justify-center mt-8">
      <button
        onClick={() =>
          setStopwatchRunning(true)
        }
        className="bg-green-600 px-6 py-3 rounded-xl"
      >
        ▶ Start
      </button>

      <button
        onClick={() =>
          setStopwatchRunning(false)
        }
        className="bg-yellow-600 px-6 py-3 rounded-xl"
      >
        ⏸ Pause
      </button>

      <button
        onClick={() => {
          setStopwatchRunning(false);
          setStopwatchTime(0);
        }}
        className="bg-red-600 px-6 py-3 rounded-xl"
      >
        🔄 Reset
      </button>
    </div>
  </div>
)}

{clockMode === "timer" && (
  <div className="text-center">
    <div className="text-[120px] font-bold text-yellow-400">
      {Math.floor(timerSeconds / 60)
        .toString()
        .padStart(2, "0")}
      :
      {(timerSeconds % 60)
        .toString()
        .padStart(2, "0")}
    </div>

<div className="flex gap-4 justify-center mb-6">

  <div>
    <p className="text-sm mb-2">
      Minuten
    </p>

    <input
      type="number"
      min="0"
      value={timerMinutes}
      onChange={(e) =>
        setTimerMinutes(
          Number(e.target.value)
        )
      }
      className="
        bg-white/10
        rounded-xl
        p-3
        w-24
        text-center
      "
    />
  </div>

  <div>
    <p className="text-sm mb-2">
      Sekunden
    </p>

    <input
      type="number"
      min="0"
      max="59"
      value={timerInputSeconds}
      onChange={(e) =>
        setTimerInputSeconds(
          Number(e.target.value)
        )
      }
      className="
        bg-white/10
        rounded-xl
        p-3
        w-24
        text-center
      "
    />
  </div>

</div>

    <div className="flex gap-4 justify-center">
      <button
        onClick={() => {
          setTimerSeconds(
            timerMinutes * 60 +
              timerInputSeconds
          );

          setTimerRunning(true);
        }}
        className="bg-green-600 px-6 py-3 rounded-xl"
      >
        ▶ Start
      </button>

      <button
        onClick={() =>
          setTimerRunning(false)
        }
        className="bg-yellow-600 px-6 py-3 rounded-xl"
      >
        ⏸ Pause
      </button>

      <button
        onClick={() => {
          setTimerRunning(false);
          setTimerSeconds(
            timerMinutes * 60 +
              timerInputSeconds
          );
        }}
        className="bg-red-600 px-6 py-3 rounded-xl"
      >
        🔄 Reset
      </button>
    </div>
  </div>
)}

    {clockMode === "digital" ? (
      <>
        <div className="flex items-end">
          <span
            className="
              text-yellow-400
              font-bold
              text-[180px]
              md:text-[320px]
              leading-none
            "
          >
            {time}
          </span>

          <span
            className="
              text-yellow-300
              text-6xl
              md:text-8xl
              mb-10
              ml-4
            "
          >
            {seconds}
          </span>
        </div>

        <p
          className="
            text-zinc-400
            text-2xl
            md:text-4xl
            mt-6
          "
        >
          {today}
        </p>
      </>
    ) : clockMode === "analog" ? ( 
<div
  className="
    relative
    w-[350px]
    h-[350px]
    md:w-[600px]
    md:h-[600px]
    rounded-full
    border-[12px]
    border-yellow-400
  "
>
  {/* Striche */}
  {[...Array(60)].map((_, i) => {
    const angle = (i * 6 - 90) * (Math.PI / 180);

    const radius = 270;

    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;

    return (
      <div
        key={`tick-${i}`}
        className="absolute"
        style={{
          left: `calc(50% + ${x}px)`,
          top: `calc(50% + ${y}px)`,
          width: i % 5 === 0 ? "4px" : "2px",
          height: i % 5 === 0 ? "24px" : "12px",
          backgroundColor: "#facc15",
          transform: `
            translate(-50%, -50%)
            rotate(${i * 6}deg)
          `,
        }}
      />
    );
  })}

  {/* Zahlen */}
  {[...Array(12)].map((_, i) => {
    const number = i + 1;

    const angle =
      (number * 30 - 90) *
      (Math.PI / 180);

    const radius = 235;

    const x =
      Math.cos(angle) * radius;

    const y =
      Math.sin(angle) * radius;

    return (
      <div
        key={number}
        className="
          absolute
          text-yellow-400
          font-bold
          text-3xl
        "
        style={{
          left: `calc(50% + ${x}px)`,
          top: `calc(50% + ${y}px)`,
          transform:
            "translate(-50%, -50%)",
        }}
      >
        {number}
      </div>
    );
  })}

  {/* Mittelpunkt */}
  <div
    className="
      absolute
      top-1/2
      left-1/2
      w-4
      h-4
      bg-yellow-400
      rounded-full
      -translate-x-1/2
      -translate-y-1/2
    "
  />

  {/* Stundenzeiger */}
  <div
    className="
      absolute
      top-1/2
      left-1/2
      origin-bottom
      bg-yellow-400
    "
    style={{
      width: "8px",
      height: "160px",
      transform: `translate(-50%, -100%) rotate(${
        new Date().getHours() * 30 +
        new Date().getMinutes() * 0.5
      }deg)`,
    }}
  />

  {/* Minutenzeiger */}
  <div
    className="
      absolute
      top-1/2
      left-1/2
      origin-bottom
      bg-yellow-300
    "
    style={{
      width: "5px",
      height: "220px",
      transform: `translate(-50%, -100%) rotate(${
        new Date().getMinutes() * 6
      }deg)`,
    }}
  />

  {/* Sekundenzeiger */}
  <div
    className="
      absolute
      top-1/2
      left-1/2
      origin-bottom
      bg-red-500
    "
    style={{
      width: "2px",
      height: "250px",
      transform: `translate(-50%, -100%) rotate(${
        new Date().getSeconds() * 6
      }deg)`,
    }}
  /> 
</div>
) : null}
  </div>
)}
    </div>
  );
}