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
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "method" });

  const geminiKey = String(process.env.GEMINI_API_KEY || "").trim();
  if (!geminiKey) return res.status(500).json({ error: "Key missing" });

  const { system, messages } = req.body || {};
  if (!Array.isArray(messages)) return res.status(400).json({ error: "Invalid body" });

  try {
    let data, success = false, lastError = "";

    // Bersihkan pesan agar prompt sistem tidak disisipkan sebagai user message yang membingungkan model
    // Filter pesan yang merupakan replika dari prompt sistem agar tidak muncul di chat
    const filteredMessages = messages.filter(m => m.role !== 'system' && !m.content.includes("INSTRUKSI WAJIB"));

    for (const model of GEMINI_MODELS) {
        try {
            const contents = filteredMessages.map(m => ({
                role: m.role === "assistant" ? "model" : "user",
                parts: [{ text: String(m.content || " ") }]
            }));

            // Masukkan system prompt sebagai parameter khusus jika API mendukung,
            // atau tambahkan di awal jika perlu, namun jangan biarkan muncul di bubble chat
            const requestBody = {
                contents,
                generationConfig: { maxOutputTokens: 4096 }
            };
            if (system) {
                requestBody.systemInstruction = { parts: [{ text: String(system) }] };
            }

            const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey}`, {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify(requestBody),
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
        return res.status(502).json({ error: "upstream", detail: lastError });
    }

    const sanitize = (text) => {
        if (!text) return "";
        return text.replace(/[\u0000-\u001F\u007F-\u009F]/g, "");
    };

    res.status(200).json({ text: sanitize(data.candidates?.[0]?.content?.parts?.[0]?.text) });
  } catch (e) {
    return res.status(500).json({ error: "Internal server error", detail: e.message });
  }
}
