import { InteractiveVisualizer } from './components/InteractiveMath';
import React, { useState, useRef, useEffect, useCallback } from "react";
import { useChat } from '@ai-sdk/react';
import "./sprint-smu.css";
import { useAuth } from './context/AuthContext'; // Import useAuth
import { supabase } from './lib/supabaseClient'; // TAMBAHKAN INI

// ---------------------------------------------------------------------------
// Static data: subjects -> grades -> units
// ---------------------------------------------------------------------------
const MATH_GRADES = [
    { id: "10", label: "Kelas 10", units: [
            { id: "mat-10-eksponen", title: "Eksponen", subtitle: "Pangkat sebagai tumpukan perkalian", accent: "#22D3EE" },
            { id: "mat-10-logaritma", title: "Logaritma", subtitle: "Pertanyaan terbalik dari pangkat", accent: "#38BDF8" },
            { id: "mat-10-akar", title: "Bentuk Akar", subtitle: "Operasi akar & rasionalisasi", accent: "#818CF8" },
            { id: "mat-10-barisan", title: "Barisan & Deret", subtitle: "Tambah tetap vs kali tetap", accent: "#A78BFA" },
            { id: "mat-10-trigo", title: "Trigonometri", subtitle: "Rasio sisi & sudut istimewa", accent: "#F472B6" },
            { id: "mat-10-spldv", title: "SPLDV", subtitle: "Dua persamaan, satu titik potong", accent: "#FB923C" },
            { id: "mat-10-kuadrat", title: "Fungsi Kuadrat", subtitle: "Parabola, puncak, diskriminan", accent: "#FBBF24" },
            { id: "mat-10-peluang", title: "Peluang", subtitle: "Menghitung kemungkinan kejadian", accent: "#34D399" },
        ] },
    { id: "11", label: "Kelas 11", units: [
            { id: "mat-11-komposisi", title: "Fungsi Komposisi & Invers", subtitle: "Menggabung & membalik fungsi", accent: "#22D3EE" },
            { id: "mat-11-lingkaran", title: "Lingkaran", subtitle: "Persamaan lingkaran & garis singgung", accent: "#38BDF8" },
            { id: "mat-11-polinomial", title: "Polinomial", subtitle: "Suku banyak, pembagian, teorema sisa", accent: "#818CF8" },
            { id: "mat-11-trigolanjut", title: "Trigonometri Lanjutan", subtitle: "Identitas & aturan sinus-cosinus", accent: "#A78BFA" },
            { id: "mat-11-transformasi", title: "Transformasi Geometri", subtitle: "Translasi, refleksi, rotasi, dilatasi", accent: "#F472B6" },
            { id: "mat-11-vektor", title: "Vektor", subtitle: "Besaran arah di bidang & ruang", accent: "#FB923C" },
            { id: "mat-11-statistika", title: "Statistika", subtitle: "Ukuran penyebaran data berkelompok", accent: "#FBBF24" },
            { id: "mat-11-peluangmajemuk", title: "Peluang Kejadian Majemuk", subtitle: "Gabungan, irisan, saling bebas", accent: "#34D399" },
        ] },
    { id: "12", label: "Kelas 12", units: [
            { id: "mat-12-limit", title: "Limit Fungsi", subtitle: "Nilai fungsi saat mendekati suatu titik", accent: "#22D3EE" },
            { id: "mat-12-turunan", title: "Turunan", subtitle: "Laju perubahan & kemiringan kurva", accent: "#38BDF8" },
            { id: "mat-12-integral", title: "Integral", subtitle: "Kebalikan turunan & luas daerah", accent: "#818CF8" },
            { id: "mat-12-matriks", title: "Matriks", subtitle: "Operasi & determinan susunan bilangan", accent: "#A78BFA" },
            { id: "mat-12-programlinear", title: "Program Linear", subtitle: "Optimasi dengan pertidaksamaan", accent: "#F472B6" },
            { id: "mat-12-deretlanjut", title: "Barisan & Deret Tak Hingga", subtitle: "Deret geometri & aplikasi bunga", accent: "#FB923C" },
            { id: "mat-12-statinferensial", title: "Statistika Inferensial", subtitle: "Menarik kesimpulan dari sampel data", accent: "#FBBF24" },
            { id: "mat-12-kombinatorika", title: "Kombinatorika Lanjutan", subtitle: "Permutasi & kombinasi kasus kompleks", accent: "#34D399" },
        ] },
];
const KIMIA_GRADES = [
    { id: "10", label: "Kelas 10", units: [
            { id: "kim-10-hakikat", title: "Hakikat Ilmu Kimia", subtitle: "Metode ilmiah & keselamatan lab", accent: "#22D3EE" },
            { id: "kim-10-atom", title: "Struktur Atom", subtitle: "Model atom & konfigurasi elektron", accent: "#38BDF8" },
            { id: "kim-10-periodik", title: "Sistem Periodik Unsur", subtitle: "Golongan, periode, sifat berkala", accent: "#818CF8" },
            { id: "kim-10-ikatan", title: "Ikatan Kimia", subtitle: "Ikatan ion, kovalen, dan logam", accent: "#A78BFA" },
            { id: "kim-10-bentukmolekul", title: "Bentuk Molekul", subtitle: "Teori VSEPR & gaya antarmolekul", accent: "#F472B6" },
            { id: "kim-10-stoikiometri", title: "Stoikiometri", subtitle: "Mol, rumus empiris & molekul", accent: "#FB923C" },
            { id: "kim-10-elektrolit", title: "Larutan Elektrolit", subtitle: "Elektrolit vs non-elektrolit", accent: "#FBBF24" },
            { id: "kim-10-redoks", title: "Reaksi Redoks Dasar", subtitle: "Bilangan oksidasi & penyetaraan", accent: "#34D399" },
        ] },
    { id: "11", label: "Kelas 11", units: [
            { id: "kim-11-termokimia", title: "Termokimia", subtitle: "Entalpi & kalor reaksi", accent: "#22D3EE" },
            { id: "kim-11-lajureaksi", title: "Laju Reaksi", subtitle: "Faktor penentu & orde reaksi", accent: "#38BDF8" },
            { id: "kim-11-kesetimbangan", title: "Kesetimbangan Kimia", subtitle: "Tetapan kesetimbangan & pergeseran", accent: "#818CF8" },
            { id: "kim-11-asambasa", title: "Asam Basa", subtitle: "Teori asam-basa & perhitungan pH", accent: "#A78BFA" },
            { id: "kim-11-penyangga", title: "Larutan Penyangga", subtitle: "Mempertahankan pH larutan", accent: "#F472B6" },
            { id: "kim-11-hidrolisis", title: "Hidrolisis Garam", subtitle: "Sifat asam-basa garam terlarut", accent: "#FB923C" },
            { id: "kim-11-ksp", title: "Ksp", subtitle: "Kelarutan & hasil kali kelarutan", accent: "#FBBF24" },
            { id: "kim-11-koloid", title: "Koloid", subtitle: "Sistem dispersi & sifat koloid", accent: "#34D399" },
        ] },
    { id: "12", label: "Kelas 12", units: [
            { id: "kim-12-koligatif", title: "Sifat Koligatif Larutan", subtitle: "Penurunan titik beku, kenaikan titik didih", accent: "#22D3EE" },
            { id: "kim-12-elektrokimia", title: "Elektrokimia", subtitle: "Sel volta & potensial elektrode", accent: "#38BDF8" },
            { id: "kim-12-elektrolisis", title: "Elektrolisis", subtitle: "Reaksi kimia oleh arus listrik", accent: "#818CF8" },
            { id: "kim-12-korosi", title: "Korosi", subtitle: "Proses & cara pencegahan karat", accent: "#A78BFA" },
            { id: "kim-12-kimiaunsur", title: "Kimia Unsur", subtitle: "Sifat unsur golongan utama & transisi", accent: "#F472B6" },
            { id: "kim-12-senyawakarbon", title: "Senyawa Karbon", subtitle: "Gugus fungsi & tata nama", accent: "#FB923C" },
            { id: "kim-12-polimer", title: "Polimer", subtitle: "Makromolekul alami & sintetis", accent: "#FBBF24" },
            { id: "kim-12-biomolekul", title: "Biomolekul", subtitle: "Karbohidrat, protein, dan lemak", accent: "#34D399" },
        ] },
];
const PHYSICS_GRADES = [
    { id: "10", label: "Kelas 10", units: [
            { id: "fis-10-besaran", title: "Besaran & Pengukuran", subtitle: "Angka penting & ketidakpastian", accent: "#22D3EE" },
            { id: "fis-10-vektor", title: "Vektor", subtitle: "Penjumlahan & penguraian vektor", accent: "#38BDF8" },
            { id: "fis-10-geraklurus", title: "Gerak Lurus", subtitle: "GLB & GLBB", accent: "#818CF8" },
            { id: "fis-10-gerakparabola", title: "Gerak Parabola", subtitle: "Gerak dua dimensi akibat gravitasi", accent: "#A78BFA" },
            { id: "fis-10-newton", title: "Hukum Newton", subtitle: "Gaya, massa, dan percepatan", accent: "#F472B6" },
            { id: "fis-10-melingkar", title: "Gerak Melingkar", subtitle: "Kecepatan sudut & percepatan sentripetal", accent: "#FB923C" },
            { id: "fis-10-usahaenergi", title: "Usaha & Energi", subtitle: "Kerja, energi kinetik & potensial", accent: "#FBBF24" },
            { id: "fis-10-momentum", title: "Momentum & Impuls", subtitle: "Tumbukan & kekekalan momentum", accent: "#34D399" },
        ] },
    { id: "11", label: "Kelas 11", units: [
            { id: "fis-11-elastisitas", title: "Elastisitas", subtitle: "Hukum Hooke & modulus elastis", accent: "#22D3EE" },
            { id: "fis-11-fluidastatis", title: "Fluida Statis", subtitle: "Tekanan hidrostatis & Archimedes", accent: "#38BDF8" },
            { id: "fis-11-fluidadinamis", title: "Fluida Dinamis", subtitle: "Kontinuitas & asas Bernoulli", accent: "#818CF8" },
            { id: "fis-11-suhukalor", title: "Suhu & Kalor", subtitle: "Pemuaian & perpindahan kalor", accent: "#A78BFA" },
            { id: "fis-11-termodinamika", title: "Termodinamika", subtitle: "Hukum I & II termodinamika", accent: "#F472B6" },
            { id: "fis-11-gelombangmekanik", title: "Gelombang Mekanik", subtitle: "Gelombang berjalan & stasioner", accent: "#FB923C" },
            { id: "fis-11-bunyi", title: "Gelombang Bunyi", subtitle: "Efek Doppler & intensitas bunyi", accent: "#FBBF24" },
            { id: "fis-11-optik", title: "Gelombang Cahaya", subtitle: "Interferensi & difraksi cahaya", accent: "#34D399" },
        ] },
    { id: "12", label: "Kelas 12", units: [
            { id: "fis-12-listrikstatis", title: "Listrik Statis", subtitle: "Hukum Coulomb & medan listrik", accent: "#22D3EE" },
            { id: "fis-12-listrikdinamis", title: "Listrik Dinamis", subtitle: "Rangkaian arus searah (DC)", accent: "#38BDF8" },
            { id: "fis-12-medanmagnet", title: "Medan Magnet", subtitle: "Gaya Lorentz & hukum Ampere", accent: "#818CF8" },
            { id: "fis-12-induksi", title: "Induksi Elektromagnetik", subtitle: "GGL induksi & hukum Faraday", accent: "#A78BFA" },
            { id: "fis-12-arusbolakbalik", title: "Arus Bolak-balik (AC)", subtitle: "Rangkaian AC & impedansi", accent: "#F472B6" },
            { id: "fis-12-radiasi", title: "Radiasi Elektromagnetik", subtitle: "Spektrum & aplikasi gelombang EM", accent: "#FB923C" },
            { id: "fis-12-fisikainti", title: "Fisika Inti", subtitle: "Radioaktivitas & reaksi nuklir", accent: "#FBBF24" },
            { id: "fis-12-modern", title: "Fisika Modern", subtitle: "Relativitas & dualisme gelombang-partikel", accent: "#34D399" },
        ] },
];
const SUBJECTS = [
    { id: "matematika", label: "Matematika", emoji: "∑", grades: MATH_GRADES },
    { id: "kimia", label: "Kimia", emoji: "🧪", grades: KIMIA_GRADES },
    { id: "fisika", label: "Fisika", emoji: "⚛️", grades: PHYSICS_GRADES },
].map((s) => ({
    ...s,
    grades: s.grades.map((g) => ({ ...g, units: g.units.map((u) => ({ ...u, grade: g.id, subject: s.id })) })),
}));
const ALL_UNITS = SUBJECTS.flatMap((s) => s.grades.flatMap((g) => g.units));
const STUDENT_CONTEXT = "Konteks siswa: SMA negeri favorit di Jakarta Selatan, belajar mandiri tanpa les tambahan, " +
    "target naik ranking di kelas. Sesuaikan level kesulitan sedikit di atas rata-rata soal sekolah biasa.";
