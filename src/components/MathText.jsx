import React from 'react';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

export function MathText({ text }) {
    if (!text || typeof text !== 'string') return null;

    // Fungsi untuk memisahkan teks biasa dengan formula LaTeX
    // Mencari pola $...$ untuk inline dan $$...$$ untuk block
    const renderWithLatex = (str) => {
        const parts = str.split(/(\$\$[\s\S]*?\$\$|\$.*?\$)/g);
        return parts.map((part, index) => {
            if (part.startsWith('$$') && part.endsWith('$$')) {
                return <BlockMath key={index} math={part.slice(2, -2)} />;
            } else if (part.startsWith('$') && part.endsWith('$')) {
                return <InlineMath key={index} math={part.slice(1, -1)} />;
            }
            return <span key={index}>{part}</span>;
        });
    };

    return (
        <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
            {renderWithLatex(text)}
        </div>
    );
}
