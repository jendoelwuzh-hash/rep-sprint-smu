import { InteractiveVisualizer } from './components/InteractiveMath';
import React, { useState, useRef, useEffect, useCallback } from "react";
import { useChat } from '@ai-sdk/react';
import "./sprint-smu.css";
import { useAuth } from './context/AuthContext';
import { supabase } from './lib/supabaseClient';

// Import refactored modules
import { SUBJECTS, AGENTS, ALL_UNITS, STUDENT_CONTEXT, BASE_RULES, DEFAULT_PROGRESS } from './data/subjects';
import { loadJSON, saveJSON, sessionKey, deserializeMessages, buildHelpSummary } from './utils/helpers';
import { MathText } from './components/MathText.jsx';
import { Pill, NavBtn, useIsWide } from './components/UI.jsx';
import { HomeTab, CameraTab, AgentsTab, TutorTab, ProgressTab } from './components/Tabs.jsx';
import { callClaude } from './api/ai.jsx';
import { useSprintLogic } from './hooks/useSprintLogic';

// Tambahkan fungsi langsung di sini untuk menghindari import error
function bumpUnit(prog, unitId, xpGain = 8) {
    const u = prog.units[unitId] || { sessions: 0, mastery: 0 };
    const sessions = u.sessions + 1;
    const mastery = Math.min(100, sessions * 12);
    return { ...prog, xp: prog.xp + xpGain, units: { ...prog.units, [unitId]: { sessions, mastery } } };
}

