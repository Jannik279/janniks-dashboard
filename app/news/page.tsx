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

export default function NewsPage() {
const [news, setNews] =
useState<News[]>([]);

const [loading, setLoading] =
useState(true);

useEffect(() => {
loadNews();
}, []);

async function loadNews() {
const { data, error } =
await supabase
.from("news")
.select("*")
.order(
"created_at",
{ ascending: false }
);

if (!error) {
  setNews(data || []);
}

setLoading(false);

}

return (
<div className="p-8">
<h1 className="text-5xl font-bold mb-8">
📰 Dashboard News
</h1>

  {loading ? (
    <div>
      News werden geladen...
    </div>
  ) : news.length === 0 ? (
    <div
      className="
        bg-white/5
        border
        border-white/10
        rounded-3xl
        p-6
      "
    >
      Noch keine News vorhanden.
    </div>
  ) : (
    <div className="grid gap-6">
      {news.map((item) => (
        <div
          key={item.id}
          className="
            bg-white/5
            border
            border-white/10
            rounded-3xl
            p-6
          "
        >
          <h2
            className="
              text-2xl
              font-bold
              mb-3
            "
          >
            {item.title}
          </h2>

          <p
            className="
              text-zinc-300
              whitespace-pre-wrap
              mb-4
            "
          >
            {item.content}
          </p>

          <div
            className="
              text-sm
              text-zinc-500
            "
          >
            von {item.author}
          </div>
        </div>
      ))}
    </div>
  )}
</div>

);
}