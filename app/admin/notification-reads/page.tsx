"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Profile = {
  id: string;
  username: string;
};

type Notification = {
  id: string;
  title: string;
};

type ReadEntry = {
  notification_id: string;
  user_id: string;
};

export default function NotificationReadsPage() {
  const [notifications, setNotifications] =
    useState<Notification[]>([]);

  const [reads, setReads] =
    useState<ReadEntry[]>([]);

  const [profiles, setProfiles] =
    useState<Profile[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const { data: notificationsData } =
      await supabase
        .from("notifications")
        .select("id,title")
        .order("created_at", {
          ascending: false,
        });

    const { data: readsData } =
      await supabase
        .from("notification_reads")
    .select(`
      notification_id,
      user_id
`);
    const { data: profilesData } =
      await supabase
        .from("profiles")
        .select("id, username");

    setProfiles(
      profilesData || []
);

    setNotifications(
      notificationsData || []
    );

    setReads(
      (readsData as ReadEntry[]) || []
    );

    setLoading(false);
  }

  if (loading) {
    return (
      <div className="p-8">
        Lade...
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-5xl font-bold mb-8">
        👀 Gelesen von
      </h1>

      <div className="grid gap-4">
        {notifications.map(
          (notification) => {
            const readers =
              reads.filter(
                (read) =>
                  read.notification_id ===
                  notification.id
              );

            return (
              <div
                key={notification.id}
                className="
                  bg-white/5
                  border
                  border-white/10
                  rounded-3xl
                  p-5
                "
              >
                <h2 className="text-xl font-bold mb-4">
                  📢 {notification.title}
                </h2>

                {readers.length === 0 ? (
                  <p className="text-zinc-400">
                    Noch niemand hat
                    diese Nachricht
                    gelesen.
                  </p>
                ) : (
                  <>
                    <div className="space-y-2">
                      {readers.map(
                        (
                          reader,
                          index
                        ) => (
                          <div
                            key={index}
                            className="
                              text-green-400
                            "
                          >
                            ✓{" "}
                            {
                              profiles.find(
                            (p) =>
                              p.id === reader.user_id
                          )?.username
                          }
                          </div>
                        )
                      )}
                    </div>

                    <p
                      className="
                        mt-4
                        text-zinc-400
                      "
                    >
                      {
                        readers.length
                      }{" "}
                      Nutzer haben
                      gelesen
                    </p>
                  </>
                )}
              </div>
            );
          }
        )}
      </div>
    </div>
  );
}