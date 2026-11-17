// src/components/MathText.js
import React, { useRef, useEffect } from "react";

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

export function MathText({ text }) {
    const containerRef = useRef(null);
    useEffect(() => {
        if (containerRef.current) {
            window.mermaid.run({ nodes: containerRef.current.querySelectorAll('.mermaid') });
        }
    }, [text]);

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