const BASE_RULES = "Jawab dalam Bahasa Indonesia. JANGAN pakai LaTeX ($...$) atau markdown (*, #, backtick). " +
    "Tulis pangkat/muatan ion dengan tanda ^ (kalau lebih dari 1 karakter, kurung: x^(2n+1), atau muatan seperti Fe^3+). " +
    "Tulis akar dengan format 'akar(isi)', misalnya akar(9) atau akar(x+1). " +
    "Tulis pecahan sebagai a/b memakai angka atau variabel pendek saja di kiri-kanan tanda '/' (tanpa spasi), misalnya 3/4 atau x/2. " +
    "Untuk rumus kimia, tulis indeks atom dengan garis bawah, misalnya H_2O atau H_2SO_4. " +
    "Untuk reaksi kimia, tulis tanda panah sebagai '->' (satu arah) atau '<->' (kesetimbangan). " +
    "Paragraf pendek, boleh pakai baris baru dan penomoran biasa (1. 2. 3.).";
const AGENTS = [
    { id: "sabar", name: "Guru Sabar", tagline: "Jelasin pelan, langkah demi langkah", emoji: "📖", color: "#22D3EE",
        system: "Kamu 'Guru Sabar', tutor matematika, kimia & fisika yang telaten. Jelaskan konsep secara bertahap dan runtut, bernomor (1), (2), (3), " +
            "pastikan tiap langkah masuk akal dan disertai alasan singkat kenapa langkah itu diambil, sebelum lanjut ke langkah berikutnya. " +
            "Sering cek pemahaman dengan pertanyaan ringan. Setelah siswa paham cara standarnya, boleh tunjukkan satu trik/cara cepat sebagai tambahan opsional, " +
            "tapi jangan sampai bikin bingung — pemahaman konsep tetap prioritas utama. Nada hangat dan sabar." },
    { id: "santai", name: "Teman Belajar", tagline: "Ngobrol santai kayak sama temen", emoji: "☕", color: "#FB923C",
        system: "Kamu 'Teman Belajar', teman sebaya yang jago matematika, kimia, dan fisika. Gaya bahasa santai, kadang pakai analogi sehari-hari, " +
            "tidak formal, tapi tetap akurat dan langkahnya tetap runtut biar gampang diikuti. Kalau ada trik atau cara pintas yang beneran ngebantu, " +
            "kasih tau juga dengan gaya santai (mis. 'nah ini triknya biar cepet...'). Hindari nada menggurui." },
    { id: "kilat", name: "Guru Kilat", tagline: "Rumus cepat & trik jitu, tanpa basa-basi", emoji: "⚡", color: "#FBBF24",
        system: "Kamu 'Guru Kilat'. Jawab singkat dan padat: langsung sebutkan rumus atau trik tercepat untuk soal ini (bukan cara panjang dulu), " +
            "lalu langkah inti bernomor secukupnya, lalu hasil akhir. Kalau ada cara cepat khas ujian (eliminasi opsi, substitusi angka, pola bilangan), " +
            "utamakan itu di atas cara manual. Tidak bertele-tele, maksimal beberapa baris kecuali diminta detail." },
    { id: "kuis", name: "Kuis Master", tagline: "Nanya-nanya interaktif, kasih skor", emoji: "📝", color: "#34D399",
        system: "Kamu 'Kuis Master'. Ajukan satu soal latihan pada satu waktu sesuai topik yang diminta, tunggu jawaban siswa, " +
            "lalu koreksi dengan tegas tapi suportif dan beri skor/semangat. Setelah koreksi, tunjukkan ringkas langkah pengerjaan yang benar secara bernomor, " +
            "dan kalau relevan sebutkan satu trik cepat yang bisa dipakai untuk soal sejenis lain kali. Jangan beri semua soal sekaligus." },
    { id: "hots", name: "Soal HOTS", tagline: "Bikin soal susah level rebutan ranking", emoji: "🧠", color: "#F472B6",
        system: "Kamu 'Agen Soal HOTS'. Buatkan SATU soal Higher Order Thinking Skills (multi-langkah, analitis, sering gabungan " +
            "beberapa konsep atau soal cerita non-rutin) untuk topik yang diminta, setingkat soal seleksi/olimpiade sekolah unggulan. " +
            "Tampilkan HANYA soalnya dulu. Jangan berikan pembahasan atau jawaban kecuali siswa memintanya secara eksplisit (misal 'kasih pembahasan'). " +
            "Kalau diminta pembahasan, jelaskan langkah bernomor secara lengkap DAN, kalau ada, sebutkan cara/trik yang lebih cepat dibanding cara panjangnya." },
    { id: "trik", name: "Master Trik", tagline: "Bongkar semua trik & cara pintas ujian", emoji: "☼", color: "#A78BFA",
        system: "Kamu 'Master Trik', ahli semua rumus cepat, trik, dan cara pintas matematika, kimia & fisika ala kakak kelas juara olimpiade. " +
            "Untuk tiap soal yang ditanyakan, SELALU tunjukkan dua bagian dengan jelas: " +
            "'Cara Standar' — langkah baku bernomor sesuai kurikulum sekolah; lalu 'Cara Cepat / Trik' — cara pintas, eliminasi opsi, pola hafalan, " +
            "atau substitusi angka yang jauh lebih cepat, terutama untuk soal pilihan ganda. Jelaskan singkat kapan trik itu aman dipakai dan kapan " +
            "sebaiknya tetap pakai cara standar (misal soal esai yang minta uraian lengkap). Nada antusias dan percaya diri, seperti membagikan 'rahasia' ujian." },
];
// ---------------------------------------------------------------------------
// Persistence (browser localStorage, per device)
// ---------------------------------------------------------------------------
const DEFAULT_PROGRESS = { xp: 0, streak: 0, lastActive: null, units: {} };
function todayStr() { return new Date().toISOString().slice(0, 10); }
function bumpStreak(prog) {
    const today = todayStr();
    if (prog.lastActive === today)
        return prog;
    const y = new Date();
    y.setDate(y.getDate() - 1);
    const yesterday = y.toISOString().slice(0, 10);
    const streak = prog.lastActive === yesterday ? prog.streak + 1 : 1;
    return { ...prog, streak, lastActive: today };
}
function bumpUnit(prog, unitId, xpGain) {
    const gain = xpGain || 8;
    const u = prog.units[unitId] || { sessions: 0, mastery: 0 };
    const sessions = u.sessions + 1;
    const mastery = Math.min(100, sessions * 12);
    const withStreak = bumpStreak(prog);
    return { ...withStreak, xp: withStreak.xp + gain, units: { ...withStreak.units, [unitId]: { sessions, mastery } } };
}
function loadJSON(key, fallback) {
    try {
        const v = localStorage.getItem(key);
        return v ? JSON.parse(v) : fallback;
    }
    catch (e) {
        return fallback;
    }
}
function saveJSON(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    }
    catch (e) { /* ignore */ }
}
function sessionKey(unit, agent) { return (unit ? unit.id : "umum") + "::" + agent.id; }
function serializeMessages(messages) {
    return messages.map((m) => ({ role: m.role, text: m.text, hadImage: !!m.image }));
}
function deserializeMessages(saved) {
    return (saved || []).map((m) => ({
        role: m.role,
        text: m.hadImage ? m.text + "\n\n(📷 foto soal dari sesi sebelumnya, tidak tersimpan setelah ditutup)" : m.text,
    }));
}
function buildHelpSummary(unit, agent, messages) {
    const recent = messages.slice(-6);
    const lines = recent.map((m) => (m.role === "user" ? "Aku" : agent.name) + ": " + m.text).join("\n\n");
    return "Halo, aku lagi belajar" + (unit ? " " + unit.title : "") + " pakai aplikasi belajar, tapi masih bingung. " +
        "Boleh dibantuin jelasin?\n\n" + (lines || "(belum ada percakapan)") + "\n\nBagian yang bikin bingung: ";
}
function errorCopy(code) {
    switch (code) {
        case "not_granted": return "Izin pakai AI belum diberikan untuk halaman ini.";
        case "rate_limited": return "Kebanyakan permintaan, coba lagi sebentar lagi.";
        case "images_unavailable": return "Tampilan ini tidak mendukung kirim foto.";
        case "image_rejected": return "Foto tidak bisa diproses, coba foto lain.";
        case "refused": return "Permintaan ditolak, coba ubah pertanyaannya.";
        case "empty_completion": return "Tidak ada jawaban, coba pertanyaan lain.";
        case "prompt_too_large": return "Percakapan kepanjangan — coba hapus riwayat topik ini lalu ulangi.";
        case "cancelled": return "Dibatalkan.";
        case "sampling_disabled": return "Fitur AI tidak tersedia untuk akun ini.";
        default: return "Terjadi kesalahan, coba lagi.";
    }
}
// ---------------------------------------------------------------------------
// Notation renderer
// ---------------------------------------------------------------------------
const MATH_RE = /(akar|sqrt)\(([^()]+)\)|([A-Za-z0-9\)\]])\^(\([^()]+\)|[A-Za-z0-9+-]+)|([A-Za-z0-9\)\]])_(\([^()]+\)|[A-Za-z0-9]+)|(<->)|(->)|(?<!\/)\b([A-Za-z0-9]{1,4})\/([A-Za-z0-9]{1,4})\b(?!\/)/g;
function MathLine({ text }) {
    const parts = [];
    let lastIndex = 0, key = 0, m;
    MATH_RE.lastIndex = 0;
    while ((m = MATH_RE.exec(text)) !== null) {
        if (m.index > lastIndex)
            parts.push(text.slice(lastIndex, m.index));
        if (m[1] !== undefined) {
            parts.push(React.createElement("span", { key: key++, style: { whiteSpace: "nowrap" } },
                "√",
                React.createElement("span", { style: { borderTop: "1.3px solid currentColor", padding: "0 2px" } }, m[2])));
        }
        else if (m[3] !== undefined) {
            const c = m[4].startsWith("(") ? m[4].slice(1, -1) : m[4];
            parts.push(React.createElement("span", { key: key++ },
                m[3],
                React.createElement("sup", { style: { fontSize: "0.72em" } }, c)));
        }
        else if (m[5] !== undefined) {
            const c = m[6].startsWith("(") ? m[6].slice(1, -1) : m[6];
            parts.push(React.createElement("span", { key: key++ },
                m[5],
                React.createElement("sub", { style: { fontSize: "0.72em" } }, c)));
        }
        else if (m[7] !== undefined) {
            parts.push(React.createElement("span", { key: key++ }, "⇄"));
        }
        else if (m[8] !== undefined) {
            parts.push(React.createElement("span", { key: key++ }, "→"));
        }
        else if (m[9] !== undefined) {
            parts.push(React.createElement("span", { key: key++, style: { display: "inline-flex", flexDirection: "column", alignItems: "center", verticalAlign: "middle", fontSize: "0.82em", lineHeight: 1.15, margin: "0 2px" } },
                React.createElement("span", { style: { padding: "0 2px" } }, m[9]),
                React.createElement("span", { style: { borderTop: "1.3px solid currentColor", width: "100%" } }),
                React.createElement("span", { style: { padding: "0 2px" } }, m[10])));
        }
        lastIndex = MATH_RE.lastIndex;
    }
    if (lastIndex < text.length)
        parts.push(text.slice(lastIndex));
    return React.createElement(React.Fragment, null, parts);
}
function MathText({ text }) {
    const containerRef = useRef(null);
    useEffect(() => {
        if (containerRef.current) {
            window.mermaid.run({ nodes: containerRef.current.querySelectorAll('.mermaid') });
        }
    }, [text]);

    // Deteksi blok mermaid yang lebih fleksibel
    if (text.includes('```')) {
        const parts = text.split('```');
        return React.createElement("div", { ref: containerRef }, parts.map((part, i) => {
            if (part.trim().startsWith('mermaid')) {
                const mermaidCode = part.trim().replace(/^mermaid\n/, '');
                return React.createElement("pre", { key: i, className: "mermaid" }, mermaidCode);
            }
            return React.createElement(MathLine, { key: i, text: part });
        }));
    }

    const lines = (text || "").split("\n");
    return React.createElement("div", { ref: containerRef }, lines.map((line, i) => React.createElement("div", { key: i, style: { minHeight: line ? undefined : 8 } }, line ? React.createElement(MathLine, { text: line }) : " ")));
}
// ---------------------------------------------------------------------------
// UI atoms
// ---------------------------------------------------------------------------
function Pill({ children, style }) {
    return React.createElement("span", { style: { display: "inline-flex", alignItems: "center", gap: 4, padding: "4px 10px", borderRadius: 999, fontSize: 12, fontWeight: 600, background: "rgba(255,255,255,0.08)", color: "#E2E8F0", ...style } }, children);
}
function Ring({ pct, color, size }) {
    const s = size || 40;
    const r = (s - 6) / 2;
    const c = 2 * Math.PI * r;
    return (React.createElement("svg", { width: s, height: s, viewBox: "0 0 " + s + " " + s },
        React.createElement("circle", { cx: s / 2, cy: s / 2, r: r, stroke: "rgba(255,255,255,0.12)", strokeWidth: "5", fill: "none" }),
        React.createElement("circle", { cx: s / 2, cy: s / 2, r: r, stroke: color, strokeWidth: "5", fill: "none", strokeDasharray: c, strokeDashoffset: c - (pct / 100) * c, strokeLinecap: "round", transform: "rotate(-90 " + s / 2 + " " + s / 2 + ")" }),
        React.createElement("text", { x: "50%", y: "52%", textAnchor: "middle", dominantBaseline: "middle", fontSize: "11", fill: "#F1F5F9", fontWeight: "700" }, pct)));
}
function NavBtn({ emoji, label, active, onClick, side }) {
    if (side) {
        return (React.createElement("button", { onClick: onClick, style: { display: "flex", alignItems: "center", gap: 12, width: "100%", textAlign: "left", padding: "12px 14px", borderRadius: 12, background: active ? "rgba(34,211,238,0.12)" : "transparent", border: "none", cursor: "pointer", color: active ? "#67E8F9" : "#94A3B8" } },
            React.createElement("span", { style: { fontSize: 20 } }, emoji),
            React.createElement("span", { style: { fontSize: 14, fontWeight: active ? 700 : 500 } }, label)));
    }
    return (React.createElement("button", { onClick: onClick, style: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3, padding: "10px 0 8px", background: "none", border: "none", cursor: "pointer", color: active ? "#67E8F9" : "#64748B" } },
        React.createElement("span", { style: { fontSize: 19 } }, emoji),
        React.createElement("span", { style: { fontSize: 11, fontWeight: active ? 700 : 500 } }, label)));
}
// Layar lebar (laptop/PC/tablet landscape): menu pindah ke sisi kiri
const WIDE_QUERY = "(min-width: 900px) and (min-height: 520px)";
function useIsWide() {
    const [wide, setWide] = useState(() => typeof window !== "undefined" && !!window.matchMedia && window.matchMedia(WIDE_QUERY).matches);
    useEffect(() => {
        if (typeof window === "undefined" || !window.matchMedia)
            return undefined;
        const mq = window.matchMedia(WIDE_QUERY);
        const onChange = (e) => setWide(e.matches);
        setWide(mq.matches);
        if (mq.addEventListener)
            mq.addEventListener("change", onChange);
        else
            mq.addListener(onChange);
        return () => {
            if (mq.removeEventListener)
                mq.removeEventListener("change", onChange);
            else
                mq.removeListener(onChange);
        };
    }, []);
    return wide;
}
// ---------------------------------------------------------------------------
// Main App
// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------
// Panggilan ke backend (/api/chat) -> Claude API. Kunci API hanya ada di server.
// ---------------------------------------------------------------------------
async function fileToBase64(file) {
    const buf = await file.arrayBuffer();
    let bin = "";
    new Uint8Array(buf).forEach((b) => (bin += String.fromCharCode(b)));
    return btoa(bin);
}
async function shrinkImage(file, maxSide = 1600) {
    try {
        const bmp = await createImageBitmap(file);
        const scale = Math.min(1, maxSide / Math.max(bmp.width, bmp.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(bmp.width * scale);
        canvas.height = Math.round(bmp.height * scale);
        canvas.getContext("2d").drawImage(bmp, 0, 0, canvas.width, canvas.height);
        const blob = await new Promise((r) => canvas.toBlob(r, "image/jpeg", 0.85));
        return blob || file;
    }
    catch (e) {
        return file;
    }
}
async function callClaude(turns, opts) {
    opts = opts || {};
    const body = {};
    if (typeof turns === "string") {
        body.messages = [{ role: "user", content: turns }];
    }
    else {
        body.system = turns[0].content;
        let rest = turns.slice(1);
        while (rest.length && rest[0].role !== "user")
            rest = rest.slice(1);
        body.messages = rest;
    }
    if (opts.images) {
        const small = await shrinkImage(opts.images);
        body.imageBase64 = await fileToBase64(small);
        body.imageType = small.type || "image/jpeg";
    }
    let r;
    try {
        r = await fetch("/api/chat", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(body),
        });
    }
    catch (e) {
        throw { code: "network", text: "Tidak bisa terhubung ke server. Cek koneksi internet." };
    }
    if (r.status === 429)
        throw { code: "rate_limited" };
    if (r.status === 413)
        throw { code: "image_rejected" };
    if (!r.ok)
        throw { code: "network", text: "Server AI sedang bermasalah, coba lagi sebentar." };
    const data = await r.json();
    if (!data.text)
        throw { code: "empty_completion" };
    return { text: data.text };
}

async function callVision(prompt, imageFile) {
    const small = await shrinkImage(imageFile);
    const imageBase64 = await fileToBase64(small);
    const body = { prompt, imageBase64, imageType: small.type || "image/jpeg" };
    console.log("Calling Vision API at: /api/vision");
    let r;
    try {
        r = await fetch("/api/vision", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(body),
        });
    }
    catch (e) {
        console.error("Fetch error:", e);
        throw { code: "network", text: "Tidak bisa terhubung ke server visi." };
    }
    if (!r.ok) {
        const errText = await r.text();
        console.error("Vision API Error:", r.status, errText);
        throw { code: "network", text: "Server Visi bermasalah." };
    }
    const data = await r.json();
    return data.text;
}

