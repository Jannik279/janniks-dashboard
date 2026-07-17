"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type News = {
id: string;
title: string;
content: string;
author: string;
created_at: string;
};

export default function AdminNewsPage() {
const [news, setNews] =
useState<News[]>([]);

const [title, setTitle] =
useState("");

const [content, setContent] =
useState("");

const [loading, setLoading] =
useState(true);

useEffect(() => {
loadNews();
}, []);

async function loadNews() {
const { data } =
await supabase
.from("news")
.select("*")
.order(
"created_at",
{ ascending: false }
);

setNews(data || []);
setLoading(false);

}

async function createNews() {
if (!title || !content) {
alert(
"Bitte Titel und Inhalt eingeben"
);
return;
}

const {
  data: { user },
} =
  await supabase.auth.getUser();

if (!user) return;

const { data: profile } =
  await supabase
    .from("profiles")
    .select("username")
    .eq("id", user.id)
    .single();

await supabase
  .from("news")
  .insert({
    title,
    content,
    author:
      profile?.username ||
      "Admin",
  });

setTitle("");
setContent("");

loadNews();

}

async function deleteNews(
id: string
) {
const ok =
confirm(
"News wirklich löschen?"
);

if (!ok) return;

await supabase
  .from("news")
  .delete()
  .eq("id", id);

loadNews();

}

return (
<div className="p-8">
<h1 className="text-5xl font-bold mb-8">
📰 News Verwaltung
</h1>

  <div
    className="
      bg-white/5
      border
      border-white/10
      rounded-3xl
      p-6
      mb-8
    "
  >
    <h2 className="text-2xl font-bold mb-4">
      Neue News
    </h2>

    <div className="grid gap-4">
      <input
        type="text"
        placeholder="Titel"
        value={title}
        onChange={(e) =>
          setTitle(
            e.target.value
          )
        }
        className="
          bg-black/20
          border
          border-white/10
          rounded-xl
          p-3
        "
      />

      <textarea
        placeholder="Inhalt"
        value={content}
        onChange={(e) =>
          setContent(
            e.target.value
          )
        }
        rows={6}
        className="
          bg-black/20
          border
          border-white/10
          rounded-xl
          p-3
        "
      />

      <button
        onClick={createNews}
        className="
          bg-green-600
          hover:bg-green-700
          rounded-xl
          py-3
          font-semibold
        "
      >
        Veröffentlichen
      </button>
    </div>
  </div>

  {loading ? (
    <div>Lade News...</div>
  ) : (
    <div className="grid gap-4">
      {news.map((item) => (
        <div
          key={item.id}
          className="
            bg-white/5
            border
            border-white/10
            rounded-3xl
            p-5
          "
        >
          <h2 className="font-bold text-xl mb-2">
            {item.title}
          </h2>

          <p className="mb-4">
            {item.content}
          </p>

          <div
            className="
              text-sm
              text-zinc-500
              mb-4
            "
          >
            von {item.author}
          </div>

          <button
            onClick={() =>
              deleteNews(
                item.id
              )
            }
            className="
              bg-red-600
              hover:bg-red-700
              px-4
              py-2
              rounded-xl
            "
          >
            Löschen
          </button>
        </div>
      ))}
    </div>
  )}
</div>

);
}