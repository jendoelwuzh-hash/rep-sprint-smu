// Vercel Serverless Function -> /api/chat
// Penyedia AI: Gemini API (ada tier gratis dari Google AI Studio)

// Model yang dipastikan ada di API Key Anda
const GEMINI_MODELS = [
    "gemini-2.5-flash",
    "gemini-2.5-pro",
    "gemini-flash-latest",
    "gemini-flash-lite-latest",
"gemini-3.8-flash",
    "gemini-pro-latest",
    "gemini-2.5-flash-lite"
];

export default async function handler(req, res) {
  // Tambahkan log untuk debug key
  console.log("LOG: API handler dipanggil, key length:", process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.length : "null");

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "method" });

  const geminiKey = String(process.env.GEMINI_API_KEY || "").trim();

  if (!geminiKey) {
    console.error("CRITICAL: GEMINI_API_KEY is not defined in environment");
    return res.status(500).json({ error: "Configuration Error: API Key missing" });
  }

  const { system, messages, imageBase64, imageType } = req.body || {};
  if (!Array.isArray(messages) || messages.length === 0 || messages.length > 20) {
    return res.status(400).json({ error: "bad_messages" });
  }

  try {
    const model = GEMINI_MODELS[0];

    const contents = messages.map(m => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: String(m.content || " ") }]
    }));
    if (system) contents.unshift({ role: "user", parts: [{ text: String(system) }] });

    const body = { contents, generationConfig: { maxOutputTokens: 4096 } };

    console.log(`LOG: Calling Gemini API with model: ${model}`);
    const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
    });

    if (!r.ok) {
        const errorText = await r.text();
        console.error("LOG: ERROR FATAL di API:", errorText);
        return res.status(502).json({ error: "upstream", status: r.status, detail: errorText });
    }

    const data = await r.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    res.status(200).json({ text });

  } catch (e) {
    console.error("LOG: Chat error", e);
    return res.status(502).json({ error: "network", detail: e.message });
  }
}
