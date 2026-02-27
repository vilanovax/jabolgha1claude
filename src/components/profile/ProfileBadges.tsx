"use client";
import { badges, toPersian } from "@/data/mock";

export default function ProfileBadges() {
  const earned = badges.filter((b) => b.earned);
  const earnedCount = earned.length;
  const completionPct = Math.round((earnedCount / badges.length) * 100);

  // Top 3 featured (earned badges)
  const featured = earned.slice(0, 3);
  // Remaining badges (all badges not in featured)
  const remaining = badges.filter((b) => !featured.includes(b));

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
          {toPersian(earnedCount)}/{toPersian(badges.length)} ({toPersian(completionPct)}٪)
        </span>
      </div>

      {/* Featured badges (top 3 earned) */}
      {featured.length > 0 && (
        <div style={{
          display: "flex",
          gap: 10,
          marginBottom: 10,
        }}>
          {featured.map((b) => (
            <div key={b.id} className="anim-badge-glow" style={{
              flex: 1,
              textAlign: "center",
              padding: "16px 6px 12px",
              borderRadius: 20,
              background: "linear-gradient(145deg, rgba(212,168,67,0.08), rgba(255,255,255,0.04))",
              border: "1px solid rgba(212,168,67,0.2)",
            }}>
              <div style={{
                fontSize: 36, marginBottom: 6, lineHeight: 1,
                filter: "drop-shadow(0 0 12px rgba(212,168,67,0.4))",
              }}>
                {b.emoji}
              </div>
              <div style={{
                fontSize: 10, fontWeight: 700,
                color: "#F0C966",
              }}>
                {b.name}
              </div>
              <div style={{
                fontSize: 8, color: "rgba(255,255,255,0.35)",
                marginTop: 2, lineHeight: 1.3,
              }}>
                {b.desc}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Remaining badges */}
      {remaining.length > 0 && (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 8,
        }}>
          {remaining.map((b) => (
            <div key={b.id} style={{
              textAlign: "center",
              padding: "12px 6px 8px",
              borderRadius: 16,
              background: b.earned
                ? "rgba(255,255,255,0.04)"
                : "rgba(255,255,255,0.02)",
              border: b.earned
                ? "1px solid rgba(250,204,21,0.12)"
                : "1px solid rgba(255,255,255,0.04)",
              opacity: b.earned ? 1 : 0.35,
            }}>
              <div style={{
                fontSize: 24, marginBottom: 4, lineHeight: 1,
                filter: b.earned
                  ? "drop-shadow(0 0 6px rgba(212,168,67,0.25))"
                  : "grayscale(1)",
              }}>
                {b.emoji}
              </div>
              <div style={{
                fontSize: 9, fontWeight: 700,
                color: b.earned ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.3)",
              }}>
                {b.name}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