function App() {
    const { profile, user } = useAuth();
    const wide = useIsWide();
    const [tab, setTab] = useState("home");
    const [activeSubject, setActiveSubject] = useState("matematika");
    const [activeGrade, setActiveGrade] = useState("10");
    const [progress, setProgress] = useState(DEFAULT_PROGRESS);
    const [histories, setHistories] = useState({});
    const [activeUnit, setActiveUnit] = useState(null);
    const [activeAgent, setActiveAgent] = useState(AGENTS[0]);

    const chatHook = useChat({
        api: '/api/chat',
        body: {
            activeAgentId: activeAgent?.id,
            activeUnitId: activeUnit?.id
        }
    }) || { messages: [], isLoading: false, sendMessage: async () => {}, setMessages: () => {} };

        const { messages = [], isLoading: pending, sendMessage, setMessages } = chatHook;
    const { scanImage, setScanImage, scanResult, setScanResult, scanning, runScan } = useSprintLogic(activeAgent, activeUnit, setProgress);

    const [manualInput, setManualInput] = useState("");
    const handleManualInputChange = (e) => setManualInput(e.target.value);
    const handleSendMessage = async (text, profile) => {
        if (!text || !text.trim()) return;

        // Berdasarkan pemeriksaan kode internal:
        // SDK mencoba melakukan 'text' in h.
        // Maka kita WAJIB mengirim objek dengan properti 'text'.
        await sendMessage({ text: text });

        if (activeUnit) setProgress((p) => bumpUnit(p, activeUnit.id));
    };

    const handleManualSubmit = async () => {
        if (!manualInput || !manualInput.trim()) return;

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

        await handleSendMessage(`${instructionText}\n\n${manualInput}`, profile);
        setManualInput("");
    };

    const [error, setError] = useState(null);
    const [helpSummary, setHelpSummary] = useState(null);
    const [sampleFn, setSampleFn] = useState(undefined);
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

    const discussScan = () => {
        // PERBAIKAN: Proteksi total terhadap data yang hilang
        if (!scanResult) {
            console.error("DEBUG: scanResult kosong");
            return;
        }

        // Gunakan [] sebagai fallback jika ALL_UNITS undefined
        const unitsList = Array.isArray(ALL_UNITS) ? ALL_UNITS : [];
        const scanResultLower = scanResult.toLowerCase();

        // Cari unit dengan aman
        const guess = unitsList.find((u) =>
            u && u.title && scanResultLower.includes(u.title.toLowerCase())
        ) || null;

        setActiveUnit(guess);
        setActiveAgent(AGENTS[0]);
        setMessages((prev) => [
            ...prev,
            { role: "user", content: "Ini soal yang tadi aku foto." },
            { role: "assistant", content: scanResult },
        ]);
        setScanImage(null);
        setScanResult(null);
        setTab("tutor");
    };

    const speakText = (text) => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'id-ID';
            window.speechSynthesis.speak(utterance);
        }
    };

    const card = "#141B33", border = "rgba(255,255,255,0.08)";

    return (
        <div style={wide
            ? { width: "100%", margin: "0 auto", height: "100dvh", minHeight: 520, background: "#0B1224", color: "#F1F5F9", display: "grid", gridTemplateColumns: "240px minmax(0, 1fr)", gridTemplateRows: "auto minmax(0, 1fr)", position: "relative", overflow: "hidden" }
            : { width: "100%", maxWidth: 480, margin: "0 auto", height: "100dvh", minHeight: 640, background: "#0B1224", color: "#F1F5F9", display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>

            <div style={wide
                ? { gridColumn: 2, gridRow: 1, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 28px 14px", borderBottom: "1px solid " + border }
                : { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 18px 12px", borderBottom: "1px solid " + border, flexShrink: 0 }}>
                <div>
                    <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: -0.3 }}>Sprint SMU</div>
                    <div style={{ fontSize: 12, color: "#94A3B8", marginTop: 2 }}>Matematika, Kimia & Fisika kelas 10-12, tanpa terasa belajar manual</div>
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                    <Pill style={{ background: "rgba(251,146,60,0.15)", color: "#FDBA74" }}>🔥 {progress.streak}</Pill>
                    <Pill style={{ background: "rgba(34,211,238,0.15)", color: "#67E8F9" }}>✨ {progress.xp} XP</Pill>
                </div>
            </div>

            <div style={wide ? { gridColumn: 2, gridRow: 2, overflowY: "auto", padding: "20px 28px 24px" } : { flex: 1, overflowY: "auto", padding: 18 }}>
                <div style={wide ? { maxWidth: 900, margin: "0 auto", height: "100%" } : { display: "contents" }}>
                    {tab === "home" && <HomeTab progress={progress} activeSubject={activeSubject} setActiveSubject={setActiveSubject} activeGrade={activeGrade} setActiveGrade={setActiveGrade} onOpenUnit={(unit) => openChat(unit, AGENTS[0])} card={card} border={border} />}
                    {tab === "camera" && <CameraTab scanImage={scanImage} scanResult={scanResult} scanning={scanning} imagesOk={imagesOk} sampleReady={!!sampleFn} onPick={() => fileInputRef.current && fileInputRef.current.click()} onRemove={() => { setScanImage(null); setScanResult(null); }} onScan={() => runScan(scanImage?.file, sampleFn, ALL_UNITS, STUDENT_CONTEXT, BASE_RULES)} onDiscuss={discussScan} onGoToTutor={() => setTab(activeUnit || messages.length ? "tutor" : "agents")} card={card} border={border} />}
                    {tab === "agents" && <AgentsTab onPick={(agent) => openChat(activeUnit, agent)} card={card} border={border} />}
                    {tab === "tutor" && <TutorTab unit={activeUnit} agent={activeAgent} messages={messages} pending={pending} error={error} input={manualInput} handleInputChange={handleManualInputChange} handleSubmit={handleManualSubmit} scrollRef={scrollRef} onChangeAgent={(a) => { setActiveAgent(a); setMessages(deserializeMessages(histories[sessionKey(activeUnit, a)])); }} onBack={() => setTab("home")} onAskHuman={() => setHelpSummary(buildHelpSummary(activeUnit, activeAgent, messages))} onClearHistory={() => setMessages([])} card={card} border={border} speakText={speakText} />}
                    {tab === "progress" && <ProgressTab progress={progress} card={card} border={border} />}
                </div>
            </div>

            <input ref={fileInputRef} id="camera-file-input" type="file" accept="image/*" onChange={(e) => {
                 const file = e.target.files && e.target.files[0];
                 e.target.value = "";
                 if (!file) return;
                 setScanImage({ file, previewUrl: URL.createObjectURL(file) });
                 setScanResult(null);
            }} style={{ position: "absolute", width: 1, height: 1, padding: 0, margin: -1, overflow: "hidden", clip: "rect(0,0,0,0)", whiteSpace: "nowrap", border: 0 }} />

            <div style={wide
                ? { gridColumn: 1, gridRow: "1 / span 2", display: "flex", flexDirection: "column", gap: 6, padding: "20px 14px", borderRight: "1px solid " + border, background: "#0D1428", overflowY: "auto" }
                : { display: "flex", borderTop: "1px solid " + border, background: "#0D1428", flexShrink: 0, paddingBottom: "env(safe-area-inset-bottom, 6px)" }}>
                {wide && <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, color: "#64748B", padding: "2px 14px 10px" }}>MENU</div>}
                <NavBtn side={wide} emoji="🏠" label="Beranda" active={tab === "home"} onClick={() => setTab("home")} />
                <NavBtn side={wide} emoji="📷" label="Kamera" active={tab === "camera"} onClick={() => setTab("camera")} />
                <NavBtn side={wide} emoji="🎓" label="Tutor" active={tab === "tutor" || tab === "agents"} onClick={() => setTab(activeUnit || messages.length ? "tutor" : "agents")} />
                <NavBtn side={wide} emoji="📊" label="Progres" active={tab === "progress"} onClick={() => setTab("progress")} />
            </div>
        </div>
    );
}
export default App;
