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

export default function NotificationsPage() {

const [notifications, setNotifications] =
useState<Notification[]>([]);

const [readNotifications, setReadNotifications] =
  useState<string[]>([]);

const [loading, setLoading] =
useState(true);

useEffect(() => {
  loadNotifications();
  loadReadNotifications();
}, []);

async function loadNotifications() {
const { data } =
await supabase
.from("notifications")
.select("*")
.order("important", {
ascending: false,
})
.order("created_at", {
ascending: false,
});

setNotifications(data || []);
setLoading(false);

}

async function loadReadNotifications() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const { data } =
    await supabase
      .from("notification_reads")
      .select("notification_id")
      .eq("user_id", user.id);

  setReadNotifications(
    data?.map(
      (item) => item.notification_id
    ) || []
  );
}

async function markAsRead(
  notificationId: string
) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const { error } =
    await supabase
      .from("notification_reads")
      .insert({
        notification_id: notificationId,
        user_id: user.id,
      });

  console.log("READ ERROR:", error);

  loadReadNotifications();
}

return (
<div className="p-8">
<h1 className="text-5xl font-bold mb-8">
🔔 Benachrichtigungen
</h1>

  {loading ? (
    <div>Lade Benachrichtigungen...</div>
  ) : notifications.length === 0 ? (
    <div
      className="
        bg-white/5
        border
        border-white/10
        rounded-3xl
        p-6
      "
    >
      Keine Benachrichtigungen vorhanden.
    </div>
  ) : (
    <div className="grid gap-5">
      {notifications.map((item) => (
        <div
          key={item.id}
          className={`
            rounded-3xl
            p-6
            border
            ${
              !readNotifications.includes(
                item.id
              )
                ? "border-blue-500 bg-blue-500/10"
                : item.important
                ? "border-yellow-500 bg-yellow-500/10"
                : "border-white/10 bg-white/5"
            }
          `}
        >
          <h2 className="text-2xl font-bold mb-3">
            {item.important
              ? "📌 "
              : ""}
            {item.title}
          </h2>

          <p className="text-zinc-300 mb-4">
            {item.message}
          </p>

          <p className="text-sm text-zinc-500">
            {new Date(
              item.created_at
            ).toLocaleString("de-DE")}
          </p>
          {!readNotifications.includes(
          item.id
        ) && (
          <button
            onClick={() =>
              markAsRead(item.id)
            }
            className="
              mt-4
              px-4
              py-2
              rounded-xl
              bg-blue-600
              hover:bg-blue-700
            "
          >
            ✓ Als gelesen markieren
          </button>
        )}
        </div>
      ))}
    </div>
  )}
</div>

);
}<button
  onClick={() => {
    alert("Klick funktioniert");
    markAsRead(item.id);
  }}
>
  ✓ Als gelesen markieren
</button>