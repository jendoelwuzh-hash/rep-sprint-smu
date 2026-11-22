import React from 'react';

// Komponen SVG sederhana untuk merender alur dasar tanpa library eksternal
export function SimpleDiagram({ code, accent }: { code: string, accent: string }) {
  // Parsing sederhana untuk alur "A --> B"
  const lines = code.split('\n').filter(line => line.includes('-->'));

  return (
    <div style={{ background: '#15161F', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: 16, margin: '10px 0' }}>
      <svg width="100%" height={lines.length * 50 + 20} viewBox={`0 0 300 ${lines.length * 50 + 20}`}>
        {lines.map((line, i) => {
          const parts = line.split('-->');
          const source = parts[0].trim();
          const target = parts[1].trim();
          const y = 30 + i * 50;
          return (
            <g key={i}>
              <rect x="50" y={y - 15} width="200" height="30" rx="6" fill={accent + '22'} stroke={accent} />
              <text x="150" y={y + 5} fill="#ECEBE6" fontSize="12" textAnchor="middle">{source} → {target}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
