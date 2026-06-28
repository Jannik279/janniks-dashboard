import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "Du bist der persönliche Assistent von Jannik.",
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    return Response.json({
      reply: response.choices[0].message.content,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        reply:
          "Die KI ist momentan nicht verfügbar. Bitte überprüfe dein API-Guthaben.",
      },
      { status: 500 }
    );
  }
}