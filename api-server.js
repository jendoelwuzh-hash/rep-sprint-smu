import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json({ limit: '50mb' }));

let availableModels = [];

async function refreshModels() {
    const geminiKey = process.env.GEMINI_API_KEY;
    if (!geminiKey) return;
    try {
        const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${geminiKey}`);
        const data = await r.json();
        if (data.models) {
            availableModels = data.models.map(m => m.name.replace('models/', ''));
            console.log("Model yang tersedia diperbarui:", availableModels);
        }
    } catch (e) {
        console.error("Gagal mendeteksi model:", e);
    }
}

function getBestModel(type) {
    // Cari model flash terbaru, utamakan versi 3.x
    const best = availableModels.find(m => m.includes(type) && m.includes('3.') && !m.includes('preview')) ||
                 availableModels.find(m => m.includes(type) && m.includes('3.')) ||
                 availableModels.find(m => m.includes(type));
    console.log(`Memilih model ${type}: ${best}`);
    return best || 'gemini-1.5-flash'; // Fallback
}

refreshModels();

app.post('/api/chat', async (req, res) => {
    const geminiKey = process.env.GEMINI_API_KEY;
    if (!geminiKey) return res.status(500).json({ error: "no_key" });

    const model = getBestModel('flash');
    const { system, messages } = req.body || {};
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

    if (r.status === 404) { await refreshModels(); return res.status(502).json({ error: "model_deprecated" }); }

    const data = await r.json();
    res.json({ text: data.candidates?.[0]?.content?.parts?.[0]?.text });
});

app.post('/api/vision', async (req, res) => {
    const geminiKey = process.env.GEMINI_API_KEY;
    if (!geminiKey) return res.status(500).json({ error: "no_key" });

    const model = getBestModel('flash');
    const { prompt, imageBase64, imageType } = req.body || {};

    const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
            contents: [{ role: "user", parts: [{ inlineData: { mimeType: imageType, data: imageBase64 } }, { text: prompt }] }],
            generationConfig: { maxOutputTokens: 4096 }
        }),
    });

    if (r.status === 404) { await refreshModels(); return res.status(502).json({ error: "model_deprecated" }); }

    const data = await r.json();
    res.json({ text: data.candidates?.[0]?.content?.parts?.[0]?.text });
});

app.listen(3000, () => console.log('API Server berjalan di port 3000'));
