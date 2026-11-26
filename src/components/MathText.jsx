import React from 'react';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

export function MathText({ text }) {
    if (!text || typeof text !== 'string') return null;

    // Fungsi untuk memisahkan teks biasa, formula LaTeX, dan bold custom (***...***)
    const renderContent = (str) => {
        // Regex untuk menangkap LaTeX (inline/block) dan bold (***...***)
        const parts = str.split(/(\$\$[\s\S]*?\$\$|\$.*?\$|\*\*\*[\s\S]*?\*\*\*)/g);

        return parts.map((part, index) => {
            // Render Block LaTeX
            if (part.startsWith('$$') && part.endsWith('$$')) {
                return <BlockMath key={index} math={part.slice(2, -2)} />;
            }
            // Render Inline LaTeX
            else if (part.startsWith('$') && part.endsWith('$')) {
                return <InlineMath key={index} math={part.slice(1, -1)} />;
            }
            // Render Bold Custom (***text***)
            else if (part.startsWith('***') && part.endsWith('***')) {
                return (
                    <strong key={index} style={{ color: '#F472B6', fontWeight: 800 }}>
                        {part.slice(3, -3)}
                    </strong>
                );
            }
            // Render teks biasa
            return <span key={index}>{part}</span>;
        });
    };

    return (
        <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
            {renderContent(text)}
        </div>
    );
}
