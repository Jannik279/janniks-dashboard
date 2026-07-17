"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function AdminGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const [loading, setLoading] =
    useState(true);

  const [allowed, setAllowed] =
    useState(false);

  useEffect(() => {
    checkAdmin();
  }, []);

  async function checkAdmin() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      setLoading(false);
      return;
    }

    const { data: profile } =
      await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    if (
      !profile ||
      profile.role !== "admin"
    ) {
      router.push("/");
      setLoading(false);
      return;
    }

    setAllowed(true);
    setLoading(false);
  }

  if (loading) {
    return (
      <div className="p-8">
        Lade...
      </div>
    );
  }

  if (!allowed) {
    return null;
  }

  return <>{children}</>;
}