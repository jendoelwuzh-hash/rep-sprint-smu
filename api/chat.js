// Vercel Serverless Function -> /api/chat
// Penyedia AI: Gemini API

// Gunakan model yang terbukti berhasil dan memiliki kuota
const GEMINI_MODELS = [
    "gemini-flash-lite-latest",
    "gemini-2.5-flash-lite",
    "gemini-3.8-flash",
    "gemini-3.1-flash-lite"
];

import { AGENTS, ALL_UNITS, STUDENT_CONTEXT, BASE_RULES } from '../src/data/subjects.js';

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "method" });

  const geminiKey = String(process.env.GEMINI_API_KEY || "").trim();
  if (!geminiKey) return res.status(500).json({ error: "Key missing" });

  const { activeAgentId, activeUnitId, messages } = req.body || {};
  if (!Array.isArray(messages)) return res.status(400).json({ error: "Invalid body" });

  // Konstruksi system prompt dinamis
  const agent = AGENTS.find(a => a.id === activeAgentId) || AGENTS[0];
  const unit = ALL_UNITS.find(u => u.id === activeUnitId);
  const system = [
      agent.system,
      "INSTRUKSI WAJIB: Jangan pernah gunakan Mermaid. Jika butuh diagram, berikan spesifikasi JSON untuk komponen SVG internal kami (tipe: 'coordinate', 'numberline', 'bar', atau 'shape').",
      STUDENT_CONTEXT,
      unit ? `Topik: ${unit.title}` : ""
  ].filter(Boolean).join("\n\n");

  try {
    let data, success = false, lastError = "";

    // Filter pesan: Buang pesan yang berisi instruksi sistem agar tidak muncul di chat bubble
    // Cek apakah content mengandung kata kunci instruksi sistem
    const isSystemInstruction = (text) => {
        const triggers = ["INSTRUKSI WAJIB", "Konteks siswa:", "BASE_RULES", "Guru Sabar", "Teman Belajar", "Guru Kilat", "Kuis Master", "Agen Soal HOTS", "Master Trik"];
        return triggers.some(trigger => text.includes(trigger));
    };

    const filteredMessages = messages.filter(m => m.role !== 'system' && !isSystemInstruction(m.content));

    for (const model of GEMINI_MODELS) {
        try {
            const contents = filteredMessages.map(m => ({
                role: m.role === "assistant" ? "model" : "user",
                parts: [{ text: String(m.content || " ") }]
            }));

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
