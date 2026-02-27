"use client";
import { badges, toPersian } from "@/data/mock";

export default function ProfileBadges() {
  const earnedCount = badges.filter((b) => b.earned).length;

  return (
    <div style={{ padding: "0 4px", marginBottom: 16 }}>
      {/* Section header */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        marginBottom: 12, padding: "0 8px",
      }}>
        <div style={{
          fontSize: 14, fontWeight: 800, color: "white",
          display: "flex", alignItems: "center", gap: 6,
        }}>
          <span style={{ fontSize: 16 }}>🏅</span>
          دستاوردها
        </div>
        <span style={{
          fontSize: 10, fontWeight: 700, color: "#facc15",
          background: "rgba(250,204,21,0.1)",
          border: "1px solid rgba(250,204,21,0.2)",
          borderRadius: 10, padding: "2px 8px",
        }}>
          {toPersian(earnedCount)}/{toPersian(badges.length)}
        </span>
      </div>

      {/* Badge grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: 10,
      }}>
        {badges.map((b) => (
          <div key={b.id} style={{
            textAlign: "center",
            padding: "14px 6px 10px",
            borderRadius: 18,
            background: b.earned
              ? "rgba(255,255,255,0.04)"
              : "rgba(255,255,255,0.02)",
            border: b.earned
              ? "1px solid rgba(250,204,21,0.15)"
              : "1px solid rgba(255,255,255,0.04)",
            opacity: b.earned ? 1 : 0.35,
            transition: "all 0.3s ease",
          }}>
            <div style={{
              fontSize: 30, marginBottom: 6, lineHeight: 1,
              filter: b.earned
                ? "drop-shadow(0 0 8px rgba(212,168,67,0.3))"
                : "grayscale(1)",
            }}>
              {b.emoji}
            </div>
            <div style={{
              fontSize: 10, fontWeight: 700,
              color: b.earned ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.3)",
            }}>
              {b.name}
            </div>
            <div style={{
              fontSize: 8, color: "rgba(255,255,255,0.25)",
              marginTop: 2, lineHeight: 1.3,
            }}>
              {b.desc}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
