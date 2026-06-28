export default function AIPage() {
  const tools = [
    {
      title: "🚀 ChatGPT",
      link: "https://chatgpt.com",
      desc: "Allgemeiner KI-Assistent",
      color: "from-green-500 to-emerald-600",
    },
    {
      title: "💎 Gemini",
      link: "https://gemini.google.com",
      desc: "Google KI",
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "🧠 Claude",
      link: "https://claude.ai",
      desc: "KI von Anthropic",
      color: "from-orange-500 to-amber-500",
    },
    {
      title: "🎨 Bildgenerator",
      link: "https://chatgpt.com",
      desc: "Bilder erstellen",
      color: "from-pink-500 to-purple-600",
    },
    {
      title: "📚 Lernhelfer",
      link: "https://chatgpt.com",
      desc: "Hausaufgaben & Lernen",
      color: "from-indigo-500 to-blue-600",
    },
    {
      title: "💻 Programmieren",
      link: "https://chatgpt.com",
      desc: "Code schreiben & Fehler finden",
      color: "from-purple-500 to-violet-600",
    },
  ];

  return (
    <div className="p-6 md:p-8 pb-28 md:pb-8">
      <div className="mb-10">
        <h1 className="text-4xl md:text-5xl font-bold">
          🤖 KI-Zentrale
        </h1>

        <p className="text-zinc-300 mt-2">
          Deine wichtigsten KI-Werkzeuge an einem Ort.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-6">
          <p className="text-green-400 text-sm mb-2">
            Verfügbar
          </p>

          <p className="text-4xl font-bold">
            {tools.length}
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-6">
          <p className="text-blue-400 text-sm mb-2">
            Kategorie
          </p>

          <p className="text-xl font-bold">
            KI & Produktivität
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-6">
          <p className="text-orange-400 text-sm mb-2">
            Status
          </p>

          <p className="text-xl font-bold">
            🟢 Online
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {tools.map((tool) => (
          <a
            key={tool.title}
            href={tool.link}
            target="_blank"
            rel="noopener noreferrer"
            className="
              bg-white/5
              backdrop-blur-lg
              border
              border-white/10
              rounded-3xl
              p-6
              hover:scale-[1.03]
              transition-all
              duration-300
              shadow-xl
            "
          >
            <div
              className={`
                w-14
                h-14
                rounded-2xl
                bg-gradient-to-r
                ${tool.color}
                flex
                items-center
                justify-center
                text-2xl
                mb-4
              `}
            >
              {tool.title.split(" ")[0]}
            </div>

            <h2 className="text-2xl font-bold mb-2">
              {tool.title}
            </h2>

            <p className="text-zinc-300 mb-4">
              {tool.desc}
            </p>

            <div className="text-blue-400 font-medium">
              Öffnen →
            </div>
          </a>
        ))}
      </div>

      <div className="mt-8 bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-6 shadow-xl">
        <h2 className="text-2xl font-bold mb-4">
          ⚡ Schnellinfo
        </h2>

        <p className="text-zinc-300">
          Hier findest du alle wichtigen KI-Dienste für
          Lernen, Programmieren, Texte, Bilder und den
          Alltag. Später können wir hier auch einen
          eigenen Chat direkt in dein Dashboard einbauen.
        </p>
      </div>
    </div>
  );
}