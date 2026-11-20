import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

mermaid.initialize({ startOnLoad: true, theme: 'dark' });

export function MermaidBlock({ code }: { code: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const render = async () => {
      if (ref.current) {
        try {
          // Unique ID for mermaid instance
          const id = 'mermaid-' + Math.random().toString(36).substr(2, 9);
          const { svg } = await mermaid.render(id, code);
          if (ref.current) ref.current.innerHTML = svg;
        } catch (err) {
          console.error("Mermaid rendering error:", err);
        }
      }
    };
    render();
  }, [code]);

  return <div ref={ref} style={{ margin: '10px 0', display: 'flex', justifyContent: 'center' }} />;
}
