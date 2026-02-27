"use client";
import { toPersian } from "@/data/mock";
import type { EventSeverity } from "@/data/mock";

interface CityEvent {
  id: number;
  type: string;
  emoji: string;
  severity: EventSeverity;
  title: string;
  desc: string;
  impacts: { text: string; positive: boolean }[];
  remainingHours: number;
  affectedPlayers: number;
}

function getSeverityStyle(severity: EventSeverity) {
  switch (severity) {
    case "critical":
      return {
        bg: "linear-gradient(135deg, rgba(239,68,68,0.08), rgba(249,115,22,0.05))",
        border: "1.5px solid rgba(239,68,68,0.2)",
        iconBg: "linear-gradient(135deg, #b91c1c, #ef4444)",
        iconShadow: "0 4px 14px rgba(239,68,68,0.3)",
        className: "anim-breathe",
      };
    case "golden":
      return {
        bg: "linear-gradient(135deg, rgba(74,222,128,0.08), rgba(34,197,94,0.05))",
        border: "1.5px solid rgba(74,222,128,0.2)",
        iconBg: "linear-gradient(135deg, #15803d, #22c55e)",
        iconShadow: "0 4px 14px rgba(34,197,94,0.3)",
        className: "",
      };
    case "important":
      return {
        bg: "linear-gradient(135deg, rgba(249,115,22,0.06), rgba(245,158,11,0.03))",
        border: "1.5px solid rgba(249,115,22,0.15)",
        iconBg: "linear-gradient(135deg, #b45309, #f97316)",
        iconShadow: "0 4px 14px rgba(249,115,22,0.3)",
        className: "",
      };
    default:
      return {
        bg: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(0,0,0,0.04)",
        iconBg: "linear-gradient(135deg, #64748b, #94a3b8)",
        iconShadow: "0 4px 14px rgba(100,116,139,0.2)",
        className: "",
      };
  }
}

export default function EventCard({ event }: { event: CityEvent }) {
  const style = getSeverityStyle(event.severity);
  const timerText = event.remainingHours >= 24
    ? `${toPersian(Math.floor(event.remainingHours / 24))} روز`
    : `${toPersian(event.remainingHours)} ساعت`;

  return (
    <div className={style.className} style={{
      borderRadius: 20, overflow: "hidden",
      background: style.bg,
      border: style.border,
      marginBottom: 10,
      boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
    }}>
      <div style={{ padding: "14px 16px" }}>
        {/* Header row */}
        <div style={{
          display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 10,
        }}>
          <div style={{
            width: 46, height: 46, borderRadius: 14, flexShrink: 0,
            background: style.iconBg,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 22,
            boxShadow: style.iconShadow,
            border: "1px solid rgba(255,255,255,0.15)",
          }}>
            {event.emoji}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{
              fontSize: 14, fontWeight: 700, color: "#0f172a", marginBottom: 3,
            }}>
              {event.title}
            </div>
            <div style={{ fontSize: 12, color: "#64748b" }}>
              {event.desc}
            </div>
          </div>
        </div>

        {/* Impacts */}
        <div style={{
          padding: "8px 12px",
          background: "rgba(0,0,0,0.02)",
          borderRadius: 12,
          marginBottom: 10,
        }}>
          {event.impacts.map((imp, i) => (
            <div key={i} style={{
              fontSize: 11, fontWeight: 600,
              color: imp.positive ? "#16a34a" : "#dc2626",
              marginBottom: i < event.impacts.length - 1 ? 4 : 0,
              display: "flex", alignItems: "center", gap: 6,
            }}>
              <span style={{ fontSize: 10 }}>{imp.positive ? "📈" : "📉"}</span>
              {imp.text}
            </div>
          ))}
        </div>

        {/* Footer: timer + affected */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <span style={{
            fontSize: 10, fontWeight: 700, padding: "3px 10px",
            borderRadius: 10,
            background: "rgba(59,130,246,0.08)", color: "#3b82f6",
            border: "1px solid rgba(59,130,246,0.15)",
          }}>
            ⏳ فعال تا {timerText} دیگر
          </span>
          <span style={{
            fontSize: 10, fontWeight: 600, color: "#94a3b8",
          }}>
            👥 {toPersian(event.affectedPlayers)} بازیکن
          </span>
        </div>
      </div>
    </div>
  );
}
