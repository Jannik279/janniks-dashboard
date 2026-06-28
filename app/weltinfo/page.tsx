"use client";

import { useEffect, useMemo, useState } from "react";

type Article = {
  title?: string;
  link?: string;
  content?: string;
  pubDate?: string;
};

export default function WeltinfoPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function loadNews() {
      try {
        const res = await fetch("/api/rss");
        const data = await res.json();

        if (Array.isArray(data)) {
          setArticles(data);
        } else {
          setArticles([]);
          console.error(data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadNews();
  }, []);

  const filteredArticles = useMemo(() => {
    return articles.filter((article) =>
      (article.title || "")
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [articles, search]);

  const topNews = filteredArticles[0];
  const otherNews = filteredArticles.slice(1);

  return (
    <div className="p-6 md:p-8 pb-28 md:pb-8">

      <div className="mb-10">
        <h1 className="text-5xl font-bold">
          🌍 Weltinfo
        </h1>

        <p className="text-zinc-400 mt-2">
          Aktuelle Nachrichten aus aller Welt
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">

        <div className="glass-card rounded-3xl p-6">
          <p className="text-blue-400 text-sm mb-2">
            Artikel
          </p>

          <h3 className="text-4xl font-bold">
            {articles.length}
          </h3>
        </div>

        <div className="glass-card rounded-3xl p-6">
          <p className="text-green-400 text-sm mb-2">
            Quelle
          </p>

          <h3 className="text-2xl font-bold">
            Tagesschau
          </h3>
        </div>

        <div className="glass-card rounded-3xl p-6">
          <p className="text-purple-400 text-sm mb-2">
            Status
          </p>

          <h3 className="text-2xl font-bold">
            {loading ? "Lädt..." : "Aktiv"}
          </h3>
        </div>

      </div>

      <div className="glass-card rounded-3xl p-4 mb-8">
        <input
          type="text"
          placeholder="🔎 Nachrichten durchsuchen..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="
            w-full
            bg-transparent
            outline-none
            text-white
            placeholder:text-zinc-500
          "
        />
      </div>

      {loading ? (
        <div className="glass-card rounded-3xl p-6">
          Nachrichten werden geladen...
        </div>
      ) : (
        <>
          {topNews && (
            <a
              href={topNews.link}
              target="_blank"
              rel="noreferrer"
              className="
                block
                glass-card
                rounded-3xl
                p-8
                mb-8
                hover:scale-[1.01]
                transition
              "
            >
              <p className="text-red-400 font-semibold mb-3">
                🔥 Top-News
              </p>

              <h2 className="text-3xl font-bold mb-4">
                {topNews.title}
              </h2>

              <p className="text-zinc-300">
                {topNews.content}
              </p>
            </a>
          )}

          <h2 className="text-2xl font-bold mb-6">
            📰 Weitere Nachrichten
          </h2>

          <div className="grid gap-6">
            {otherNews.map((article, index) => (
              <a
                key={index}
                href={article.link}
                target="_blank"
                rel="noreferrer"
                className="
                  glass-card
                  rounded-3xl
                  p-6
                  hover:scale-[1.01]
                  transition
                "
              >
                <p className="accent-text text-sm mb-2">
                  Tagesschau
                </p>

                <h3 className="text-xl font-bold mb-3">
                  {article.title}
                </h3>

                <p className="text-zinc-400 mb-4">
                  {article.content}
                </p>

                <p className="text-sm text-zinc-500">
                  {article.pubDate}
                </p>
              </a>
            ))}
          </div>
        </>
      )}
    </div>
  );
}