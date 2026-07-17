"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import LogoutButton from "./LogoutButton";
import { profile } from "console";

export default function Sidebar() {
  const pathname = usePathname();

  const [taskCount, setTaskCount] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);
  const [notificationCount, setNotificationCount] =
  useState(0);
  const [username, setUsername] =
  useState("Benutzer");
  const [online, setOnline] =
  useState(false);

useEffect(() => {
  const savedTasks = localStorage.getItem("jannik-tasks");

  if (savedTasks) {
    const tasks = JSON.parse(savedTasks);

    const openTasks = tasks.filter(
      (task: any) => !task.completed
    );

    setTaskCount(openTasks.length);
  }

  loadProfile();
  checkAdmin();
  loadNotifications();
  checkBan();

  async function updateStatus(
    online: boolean
  ) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data, error } = await supabase
      .from("user_status")
      .upsert(
        {
          user_id: user.id,
          online,
          logged_in: true,
          last_seen: new Date().toISOString(),
        },
        {
          onConflict: "user_id",
        }
      )
      .select();

    console.log("STATUS:", online);
    console.log("DATA:", data);
    console.log("ERROR:", error);
  }

  updateStatus(true);
  setOnline(true);
  
  const heartbeat = setInterval(() => {
    updateStatus(true);
  }, 10000);

  const handleUnload = () => {
    updateStatus(false);
  };

  window.addEventListener(
    "beforeunload",
    handleUnload
  );

  const channel = supabase.channel(
    "notification-updates"
  );

  const banChannel = supabase
  .channel("ban-check")
  .on(
    "postgres_changes",
    {
      event: "UPDATE",
      schema: "public",
      table: "profiles",
    },
    async (payload) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (
        payload.new.id === user?.id &&
        payload.new.banned === true
      ) {
        alert(
          "🚫 Dein Konto wurde gesperrt."
        );

        await supabase.auth.signOut();

        window.location.href =
          "/login";
      }
    }
  )
  .subscribe();

  channel
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "notification_reads",
      },
      () => {
        loadNotifications();
      }
    )
    .subscribe();

