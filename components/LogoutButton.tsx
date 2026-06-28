"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const logout = () => {
    localStorage.removeItem("loggedIn");
    router.push("/login");
  };

  return (
    <button
      onClick={logout}
      className="w-full mt-6 p-3 rounded-xl bg-red-600 hover:bg-red-500 transition"
    >
      🚪 Abmelden
    </button>
  );
}