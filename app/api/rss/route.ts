import { NextResponse } from "next/server";
import Parser from "rss-parser";

const parser = new Parser();

export async function GET() {
try {
const feeds = [
"https://www.tagesschau.de/xml/rss2",
"https://rss.dw.com/xml/rss-de-top",
];

let articles: any[] = [];

for (const url of feeds) {
  try {
    const feed = await parser.parseURL(url);

    const items = feed.items.map((item) => ({
      title: item.title || "Kein Titel",
      link: item.link || "#",
      content:
        item.contentSnippet ||
        item.content ||
        "Keine Beschreibung",
      pubDate: item.pubDate || "",
      source: feed.title || "Nachrichten",
    }));

    articles.push(...items);
  } catch (err) {
    console.error("Feed Fehler:", url);
  }
}

articles = articles.slice(0, 30);

return NextResponse.json(articles);

} catch (error) {
console.error(error);

return NextResponse.json(
  {
    error: "RSS konnte nicht geladen werden",
  },
  {
    status: 500,
  }
);

}
}