import { parseBlocks } from '../utils/parsers';
import { MathText } from './MathText';
import { DiagramBlock } from './Diagrams';
import type { ParsedBlock } from '../types';

interface MarkdownTableProps {
  header: string[];
  rows: string[][];
  accent: string;
}

function MarkdownTable({ header, rows, accent }: MarkdownTableProps) {
  return (
    <div style={{ overflowX: 'auto', margin: '6px 0', borderRadius: 10, border: '1px solid rgba(255,255,255,0.12)' }}>
      <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: 12.5, minWidth: 220 }}>
        <thead>
          <tr>
            {header.map((h, idx) => (
              <th
                key={idx}
                style={{
                  textAlign: 'left',
                  padding: '6px 10px',
                  background: accent + '24',
                  color: accent,
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600,
                  borderBottom: `1px solid ${accent}55`,
                  whiteSpace: 'nowrap',
                }}
              >
                <MathText text={h} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rIdx) => (
            <tr key={rIdx} style={{ background: rIdx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.035)' }}>
              {row.map((cell, cIdx) => (
                <td
                  key={cIdx}
                  style={{
                    padding: '6px 10px',
                    color: '#ECEBE6',
                    fontFamily: "'Inter', sans-serif",
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                    verticalAlign: 'top',
                  }}
                >
                  <MathText text={cell} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

interface RichMessageProps {
  text: string;
  accent: string;
}

export function RichMessage({ text, accent }: RichMessageProps) {
  const blocks = parseBlocks(text || '');

  return (
    <>
      {blocks.map((b: ParsedBlock, idx: number) => {
        if (b.type === 'table') return <MarkdownTable key={idx} header={b.header!} rows={b.rows!} accent={accent} />;
        if (b.type === 'diagram') return <DiagramBlock key={idx} spec={b.spec!} accent={accent} />;
        if (!b.content?.trim()) return null;
        return <div key={idx} style={{ whiteSpace: 'pre-wrap' }}><MathText text={b.content} /></div>;
      })}
    </>
  );
}