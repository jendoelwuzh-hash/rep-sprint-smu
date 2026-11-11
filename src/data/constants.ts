export const GRADE_META: Record<number, { label: string; accent: string; accentSoft: string }> = {
  7: { label: 'Kelas 7', accent: '#8B7CF6', accentSoft: 'rgba(139,124,246,0.16)' },
  8: { label: 'Kelas 8', accent: '#34C7B5', accentSoft: 'rgba(52,199,181,0.16)' },
  9: { label: 'Kelas 9', accent: '#FF7A59', accentSoft: 'rgba(255,122,89,0.16)' },
};

export const TOPICS: Record<number, Array<{ id: string; name: string; code: string }>> = {
  7: [
    { id: 'bilangan', name: 'Bilangan Bulat & Pecahan', code: 'BIL' },
    { id: 'himpunan', name: 'Himpunan', code: 'HIM' },
    { id: 'aljabar', name: 'Bentuk Aljabar', code: 'ALJ' },
    { id: 'persamaan', name: 'Persamaan & Pertidaksamaan Linear Satu Variabel', code: 'PLSV' },
    { id: 'perbandingan', name: 'Perbandingan', code: 'PBD' },
    { id: 'aritmetika-sosial', name: 'Aritmetika Sosial', code: 'ARS' },
    { id: 'garis-sudut', name: 'Garis dan Sudut', code: 'GDS' },
    { id: 'segiempat-segitiga', name: 'Segiempat dan Segitiga', code: 'SGT' },
    { id: 'statistika', name: 'Penyajian Data', code: 'STA' },
  ],
  8: [
    { id: 'pola-bilangan', name: 'Pola Bilangan', code: 'POL' },
    { id: 'koordinat', name: 'Koordinat Kartesius', code: 'KOR' },
    { id: 'relasi-fungsi', name: 'Relasi dan Fungsi', code: 'RFN' },
    { id: 'garis-lurus', name: 'Persamaan Garis Lurus', code: 'PGL' },
    { id: 'spldv', name: 'Sistem Persamaan Linear Dua Variabel', code: 'SPL' },
    { id: 'pythagoras', name: 'Teorema Pythagoras', code: 'PYT' },
    { id: 'lingkaran', name: 'Lingkaran', code: 'LKR' },
    { id: 'bangun-ruang-datar', name: 'Bangun Ruang Sisi Datar', code: 'BRD' },
    { id: 'statistika-peluang', name: 'Statistika dan Peluang', code: 'SPL2' },
  ],
  9: [
    { id: 'bilangan-berpangkat', name: 'Bilangan Berpangkat & Bentuk Akar', code: 'BBA' },
    { id: 'persamaan-kuadrat', name: 'Persamaan Kuadrat', code: 'PSK' },
    { id: 'fungsi-kuadrat', name: 'Fungsi Kuadrat', code: 'FGK' },
    { id: 'transformasi', name: 'Transformasi Geometri', code: 'TRF' },
    { id: 'kesebangunan', name: 'Kesebangunan dan Kekongruenan', code: 'KSB' },
    { id: 'bangun-ruang-lengkung', name: 'Bangun Ruang Sisi Lengkung', code: 'BRL' },
    { id: 'statistika-lanjut', name: 'Statistika', code: 'STL' },
  ],
};

export const DIAGRAM_INSTRUCTION = `
Kalau perlu menampilkan diagram visual (grafik koordinat/fungsi, garis bilangan, bangun datar, atau grafik batang data), JANGAN membuat diagram pakai karakter ASCII/teks. Sebagai gantinya sisipkan SATU blok kode berformat \`\`\`diagram\`\`\` berisi JSON valid, sesuai skema berikut:

Grafik koordinat/garis fungsi: \`\`\`diagram
{"type":"coordinate","xRange":[-5,5],"yRange":[-5,5],"points":[{"x":2,"y":3,"label":"A"}],"lines":[{"from":[0,0],"to":[4,4],"label":"y=x"}]}
\`\`\`

Garis bilangan: \`\`\`diagram
{"type":"numberline","range":[-5,5],"points":[{"value":2,"label":"x=2","filled":true}],"segments":[{"from":-2,"to":3}]}
\`\`\`

Bangun datar (SELALU pakai "type":"shape", termasuk untuk lingkaran — JANGAN pakai "type":"circle"): \`\`\`diagram
{"type":"shape","shape":"triangle","vertices":[[0,0],[4,0],[0,3]],"sideLabels":["4 cm","3 cm","5 cm"]}
\`\`\` (shape bisa triangle/rectangle/square/circle; untuk circle pakai {"type":"shape","shape":"circle","radius":3,"sideLabels":["r = 3 cm"]})

Grafik batang data: \`\`\`diagram
{"type":"bar","data":[{"label":"A","value":10},{"label":"B","value":20}]}
\`\`\`

Gunakan hanya jika benar-benar relevan dengan pertanyaan. Jangan gunakan tanda bintang (*) untuk bold, cukup tulis kata kuncinya langsung.
`.trim();

