import React from 'react';

// MermaidBlock sekarang hanya menampilkan kode sebagai teks untuk menghindari ERR_ABORTED 404
// yang disebabkan oleh dynamic import di library mermaid.
export function MermaidBlock({ code }: { code: string }) {
  return (
    <pre style={{
        background: '#15161F',
        color: '#94A3B8',
        padding: '12px',
        borderRadius: 8,
        fontSize: '12px',
        overflowX: 'auto',
        border: '1px solid rgba(255,255,255,0.1)'
    }}>
      {code}
    </pre>
  );
}
