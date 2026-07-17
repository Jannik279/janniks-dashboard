"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { usePathname, useRouter } from "next/navigation";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    async function checkUser() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (
        !session &&
        pathname !== "/login"
      ) {
        router.push("/login");
        return;
      }

      if (
        session &&
        pathname === "/login"
      ) {
        router.push("/");
        return;
      }

      setLoading(false);
    }

    checkUser();
  }, [pathname, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Lade...
      </div>
    );
  }

  return <>{children}</>;
}