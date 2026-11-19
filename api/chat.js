// Vercel Serverless Function -> /api/chat
// Penyedia AI: Gemini API

const GEMINI_MODELS = [
    "gemini-2.5-flash",
    "gemini-2.5-pro",
    "gemini-flash-latest",
    "gemini-flash-lite-latest",
    "gemini-pro-latest",
    "gemini-2.5-flash-lite"
];

export default async function handler(req, res) {
  console.log("LOG: API handler dipanggil!");
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "method" });

  const geminiKey = String(process.env.GEMINI_API_KEY || "").trim();
  if (!geminiKey) return res.status(500).json({ error: "Key missing" });

  const { system, messages } = req.body || {};

  try {
    for (const model of GEMINI_MODELS) {
        console.log(`LOG: Mencoba model: ${model}`);
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

        const textResponse = await r.text();
        if (r.ok) {
            const data = JSON.parse(textResponse);
            console.log("LOG: Berhasil mendapatkan respon dari model:", model);
            return res.status(200).json({ text: data.candidates?.[0]?.content?.parts?.[0]?.text });
        } else {
            console.error(`LOG: Model ${model} gagal dengan respon:`, textResponse);
        }
    }
    return res.status(502).json({ error: "Semua model gagal" });
  } catch (e) {
    console.error("LOG: Error fatal:", e);
    return res.status(500).json({ error: e.message });
  }
}
