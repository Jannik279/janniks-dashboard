"use client";

import { useEffect, useState } from "react";

type Event = {
  id: number;
  title: string;
  date: string;
};

export default function CalendarPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    const savedEvents =
      localStorage.getItem("jannik-events");

    if (savedEvents) {
      setEvents(JSON.parse(savedEvents));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "jannik-events",
      JSON.stringify(events)
    );
  }, [events]);

  const addEvent = () => {
    if (!title.trim() || !date) return;

    const event: Event = {
      id: Date.now(),
      title,
      date,
    };

    setEvents([event, ...events]);

    setTitle("");
    setDate("");
  };

  const deleteEvent = (id: number) => {
    setEvents(
      events.filter((event) => event.id !== id)
    );
  };

  return (
    <div className="p-6 md:p-8 pb-28 md:pb-8">
      <div className="mb-10">
        <h1 className="text-4xl md:text-5xl font-bold">
          📅 Kalender
        </h1>

        <p className="text-zinc-300 mt-2">
          Verwalte deine Termine und Ereignisse.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="glass-card rounded-3xl p-6">
          <p className="accent-text text-sm mb-2">
            Termine
          </p>

          <p className="text-4xl font-bold">
            {events.length}
          </p>
        </div>

        <div className="glass-card rounded-3xl p-6">
          <p className="text-green-400 text-sm mb-2">
            Nächster Termin
          </p>

          <p className="font-semibold">
            {events.length
              ? events[0].title
              : "Kein Termin"}
          </p>
        </div>

        <div className="glass-card rounded-3xl p-6">
          <p className="text-orange-400 text-sm mb-2">
            Status
          </p>

          <p className="font-semibold">
            🟢 Aktiv
          </p>
        </div>
      </div>

      <div className="glass-card rounded-3xl p-6 mb-8">
        <h2 className="text-2xl font-bold mb-6">
          Neuer Termin
        </h2>

        <div className="grid md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Terminname"
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
            className="
              bg-black/20
              border
              border-white/10
              rounded-2xl
              p-4
              outline-none
            "
          />

          <input
            type="date"
            value={date}
            onChange={(e) =>
              setDate(e.target.value)
            }
            className="
              bg-black/20
              border
              border-white/10
              rounded-2xl
              p-4
              outline-none
            "
          />

          <button
            onClick={addEvent}
            className="
              accent-gradient
              rounded-2xl
              font-semibold
            "
          >
            Termin hinzufügen
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {events.length === 0 && (
          <div className="glass-card rounded-3xl p-8 text-center">
            <p className="text-zinc-400">
              Noch keine Termine vorhanden.
            </p>
          </div>
        )}

        {events.map((event) => (
          <div
            key={event.id}
            className="
              glass-card
              rounded-3xl
              p-5
              flex
              justify-between
              items-center
            "
          >
            <div>
              <p className="font-semibold text-lg">
                {event.title}
              </p>

              <p className="text-zinc-400">
                {event.date}
              </p>
            </div>

            <button
              onClick={() =>
                deleteEvent(event.id)
              }
              className="
                px-4
                py-2
                rounded-xl
                bg-red-500/20
                hover:bg-red-500/30
              "
            >
              🗑️
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}