"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function MobileNav() {
const pathname = usePathname();

const links = [
{
href: "/",
icon: "🏠",
label: "Home",
},
{
  href: "/weltinfo",
  icon: "🌍",
  label: "Weltinfo",
},
{
href: "/tasks",
icon: "✅",
label: "Tasks",
},
{
href: "/calendar",
icon: "📅",
label: "Kalender",
},
{
href: "/ai",
icon: "🤖",
label: "KI",
},
{
href: "/settings",
icon: "⚙️",
label: "Settings",
},

];

return (
<div className=" md:hidden fixed bottom-4 left-4 right-4 z-50 " >
<nav className=" bg-black/40 backdrop-blur-2xl border border-white/10 rounded-3xl px-3 py-3 shadow-2xl " >
<div className="flex items-center justify-between">
{links.map((link) => {
const active =
pathname === link.href;

        return (
          <Link
            key={link.href}
            href={link.href}
            className={`
              flex
              flex-col
              items-center
              justify-center
              gap-1
              px-3
              py-2
              rounded-2xl
              transition-all
              duration-300

              ${
                active
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 scale-110"
                  : "opacity-70"
              }
            `}
          >
            <span className="text-xl">
              {link.icon}
            </span>

            <span className="text-[10px] font-medium">
              {link.label}
            </span>
          </Link>
        );
      })}
    </div>
  </nav>
</div>

);
}