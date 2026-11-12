import { readBraced } from '../utils/parsers';

interface MathTextProps {
  text: string;
}

export function MathText({ text }: MathTextProps) {
  if (!text) return null;

  const nodes: React.ReactNode[] = [];
  let key = 0;
  let i = 0;

  while (i < text.length) {
    // Bold: ***text***
    if (text.startsWith('***', i)) {
      const end = text.indexOf('***', i + 3);
      if (end !== -1) {
        nodes.push(
          <strong key={key++} style={{ fontWeight: 700 }}>
            <MathText text={text.slice(i + 3, end)} />
          </strong>
        );
        i = end + 3;
        continue;
      }
    }

    // Bold: **text**
    if (text.startsWith('**', i)) {
      const end = text.indexOf('**', i + 2);
      if (end !== -1) {
        nodes.push(
          <strong key={key++} style={{ fontWeight: 700 }}>
            <MathText text={text.slice(i + 2, end)} />
          </strong>
        );
        i = end + 2;
        continue;
      }
    }

    // Bold: *text* (single asterisk)
    if (text[i] === '*' && /[^\s*]/.test(text[i + 1] || '')) {
      const end = text.indexOf('*', i + 1);
      if (end !== -1) {
        nodes.push(
          <strong key={key++} style={{ fontWeight: 700 }}>
            <MathText text={text.slice(i + 1, end)} />
          </strong>
        );
        i = end + 1;
        continue;
      }
    }

    // Fraction: \frac{num}{den}
    if (text.startsWith('\\frac', i)) {
      const num = readBraced(text, i + 5);
      if (num) {
        const den = readBraced(text, num.end);
        if (den) {
          nodes.push(
            <span
              key={key++}
              style={{
                display: 'inline-flex',
                flexDirection: 'column',
                alignItems: 'center',
                verticalAlign: 'middle',
                margin: '0 3px',
                fontSize: '0.85em',
                lineHeight: 1.1,
              }}
            >
              <span style={{ padding: '0 3px' }}><MathText text={num.content} /></span>
              <span style={{ borderTop: '1.5px solid currentColor', width: '100%', padding: '0 3px' }} />
              <span style={{ padding: '0 3px' }}><MathText text={den.content} /></span>
            </span>
          );
          i = den.end;
          continue;
        }
      }
    }

    // Square root: \sqrt{arg}
    if (text.startsWith('\\sqrt', i)) {
      const arg = readBraced(text, i + 5);
      if (arg) {
        nodes.push(
          <span key={key++} style={{ display: 'inline-flex', alignItems: 'flex-start', margin: '0 2px' }}>
            <span style={{ fontSize: '1.1em' }}>&#8730;</span>
            <span style={{ borderTop: '1.5px solid currentColor', paddingLeft: '2px', marginLeft: '-2px' }}>
              <MathText text={arg.content} />
            </span>
          </span>
        );
        i = arg.end;
        continue;
      }
    }

    // Superscript: ^{n} or ^n
    if (text[i] === '^') {
      const braced = readBraced(text, i + 1);
      if (braced) {
        nodes.push(<sup key={key++} style={{ fontSize: '0.75em' }}>{braced.content}</sup>);
        i = braced.end;
        continue;
      } else if (/[0-9a-zA-Z-]/.test(text[i + 1] || '')) {
        nodes.push(<sup key={key++} style={{ fontSize: '0.75em' }}>{text[i + 1]}</sup>);
        i += 2;
        continue;
      }
    }

    // Subscript: _{n} or _n
    if (text[i] === '_') {
      const braced = readBraced(text, i + 1);
      if (braced) {
        nodes.push(<sub key={key++} style={{ fontSize: '0.75em' }}>{braced.content}</sub>);
        i = braced.end;
        continue;
      } else if (/[0-9a-zA-Z]/.test(text[i + 1] || '')) {
        nodes.push(<sub key={key++} style={{ fontSize: '0.75em' }}>{text[i + 1]}</sub>);
        i += 2;
        continue;
      }
    }

    // Regular text
    let j = i;
    while (j < text.length && text[j] !== '\\' && text[j] !== '^' && text[j] !== '_' && text[j] !== '*') j++;
    if (j === i) j = i + 1;
    nodes.push(text.slice(i, j));
    i = j;
  }

  return <>{nodes}</>;
}