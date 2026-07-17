"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Notification = {
id: string;
title: string;
message: string;
important: boolean;
created_at: string;
};

export default function AdminNotificationsPage() {
const [notifications, setNotifications] =
  useState<Notification[]>([]);
const [reads, setReads] =
  useState<ReadUser[]>([]);

const [title, setTitle] =
useState("");

const [message, setMessage] =
useState("");

const [important, setImportant] =
useState(false);

const [loading, setLoading] =
useState(true);

useEffect(() => {
  loadNotifications();
  loadReads();
}, []);

async function loadNotifications() {
const { data } =
await supabase
.from("notifications")
.select("*")
.order("created_at", {
ascending: false,
});

setNotifications(data || []);
setLoading(false);

}

async function loadReads() {
  const { data } =
    await supabase
      .from("notification_reads")
      .select(`
        notification_id,
        profiles:user_id (
          username
        )
      `);

  setReads(
    (data as ReadUser[]) || []
  );
}

async function createNotification() {
if (!title || !message) {
alert(
"Bitte Titel und Nachricht eingeben"
);
return;
}

await supabase
  .from("notifications")
  .insert({
    title,
    message,
    important,
  });

setTitle("");
setMessage("");
setImportant(false);

await loadNotifications();
await loadReads();

}

async function deleteNotification(
id: string
) {
const ok = confirm(
"Benachrichtigung löschen?"
);

if (!ok) return;

await supabase
  .from("notifications")
  .delete()
  .eq("id", id);

await loadNotifications();
await loadReads();
}

return (
<div className="p-8">
<h1 className="text-5xl font-bold mb-8">
🔔 Benachrichtigungen
</h1>

  <div
    className="
      bg-white/5
      border
      border-white/10
      rounded-3xl
      p-6
      mb-8
    "
  >
    <h2 className="text-2xl font-bold mb-4">
      Neue Benachrichtigung
    </h2>

    <div className="grid gap-4">
      <input
        type="text"
        placeholder="Titel"
        value={title}
        onChange={(e) =>
          setTitle(e.target.value)
        }
        className="
          bg-black/20
          border
          border-white/10
          rounded-xl
          p-3
        "
      />

      <textarea
        rows={5}
        placeholder="Nachricht"
        value={message}
        onChange={(e) =>
          setMessage(e.target.value)
        }
        className="
          bg-black/20
          border
          border-white/10
          rounded-xl
          p-3
        "
      />

      <label className="flex gap-2 items-center">
        <input
          type="checkbox"
          checked={important}
          onChange={(e) =>
            setImportant(
              e.target.checked
            )
          }
        />
        📌 Wichtig markieren
      </label>

      <button
        onClick={
          createNotification
        }
        className="
          bg-green-600
          hover:bg-green-700
          rounded-xl
          py-3
          font-semibold
        "
      >
        Veröffentlichen
      </button>
    </div>
  </div>

  {loading ? (
    <div>Lade...</div>
  ) : (
    <div className="grid gap-4">
      {notifications.map(
        (item) => (
          <div
            key={item.id}
            className="
              bg-white/5
              border
              border-white/10
              rounded-3xl
              p-5
            "
          >
            <h2 className="text-xl font-bold">
              {item.important
                ? "📌 "
                : ""}
              {item.title}
            </h2>

            <p className="mt-2 mb-4">
              {item.message}
            </p>
            <div className="mb-4">
  <p className="text-sm text-zinc-400 mb-2">
    👥 Gelesen von:
  </p>

  {reads
    .filter(
      (read) =>
        read.notification_id ===
        item.id
    )
    .map((read, index) => (
      <div
        key={index}
        className="
          text-sm
          text-green-400
        "
      >
        ✓ {
          read.profiles
            ?.username
        }
      </div>
    ))}

  <p className="text-xs text-zinc-500 mt-2">
    {
      reads.filter(
        (read) =>
          read.notification_id ===
          item.id
      ).length
    }
    {" "}
    Nutzer haben gelesen
  </p>
</div>

            <button
              onClick={() =>
                deleteNotification(
                  item.id
                )
              }
              className="
                bg-red-600
                hover:bg-red-700
                px-4
                py-2
                rounded-xl
              "
            >
              Löschen
            </button>
          </div>
        )
      )}
    </div>
  )}
</div>

);
}