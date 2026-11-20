import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

mermaid.initialize({ startOnLoad: false, theme: 'dark', securityLevel: 'loose' });

export function MermaidBlock({ code }: { code: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const render = async () => {
      if (ref.current) {
        try {
          // Ubah 'graph' menjadi 'flowchart' dan bersihkan kurung siku agar lebih stabil
          let cleanCode = code.replace(/^graph/i, 'flowchart');
          cleanCode = cleanCode.replace(/[\[\]]/g, (m) => m === '[' ? '(' : ')');

          const id = 'mermaid-' + Math.random().toString(36).substr(2, 9);

          const { svg } = await mermaid.render(id, cleanCode);
          if (ref.current) ref.current.innerHTML = svg;
        } catch (err) {
          console.error("Mermaid rendering error:", err);
          if (ref.current) ref.current.innerHTML = `<div style="color: #FCA5A5; font-size: 12px;">Diagram tidak dapat dimuat.</div>`;
        }
      }
    };
    render();
  }, [code]);

  return <div ref={ref} style={{ margin: '10px 0', display: 'flex', justifyContent: 'center' }} />;
}
