"use client";
import { cityPlayers, toPersian } from "@/data/mock";

const myPlayer = cityPlayers.find((p) => p.isMe);
const cityRank = myPlayer?.rank ?? 0;

const rankings = [
  { emoji: "🏙️", label: "رتبه شهری", value: cityRank },
  { emoji: "💼", label: "رتبه شغلی", value: cityRank + 5 },
  { emoji: "💰", label: "رتبه دارایی", value: cityRank },
];

export default function ProfileRankings() {
  return (
    <div style={{
      display: "flex",
      gap: 8,
      padding: "0 8px",
      marginBottom: 16,
    }}>
      {rankings.map((r) => (
        <div key={r.label} style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 5,
          padding: "10px 6px",
          borderRadius: 14,
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.06)",
        }}>
          <span style={{ fontSize: 14 }}>{r.emoji}</span>
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}>
            <span style={{
              fontSize: 12, fontWeight: 900, color: "#F0C966",
              fontVariantNumeric: "tabular-nums",
            }}>
              #{toPersian(r.value)}
            </span>
            <span style={{
              fontSize: 7, fontWeight: 600, color: "rgba(255,255,255,0.3)",
            }}>
              {r.label}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
