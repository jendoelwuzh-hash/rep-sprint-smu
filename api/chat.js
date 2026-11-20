// Vercel Serverless Function -> /api/chat
// Penyedia AI: Gemini API

// Gunakan model yang terbukti berhasil dan memiliki kuota
const GEMINI_MODELS = [
    "gemini-flash-lite-latest",
    "gemini-2.5-flash-lite", 
    "gemini-3.8-flash",
    "gemini-3.1-flash-lite" 
];

export default async function handler(req, res) {
  console.log("LOG: API handler dipanggil!");
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "method" });

  const geminiKey = String(process.env.GEMINI_API_KEY || "").trim();
  if (!geminiKey) return res.status(500).json({ error: "Key missing" });

  const { system, messages } = req.body || {};
  if (!Array.isArray(messages)) return res.status(400).json({ error: "Invalid body" });

  try {
    let data, success = false, lastError = "";

    for (const model of GEMINI_MODELS) {
        try {
            console.log(`LOG: Trying Gemini API with model: ${model}`);
            const contents = messages.map(m => ({
                role: m.role === "assistant" ? "model" : "user",
                parts: [{ text: String(m.content || " ") }]
            }));
            if (system) contents.unshift({ role: "user", parts: [{ text: String(system) }] });

            const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey}`, {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ contents, generationConfig: { maxOutputTokens: 4096 } }),
            });

            if (r.ok) {
                data = await r.json();
                success = true;
                break;
            } else {
                lastError = await r.text();
            }
        } catch (e) {
            console.error(`LOG: Failed model ${model}:`, e);
        }
    }

    if (!success) {
        console.error("LOG: All models failed. Last error:", lastError);
        return res.status(502).json({ error: "upstream", detail: lastError });
    }

    res.status(200).json({ text: data.candidates?.[0]?.content?.parts?.[0]?.text });
  } catch (e) {
    console.error("LOG: Chat error", e);
    return res.status(500).json({ error: "Internal server error", detail: e.message });
  }
}
