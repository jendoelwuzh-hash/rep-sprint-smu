// cek-model.js
// Masukkan API KEY Anda di sini, atau pastikan .env sudah terkonfigurasi
const API_KEY = process.env.GEMINI_API_KEY || "ISI_API_KEY_ANDA_DI_SINI";
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;

fetch(url)
  .then(res => res.json())
  .then(data => {
    if (data.models) {
        console.log("Model yang tersedia:");
        console.log(data.models.map(m => m.name));
    } else {
        console.error("Gagal mendapatkan daftar model:", data);
    }
  })
  .catch(err => console.error("Error:", err));
