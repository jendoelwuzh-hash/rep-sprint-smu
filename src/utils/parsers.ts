import type { ParsedBlock, DiagramSpec } from '../types';

export function isTableRow(line: string): boolean {
  return line.trim().startsWith('|') && line.trim().length > 1 && line.includes('|', line.indexOf('|') + 1);
}

export function isSeparatorRow(line: string): boolean {
  if (!line) return false;
  const t = line.trim();
  if (!t.startsWith('|')) return false;
  if (!/^[|:\-\s]+$/.test(t)) return false;
  return t.includes('-');
}

export function parseTableRow(line: string): string[] {
  let t = line.trim();
  if (t.startsWith('|')) t = t.slice(1);
  if (t.endsWith('|')) t = t.slice(0, -1);
  return t.split('|').map((c) => c.trim());
}

export function parseTextAndTables(text: string): ParsedBlock[] {
  const lines = text.split('\n');
  const blocks: ParsedBlock[] = [];
  let i = 0;

  while (i < lines.length) {
    if (isTableRow(lines[i]) && isSeparatorRow(lines[i + 1])) {
      const tableLines = [lines[i]];
      let j = i + 2;
      while (j < lines.length && isTableRow(lines[j])) {
        tableLines.push(lines[j]);
        j++;
      }
      blocks.push({
        type: 'table',
        header: parseTableRow(tableLines[0]),
        rows: tableLines.slice(1).map(parseTableRow),
      });
      i = j;
    } else {
      const paraLines: string[] = [];
      let j = i;
      while (j < lines.length && !(isTableRow(lines[j]) && isSeparatorRow(lines[j + 1]))) {
        paraLines.push(lines[j]);
        j++;
      }
      blocks.push({ type: 'text', content: paraLines.join('\n') });
      i = j;
    }
  }
  return blocks;
}

export function parseBlocks(text: string): ParsedBlock[] {
  const blocks: ParsedBlock[] = [];
  // Perbaikan regex: mendukung ```diagram``` ATAU ```mermaid```
  const fenceRegex = /```(?:diagram|mermaid)\s*([\s\S]*?)```/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = fenceRegex.exec(text)) !== null) {
    const before = text.slice(lastIndex, match.index);
    if (before) blocks.push(...parseTextAndTables(before));

    // Untuk diagram: kita akan bungkus spec-nya agar kompatibel dengan DiagramBlock
    // Mermaid biasanya adalah string mentah, bukan JSON.
    const content = match[1].trim();
    try {
        blocks.push({
            type: 'diagram',
            spec: content.startsWith('{') ? JSON.parse(content) : { type: 'mermaid', code: content }
        });
    } catch (e) {
        // Jika gagal parse JSON, anggap sebagai teks biasa
        blocks.push({ type: 'text', content: match[0] });
    }

    lastIndex = fenceRegex.lastIndex;
  }

  const rest = text.slice(lastIndex);
  if (rest) blocks.push(...parseTextAndTables(rest));

  return blocks;
}

export function readBraced(str: string, start: number): { content: string; end: number } | null {
  if (str[start] !== '{') return null;
  let depth = 0;
  for (let j = start; j < str.length; j++) {
    if (str[j] === '{') depth++;
    else if (str[j] === '}') {
      depth--;
      if (depth === 0) return { content: str.slice(start + 1, j), end: j + 1 };
    }
  }
  return null;
}