import { ChevronIcon } from './Icons';

interface MasteryRingProps {
  pct: number;
  accent: string;
  size?: number;
}

export function MasteryRing({ pct, accent, size = 40 }: MasteryRingProps) {
  const stroke = 3.5;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (Math.min(100, Math.max(0, pct)) / 100) * c;

  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)', flexShrink: 0 }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={stroke} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={accent}
        strokeWidth={stroke}
        strokeDasharray={c}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 0.6s ease' }}
      />
    </svg>
  );
}

interface TopicCardProps {
  topic: { id: string; name: string; code: string };
  accent: string;
  mastery: number;
  onClick: () => void;
}

export function TopicCard({ topic, accent, mastery, onClick }: TopicCardProps) {
  return (
    <button onClick={onClick} style={styles.card}>
      <span style={styles.accentBar} />
      <span style={styles.code}>{topic.code}</span>
      <span style={styles.name}>{topic.name}</span>
      <MasteryRing pct={mastery} accent={accent} />
      <ChevronIcon size={16} color="#5A5D70" />
    </button>
  );
}

const styles: Record<string, React.CSSProperties> = {
  card: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    width: '100%',
    background: '#1B1D2B',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: 14,
    padding: '12px 14px',
    cursor: 'pointer',
    textAlign: 'left',
    position: 'relative',
    overflow: 'hidden',
  },
  accentBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
  },
  code: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 11,
    fontWeight: 600,
    background: 'var(--accent-soft)',
    borderRadius: 6,
    padding: '3px 7px',
    letterSpacing: 0.5,
    flexShrink: 0,
  },
  name: {
    flex: 1,
    color: '#ECEBE6',
    fontSize: 14.5,
    fontFamily: "'Inter', sans-serif",
    lineHeight: 1.3,
  },
};

interface StatPillProps {
  icon: React.ReactNode;
  value: string | number;
}

export function StatPill({ icon, value }: StatPillProps) {
  return (
    <div style={styles.statPill}>
      {icon}
      <span style={styles.statValue}>{value}</span>
    </div>
  );
}

interface ProgCardProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
}

export function ProgCard({ icon, value, label }: ProgCardProps) {
  return (
    <div style={styles.progCard}>
      {icon}
      <div style={styles.progValue}>{value}</div>
      <div style={styles.progLabel}>{label}</div>
    </div>
  );
}

const statPillStyles: Record<string, React.CSSProperties> = {
  statPill: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    background: '#1B1D2B',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: 20,
    padding: '5px 9px',
  },
  statValue: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 12.5,
    color: '#ECEBE6',
  },
};

const progCardStyles: Record<string, React.CSSProperties> = {
  progCard: {
    flex: 1,
    background: '#1B1D2B',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: 14,
    padding: '12px 10px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 2,
  },
  progValue: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 20,
    color: '#ECEBE6',
    fontWeight: 700,
  },
  progLabel: {
    fontFamily: "'Inter', sans-serif",
    fontSize: 11,
    color: '#7B7E92',
  },
};

Object.assign(styles, statPillStyles, progCardStyles);

interface PrimaryButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  accent: string;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: React.CSSProperties;
}

export function PrimaryButton({ children, onClick, accent, disabled, fullWidth, style }: PrimaryButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        ...primaryBtnStyle(accent),
        width: fullWidth ? '100%' : 'auto',
        opacity: disabled ? 0.6 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
        ...style,
      }}
    >
      {children}
    </button>
  );
}

function primaryBtnStyle(accent: string): React.CSSProperties {
  return {
    background: accent,
    color: '#12131C',
    border: 'none',
    borderRadius: 10,
    padding: '9px 18px',
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 600,
    fontSize: 13,
    cursor: 'pointer',
  };
}

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  accent?: string;
}

export function InputField({ accent, style, ...props }: InputFieldProps) {
  return (
    <input
      {...props}
      style={{
        ...styles.input,
        borderColor: accent ? `${accent}55` : 'rgba(255,255,255,0.08)',
        ...style,
      }}
    />
  );
}

const inputStyles: Record<string, React.CSSProperties> = {
  input: {
    flex: 1,
    background: '#1B1D2B',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 20,
    padding: '10px 14px',
    color: '#ECEBE6',
    fontFamily: "'Inter', sans-serif",
    fontSize: 13.5,
    outline: 'none',
  },
};

Object.assign(styles, inputStyles);

interface SendButtonProps {
  onClick?: () => void;
  accent: string;
  disabled?: boolean;
}

export function SendButton({ onClick, accent, disabled }: SendButtonProps) {
  return (
    <button onClick={onClick} disabled={disabled} style={{ ...styles.sendBtn, background: accent, opacity: disabled ? 0.6 : 1 }}>
      <svg width={16} height={16} viewBox="0 0 24 24" fill="#12131C">
        <path d="M3 11.5 21 3l-6.5 18-3.5-7.5z" />
      </svg>
    </button>
  );
}

const sendBtnStyles: Record<string, React.CSSProperties> = {
  sendBtn: {
    width: 38,
    height: 38,
    borderRadius: '50%',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    flexShrink: 0,
  },
};

Object.assign(styles, sendBtnStyles);

interface EmptyStateProps {
  message: string;
  buttonText: string;
  onButtonClick: () => void;
  accent: string;
}

export function EmptyState({ message, buttonText, onButtonClick, accent }: EmptyStateProps) {
  return (
    <div style={styles.emptyState}>
      <p style={styles.emptyMessage}>{message}</p>
      <PrimaryButton onClick={onButtonClick} accent={accent}>{buttonText}</PrimaryButton>
    </div>
  );
}

const emptyStateStyles: Record<string, React.CSSProperties> = {
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 14,
    marginTop: 60,
  },
  emptyMessage: {
    color: '#9295A6',
    fontFamily: "'Inter', sans-serif",
    fontSize: 13.5,
    textAlign: 'center',
    lineHeight: 1.5,
  },
};

Object.assign(styles, emptyStateStyles);