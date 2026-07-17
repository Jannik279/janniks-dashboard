"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [username, setUsername] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  async function login() {
    setLoading(true);
    setError("");

    try {
      const userRes = await fetch(
        "/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            username,
          }),
        }
      );

      const userData =
        await userRes.json();

      if (!userRes.ok) {
        setError(userData.error);
        setLoading(false);
        return;
      }

      const {
        data: { user },
        error,
      } = await supabase.auth.signInWithPassword({
        email: userData.email,
        password,
      });

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      if (!user) {
        setLoading(false);
        return;
      }

      const { data: profile } =
        await supabase
          .from("profiles")
          .select("banned")
          .eq("id", user.id)
          .single();



      if (profile?.banned) {
        await supabase.auth.signOut();

        setLoading(false);

        alert(
          "🚫 Dieses Konto wurde gesperrt."
        );

        return;
      }

      console.log("USER:", user);
      console.log(
        "BAN STATUS:",
        profile
      );
      console.log("LOGIN OK");

      setLoading(false);

      router.push("/");
      router.refresh();
    } catch (err) {
      console.error(err);

      setError(
        "Login fehlgeschlagen"
      );

      setLoading(false);
    }
  }

  return (
    <div
      className="
        min-h-screen
        flex
        items-center
        justify-center
        p-6
      "
    >
      <div
        className="
          glass-card
          rounded-3xl
          p-8
          w-full
          max-w-md
        "
      >
        <h1
          className="
            text-3xl
            font-bold
            mb-6
          "
        >
          🔐 Login
        </h1>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Benutzername"
            value={username}
            onChange={(e) =>
              setUsername(
                e.target.value
              )
            }
            className="
              w-full
              p-4
              rounded-2xl
              bg-black/30
              border
              border-white/10
            "
          />

          <input
            type="password"
            placeholder="Passwort"
            value={password}
            onChange={(e) =>
              setPassword(
                e.target.value
              )
            }
            className="
              w-full
              p-4
              rounded-2xl
              bg-black/30
              border
              border-white/10
            "
          />

          {error && (
            <p className="text-red-400">
              {error}
            </p>
          )}

          <button
            onClick={login}
            disabled={loading}
            className="
              w-full
              p-4
              rounded-2xl
              bg-blue-600
              hover:bg-blue-500
              disabled:opacity-50
            "
          >
            {loading
              ? "Anmelden..."
              : "Anmelden"}
          </button>
        </div>
      </div>
    </div>
  );
}