return () => {
  clearInterval(heartbeat);

  window.removeEventListener(
    "beforeunload",
    handleUnload
  );

  async function updateStatus(
  online: boolean
) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  await supabase
    .from("user_status")
    .upsert(
      {
        user_id: user.id,
        online,
        logged_in: true,
        last_seen:
          new Date().toISOString(),
      },
      {
        onConflict: "user_id",
      }
    );
}

  supabase.removeChannel(channel);
  supabase.removeChannel(banChannel);
};
}, []);

  async function checkAdmin() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (data?.role === "admin") {
      setIsAdmin(true);
    }
  }

  async function checkBan() {
    
  const {
    data: { user },
  } = await supabase.auth.getUser();
  
  if (!user) return;

  
  const { data: profile } = await supabase
    .from("profiles")
    .select("banned")
    .eq("id", user.id)
    .single();

  if (profile?.banned === true) {
    await supabase.auth.signOut();

    alert(
      "🚫 Dein Konto wurde gesperrt."
    );

    window.location.href = "/login";
  }
}

  async function loadProfile() {
    const {
     data: { user },
   } = await supabase.auth.getUser();

    if (!user) return;

    const { data } =
      await supabase
        .from("profiles")
        .select("username")
        .eq("id", user.id)
        .single();

    if (data?.username) {
      setUsername(data.username);
    }
    const { data: status } =
  await supabase
    .from("user_status")
    .select("online")
    .eq("user_id", user.id)
    .single();

if (status) {
  setOnline(status.online);
}
  }

  async function checkBanStatus() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const { data } =
    await supabase
      .from("profiles")
      .select("banned")
      .eq("id", user.id)
      .single();

  if (data?.banned) {
    alert(
      "🚫 Dein Konto wurde gesperrt."
    );

    await supabase.auth.signOut();

    window.location.href =
      "/login";
  }
}

  loadNotifications();

    async function loadNotifications() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const {
    data: notifications,
    error: notificationsError,
  } = await supabase
    .from("notifications")
    .select("id");

  if (
    notificationsError ||
    !notifications
  ) {
    return;
  }

  const {
    data: reads,
    error: readsError,
  } = await supabase
    .from("notification_reads")
    .select("notification_id")
    .eq("user_id", user.id);

  if (readsError) {
    return;
  }

  const readIds =
    reads?.map(
      (item) => item.notification_id
    ) || [];

  const unreadCount =
    notifications.filter(
      (notification) =>
        !readIds.includes(
          notification.id
        )
    ).length;

  setNotificationCount(
    unreadCount
  );
}


  const links = [
    {
      href: "/",
      icon: "🏠",
      label: "Dashboard",
    },
    {
      href: "/weltinfo",
      icon: "🌍",
      label: "Weltinfo",
    },
    {
      href: "/tasks",
      icon: "✅",
      label: "Aufgaben",
      badge: taskCount,
    },
    {
      href: "/notes",
      icon: "📝",
      label: "Notizen",
    },
    {
      href: "/calendar",
      icon: "📅",
      label: "Kalender",
    },
    {
      href: "/notifications",
      icon: "🔔",
      label: "Benachrichtigungen",
      badge: notificationCount,
    },
    {
      href: "/chat",
      icon: "💬",
      label: "Chat",
    },
    {
      href: "/admin",
      icon: "👑",
      label: "Admin",
    },
    {
      href: "/settings",
      icon: "⚙️",
      label: "Einstellungen",
    },
  ];

  

  return (
    <aside
      className="
        hidden
        md:flex
        w-72
        min-h-screen
        flex-col
        justify-between
        border-r
        border-white/10
        bg-black/20
        backdrop-blur-xl
        p-6
      "
    >
      <div>
        <div className="mb-10">
          <div
            className="
              w-14
              h-14
              rounded-2xl
              bg-gradient-to-r
              from-blue-500
              to-purple-600
              flex
              items-center
              justify-center
              text-2xl
              mb-4
            "
          >
            🚀
          </div>

          <h1 className="text-2xl font-bold">
            Jannik's Dashboard
          </h1>


        </div>

        <nav className="space-y-3">
          {links.map((link) => {
            const active =
              pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`
                  flex
                  items-center
                  justify-between
                  rounded-2xl
                  px-4
                  py-4
                  transition-all
                  duration-300

                  ${
                    active
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg shadow-blue-500/20"
                      : "hover:bg-white/10"
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">
                    {link.icon}
                  </span>

                  <span className="font-medium">
                    {link.label}
                  </span>
                </div>

                {"badge" in link &&
                  link.badge &&
                  link.badge > 0 && (
                    <div
                      className="
                        min-w-[28px]
                        h-7
                        px-2
                        rounded-full
                        bg-red-500
                        flex
                        items-center
                        justify-center
                        text-xs
                        font-bold
                      "
                    >
                      {link.badge}
                    </div>
                  )}
              </Link>
            );
          })}
        </nav>
      </div>

      <div
        className="
          bg-white/5
          border
          border-white/10
          rounded-3xl
          p-4
        "
      >
        <div className="flex items-center gap-3 mb-4">
          <div
            className="
              w-12
              h-12
              rounded-full
              bg-gradient-to-r
              from-blue-500
              to-purple-600
              flex
              items-center
              justify-center
            "
          >
            👤
          </div>

          <div>
            <p className="font-semibold">
               {username}
            </p>

            <p
  className={
    online
      ? "text-green-400 text-sm"
      : "text-zinc-400 text-sm"
  }
>
  {online
    ? "🟢 Online"
    : "⚫ Offline"}
</p>
          </div>
        </div>

        <LogoutButton />
      </div>
    </aside>
  );
  
}