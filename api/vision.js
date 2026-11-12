// Vercel Serverless Function -> /api/vision
// Analisis gambar menggunakan Gemini API

const GEMINI_MODELS = ["gemini-2.5-flash"];

export default async function handler(req, res) {
  const geminiKey = String(process.env.GEMINI_API_KEY || "").trim();
  if (!geminiKey) return res.status(500).json({ error: "no_key" });
  if (req.method !== "POST") return res.status(405).json({ error: "method" });

  const { prompt, imageBase64, imageType } = req.body || {};
  if (!prompt || !imageBase64) return res.status(400).json({ error: "prompt and imageBase64 required" });

  try {
    const r = await fetch("https://generativelanguage.googleapis.com/v1beta/models/" + GEMINI_MODELS[0] + ":generateContent", {
      method: "POST",
      headers: { "content-type": "application/json", "x-goog-api-key": geminiKey },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ inlineData: { mimeType: imageType || "image/jpeg", data: imageBase64 } }, { text: prompt }] }],
        generationConfig: { maxOutputTokens: 4096 }
      }),
    });

    if (!r.ok) {
        const errorText = await r.text();
        console.error("Gemini Vision API Error:", r.status, errorText);
        return res.status(502).json({ error: "upstream_error", detail: errorText });
    }
    const data = await r.json();
    console.log("Gemini Vision API Response:", JSON.stringify(data));
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "Tidak ada jawaban";
    return res.status(200).json({ text });
  } catch (e) {
    return res.status(502).json({ error: "network_error" });
  }
}