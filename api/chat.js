// Vercel Serverless Function -> /api/chat
const MODEL = "gemini-2.5-flash";

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  // Sentinel: Cek apakah key terbaca
  const keyExists = !!process.env.GEMINI_API_KEY;
  console.log("Sentinel Check: GEMINI_API_KEY exists?", keyExists);

  if (!keyExists) {
    console.error("CRITICAL: GEMINI_API_KEY is not defined in environment");
    return res.status(500).json({ error: "Configuration Error: API Key missing in Vercel" });
  }

  try {
    const geminiKey = process.env.GEMINI_API_KEY;
    const { system, messages } = req.body || {};

    if (!Array.isArray(messages)) {
      return res.status(400).json({ error: "Invalid request body" });
    }

    const contents = messages.map(m => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: String(m.content || " ") }]
    }));
    if (system) contents.unshift({ role: "user", parts: [{ text: String(system) }] });

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${geminiKey}`;

    console.log("Sentinel: Calling Gemini API...");
    const r = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents, generationConfig: { maxOutputTokens: 4096 } }),
    });

    // Sentinel: Baca teks dulu
    const responseText = await r.text();
    console.log("Sentinel: Response status:", r.status);
    console.log("Sentinel: Raw Response:", responseText);

    if (!r.ok) {
      throw new Error(`API Error ${r.status}: ${responseText}`);
    }

    const data = JSON.parse(responseText);
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    return res.status(200).json({ text: text || "Maaf, AI tidak memberikan jawaban." });

  } catch (e) {
    console.error("Internal Server Error:", e.message);
    return res.status(500).json({ error: "Internal server error", detail: e.message });
  }
}
