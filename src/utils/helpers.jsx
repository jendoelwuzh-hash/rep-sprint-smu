// src/utils/helpers.jsx

export function todayStr() { return new Date().toISOString().slice(0, 10); }

export function bumpStreak(prog) {
    const today = todayStr();
    if (prog.lastActive === today)
        return prog;
    const y = new Date();
    y.setDate(y.getDate() - 1);
    const yesterday = y.toISOString().slice(0, 10);
    const streak = prog.lastActive === yesterday ? prog.streak + 1 : 1;
    return { ...prog, streak, lastActive: today };
}

export function bumpUnit(prog, unitId, xpGain) {
    const gain = xpGain || 8;
    const u = prog.units[unitId] || { sessions: 0, mastery: 0 };
    const sessions = u.sessions + 1;
    const mastery = Math.min(100, sessions * 12);
    const withStreak = bumpStreak(prog);
    return { ...withStreak, xp: withStreak.xp + gain, units: { ...withStreak.units, [unitId]: { sessions, mastery } } };
}

export function loadJSON(key, fallback) {
    try {
        const v = localStorage.getItem(key);
        return v ? JSON.parse(v) : fallback;
    }
    catch (e) {
        return fallback;
    }
}

export function saveJSON(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    }
    catch (e) { /* ignore */ }
}

export function sessionKey(unit, agent) { return (unit ? unit.id : "umum") + "::" + agent.id; }

export function serializeMessages(messages) {
    return messages.map((m) => ({ role: m.role, text: m.text, hadImage: !!m.image }));
}

export function deserializeMessages(saved) {
    // Pastikan 'saved' adalah array sebelum melakukan .map
    if (!Array.isArray(saved)) return [];
    
    return saved.map((m) => ({
        role: m.role,
        // Pastikan m.text ada sebelum dioperasikan
        text: m.hadImage ? (m.text || "") + "\n\n(📷 foto soal dari sesi sebelumnya, tidak tersimpan setelah ditutup)" : (m.text || ""),
    }));
}

export function buildHelpSummary(unit, agent, messages) {
    const recent = messages.slice(-6);
    const lines = recent.map((m) => (m.role === "user" ? "Aku" : agent.name) + ": " + m.text).join("\n\n");
    return "Halo, aku lagi belajar" + (unit ? " " + unit.title : "") + " pakai aplikasi belajar, tapi masih bingung. " +
        "Boleh dibantuin jelasin?\n\n" + (lines || "(belum ada percakapan)") + "\n\nBagian yang bikin bingung: ";
}

export function errorCopy(code) {
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