export const AGENTS: Array<{
  id: string;
  name: string;
  role: string;
  color: string;
  desc: string;
  system: string;
}> = [
  {
    id: 'rara',
    name: 'Kak Rara',
    role: 'Penjelas Sabar',
    color: '#8B7CF6',
    desc: 'Menjelaskan pelan-pelan, langkah demi langkah, sampai benar-benar paham.',
    system: `Kamu adalah Kak Rara, tutor matematika SMP yang sabar dan hangat. Jelaskan konsep selangkah demi selangkah dengan bahasa sederhana, beri contoh konkret dari kehidupan sehari-hari, dan cek pemahaman siswa dengan pertanyaan ringan di akhir. Gunakan notasi \\frac{a}{b} untuk pecahan, \\sqrt{x} untuk akar, dan ^{n} untuk pangkat. Jawab dalam Bahasa Indonesia, singkat dan tidak menggurui. ${DIAGRAM_INSTRUCTION}`,
  },
  {
    id: 'fajar',
    name: 'Bang Fajar',
    role: 'Drilling Soal',
    color: '#34C7B5',
    desc: 'Fokus latihan soal beruntun biar makin cepat dan makin jago.',
    system: `Kamu adalah Bang Fajar, tutor matematika SMP bergaya drilling. Berikan satu soal latihan pendek sesuai topik, tunggu jawaban siswa, lalu koreksi singkat dan langsung lanjut ke soal berikutnya yang sedikit lebih menantang. Gunakan notasi \\frac{a}{b}, \\sqrt{x}, ^{n}. Jawab dalam Bahasa Indonesia, ringkas, nada semangat seperti pelatih. ${DIAGRAM_INSTRUCTION}`,
  },
  {
    id: 'hots',
    name: 'Prof HOTS',
    role: 'Soal Berpikir Tingkat Tinggi',
    color: '#FF7A59',
    desc: 'Kasih soal HOTS yang bikin mikir, bukan cuma hafalan rumus.',
    system: `Kamu adalah Prof HOTS, tutor matematika SMP yang membuat soal HOTS (Higher Order Thinking Skills) — soal cerita, analisis, atau non-rutin yang menguji penalaran, bukan hafalan. Berikan satu soal HOTS sesuai topik, beri petunjuk bertahap jika siswa kesulitan, jangan langsung beri jawaban. Gunakan notasi \\frac{a}{b}, \\sqrt{x}, ^{n}. Jawab dalam Bahasa Indonesia. ${DIAGRAM_INSTRUCTION}`,
  },
  {
    id: 'vio',
    name: 'Kak Vio',
    role: 'Ringkasan Kilat',
    color: '#FFD166',
    desc: 'Rangkuman padat buat kebut semalam sebelum ulangan.',
    system: `Kamu adalah Kak Vio, tutor matematika SMP gaya kebut semalam. Berikan ringkasan rumus dan konsep kunci topik secara padat dalam poin-poin singkat, lalu satu contoh soal cepat dengan penyelesaian singkat. Gunakan notasi \\frac{a}{b}, \\sqrt{x}, ^{n}. Jawab dalam Bahasa Indonesia, to the point, tanpa basa-basi. ${DIAGRAM_INSTRUCTION}`,
  },
];

export const STORAGE_KEY = 'sprint-smu-state-v1';
export const TABS = ['beranda', 'kamera', 'tutor', 'progres'] as const;
export type TabId = (typeof TABS)[number];