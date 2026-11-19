// Vercel Serverless Function -> /api/chat
// Penyedia AI: Gemini API (ada tier gratis dari Google AI Studio)

const VERSION = "v4-gemini";
// Model Gemini yang tersedia di akun Anda:
const GEMINI_MODELS = [
    "gemini-2.5-flash",
    "gemini-2.5-pro",
    "gemini-flash-latest",
    "gemini-flash-lite-latest",
    "gemini-pro-latest",
    "gemini-2.5-flash-lite"
];
const MAX_CHARS = 30000;

export default async function handler(req, res) {
  console.log("LOG: API handler dipanggil!");
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "method" });

  const geminiKey = String(process.env.GEMINI_API_KEY || "").trim();
  const keyExists = !!geminiKey;
  console.log("LOG: Apakah API KEY ada?", keyExists);

  if (!keyExists) {
    console.error("CRITICAL: GEMINI_API_KEY is not defined in environment");
    return res.status(500).json({ error: "Configuration Error: API Key missing" });
  }

  const { system, messages, imageBase64, imageType } = req.body || {};
  if (!Array.isArray(messages) || messages.length === 0 || messages.length > 20) {
    return res.status(400).json({ error: "bad_messages" });
  }

  const total = JSON.stringify(messages).length + String(system || "").length;
  if (total > MAX_CHARS) return res.status(413).json({ error: "too_large" });

  try {
    let data;
    let success = false;
    let lastError = "";

    // Mencoba model dari daftar yang tersedia satu per satu
    for (const model of GEMINI_MODELS) {
        try {
            console.log(`LOG: Trying Gemini API with model: ${model}`);
            const contents = messages.map(m => ({
                role: m.role === "assistant" ? "model" : "user",
                parts: [{ text: String(m.content || " ") }]
            }));
            if (system) contents.unshift({ role: "user", parts: [{ text: String(system) }] });

            const body = { contents, generationConfig: { maxOutputTokens: 4096 } };
            const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey}`, {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify(body),
            });

            if (r.ok) {
                data = await r.json();
                success = true;
                break;
            } else {
                lastError = await r.text();
                console.error(`LOG: Model ${model} failed:`, lastError);
            }
        } catch (e) {
            console.error(`LOG: Error with model ${model}:`, e);
        }
    }

    if (!success) {
        return res.status(502).json({ error: "upstream", detail: lastError });
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    res.status(200).json({ text });

  } catch (e) {
    console.error("LOG: Chat error", e);
    return res.status(502).json({ error: "network", detail: e.message });
  }
}
