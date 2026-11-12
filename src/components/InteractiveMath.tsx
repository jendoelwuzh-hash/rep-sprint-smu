import React, { useState } from "react";

// 1. Matematika: Transformasi Fungsi
export function FunctionTransformation({ functionType = "quadratic" }: { functionType?: "quadratic" | "sine" }) {
  const [shiftX, setShiftX] = useState(0);
  const [shiftY, setShiftY] = useState(0);
  const [scale, setScale] = useState(1);

  const W = 300;
  const H = 300;
  const pad = 30;

  const mapX = (x: number) => pad + ((x + 5) / 10) * (W - 2 * pad);
  const mapY = (y: number) => H - pad - ((y + 5) / 10) * (H - 2 * pad);
  const baseFn = (x: number) => functionType === "quadratic" ? x * x : Math.sin(x);
  const transformedFn = (x: number) => scale * baseFn(x - shiftX) + shiftY;

  let path = "";
  for (let x = -5; x <= 5; x += 0.1) {
    const y = transformedFn(x);
    if (y < -5 || y > 5) continue;
    path += `${x === -5 ? "M" : "L"} ${mapX(x)} ${mapY(y)} `;
  }

  return (
    <div style={{ background: "#15161F", padding: "16px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)" }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <line x1={mapX(-5)} y1={mapY(0)} x2={mapX(5)} y2={mapY(0)} stroke="#9295A6" />
        <line x1={mapX(0)} y1={mapY(-5)} x2={mapX(0)} y2={mapY(5)} stroke="#9295A6" />
        <path d={path} fill="none" stroke="#22D3EE" strokeWidth="2" />
      </svg>
      <div style={{ marginTop: "16px", display: "flex", flexDirection: "column", gap: "10px" }}>
        <input type="range" min="-5" max="5" step="0.5" value={shiftX} onChange={(e) => setShiftX(parseFloat(e.target.value))} title="Geser X" />
        <input type="range" min="-5" max="5" step="0.5" value={shiftY} onChange={(e) => setShiftY(parseFloat(e.target.value))} title="Geser Y" />
        <input type="range" min="0.5" max="3" step="0.1" value={scale} onChange={(e) => setScale(parseFloat(e.target.value))} title="Skala" />
      </div>
    </div>
  );
}

// 2. Fisika: Gelombang Sederhana
export function WaveVisualizer() {
  const [freq, setFreq] = useState(1);
  const W = 300;
  const H = 150;
  const path = Array.from({ length: W }, (_, x) => {
    const y = H / 2 + 30 * Math.sin((x / W) * 2 * Math.PI * freq);
    return `${x === 0 ? "M" : "L"} ${x} ${y}`;
  }).join(" ");

  return (
    <div style={{ background: "#15161F", padding: "16px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)" }}>
      <p style={{ color: "#fff" }}>Simulasi Gelombang (Frekuensi: {freq})</p>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ border: "1px solid rgba(255,255,255,0.1)" }}>
        <path d={path} fill="none" stroke="#34D399" strokeWidth="2" />
      </svg>
      <input type="range" min="1" max="10" value={freq} onChange={(e) => setFreq(parseInt(e.target.value))} style={{ width: "100%", marginTop: "10px" }} />
    </div>
  );
}

// 3. Kimia: Struktur Molekul Sederhana
export function MoleculeVisualizer() {
  const [atoms, setAtoms] = useState(2);
  const W = 300;
  const H = 200;

  return (
    <div style={{ background: "#15161F", padding: "16px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)" }}>
      <p style={{ color: "#fff" }}>Geometri Molekul (Jumlah Atom: {atoms})</p>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        {Array.from({ length: atoms }).map((_, i) => (
          <circle
            key={i}
            cx={W / 2 + (i - (atoms - 1) / 2) * 60}
            cy={H / 2}
            r={20}
            fill={i === 0 ? "#F87171" : "#60A5FA"}
          />
        ))}
        {atoms > 1 && (
          <line
            x1={W / 2 - (atoms - 2) * 30}
            y1={H / 2}
            x2={W / 2 + (atoms - 2) * 30}
            y2={H / 2}
            stroke="#94A3B8"
            strokeWidth="4"
          />
        )}
      </svg>
      <input type="range" min="2" max="5" value={atoms} onChange={(e) => setAtoms(parseInt(e.target.value))} style={{ width: "100%", marginTop: "10px" }} />
    </div>
  );
}

// Master Visualizer
export function InteractiveVisualizer({ unitId }: { unitId: string }) {
  if (unitId.includes("mat-11-transformasi")) return <FunctionTransformation />;
  if (unitId.includes("fis-11-gelombang")) return <WaveVisualizer />;
  if (unitId.includes("kim-10-bentukmolekul")) return <MoleculeVisualizer />;
  return null;
}
