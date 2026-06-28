"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const login = () => {
    if (
      username === "Jannik" &&
      password === "Dashboard2026!"
    ) {
      localStorage.setItem("loggedIn", "true");
      router.push("/");
    } else {
      alert("Falsche Anmeldedaten");
    }
  };

  return (
    <main className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <div className="bg-zinc-900 p-8 rounded-2xl w-96">
        <h1 className="text-white text-3xl font-bold mb-6 text-center">
          Jannik's Dashboard
        </h1>

        <input
          placeholder="Benutzername"
          className="w-full p-3 mb-3 rounded bg-zinc-800 text-white"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Passwort"
          className="w-full p-3 mb-4 rounded bg-zinc-800 text-white"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={login}
          className="w-full p-3 bg-blue-600 rounded text-white"
        >
          Anmelden
        </button>
      </div>
    </main>
  );
}