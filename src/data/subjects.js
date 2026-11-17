// src/data/subjects.js

export const MATH_GRADES = [
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

export const KIMIA_GRADES = [
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

export const PHYSICS_GRADES = [
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

export const SUBJECTS = [
    { id: "matematika", label: "Matematika", emoji: "∑", grades: MATH_GRADES },
    { id: "kimia", label: "Kimia", emoji: "🧪", grades: KIMIA_GRADES },
    { id: "fisika", label: "Fisika", emoji: "⚛️", grades: PHYSICS_GRADES },
].map((s) => ({
    ...s,
    grades: s.grades.map((g) => ({ ...g, units: g.units.map((u) => ({ ...u, grade: g.id, subject: s.id })) })),
}));

export const ALL_UNITS = SUBJECTS.flatMap((s) => s.grades.flatMap((g) => g.units));

export const STUDENT_CONTEXT = "Konteks siswa: SMA negeri favorit di Jakarta Selatan, belajar mandiri tanpa les tambahan, " +
    "target naik ranking di kelas. Sesuaikan level kesulitan sedikit di atas rata-rata soal sekolah biasa.";

export const BASE_RULES = "Jawab dalam Bahasa Indonesia. JANGAN pakai LaTeX ($...$) atau markdown (*, #, backtick). " +
    "Tulis pangkat/muatan ion dengan tanda ^ (kalau lebih dari 1 karakter, kurung: x^(2n+1), atau muatan seperti Fe^3+). " +
    "Tulis akar dengan format 'akar(isi)', misalnya akar(9) atau akar(x+1). " +
    "Tulis pecahan sebagai a/b memakai angka atau variabel pendek saja di kiri-kanan tanda '/' (tanpa spasi), misalnya 3/4 atau x/2. " +
    "Untuk rumus kimia, tulis indeks atom dengan garis bawah, misalnya H_2O atau H_2SO_4. " +
    "Untuk reaksi kimia, tulis tanda panah sebagai '->' (satu arah) atau '<->' (kesetimbangan). " +
    "Paragraf pendek, boleh pakai baris baru dan penomoran biasa (1. 2. 3.).";

export const AGENTS = [
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

export const DEFAULT_PROGRESS = { xp: 0, streak: 0, lastActive: null, units: {} };