function App() {
    const { profile, user } = useAuth(); // Ambil profile dan user
    const wide = useIsWide();
    const [tab, setTab] = useState("home");
    const [activeSubject, setActiveSubject] = useState("matematika");
    const [activeGrade, setActiveGrade] = useState("10");
    const [progress, setProgress] = useState(DEFAULT_PROGRESS);
    const [histories, setHistories] = useState({});
    const [activeUnit, setActiveUnit] = useState(null);
    const [activeAgent, setActiveAgent] = useState(AGENTS[0]);

    // Gunakan useChat dari Vercel AI SDK
    const chatHook = useChat({
        api: '/api/chat',
        body: {
            activeAgentId: activeAgent?.id,
            activeUnitId: activeUnit?.id
        }
    });

    const { messages, input, handleSubmit, isLoading: pending, append } = chatHook;

    // Implementasi handleInputChange mandiri yang aman
    const handleInputChange = useCallback((e) => {
        if (chatHook && typeof chatHook.handleInputChange === 'function') {
            chatHook.handleInputChange(e);
        } else if (chatHook && typeof chatHook.setInput === 'function') {
            chatHook.setInput(e.target.value);
        } else {
            console.error("handleInputChange/setInput tidak tersedia di chatHook:", chatHook);
        }
    }, [chatHook]);

    const [error, setError] = useState(null);
    const [scanImage, setScanImage] = useState(null); // {file, previewUrl}
    const [scanResult, setScanResult] = useState(null);
    const [scanning, setScanning] = useState(false);
    const [helpSummary, setHelpSummary] = useState(null);
    const [copied, setCopied] = useState(false);
    const [sampleFn, setSampleFn] = useState(undefined); // undefined=loading, null=unavailable, fn=ready
    const [imagesOk, setImagesOk] = useState(false);
    const scrollRef = useRef(null);
    const fileInputRef = useRef(null);
    useEffect(() => {
        setProgress(loadJSON("sprint-smu-progress-v1", DEFAULT_PROGRESS));
        setHistories(loadJSON("sprint-smu-histories-v1", {}));
        setSampleFn(() => callClaude);
        setImagesOk(true);
    }, []);
    useEffect(() => {
        saveJSON("sprint-smu-progress-v1", progress);
        if (user && progress !== DEFAULT_PROGRESS) {
            // Sinkronisasi paling minimal untuk menghindari error kolom
            supabase
                .from('user_progress')
                .upsert({ id: user.id })
                .then(({ error }) => { if (error) console.error("Sync error (ignore if expected):", error); });
        }
    }, [progress, user]);
    useEffect(() => {
        scrollRef.current && scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }, [messages, pending]);

    const openChat = useCallback((unit, agent) => {
        setActiveUnit(unit);
        const a = agent || AGENTS[0];
        setActiveAgent(a);
        setError(null);
        setTab("tutor");
    }, []);

    const send = useCallback(async (overrideText) => {
        const text = (overrideText !== undefined ? overrideText : input).trim();
        if (!text) return;

        const instructionText = [
            activeAgent.system,
            "INSTRUKSI WAJIB: Untuk setiap ilustrasi visual, diagram, atau grafik, SELALU gunakan format diagram Mermaid (di dalam blok ```mermaid ... ```). JANGAN PERNAH menggunakan ASCII atau teks biasa untuk menggambarkan bentuk, vektor, atau grafik.",
            STUDENT_CONTEXT,
            profile ? `Profil Siswa: Kelas ${profile.class || 'tidak diketahui'}. Topik yang perlu diperkuat: ${Array.isArray(profile.weak_topics) ? profile.weak_topics.join(', ') : (profile.weak_topics || 'tidak ada spesifik')}.` : "",
            activeUnit ? ("Siswa sedang membahas mata pelajaran " +
                (activeUnit.subject === "kimia" ? "Kimia" : activeUnit.subject === "fisika" ? "Fisika" : "Matematika") +
                ", topik: " + activeUnit.title + " (" + activeUnit.subtitle + ").") : "",
            BASE_RULES,
        ].filter(Boolean).join("\n\n");

        await append({ role: 'user', content: `${instructionText}\n\n${text}` });

        if (activeUnit) setProgress((p) => bumpUnit(p, activeUnit.id));
    }, [input, activeAgent, activeUnit, append]);
    const handlePickPhoto = (e) => {
        const file = e.target.files && e.target.files[0];
        e.target.value = "";
        if (!file)
            return;
        setScanImage({ file, previewUrl: URL.createObjectURL(file) });
        setScanResult(null);
    };
    const runScan = useCallback(async () => {
        if (!scanImage || !sampleFn)
            return;
        setScanning(true);
        setScanResult(null);
        const prompt = [
            "Kamu asisten yang membaca foto soal matematika, kimia, ATAU fisika SMA (kelas 10-12).",
            "Langkah: (1) sebutkan mata pelajaran, kelas (10/11/12), dan topik yang paling cocok dari daftar ini: " +
                ALL_UNITS.map((u) => u.title + " (" + u.subject + ", kelas " + u.grade + ")").join(", ") +
                ". (2) tuliskan ulang soalnya singkat. (3) berikan penyelesaian langkah demi langkah sampai jawaban akhir.",
            STUDENT_CONTEXT,
            BASE_RULES,
        ].join("\n\n");
        try {
            const resText = await callVision(prompt, scanImage.file);
            setScanResult(resText);
            setProgress((p) => bumpUnit(p, "scan-umum", 5));
        }
        catch (e) {
            setScanResult("Gagal membaca foto: " + errorCopy(e && e.code));
        }
        finally {
            setScanning(false);
        }
    }, [scanImage, sampleFn]);
    const discussScan = () => {
        const guess = ALL_UNITS.find((u) => scanResult && scanResult.toLowerCase().includes(u.title.toLowerCase())) || null;
        setActiveUnit(guess);
        setActiveAgent(AGENTS[0]);
        setMessages([
            { role: "user", text: "Ini soal yang tadi aku foto." },
            { role: "assistant", text: scanResult },
        ]);
        setScanImage(null);
        setScanResult(null);
        setTab("tutor");
    };

    // Fitur Voice
    const speakText = (text) => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'id-ID';
            window.speechSynthesis.speak(utterance);
        }
    };

    const card = "#141B33", border = "rgba(255,255,255,0.08)";
    return (React.createElement("div", { style: wide
            ? { width: "100%", margin: "0 auto", height: "100dvh", minHeight: 520, background: "#0B1224", color: "#F1F5F9", display: "grid", gridTemplateColumns: "240px minmax(0, 1fr)", gridTemplateRows: "auto minmax(0, 1fr)", position: "relative", overflow: "hidden" }
            : { width: "100%", maxWidth: 480, margin: "0 auto", height: "100dvh", minHeight: 640, background: "#0B1224", color: "#F1F5F9", display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" } },
        React.createElement("div", { style: wide
            ? { gridColumn: 2, gridRow: 1, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 28px 14px", borderBottom: "1px solid " + border }
            : { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 18px 12px", borderBottom: "1px solid " + border, flexShrink: 0 } },
            React.createElement("div", null,
                React.createElement("div", { style: { fontSize: 20, fontWeight: 800, letterSpacing: -0.3 } }, "Sprint SMU"),
                React.createElement("div", { style: { fontSize: 12, color: "#94A3B8", marginTop: 2 } }, "Matematika, Kimia & Fisika kelas 10-12, tanpa terasa belajar manual")),
            React.createElement("div", { style: { display: "flex", gap: 6 } },
                React.createElement(Pill, { style: { background: "rgba(251,146,60,0.15)", color: "#FDBA74" } },
                    "🔥",
                    " ",
                    progress.streak),
                React.createElement(Pill, { style: { background: "rgba(34,211,238,0.15)", color: "#67E8F9" } },
                    "✨",
                    " ",
                    progress.xp,
                    " XP"))),
        React.createElement("div", { style: wide ? { gridColumn: 2, gridRow: 2, overflowY: "auto", padding: "20px 28px 24px" } : { flex: 1, overflowY: "auto", padding: 18 } },
            React.createElement("div", { style: wide ? { maxWidth: 900, margin: "0 auto", height: "100%" } : { display: "contents" } },
            tab === "home" && (React.createElement(HomeTab, { progress: progress, activeSubject: activeSubject, setActiveSubject: setActiveSubject, activeGrade: activeGrade, setActiveGrade: setActiveGrade, onOpenUnit: (unit) => openChat(unit, AGENTS[0]), card: card, border: border })),
            tab === "camera" && (React.createElement(CameraTab, { scanImage: scanImage, scanResult: scanResult, scanning: scanning, imagesOk: imagesOk, sampleReady: !!sampleFn, onPick: () => fileInputRef.current && fileInputRef.current.click(), onRemove: () => { setScanImage(null); setScanResult(null); }, onScan: runScan, onDiscuss: discussScan, onGoToTutor: () => setTab(activeUnit || messages.length ? "tutor" : "agents"), card: card, border: border })),
            tab === "agents" && (React.createElement(AgentsTab, { onPick: (agent) => openChat(activeUnit, agent), card: card, border: border })),
            tab === "tutor" && (React.createElement(TutorTab, { unit: activeUnit, agent: activeAgent, messages: messages, pending: pending, error: error, input: input || "", handleInputChange: handleInputChange, handleSubmit: handleSubmit, scrollRef: scrollRef, onChangeAgent: (a) => { setActiveAgent(a); setMessages(deserializeMessages(histories[sessionKey(activeUnit, a)])); }, onBack: () => setTab("home"), onAskHuman: () => setHelpSummary(buildHelpSummary(activeUnit, activeAgent, messages)), onClearHistory: () => setMessages([]), card: card, border: border })),
            tab === "progress" && React.createElement(ProgressTab, { progress: progress, card: card, border: border }))),
        React.createElement("input", { ref: fileInputRef, id: "camera-file-input", type: "file", accept: "image/*", onChange: handlePickPhoto, style: { position: "absolute", width: 1, height: 1, padding: 0, margin: -1, overflow: "hidden", clip: "rect(0,0,0,0)", whiteSpace: "nowrap", border: 0 } }),
        helpSummary !== null && (React.createElement("div", { style: { position: "absolute", inset: 0, background: "rgba(5,9,20,0.85)", zIndex: 50, display: "flex", alignItems: wide ? "center" : "flex-end", justifyContent: "center" } },
            React.createElement("div", { style: wide
                    ? { width: "100%", maxWidth: 520, background: card, border: "1px solid " + border, borderRadius: 18, padding: 18 }
                    : { width: "100%", background: card, borderTop: "1px solid " + border, borderRadius: "18px 18px 0 0", padding: 18 } },
                React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8, marginBottom: 4 } },
                    React.createElement("span", null, "❓"),
                    React.createElement("div", { style: { fontWeight: 800, fontSize: 14.5 } }, "Ringkasan buat kakak")),
                React.createElement("div", { style: { fontSize: 11.5, color: "#94A3B8", marginBottom: 10 } }, "Lengkapi bagian bingungnya, lalu salin atau kirim langsung ke WhatsApp."),
                React.createElement("textarea", { value: helpSummary, onChange: (e) => setHelpSummary(e.target.value), rows: 7, style: { width: "100%", background: "#0B1224", border: "1px solid " + border, borderRadius: 10, padding: 12, color: "#E2E8F0", fontSize: 12.5, lineHeight: 1.5, resize: "vertical", outline: "none" } }),
                React.createElement("div", { style: { display: "flex", gap: 8, marginTop: 12 } },
                    React.createElement("button", { onClick: () => { navigator.clipboard && navigator.clipboard.writeText(helpSummary).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1500); }).catch(() => { }); }, style: { flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, background: "#22D3EE", color: "#04222B", border: "none", borderRadius: 10, padding: "11px 0", fontWeight: 700, fontSize: 13, cursor: "pointer" } }, copied ? "✅ Disalin" : "📋 Salin teks"),
                    React.createElement("button", { onClick: () => window.open("https://wa.me/?text=" + encodeURIComponent(helpSummary), "_blank"), style: { flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, background: "#34D399", color: "#04231A", border: "none", borderRadius: 10, padding: "11px 0", fontWeight: 700, fontSize: 13, cursor: "pointer" } }, "💬 WhatsApp")),
                React.createElement("button", { onClick: () => setHelpSummary(null), style: { width: "100%", marginTop: 8, background: "none", border: "none", color: "#94A3B8", fontSize: 12.5, padding: "8px 0", cursor: "pointer" } }, "Tutup")))),
        React.createElement("div", { style: wide
                ? { gridColumn: 1, gridRow: "1 / span 2", display: "flex", flexDirection: "column", gap: 6, padding: "20px 14px", borderRight: "1px solid " + border, background: "#0D1428", overflowY: "auto" }
                : { display: "flex", borderTop: "1px solid " + border, background: "#0D1428", flexShrink: 0, paddingBottom: "env(safe-area-inset-bottom, 6px)" } },
            wide && (React.createElement("div", { style: { fontSize: 11, fontWeight: 700, letterSpacing: 1, color: "#64748B", padding: "2px 14px 10px" } }, "MENU")),
            React.createElement(NavBtn, { side: wide, emoji: "🏠", label: "Beranda", active: tab === "home", onClick: () => setTab("home") }),
            React.createElement(NavBtn, { side: wide, emoji: "📷", label: "Kamera", active: tab === "camera", onClick: () => setTab("camera") }),
            React.createElement(NavBtn, { side: wide, emoji: "🎓", label: "Tutor", active: tab === "tutor" || tab === "agents", onClick: () => setTab(activeUnit || messages.length ? "tutor" : "agents") }),
            React.createElement(NavBtn, { side: wide, emoji: "📊", label: "Progres", active: tab === "progress", onClick: () => setTab("progress") }))));
}
function HomeTab({ progress, activeSubject, setActiveSubject, activeGrade, setActiveGrade, onOpenUnit, card, border }) {
    const subject = SUBJECTS.find((s) => s.id === activeSubject) || SUBJECTS[0];
    const grade = subject.grades.find((g) => g.id === activeGrade) || subject.grades[0];
    return (React.createElement("div", null,
        React.createElement("div", { style: { display: "flex", gap: 6, marginBottom: 10 } }, SUBJECTS.map((s) => {
            const active = s.id === activeSubject;
            return (React.createElement("button", { key: s.id, onClick: () => setActiveSubject(s.id), style: {
                    flex: 1, padding: "10px 0", borderRadius: 10, cursor: "pointer", fontSize: 13, fontWeight: 700,
                    border: "1px solid " + (active ? "#F472B6" : border), background: active ? "rgba(244,114,182,0.14)" : card,
                    color: active ? "#F9A8D4" : "#94A3B8", display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                } },
                s.emoji,
                " ",
                s.label));
        })),
        React.createElement("div", { style: { display: "flex", gap: 6, marginBottom: 14 } }, subject.grades.map((g) => (React.createElement("button", { key: g.id, onClick: () => setActiveGrade(g.id), style: {
                flex: 1, padding: "9px 0", borderRadius: 10, cursor: "pointer", fontSize: 12.5, fontWeight: 700,
                border: "1px solid " + (g.id === activeGrade ? "#22D3EE" : border), background: g.id === activeGrade ? "rgba(34,211,238,0.14)" : card,
                color: g.id === activeGrade ? "#67E8F9" : "#94A3B8",
            } }, g.label)))),
        React.createElement("div", { style: { fontSize: 13, fontWeight: 700, color: "#94A3B8", marginBottom: 10 } },
            "Pilih topik ",
            subject.label.toLowerCase(),
            " ",
            grade.label.toLowerCase()),
        React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 } }, grade.units.map((u) => {
            const stat = progress.units[u.id];
            const mastery = (stat && stat.mastery) || 0;
            return (React.createElement("button", { key: u.id, onClick: () => onOpenUnit(u), style: { textAlign: "left", background: card, border: "1px solid " + border, borderRadius: 14, padding: 14, cursor: "pointer", display: "flex", flexDirection: "column", gap: 8 } },
                React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start" } },
                    React.createElement("div", { style: { width: 8, height: 8, borderRadius: 99, background: u.accent, marginTop: 5 } }),
                    React.createElement(Ring, { pct: mastery, color: u.accent, size: 34 })),
                React.createElement("div", null,
                    React.createElement("div", { style: { fontWeight: 700, fontSize: 14.5 } }, u.title),
                    React.createElement("div", { style: { fontSize: 11.5, color: "#94A3B8", marginTop: 2, lineHeight: 1.35 } }, u.subtitle))));
        })),
        React.createElement("div", { style: { marginTop: 22, background: card, border: "1px solid " + border, borderRadius: 14, padding: 16 } },
            React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8, marginBottom: 6 } },
                React.createElement("span", null, "🏆"),
                React.createElement("span", { style: { fontWeight: 700, fontSize: 13.5 } }, "Mau soal susah buat kejar ranking?")),
            React.createElement("div", { style: { fontSize: 12.5, color: "#94A3B8", lineHeight: 1.5 } }, "Coba agen \"Soal HOTS\" di tab Tutor — bikinin soal setingkat seleksi sekolah unggulan, lengkap sama pembahasan kalau diminta."))));
}
function CameraTab({ scanImage, scanResult, scanning, imagesOk, sampleReady, onPick, onRemove, onScan, onDiscuss, onGoToTutor, card, border }) {
    if (sampleReady && !imagesOk) {
        return (React.createElement("div", null,
            React.createElement("div", { style: { fontSize: 13, fontWeight: 700, color: "#94A3B8", marginBottom: 10 } }, "Foto soal sekolah"),
            React.createElement("div", { style: { background: card, border: "1px solid " + border, borderRadius: 16, padding: "32px 18px", display: "flex", flexDirection: "column", alignItems: "center", gap: 12, textAlign: "center" } },
                React.createElement("span", { style: { fontSize: 30 } }, "📷"),
                React.createElement("div", { style: { fontWeight: 700, fontSize: 14.5 } }, "Kirim foto ke AI belum didukung di tampilan ini"),
                React.createElement("div", { style: { fontSize: 12.5, color: "#94A3B8", lineHeight: 1.5 } }, "Ini keterbatasan sementara dari tampilan artifact Claude, bukan dari aplikasinya. Untuk sekarang, ketik atau salin soalnya lewat tab Tutor — agen tetap bisa bantu jelasin dan kasih langkah pengerjaannya."),
                React.createElement("button", { onClick: onGoToTutor, style: { marginTop: 4, background: "#22D3EE", color: "#04222B", border: "none", borderRadius: 12, padding: "11px 22px", fontWeight: 800, fontSize: 13.5, cursor: "pointer" } }, "Ketik soal di Tutor"))));
    }
    return (React.createElement("div", null,
        React.createElement("div", { style: { fontSize: 13, fontWeight: 700, color: "#94A3B8", marginBottom: 10 } }, "Foto soal sekolah"),
        !scanImage && React.createElement("div", { style: { padding: "20px 0", display: "flex", flexDirection: "column", gap: 10, zIndex: 1000 } },
            React.createElement("button", { onClick: onPick, style: { width: "100%", background: "#22D3EE", color: "#04222B", border: "none", borderRadius: 12, padding: "12px 0", fontWeight: 800, fontSize: 14, cursor: "pointer", zIndex: 1000 } }, "Pilih File dari HP"),
            React.createElement("div", { style: { textAlign: "center", color: "#94A3B8" } }, "atau"),
            React.createElement("label", { htmlFor: "camera-file-input", style: { width: "100%", background: card, border: "1.5px dashed " + border, borderRadius: 16, padding: "40px 16px", display: "flex", flexDirection: "column", alignItems: "center", gap: 10, cursor: "pointer", color: "#67E8F9", boxSizing: "border-box", zIndex: 1000 } },
                React.createElement("span", { style: { fontSize: 30 } }, "📷"),
                React.createElement("div", { style: { fontWeight: 700, fontSize: 14 } }, "Ambil Foto Baru")
            )
        ),
        scanImage && (React.createElement("div", { style: { background: card, border: "1px solid " + border, borderRadius: 16, overflow: "hidden" } },
            React.createElement("div", { style: { position: "relative" } },
                React.createElement("img", { src: scanImage.previewUrl, alt: "soal", style: { width: "100%", display: "block", maxHeight: 260, objectFit: "cover" } }),
                React.createElement("button", { onClick: onRemove, style: { position: "absolute", top: 8, right: 8, background: "rgba(11,18,36,0.75)", border: "none", borderRadius: 999, width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", cursor: "pointer" } }, "✕")),
            React.createElement("div", { style: { padding: 14 } },
                !scanResult && (React.createElement("button", { onClick: onScan, disabled: scanning, style: { width: "100%", background: "#22D3EE", color: "#04222B", border: "none", borderRadius: 12, padding: "12px 0", fontWeight: 800, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 } }, scanning ? React.createElement(React.Fragment, null,
                    React.createElement("span", { className: "spinner" }),
                    " Membaca soal…") : React.createElement(React.Fragment, null,
                    "✨",
                    " Bahas soal ini"))),
                scanResult && (React.createElement("div", null,
                    React.createElement("div", { style: { fontSize: 13.5, lineHeight: 1.55, color: "#E2E8F0" } },
                        React.createElement(MathText, { text: scanResult })),
                    React.createElement("div", { style: { display: "flex", gap: 8, marginTop: 14 } },
                        React.createElement("button", { onClick: onDiscuss, style: { flex: 1, background: "#F472B6", color: "#2B0B1A", border: "none", borderRadius: 10, padding: "10px 0", fontWeight: 700, fontSize: 13, cursor: "pointer" } }, "Diskusikan lebih lanjut"),
                        React.createElement("button", { onClick: onRemove, style: { background: "transparent", color: "#94A3B8", border: "1px solid " + border, borderRadius: 10, padding: "10px 14px", fontWeight: 600, fontSize: 13, cursor: "pointer" } }, "Foto lagi")))))))));
}
function AgentsTab({ onPick, card, border }) {
    return (React.createElement("div", null,
        React.createElement("div", { style: { fontSize: 13, fontWeight: 700, color: "#94A3B8", marginBottom: 10 } }, "Pilih gaya belajarmu"),
        React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 10 } }, AGENTS.map((a) => (React.createElement("button", { key: a.id, onClick: () => onPick(a), style: { display: "flex", alignItems: "center", gap: 12, textAlign: "left", background: card, border: "1px solid " + border, borderRadius: 14, padding: 14, cursor: "pointer" } },
            React.createElement("div", { style: { width: 42, height: 42, borderRadius: 12, flexShrink: 0, background: a.color + "22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 19 } }, a.emoji),
            React.createElement("div", { style: { flex: 1 } },
                React.createElement("div", { style: { fontWeight: 700, fontSize: 14 } }, a.name),
                React.createElement("div", { style: { fontSize: 11.5, color: "#94A3B8", marginTop: 1 } }, a.tagline)),
            React.createElement("span", { style: { color: "#475569" } }, "›")))))));
}
function TutorTab({ unit, agent, messages, pending, error, input = "", handleInputChange, handleSubmit, scrollRef, onChangeAgent, onBack, onAskHuman, onClearHistory, card, border }) {
    const showTransformation = unit && unit.id === 'mat-11-transformasi';
    return (React.createElement("div", { style: { display: "flex", flexDirection: "column", height: "100%" } },
        React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 10, marginBottom: 10 } },
            React.createElement("button", { onClick: onBack, style: { background: "none", border: "none", color: "#94A3B8", cursor: "pointer", padding: 4, fontSize: 16 } }, "←"),
            React.createElement("div", { style: { flex: 1 } },
                React.createElement("div", { style: { fontWeight: 700, fontSize: 14 } },
                    agent.name,
                    unit ? " · " + unit.title : ""),
                React.createElement("div", { style: { fontSize: 11, color: "#94A3B8" } }, agent.tagline)),
            messages.length > 0 && (React.createElement("button", { onClick: onClearHistory, title: "Hapus riwayat topik ini", style: { background: "none", border: "none", color: "#64748B", cursor: "pointer", padding: 4 } }, "🗑️")),
            React.createElement("select", { value: agent.id, onChange: (e) => onChangeAgent(AGENTS.find((a) => a.id === e.target.value)), style: { background: card, color: "#E2E8F0", border: "1px solid " + border, borderRadius: 8, fontSize: 11.5, padding: "6px 8px" } }, AGENTS.map((a) => React.createElement("option", { key: a.id, value: a.id }, a.name))),
        ),

        unit && React.createElement("div", { style: { marginBottom: 10 } },
            React.createElement(InteractiveVisualizer, { unitId: unit.id })
        ),

        React.createElement("div", { ref: scrollRef, style: { flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 10, paddingBottom: 10 } },
            messages.length === 0 && (React.createElement("div", { style: { background: card, border: "1px solid " + border, borderRadius: 12, padding: 14, fontSize: 12.5, color: "#94A3B8", display: "flex", gap: 8 } },
                React.createElement("span", null, agent.emoji),
                React.createElement("span", null, unit ? ("Tanya apa saja soal " + unit.title + ", atau ketik \"kasih soal\" biar " + agent.name + " mulai duluan.") : "Ceritakan topik atau soal yang mau kamu bahas dulu."))),
            messages.map((m, i) => (React.createElement("div", { key: i, style: { alignSelf: m.role === "user" ? "flex-end" : "flex-start", maxWidth: "85%", background: m.role === "user" ? "#1D4ED8" : card, border: m.role === "user" ? "none" : "1px solid " + border, borderRadius: 14, padding: "10px 13px", fontSize: 13.5, lineHeight: 1.5, position: "relative" } },
                React.createElement(MathText, { text: m.content }),
                m.role === "assistant" && React.createElement("button", { onClick: () => speakText(m.content), style: { position: "absolute", bottom: 4, right: 6, background: "none", border: "none", cursor: "pointer", fontSize: 14 } }, "🔊")))),
            pending && React.createElement("div", { style: { alignSelf: "flex-start", background: card, border: "1px solid " + border, borderRadius: 14, padding: "10px 13px" } },
                React.createElement("span", { className: "spinner" })),
            error && React.createElement("div", { style: { color: "#FCA5A5", fontSize: 12 } }, error)),
        messages.length > 0 && (React.createElement("button", { onClick: onAskHuman, style: { display: "flex", alignItems: "center", justifyContent: "center", gap: 6, width: "100%", background: "rgba(244,114,182,0.12)", color: "#F9A8D4", border: "1px solid rgba(244,114,182,0.3)", borderRadius: 10, padding: "9px 0", fontSize: 12.5, fontWeight: 600, cursor: "pointer", marginBottom: 8 } },
            "❓",
            " Bingung, minta dijelasin manusia")),
        React.createElement("div", { style: { display: "flex", gap: 8 } },
            React.createElement("input", { value: input, onChange: handleInputChange, onKeyDown: (e) => { if (e.key === "Enter")
                    handleSubmit(e); }, placeholder: "Tulis pertanyaan…", style: { flex: 1, background: card, border: "1px solid " + border, borderRadius: 12, padding: "11px 14px", color: "#F1F5F9", fontSize: 13.5, outline: "none" } }),
            React.createElement("button", { onClick: handleSubmit, disabled: pending || !input.trim(), style: { width: 42, height: 42, borderRadius: 12, background: "#22D3EE", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0, opacity: pending || !input.trim() ? 0.5 : 1 } }, "➤"))));
}
function ProgressTab({ progress, card, border }) {
    const totalMastery = ALL_UNITS.reduce((s, u) => s + ((progress.units[u.id] && progress.units[u.id].mastery) || 0), 0) / ALL_UNITS.length;
    return (React.createElement("div", null,
        React.createElement("div", { style: { display: "flex", gap: 10, marginBottom: 16 } },
            React.createElement("div", { style: { flex: 1, background: card, border: "1px solid " + border, borderRadius: 14, padding: 16, textAlign: "center" } },
                React.createElement("div", { style: { fontSize: 18 } }, "🔥"),
                React.createElement("div", { style: { fontSize: 22, fontWeight: 800 } }, progress.streak),
                React.createElement("div", { style: { fontSize: 11, color: "#94A3B8" } }, "Hari beruntun")),
            React.createElement("div", { style: { flex: 1, background: card, border: "1px solid " + border, borderRadius: 14, padding: 16, textAlign: "center" } },
                React.createElement("div", { style: { fontSize: 18 } }, "✨"),
                React.createElement("div", { style: { fontSize: 22, fontWeight: 800 } }, progress.xp),
                React.createElement("div", { style: { fontSize: 11, color: "#94A3B8" } }, "Total XP")),
            React.createElement("div", { style: { flex: 1, background: card, border: "1px solid " + border, borderRadius: 14, padding: 16, textAlign: "center" } },
                React.createElement("div", { style: { fontSize: 18 } }, "✅"),
                React.createElement("div", { style: { fontSize: 22, fontWeight: 800 } },
                    Math.round(totalMastery),
                    "%"),
                React.createElement("div", { style: { fontSize: 11, color: "#94A3B8" } }, "Rata-rata penguasaan"))),
        SUBJECTS.map((s) => (React.createElement("div", { key: s.id, style: { marginBottom: 20 } },
            React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 6, fontSize: 14, fontWeight: 800, marginBottom: 10 } },
                s.emoji,
                " ",
                s.label),
            s.grades.map((g) => (React.createElement("div", { key: g.id, style: { marginBottom: 14 } },
                React.createElement("div", { style: { fontSize: 12.5, fontWeight: 700, color: "#94A3B8", marginBottom: 8 } }, g.label),
                React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 8 } }, g.units.map((u) => {
                    const stat = progress.units[u.id];
                    const mastery = (stat && stat.mastery) || 0;
                    return (React.createElement("div", { key: u.id, style: { display: "flex", alignItems: "center", gap: 12, background: card, border: "1px solid " + border, borderRadius: 12, padding: 12 } },
                        React.createElement(Ring, { pct: mastery, color: u.accent, size: 36 }),
                        React.createElement("div", { style: { flex: 1 } },
                            React.createElement("div", { style: { fontWeight: 700, fontSize: 13.5 } }, u.title),
                            React.createElement("div", { style: { fontSize: 11, color: "#94A3B8" } },
                                (stat && stat.sessions) || 0,
                                " sesi belajar"))));
                }))))))))));
}

export default App;
