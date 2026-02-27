interface Props {
  value: number;     // 0-100
  color?: string;
  height?: number;
  showLabel?: boolean;
}

export default function ProgressBar({ value, color = "var(--primary)", height = 8, showLabel = false }: Props) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div className="progress-wrap" style={{ flex: 1, height }}>
        <div className="progress-fill" style={{ width: `${Math.min(value, 100)}%`, background: color }} />
      </div>
      {showLabel && (
        <span style={{ fontSize: 11, color: "var(--text-muted)", minWidth: 30, textAlign: "left" }}>
          {value}٪
        </span>
      )}
    </div>
  );
}
