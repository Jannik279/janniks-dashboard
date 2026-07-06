"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Sidebar() {
const pathname = usePathname();

const [taskCount, setTaskCount] = useState(0);

useEffect(() => {
const savedTasks =
localStorage.getItem("jannik-tasks");

if (savedTasks) {
  const tasks = JSON.parse(savedTasks);

  const openTasks = tasks.filter(
    (task: any) => !task.completed
  );

  setTaskCount(openTasks.length);
}

}, []);

const links = [
{
href: "/",
icon: "🏠",
label: "Dashboard",
},
{
href: "/weltinfo",
label: "Weltinfo",
icon: "🌍",
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
href: "/settings",
icon: "⚙️",
label: "Einstellungen",
},
];

return (
<aside className=" hidden md:flex w-72 min-h-screen flex-col justify-between border-r border-white/10 bg-black/20 backdrop-blur-xl p-6 " >
<div>
<div className="mb-10">
<div className=" w-14 h-14 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-2xl mb-4 " >
🚀
</div>

      <h1 className="text-2xl font-bold">
        Jannik's Dashboard
      </h1>

      <p className="text-zinc-400 text-sm mt-1">
        Personal Hub
      </p>
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

            {link.badge &&
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
    <div className="flex items-center gap-3">
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
          Jannik
        </p>

        <p className="text-green-400 text-sm">
          🟢 Online
        </p>
      </div>
    </div>
  </div>
</aside>

);
}