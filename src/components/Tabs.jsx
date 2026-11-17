// src/components/Tabs.js
import React from 'react';
import { Pill, Ring, NavBtn } from './UI.jsx';
import { MathText } from './MathText.jsx';
import { SUBJECTS, AGENTS, ALL_UNITS } from '../data/subjects';

export function HomeTab({ progress, activeSubject, setActiveSubject, activeGrade, setActiveGrade, onOpenUnit, card, border }) {
    const subject = SUBJECTS.find((s) => s.id === activeSubject) || SUBJECTS[0];
    const grade = subject.grades.find((g) => g.id === activeGrade) || subject.grades[0];
    return (
        <div>
            <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
                {SUBJECTS.map((s) => {
                    const active = s.id === activeSubject;
                    return (
                        <button key={s.id} onClick={() => setActiveSubject(s.id)} style={{
                            flex: 1, padding: "10px 0", borderRadius: 10, cursor: "pointer", fontSize: 13, fontWeight: 700,
                            border: "1px solid " + (active ? "#F472B6" : border), background: active ? "rgba(244,114,182,0.14)" : card,
                            color: active ? "#F9A8D4" : "#94A3B8", display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                        }}>
                            {s.emoji} {s.label}
                        </button>
                    );
                })}
            </div>
            <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
                {subject.grades.map((g) => (
                    <button key={g.id} onClick={() => setActiveGrade(g.id)} style={{
                        flex: 1, padding: "9px 0", borderRadius: 10, cursor: "pointer", fontSize: 12.5, fontWeight: 700,
                        border: "1px solid " + (g.id === activeGrade ? "#22D3EE" : border), background: g.id === activeGrade ? "rgba(34,211,238,0.14)" : card,
                        color: g.id === activeGrade ? "#67E8F9" : "#94A3B8",
                    }}>{g.label}</button>
                ))}
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#94A3B8", marginBottom: 10 }}>
                Pilih topik {subject.label.toLowerCase()} {grade.label.toLowerCase()}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {grade.units.map((u) => {
                    const stat = progress.units[u.id];
                    const mastery = (stat && stat.mastery) || 0;
                    return (
                        <button key={u.id} onClick={() => onOpenUnit(u)} style={{ textAlign: "left", background: card, border: "1px solid " + border, borderRadius: 14, padding: 14, cursor: "pointer", display: "flex", flexDirection: "column", gap: 8 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                <div style={{ width: 8, height: 8, borderRadius: 99, background: u.accent, marginTop: 5 }} />
                                <Ring pct={mastery} color={u.accent} size={34} />
                            </div>
                            <div>
                                <div style={{ fontWeight: 700, fontSize: 14.5 }}>{u.title}</div>
                                <div style={{ fontSize: 11.5, color: "#94A3B8", marginTop: 2, lineHeight: 1.35 }}>{u.subtitle}</div>
                            </div>
                        </button>
                    );
                })}
            </div>
            <div style={{ marginTop: 22, background: card, border: "1px solid " + border, borderRadius: 14, padding: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <span>🏆</span>
                    <span style={{ fontWeight: 700, fontSize: 13.5 }}>Mau soal susah buat kejar ranking?</span>
                </div>
                <div style={{ fontSize: 12.5, color: "#94A3B8", lineHeight: 1.5 }}>Coba agen "Soal HOTS" di tab Tutor — bikinin soal setingkat seleksi sekolah unggulan, lengkap sama pembahasan kalau diminta.</div>
            </div>
        </div>
    );
}

export function CameraTab({ scanImage, scanResult, scanning, imagesOk, sampleReady, onPick, onRemove, onScan, onDiscuss, onGoToTutor, card, border }) {
    if (sampleReady && !imagesOk) {
        return (
            <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#94A3B8", marginBottom: 10 }}>Foto soal sekolah</div>
                <div style={{ background: card, border: "1px solid " + border, borderRadius: 16, padding: "32px 18px", display: "flex", flexDirection: "column", alignItems: "center", gap: 12, textAlign: "center" }}>
                    <span style={{ fontSize: 30 }}>📷</span>
                    <div style={{ fontWeight: 700, fontSize: 14.5 }}>Kirim foto ke AI belum didukung di tampilan ini</div>
                    <div style={{ fontSize: 12.5, color: "#94A3B8", lineHeight: 1.5 }}>Ini keterbatasan sementara dari tampilan artifact Claude, bukan dari aplikasinya. Untuk sekarang, ketik atau salin soalnya lewat tab Tutor — agen tetap bisa bantu jelasin dan kasih langkah pengerjaannya.</div>
                    <button onClick={onGoToTutor} style={{ marginTop: 4, background: "#22D3EE", color: "#04222B", border: "none", borderRadius: 12, padding: "11px 22px", fontWeight: 800, fontSize: 13.5, cursor: "pointer" }}>Ketik soal di Tutor</button>
                </div>
            </div>
        );
    }
    return (
        <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#94A3B8", marginBottom: 10 }}>Foto soal sekolah</div>
            {!scanImage && <div style={{ padding: "20px 0", display: "flex", flexDirection: "column", gap: 10, zIndex: 1000 }}>
                <button onClick={onPick} style={{ width: "100%", background: "#22D3EE", color: "#04222B", border: "none", borderRadius: 12, padding: "12px 0", fontWeight: 800, fontSize: 14, cursor: "pointer", zIndex: 1000 }}>Pilih File dari HP</button>
                <div style={{ textAlign: "center", color: "#94A3B8" }}>atau</div>
                <label htmlFor="camera-file-input" style={{ width: "100%", background: card, border: "1.5px dashed " + border, borderRadius: 16, padding: "40px 16px", display: "flex", flexDirection: "column", alignItems: "center", gap: 10, cursor: "pointer", color: "#67E8F9", boxSizing: "border-box", zIndex: 1000 }}>
                    <span style={{ fontSize: 30 }}>📷</span>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>Ambil Foto Baru</div>
                </label>
            </div>}
            {scanImage && (
                <div style={{ background: card, border: "1px solid " + border, borderRadius: 16, overflow: "hidden" }}>
                    <div style={{ position: "relative" }}>
                        <img src={scanImage.previewUrl} alt="soal" style={{ width: "100%", display: "block", maxHeight: 260, objectFit: "cover" }} />
                        <button onClick={onRemove} style={{ position: "absolute", top: 8, right: 8, background: "rgba(11,18,36,0.75)", border: "none", borderRadius: 999, width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", cursor: "pointer" }}>✕</button>
                    </div>
                    <div style={{ padding: 14 }}>
                        {!scanResult && <button onClick={onScan} disabled={scanning} style={{ width: "100%", background: "#22D3EE", color: "#04222B", border: "none", borderRadius: 12, padding: "12px 0", fontWeight: 800, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                            {scanning ? <><span className="spinner"></span> Membaca soal…</> : <>✨ Bahas soal ini</>}
                        </button>}
                        {scanResult && (
                            <div>
                                <div style={{ fontSize: 13.5, lineHeight: 1.55, color: "#E2E8F0" }}>
                                    <MathText text={scanResult} />
                                </div>
                                <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
                                    <button onClick={onDiscuss} style={{ flex: 1, background: "#F472B6", color: "#2B0B1A", border: "none", borderRadius: 10, padding: "10px 0", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>Diskusikan lebih lanjut</button>
                                    <button onClick={onRemove} style={{ background: "transparent", color: "#94A3B8", border: "1px solid " + border, borderRadius: 10, padding: "10px 14px", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>Foto lagi</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export function AgentsTab({ onPick, card, border }) {
    return (
        <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#94A3B8", marginBottom: 10 }}>Pilih gaya belajarmu</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {AGENTS.map((a) => (
                    <button key={a.id} onClick={() => onPick(a)} style={{ display: "flex", alignItems: "center", gap: 12, textAlign: "left", background: card, border: "1px solid " + border, borderRadius: 14, padding: 14, cursor: "pointer" }}>
                        <div style={{ width: 42, height: 42, borderRadius: 12, flexShrink: 0, background: a.color + "22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 19 }}>{a.emoji}</div>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 700, fontSize: 14 }}>{a.name}</div>
                            <div style={{ fontSize: 11.5, color: "#94A3B8", marginTop: 1 }}>{a.tagline}</div>
                        </div>
                        <span style={{ color: "#475569" }}>›</span>
                    </button>
                ))}
            </div>
        </div>
    );
}

export function TutorTab({ unit, agent, messages, pending, error, input = "", handleInputChange, handleSubmit, scrollRef, onChangeAgent, onBack, onAskHuman, onClearHistory, card, border, speakText }) {
    return (
        <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <button onClick={onBack} style={{ background: "none", border: "none", color: "#94A3B8", cursor: "pointer", padding: 4, fontSize: 16 }}>←</button>
                <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{agent.name}{unit ? " · " + unit.title : ""}</div>
                    <div style={{ fontSize: 11, color: "#94A3B8" }}>{agent.tagline}</div>
                </div>
                {messages.length > 0 && <button onClick={onClearHistory} title="Hapus riwayat topik ini" style={{ background: "none", border: "none", color: "#64748B", cursor: "pointer", padding: 4 }}>🗑️</button>}
                <select value={agent.id} onChange={(e) => onChangeAgent(AGENTS.find((a) => a.id === e.target.value))} style={{ background: card, color: "#E2E8F0", border: "1px solid " + border, borderRadius: 8, fontSize: 11.5, padding: "6px 8px" }}>
                    {AGENTS.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
                </select>
            </div>
            {unit && <div style={{ marginBottom: 10 }}>
                {/* InteractiveVisualizer needs to be passed in or imported */}
            </div>}
            <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 10, paddingBottom: 10 }}>
                {messages.length === 0 && <div style={{ background: card, border: "1px solid " + border, borderRadius: 12, padding: 14, fontSize: 12.5, color: "#94A3B8", display: "flex", gap: 8 }}>
                    <span>{agent.emoji}</span>
                    <span>{unit ? ("Tanya apa saja soal " + unit.title + ", atau ketik \"kasih soal\" biar " + agent.name + " mulai duluan.") : "Ceritakan topik atau soal yang mau kamu bahas dulu."}</span>
                </div>}
                {messages.map((m, i) => (
                    <div key={i} style={{ alignSelf: m.role === "user" ? "flex-end" : "flex-start", maxWidth: "85%", background: m.role === "user" ? "#1D4ED8" : card, border: m.role === "user" ? "none" : "1px solid " + border, borderRadius: 14, padding: "10px 13px", fontSize: 13.5, lineHeight: 1.5, position: "relative" }}>
                        <MathText text={m.content} />
                        {m.role === "assistant" && <button onClick={() => speakText(m.content)} style={{ position: "absolute", bottom: 4, right: 6, background: "none", border: "none", cursor: "pointer", fontSize: 14 }}>🔊</button>}
                    </div>
                ))}
                {pending && <div style={{ alignSelf: "flex-start", background: card, border: "1px solid " + border, borderRadius: 14, padding: "10px 13px" }}><span className="spinner"></span></div>}
                {error && <div style={{ color: "#FCA5A5", fontSize: 12 }}>{error}</div>}
            </div>
            {messages.length > 0 && <button onClick={onAskHuman} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, width: "100%", background: "rgba(244,114,182,0.12)", color: "#F9A8D4", border: "1px solid rgba(244,114,182,0.3)", borderRadius: 10, padding: "9px 0", fontSize: 12.5, fontWeight: 600, cursor: "pointer", marginBottom: 8 }}>❓ Bingung, minta dijelasin manusia</button>}
            <div style={{ display: "flex", gap: 8 }}>
                <input value={input} onChange={handleInputChange} onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(e); }} placeholder="Tulis pertanyaan…" style={{ flex: 1, background: card, border: "1px solid " + border, borderRadius: 12, padding: "11px 14px", color: "#F1F5F9", fontSize: 13.5, outline: "none" }} />
                <button onClick={handleSubmit} disabled={pending || !input.trim()} style={{ width: 42, height: 42, borderRadius: 12, background: "#22D3EE", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0, opacity: pending || !input.trim() ? 0.5 : 1 }}>➤</button>
            </div>
        </div>
    );
}

export function ProgressTab({ progress, card, border }) {
    const totalMastery = ALL_UNITS.reduce((s, u) => s + ((progress.units[u.id] && progress.units[u.id].mastery) || 0), 0) / ALL_UNITS.length;
    return (
        <div>
            <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
                <div style={{ flex: 1, background: card, border: "1px solid " + border, borderRadius: 14, padding: 16, textAlign: "center" }}>
                    <div style={{ fontSize: 18 }}>🔥</div>
                    <div style={{ fontSize: 22, fontWeight: 800 }}>{progress.streak}</div>
                    <div style={{ fontSize: 11, color: "#94A3B8" }}>Hari beruntun</div>
                </div>
                <div style={{ flex: 1, background: card, border: "1px solid " + border, borderRadius: 14, padding: 16, textAlign: "center" }}>
                    <div style={{ fontSize: 18 }}>✨</div>
                    <div style={{ fontSize: 22, fontWeight: 800 }}>{progress.xp}</div>
                    <div style={{ fontSize: 11, color: "#94A3B8" }}>Total XP</div>
                </div>
                <div style={{ flex: 1, background: card, border: "1px solid " + border, borderRadius: 14, padding: 16, textAlign: "center" }}>
                    <div style={{ fontSize: 18 }}>✅</div>
                    <div style={{ fontSize: 22, fontWeight: 800 }}>{Math.round(totalMastery)}%</div>
                    <div style={{ fontSize: 11, color: "#94A3B8" }}>Rata-rata penguasaan</div>
                </div>
            </div>
            {SUBJECTS.map((s) => (
                <div key={s.id} style={{ marginBottom: 20 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 14, fontWeight: 800, marginBottom: 10 }}>{s.emoji} {s.label}</div>
                    {s.grades.map((g) => (
                        <div key={g.id} style={{ marginBottom: 14 }}>
                            <div style={{ fontSize: 12.5, fontWeight: 700, color: "#94A3B8", marginBottom: 8 }}>{g.label}</div>
                            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                {g.units.map((u) => {
                                    const stat = progress.units[u.id];
                                    const mastery = (stat && stat.mastery) || 0;
                                    return (
                                        <div key={u.id} style={{ display: "flex", alignItems: "center", gap: 12, background: card, border: "1px solid " + border, borderRadius: 12, padding: 12 }}>
                                            <Ring pct={mastery} color={u.accent} size={36} />
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontWeight: 700, fontSize: 13.5 }}>{u.title}</div>
                                                <div style={{ fontSize: 11, color: "#94A3B8" }}>{(stat && stat.sessions) || 0} sesi belajar</div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}
