import React from 'react';

export function MathText({ text }) {
    // 1. Guard clause: Jika text tidak ada atau bukan string, return null atau teks kosong
    if (!text || typeof text !== 'string') {
        return null;
    }

    // 2. Gunakan try-catch saat pemrosesan teks jika ada logic regex yang kompleks
    try {
        // Jika teks mengandung blok Mermaid, kita tampilkan secara sederhana
        // Agar tidak crash saat rendering
        return <div style={{ whiteSpace: 'pre-wrap' }}>{text}</div>;
    } catch (e) {
        console.error("MathText render error:", e);
        return <div>{text}</div>;
    }
}
