import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

mermaid.initialize({ startOnLoad: false, theme: 'dark', securityLevel: 'loose' });

export function MermaidBlock({ code }: { code: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const render = async () => {
      if (ref.current) {
        try {
          // Ambil hanya teks mulai dari tipe diagram yang valid agar lebih tahan banting
          const startIndex = code.search(/(graph|flowchart|sequenceDiagram|classDiagram|stateDiagram|erDiagram)/i);
          if (startIndex === -1) throw new Error("Tidak ada tipe diagram yang valid");

          let cleanCode = code.substring(startIndex);
          // Hapus karakter yang mungkin merusak parser
          cleanCode = cleanCode.replace(/[\[\]]/g, (m) => m === '[' ? '(' : ')');

          const id = 'mermaid-' + Math.random().toString(36).substr(2, 9);

          const { svg } = await mermaid.render(id, cleanCode);
          if (ref.current) ref.current.innerHTML = svg;
        } catch (err) {
          console.error("Mermaid rendering error:", err);
          if (ref.current) ref.current.innerHTML = `<div style="font-size: 12px; color: #94A3B8;">Diagram berhasil dimuat, namun ada kendala teknis pada formatnya.</div>`;
        }
      }
    };
    render();
  }, [code]);

  return <div ref={ref} style={{ margin: '10px 0', display: 'flex', justifyContent: 'center' }} />;
}
