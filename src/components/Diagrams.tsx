import type { DiagramSpec } from '../types';

interface DiagramBlockProps {
  spec: DiagramSpec;
  accent: string;
}

function CoordinatePlane({ spec, accent }: { spec: DiagramSpec; accent: string }) {
  const W = 260;
  const H = 220;
  const pad = 24;
  const xR = spec.xRange || [-5, 5];
  const yR = spec.yRange || [-5, 5];
  const sx = (x: number) => pad + ((x - xR[0]) / (xR[1] - xR[0])) * (W - 2 * pad);
  const sy = (y: number) => H - pad - ((y - yR[0]) / (yR[1] - yR[0])) * (H - 2 * pad);

  const xTicks: number[] = [];
  for (let x = Math.ceil(xR[0]); x <= Math.floor(xR[1]); x++) xTicks.push(x);
  const yTicks: number[] = [];
  for (let y = Math.ceil(yR[0]); y <= Math.floor(yR[1]); y++) yTicks.push(y);

  return (
    <div style={{ background: '#15161F', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: 8, margin: '6px 0', overflowX: 'auto' }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        {xTicks.map((x) => (
          <line key={`gx${x}`} x1={sx(x)} y1={pad} x2={sx(x)} y2={H - pad} stroke="rgba(255,255,255,0.06)" strokeWidth={1} />
        ))}
        {yTicks.map((y) => (
          <line key={`gy${y}`} x1={pad} y1={sy(y)} x2={W - pad} y2={sy(y)} stroke="rgba(255,255,255,0.06)" strokeWidth={1} />
        ))}
        <line x1={pad} y1={sy(0)} x2={W - pad} y2={sy(0)} stroke="#9295A6" strokeWidth={1.2} />
        <line x1={sx(0)} y1={pad} x2={sx(0)} y2={H - pad} stroke="#9295A6" strokeWidth={1.2} />
        {(spec.lines || []).map((ln: any, idx: number) => (
          <g key={idx}>
            <line x1={sx(ln.from[0])} y1={sy(ln.from[1])} x2={sx(ln.to[0])} y2={sy(ln.to[1])} stroke={accent} strokeWidth={2} />
            {ln.label && <text x={sx(ln.to[0]) + 4} y={sy(ln.to[1]) - 4} fill={accent} fontSize={10} fontFamily="JetBrains Mono">{ln.label}</text>}
          </g>
        ))}
        {(spec.points || []).map((p: any, idx: number) => (
          <g key={idx}>
            <circle cx={sx(p.x)} cy={sy(p.y)} r={3.5} fill={accent} />
            {p.label && <text x={sx(p.x) + 6} y={sy(p.y) - 6} fill="#ECEBE6" fontSize={10} fontFamily="Inter">{p.label} ({p.x}, {p.y})</text>}
          </g>
        ))}
      </svg>
    </div>
  );
}

function NumberLineDiagram({ spec, accent }: { spec: DiagramSpec; accent: string }) {
  const W = 280;
  const H = 70;
  const pad = 20;
  const range = spec.range || [-5, 5];
  const sx = (v: number) => pad + ((v - range[0]) / (range[1] - range[0])) * (W - 2 * pad);
  const ticks: number[] = [];
  for (let v = Math.ceil(range[0]); v <= Math.floor(range[1]); v++) ticks.push(v);
  const y = 38;

  return (
    <div style={{ background: '#15161F', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: 8, margin: '6px 0', overflowX: 'auto' }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <line x1={pad} y1={y} x2={W - pad} y2={y} stroke="#9295A6" strokeWidth={1.5} />
        {(spec.segments || []).map((s: any, idx: number) => (
          <line key={idx} x1={sx(s.from)} y1={y} x2={sx(s.to)} y2={y} stroke={accent} strokeWidth={4} strokeLinecap="round" />
        ))}
        {ticks.map((v) => (
          <g key={v}>
            <line x1={sx(v)} y1={y - 4} x2={sx(v)} y2={y + 4} stroke="#5A5D70" strokeWidth={1} />
            <text x={sx(v)} y={y + 16} fill="#7B7E92" fontSize={9} fontFamily="JetBrains Mono" textAnchor="middle">{v}</text>
          </g>
        ))}
        {(spec.points || []).map((p: any, idx: number) => (
          <g key={idx}>
            <circle cx={sx(p.value)} cy={y} r={4.5} fill={p.filled === false ? '#15161F' : accent} stroke={accent} strokeWidth={1.8} />
            {p.label && <text x={sx(p.value)} y={y - 10} fill="#ECEBE6" fontSize={10} fontFamily="Inter" textAnchor="middle">{p.label}</text>}
          </g>
        ))}
      </svg>
    </div>
  );
}

function ShapeDiagram({ spec, accent }: { spec: DiagramSpec; accent: string }) {
  const W = 220;
  const H = 180;
  const pad = 26;
  const shape = (spec.shape || '').toLowerCase().trim();

  if (shape === 'circle') {
    const r = 60;
    const radiusLabel = spec.sideLabels && spec.sideLabels[0] ? spec.sideLabels[0] : (spec.radius != null ? `r = ${spec.radius}` : null);
    return (
      <div style={{ background: '#15161F', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: 8, margin: '6px 0', display: 'flex', justifyContent: 'center' }}>
        <svg width={160} height={160} viewBox="0 0 160 160">
          <circle cx={80} cy={80} r={r} fill="none" stroke={accent} strokeWidth={2.2} />
          <circle cx={80} cy={80} r={2} fill="#ECEBE6" />
          <line x1={80} y1={80} x2={80 + r} y2={80} stroke={accent} strokeWidth={1.4} strokeDasharray="3 2" />
          {radiusLabel && <text x={80 + r / 2} y={74} fill="#ECEBE6" fontSize={10} fontFamily="Inter" textAnchor="middle">{radiusLabel}</text>}
        </svg>
      </div>
    );
  }

  let verts = spec.vertices;
  if (!verts || verts.length < 3) {
    if (shape === 'rectangle' || shape === 'square') verts = [[0, 0], [4, 0], [4, 3], [0, 3]];
    else verts = [[0, 0], [4, 0], [1.5, 3]];
  }

  const xs = verts.map((v: number[]) => v[0]);
  const ys = verts.map((v: number[]) => v[1]);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const spanX = maxX - minX || 1;
  const spanY = maxY - minY || 1;
  const scale = Math.min((W - 2 * pad) / spanX, (H - 2 * pad) / spanY);
  const px = (v: number[]) => pad + (v[0] - minX) * scale;
  const py = (v: number[]) => H - pad - (v[1] - minY) * scale;
  const pts = verts.map((v: number[]) => `${px(v)},${py(v)}`).join(' ');

  return (
    <div style={{ background: '#15161F', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: 8, margin: '6px 0', display: 'flex', justifyContent: 'center', overflowX: 'auto' }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <polygon points={pts} fill={`${accent}1a`} stroke={accent} strokeWidth={2.2} />
        {verts.map((v: number[], idx: number) => {
          const next = verts[(idx + 1) % verts.length];
          const mx = (px(v) + px(next)) / 2;
          const my = (py(v) + py(next)) / 2;
          const label = (spec.sideLabels || [])[idx];
          return label ? <text key={`s${idx}`} x={mx} y={my - 6} fill="#ECEBE6" fontSize={10.5} fontFamily="Inter" textAnchor="middle">{label}</text> : null;
        })}
        {(spec.angleLabels || []).map((a: any, idx: number) => {
          const v = verts[a.vertex];
          if (!v) return null;
          return <text key={`a${idx}`} x={px(v)} y={py(v) - 4} fill={accent} fontSize={10} fontFamily="JetBrains Mono" textAnchor="middle">{a.label}</text>;
        })}
      </svg>
    </div>
  );
}

function BarDiagram({ spec, accent }: { spec: DiagramSpec; accent: string }) {
  const W = 260;
  const H = 160;
  const pad = 28;
  const data = spec.data || [];
  const max = Math.max(1, ...data.map((d: any) => d.value));
  const bw = (W - 2 * pad) / Math.max(1, data.length);

  return (
    <div style={{ background: '#15161F', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: 8, margin: '6px 0', overflowX: 'auto' }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <line x1={pad} y1={H - pad} x2={W - pad} y2={H - pad} stroke="#5A5D70" strokeWidth={1} />
        {data.map((d: any, idx: number) => {
          const barH = ((H - 2 * pad) * d.value) / max;
          const x = pad + idx * bw + bw * 0.2;
          const y = H - pad - barH;
          return (
            <g key={idx}>
              <rect x={x} y={y} width={bw * 0.6} height={barH} fill={accent} rx={3} />
              <text x={x + (bw * 0.6) / 2} y={y - 4} fill="#ECEBE6" fontSize={9.5} fontFamily="JetBrains Mono" textAnchor="middle">{d.value}</text>
              <text x={x + (bw * 0.6) / 2} y={H - pad + 12} fill="#7B7E92" fontSize={9.5} fontFamily="Inter" textAnchor="middle">{d.label}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

const SHAPE_NAMES = ['circle', 'triangle', 'rectangle', 'square', 'polygon'];

export function DiagramBlock({ spec, accent }: DiagramBlockProps) {
  const type = (spec.type || '').toLowerCase().trim();

  if (type === 'coordinate') return <CoordinatePlane spec={spec} accent={accent} />;
  if (type === 'numberline' || type === 'number-line' || type === 'number_line') return <NumberLineDiagram spec={spec} accent={accent} />;
  if (type === 'bar') return <BarDiagram spec={spec} accent={accent} />;
  if (type === 'shape' || SHAPE_NAMES.includes(type)) {
    const shape = (spec.shape || type || '').toLowerCase().trim();
    return <ShapeDiagram spec={{ ...spec, shape }} accent={accent} />;
  }
  return null;
}