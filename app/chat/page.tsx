"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Message = {
  id: string;
  message: string;
  created_at: string;
  profiles: {
    username: string;
  };
};

export default function ChatPage() {
  const [messages, setMessages] =
    useState<Message[]>([]);

  const [newMessage, setNewMessage] =
    useState("");

  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    loadMessages();

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

checkAdmin();

    const channel = supabase
      .channel("chat-room")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "chat_messages",
        },
        () => {
          loadMessages();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function loadMessages() {
    const { data } = await supabase
      .from("chat_messages")
      .select(`
        id,
        message,
        created_at,
        profiles(username)
      `)
      .order("created_at");

    setMessages(
      (data as Message[]) || []
    );
  }

  async function sendMessage() {
    if (!newMessage.trim()) return;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

   const { data, error } = await supabase
  .from("chat_messages")
  .insert({
    user_id: user.id,
    message: newMessage,
  })
  .select();

console.log("CHAT DATA:", data);
console.log("CHAT ERROR:", error);

    setNewMessage("");
  }
  async function clearChat() {
  const confirmed = window.confirm(
    "Möchtest du wirklich den gesamten Chat löschen?"
  );

  if (!confirmed) return;

  const { error } = await supabase
    .from("chat_messages")
    .delete()
    .not("id", "is", null);

  if (error) {
    console.error(error);
    alert("Fehler beim Löschen.");
    return;
  }

  setMessages([]);
}

  return (
    <div className="p-8">
      <div
        className="
          bg-white/5
          border
          border-white/10
          rounded-3xl
          p-6
          h-[600px]
          overflow-y-auto
          mb-4
        "
      >
        <div className="flex items-center gap-3 mb-8">
  <h1 className="text-5xl font-bold">
    💬 Live Chat
  </h1>

  {isAdmin && (
    <button
      onClick={clearChat}
      className="
        px-4
        py-2
        rounded-xl
        bg-red-600
        hover:bg-red-500
      "
    >
      🗑️ Chat löschen
    </button>
  )}
</div>
        {messages.map((msg) => (
          <div
            key={msg.id}
            className="mb-4"
          >
            <p className="font-bold text-blue-400">
              {msg.profiles?.username}
            </p>

            <p>{msg.message}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <input
          value={newMessage}
          onChange={(e) =>
            setNewMessage(e.target.value)
          }
          placeholder="Nachricht..."
          className="
            flex-1
            rounded-2xl
            bg-white/10
            px-4
            py-3
          "
        />

        <button
          onClick={sendMessage}
          className="
            px-6
            rounded-2xl
            bg-blue-600
          "
        >
          Senden
        </button>
      </div>
    </div>
  );
}