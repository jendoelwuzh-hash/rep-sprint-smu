import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

mermaid.initialize({ startOnLoad: false, theme: 'dark', securityLevel: 'loose' });

export function MermaidBlock({ code }: { code: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const render = async () => {
      if (ref.current) {
        try {
          // Bersihkan kode: Mermaid sensitif dengan karakter tertentu di dalam label
          const cleanCode = code.replace(/[\[\]]/g, (m) => m === '[' ? '(' : ')');

          const id = 'mermaid-' + Math.random().toString(36).substr(2, 9);
          // Gunakan mermaid.parse untuk validasi sebelum render
          await mermaid.parse(cleanCode);
          const { svg } = await mermaid.render(id, cleanCode);
          if (ref.current) ref.current.innerHTML = svg;
        } catch (err) {
          console.error("Mermaid rendering error:", err);
          if (ref.current) ref.current.textContent = "Gagal merender diagram.";
        }
      }
    };
    render();
  }, [code]);

  return <div ref={ref} style={{ margin: '10px 0', display: 'flex', justifyContent: 'center' }} />;
}
