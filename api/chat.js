// Vercel Serverless Function -> /api/chat
// Penyedia AI: Gemini API

const MODEL = "models/gemini-3.8-flash";


export default async function handler(req, res) {
  // Tambahkan Header CORS agar aman
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  console.log("Request received:", req.method, req.url);

  try {
    const geminiKey = process.env.GEMINI_API_KEY;
    if (!geminiKey) {
      console.error("CRITICAL: Missing GEMINI_API_KEY");
      return res.status(500).json({ error: "Configuration error: Missing API Key" });
    }

    const { system, messages } = req.body || {};
    if (!Array.isArray(messages)) {
      return res.status(400).json({ error: "Invalid request body" });
    }

    // Transformasi pesan
    const contents = messages.map(m => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: String(m.content || " ") }]
    }));

    if (system) {
      contents.unshift({ role: "user", parts: [{ text: String(system) }] });
    }

    const body = { contents, generationConfig: { maxOutputTokens: 4096 } };
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${geminiKey}`;

    const r = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await r.json();

    if (!r.ok) {
      console.error("Gemini API Error:", data);
      return res.status(502).json({ error: "AI Service Error", detail: data.error?.message || "Unknown error" });
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    return res.status(200).json({ text: text || "Maaf, AI tidak memberikan jawaban." });

  } catch (e) {
    console.error("Internal Server Error:", e);
    return res.status(500).json({ error: "Internal server error", detail: e.message });
  }
}
