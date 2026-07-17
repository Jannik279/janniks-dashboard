"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type UserStatus = {
  user_id: string;
  online: boolean;
  logged_in: boolean;
  last_seen: string;
  profiles: {
    username: string;
  };
};

export default function OnlineUsersPage() {
  const [users, setUsers] =
    useState<UserStatus[]>([]);

  useEffect(() => {
    loadUsers();

    const interval = setInterval(
      loadUsers,
      2000
    );

    return () => clearInterval(interval);
  }, []);

  async function loadUsers() {
    const { data, error } =
      await supabase
        .from("user_status")
        .select(`
          user_id,
          online,
          logged_in,
          last_seen,
          profiles (
            username
          )
        `);

    if (error) {
      console.error(error);
      return;
    }

    setUsers(
      (data as UserStatus[]) || []
    );
  }

  function isOnline(
    lastSeen: string
  ) {
    const now = Date.now();
    const last =
      new Date(lastSeen).getTime();

    return now - last < 15000;
  }

  return (
    <div className="p-8">
      <h1 className="text-5xl font-bold mb-8">
        🟢 Online Nutzer
      </h1>

      <div className="grid gap-4">
        {users
          .sort((a, b) => {
            const aOnline =
              isOnline(a.last_seen)
                ? 1
                : 0;

            const bOnline =
              isOnline(b.last_seen)
                ? 1
                : 0;

            return bOnline - aOnline;
          })
          .map((user) => (
            <div
              key={user.user_id}
              className="
                bg-white/5
                border
                border-white/10
                rounded-3xl
                p-5
              "
            >
              <h2 className="text-xl font-bold">
                {user.profiles
                  ?.username ||
                  "Unbekannt"}
              </h2>

              <p
                className={
                  isOnline(
                    user.last_seen
                  )
                    ? "text-green-400"
                    : "text-zinc-400"
                }
              >
                {isOnline(
                  user.last_seen
                )
                  ? "🟢 Online"
                  : "⚫ Offline"}
              </p>

              <p
                className={
                  user.logged_in
                    ? "text-blue-400"
                    : "text-red-400"
                }
              >
                {user.logged_in
                  ? "🔑 Angemeldet"
                  : "🚪 Abgemeldet"}
              </p>

              <p className="text-sm text-zinc-500 mt-2">
                Zuletzt aktiv:{" "}
                {new Date(
                  user.last_seen
                ).toLocaleString(
                  "de-DE"
                )}
              </p>
            </div>
          ))}
      </div>
    </div>
  );
}