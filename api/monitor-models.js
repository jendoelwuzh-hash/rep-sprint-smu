// api/monitor-models.js
// Tugas Sentinel: Pantau ketersediaan model Gemini

const API_KEY = process.env.GEMINI_API_KEY;
const CURRENT_MODEL = "models/gemini-3.8-flash";
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;

async function checkModels() {
  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log("DEBUG RESPONSE:", JSON.stringify(data, null, 2)); const models = data.models ? data.models.map(m => m.name) : [];

    if (!models.includes(CURRENT_MODEL)) {
      console.error(`[SENTINEL ALERT] Model ${CURRENT_MODEL} tidak lagi ditemukan di API!`);
      // Di sini kita bisa tambahkan logika notifikasi Telegram/Slack nantinya
    } else {
      console.log(`[SENTINEL INFO] Model ${CURRENT_MODEL} masih tersedia.`);
    }
  } catch (error) {
    console.error("[SENTINEL ERROR] Gagal menghubungi API:", error);
  }
}

checkModels();
