// src/components/UI.js
import React, { useState, useEffect } from "react";

export function Pill({ children, style }) {
    return React.createElement("span", { style: { display: "inline-flex", alignItems: "center", gap: 4, padding: "4px 10px", borderRadius: 999, fontSize: 12, fontWeight: 600, background: "rgba(255,255,255,0.08)", color: "#E2E8F0", ...style } }, children);
}

export function Ring({ pct, color, size }) {
    const s = size || 40;
    const r = (s - 6) / 2;
    const c = 2 * Math.PI * r;
    return (React.createElement("svg", { width: s, height: s, viewBox: "0 0 " + s + " " + s },
        React.createElement("circle", { cx: s / 2, cy: s / 2, r: r, stroke: "rgba(255,255,255,0.12)", strokeWidth: "5", fill: "none" }),
        React.createElement("circle", { cx: s / 2, cy: s / 2, r: r, stroke: color, strokeWidth: "5", fill: "none", strokeDasharray: c, strokeDashoffset: c - (pct / 100) * c, strokeLinecap: "round", transform: "rotate(-90 " + s / 2 + " " + s / 2 + ")" }),
        React.createElement("text", { x: "50%", y: "52%", textAnchor: "middle", dominantBaseline: "middle", fontSize: "11", fill: "#F1F5F9", fontWeight: "700" }, pct)));
}

export function NavBtn({ emoji, label, active, onClick, side }) {
    if (side) {
        return (React.createElement("button", { onClick: onClick, style: { display: "flex", alignItems: "center", gap: 12, width: "100%", textAlign: "left", padding: "12px 14px", borderRadius: 12, background: active ? "rgba(34,211,238,0.12)" : "transparent", border: "none", cursor: "pointer", color: active ? "#67E8F9" : "#94A3B8" } },
            React.createElement("span", { style: { fontSize: 20 } }, emoji),
            React.createElement("span", { style: { fontSize: 14, fontWeight: active ? 700 : 500 } }, label)));
    }
    return (React.createElement("button", { onClick: onClick, style: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3, padding: "10px 0 8px", background: "none", border: "none", cursor: "pointer", color: active ? "#67E8F9" : "#64748B" } },
        React.createElement("span", { style: { fontSize: 19 } }, emoji),
        React.createElement("span", { style: { fontSize: 11, fontWeight: active ? 700 : 500 } }, label)));
}

const WIDE_QUERY = "(min-width: 900px) and (min-height: 520px)";
export function useIsWide() {
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
