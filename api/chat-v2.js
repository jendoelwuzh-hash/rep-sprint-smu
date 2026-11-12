// Vercel Serverless Function -> /api/chat
// Memilih penyedia AI otomatis dari environment variable yang diisi di Vercel:
//   - GITHUB_TOKEN      -> GitHub Models (gratis, ada batas pemakaian)
//   - ANTHROPIC_API_KEY -> Claude API (berbayar, tanpa batas harian ketat)
// Kalau keduanya ada, Claude API yang dipakai.

const CLAUDE_MODEL = "claude-sonnet-5-5";
const GITHUB_MODEL = process.env.GITHUB_MODEL || "openai/gpt-4o-mini";
const MAX_CHARS = 30000;

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "method" });

  const claudeKey = String(process.env.ANTHROPIC_API_KEY || "").trim();
  const ghToken = String(process.env.GITHUB_TOKEN || "").trim();
  const useClaude = !!claudeKey;
  const useGitHub = !useClaude && !!ghToken;
  if (!useClaude && !useGitHub) return res.status(500).json({ error: "no_key" });

  const { system, messages, imageBase64, imageType } = req.body || {};
  if (!Array.isArray(messages) || messages.length === 0 || messages.length > 20) {
    return res.status(400).json({ error: "bad_messages" });
  }
  const total = JSON.stringify(messages).length + String(system || "").length;
  if (total > MAX_CHARS) return res.status(413).json({ error: "too_large" });

  // GitHub Models gratis: batas input sekitar 8K token per permintaan -> riwayat dipangkas
  let history = messages.map((m) => ({
    role: m.role === "assistant" ? "assistant" : "user",
    content: String(m.content || " "),
  }));
  if (useGitHub) {
    history = history.slice(-8);
    while (history.length && history[0].role !== "user") history = history.slice(1);
  }
  const mime = imageType || "image/jpeg";

  try {
    let r;
    if (useClaude) {
      const msgs = history.map((m) => ({ ...m }));
      if (imageBase64) {
        const last = msgs[msgs.length - 1];
        last.content = [
          { type: "image", source: { type: "base64", media_type: mime, data: imageBase64 } },
          { type: "text", text: last.content },
        ];
      }
      const body = { model: CLAUDE_MODEL, max_tokens: 1500, messages: msgs };
      if (system) body.system = String(system);
      r = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-api-key": claudeKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify(body),
      });
    } else {
      const msgs = [];
      if (system) msgs.push({ role: "system", content: String(system) });
      history.forEach((m) => msgs.push({ ...m }));
      if (imageBase64) {
        const last = msgs[msgs.length - 1];
        last.content = [
          { type: "text", text: last.content },
          { type: "image_url", image_url: { url: "data:" + mime + ";base64," + imageBase64 } },
        ];
      }
      r = await fetch("https://models.github.ai/inference/chat/completions", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          accept: "application/vnd.github+json",
          "x-github-api-version": "2022-11-28",
          authorization: "Bearer " + ghToken,
        },
        body: JSON.stringify({ model: GITHUB_MODEL, max_tokens: 1500, messages: msgs }),
      });
    }

    if (r.status === 429) return res.status(429).json({ error: "rate_limited" });
    if (!r.ok) {
      let detail = "";
      try { detail = (await r.text()).slice(0, 300); } catch (e2) { /* abaikan */ }
      console.error("upstream error", r.status, detail);
      return res.status(502).json({ error: "upstream", status: r.status, detail });
    }
    const data = await r.json();

    const text = useClaude
      ? (data.content || []).filter((b) => b.type === "text").map((b) => b.text).join("\n").trim()
      : String(data.choices?.[0]?.message?.content || "").trim();
    return res.status(200).json({ text });
  } catch (e) {
    console.error("chat error", e);
    const detail = String((e && e.message) || e) + (e && e.cause && e.cause.code ? " (" + e.cause.code + ")" : "");
    return res.status(502).json({ error: "network", detail });
  }
}
