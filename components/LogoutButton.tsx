"use client";

import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  async function logout() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      await supabase
        .from("user_status")
        .update({
          online: false,
          logged_in: false,
          last_seen: new Date().toISOString(),
        })
        .eq("user_id", user.id);
    }

    await supabase.auth.signOut();

    router.push("/login");
    router.refresh();
  }

  return (
    <button
      onClick={logout}
      className="
        w-full
        mt-4
        p-3
        rounded-2xl
        bg-red-600
        hover:bg-red-500
        transition
      "
    >
      🚪 Abmelden
    </button>
  );
}