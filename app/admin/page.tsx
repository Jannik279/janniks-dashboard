"use client";

import Link from "next/link";

export default function AdminPage() {
const cards = [
{
href: "/admin/users",
icon: "👥",
title: "Benutzer",
description: "Benutzerverwaltung",
},
{
href: "/admin/notifications",
icon: "📢",
title: "Nachrichten",
description: "Benachrichtigungen verwalten",
},
{
href: "/admin/notification-reads",
icon: "👀",
title: "Gelesen von",
description: "Lesestatus anzeigen",
},
{
  title: "Online Nutzer",
  description:
    "Wer ist aktuell online?",
  icon: "🟢",
  href: "/admin/online",
},
];

return (
    <div className="p-8">
      <h1 className="text-5xl font-bold mb-2">
        👑 Adminbereich
      </h1>

      <p className="text-zinc-400 mb-10">
        Verwaltung deines Dashboards
      </p>

      <div className="grid md:grid-cols-3 gap-6">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="
              bg-white/5
              border
              border-white/10
              rounded-3xl
              p-6
              hover:bg-white/10
              transition
            "
          >
            <div className="text-5xl mb-4">
              {card.icon}
            </div>

            <h2 className="text-2xl font-bold mb-2">
              {card.title}
            </h2>

            <p className="text-zinc-400">
              {card.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
);
}