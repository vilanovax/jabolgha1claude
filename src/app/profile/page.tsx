"use client";
import TopHeader from "@/components/layout/TopHeader";
import BottomNav from "@/components/layout/BottomNav";
import { player, badges, job, housing, bank, formatMoney } from "@/data/mock";

export default function ProfilePage() {
  const earnedBadges = badges.filter((b) => b.earned);

  return (
    <div className="game-bg" style={{ minHeight: "100dvh" }}>
      <TopHeader />

      <div className="page-enter" style={{
        paddingTop: "calc(var(--header-h) + 8px)",
        paddingBottom: "calc(var(--nav-h) + 16px)",
        paddingLeft: 14, paddingRight: 14,
        position: "relative", zIndex: 2,
      }}>
        {/* Profile Hero - Dark panel */}
        <div style={{
          borderRadius: 24, padding: "22px 16px", marginBottom: 14,
          background: "linear-gradient(145deg, #0F2340, #1B3A5C 60%, #263E66)",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 8px 32px rgba(10,22,40,0.3), inset 0 1px 0 rgba(255,255,255,0.06)",
          textAlign: "center", position: "relative", overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", inset: 0, opacity: 0.06,
            backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(255,255,255,0.03) 20px, rgba(255,255,255,0.03) 40px)`,
            pointerEvents: "none",
          }} />
          <div style={{
            position: "absolute", top: -20, right: -20,
            width: 100, height: 100, borderRadius: "50%",
            background: "rgba(212,168,67,0.08)", filter: "blur(30px)",
            pointerEvents: "none",
          }} />

          <div style={{ position: "relative" }}>
            {/* Avatar */}
            <div className="anim-breathe" style={{
              width: 80, height: 80, borderRadius: "50%", margin: "0 auto 10px",
              background: "linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))",
              border: "2px solid rgba(212,168,67,0.3)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 44,
              boxShadow: "0 0 20px rgba(212,168,67,0.15), inset 0 0 20px rgba(212,168,67,0.05)",
            }}>
              {player.avatar}
            </div>

            <div style={{ fontSize: 22, fontWeight: 900, color: "white", marginBottom: 3 }}>{player.name}</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", marginBottom: 10 }}>
              {job.title} · {player.city}
            </div>

            <div style={{ display: "flex", justifyContent: "center", gap: 6 }}>
              <span style={{
                fontSize: 10, fontWeight: 700, padding: "3px 10px",
                background: "rgba(212,168,67,0.2)", color: "#F0C966",
                border: "1px solid rgba(212,168,67,0.3)", borderRadius: "var(--r-full)",
              }}>Lv.{player.level}</span>
              <span style={{
                fontSize: 10, fontWeight: 600, padding: "3px 10px",
                background: "rgba(96,165,250,0.15)", color: "#93c5fd",
                borderRadius: "var(--r-full)",
              }}>{player.scenario}</span>
            </div>

            {/* XP bar */}
            <div style={{ marginTop: 14, padding: "0 20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 10, color: "rgba(255,255,255,0.35)" }}>XP</span>
                <span style={{ fontSize: 10, fontWeight: 700, color: "#F0C966" }}>{player.xp} / {player.xpNext}</span>
              </div>
              <div style={{
                background: "rgba(255,255,255,0.1)", borderRadius: "var(--r-full)",
                height: 6, overflow: "hidden", border: "1px solid rgba(255,255,255,0.05)",
              }}>
                <div style={{
                  width: `${(player.xp / player.xpNext) * 100}%`, height: "100%",
                  borderRadius: "var(--r-full)",
                  background: "linear-gradient(90deg, #D4A843, #F0C966)",
                  boxShadow: "0 0 8px rgba(212,168,67,0.5)",
                  transition: "width 0.5s ease",
                }} />
              </div>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
          {[
            { label: "دارایی", value: formatMoney(bank.checking + bank.savings), emoji: "💰", glow: "rgba(74,222,128,0.2)" },
            { label: "مهارت", value: "Lv.8", emoji: "🧠", glow: "rgba(96,165,250,0.2)" },
            { label: "تجربه", value: `${player.xp} XP`, emoji: "⭐", glow: "rgba(212,168,67,0.2)" },
          ].map((s) => (
            <div key={s.label} style={{
              flex: 1, padding: "14px 10px", textAlign: "center",
              borderRadius: 20, background: "white",
              border: "1px solid rgba(0,0,0,0.04)",
              boxShadow: `0 4px 16px ${s.glow}, 0 1px 3px rgba(0,0,0,0.04)`,
            }}>
              <div style={{
                fontSize: 22, marginBottom: 4,
                filter: `drop-shadow(0 0 5px ${s.glow})`,
              }}>{s.emoji}</div>
              <div style={{ fontSize: 15, fontWeight: 800, color: "#0f172a", marginBottom: 2 }}>{s.value}</div>
              <div style={{ fontSize: 10, color: "#94a3b8" }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Current status */}
        <div style={{
          fontSize: 14, fontWeight: 800, color: "#1e293b",
          display: "flex", alignItems: "center", gap: 6,
          marginBottom: 12, padding: "0 2px",
        }}>
          <span style={{ fontSize: 16 }}>📋</span> وضعیت فعلی
        </div>

        {[
          { emoji: "💼", label: "شغل", value: `${job.title} · ${job.company}`, bg: "#f0fdf4", border: "#bbf7d0", color: "#166534", iconBg: "linear-gradient(135deg, #15803d, #22c55e)" },
          { emoji: "🏠", label: "مسکن", value: `${housing.type} · ${formatMoney(housing.monthlyRent)}/ماه`, bg: "#fff7ed", border: "#fed7aa", color: "#92400e", iconBg: "linear-gradient(135deg, #c2410c, #f97316)" },
          { emoji: "🏦", label: "بانک", value: `${bank.name} · سود ${bank.savingsRate}٪`, bg: "#eff6ff", border: "#bfdbfe", color: "#1e40af", iconBg: "linear-gradient(135deg, #1d4ed8, #3b82f6)" },
        ].map((item) => (
          <div key={item.label} style={{
            display: "flex", alignItems: "center", gap: 12,
            padding: "12px 14px", borderRadius: 20, marginBottom: 10,
            background: item.bg, border: `1.5px solid ${item.border}`,
            boxShadow: `0 2px 8px ${item.border}40`,
          }}>
            <div style={{
              width: 40, height: 40, borderRadius: 12, flexShrink: 0,
              background: item.iconBg,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 18,
              boxShadow: `0 4px 12px ${item.border}`,
              border: "1px solid rgba(255,255,255,0.15)",
            }}>
              {item.emoji}
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: item.color }}>{item.label}</div>
              <div style={{ fontSize: 12, color: item.color, opacity: 0.8 }}>{item.value}</div>
            </div>
          </div>
        ))}

        {/* Badges */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          marginTop: 6, marginBottom: 12, padding: "0 2px",
        }}>
          <div style={{
            fontSize: 14, fontWeight: 800, color: "#1e293b",
            display: "flex", alignItems: "center", gap: 6,
          }}>
            <span style={{ fontSize: 16 }}>🏅</span> بج‌های من
          </div>
          <span style={{
            fontSize: 11, fontWeight: 700, padding: "3px 10px",
            background: "white", color: "#64748b",
            borderRadius: "var(--r-full)", border: "1px solid #e2e8f0",
          }}>
            {earnedBadges.length}/{badges.length}
          </span>
        </div>

        <div style={{
          display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10,
          marginBottom: 14,
        }}>
          {badges.map((b) => (
            <div key={b.id} style={{
              textAlign: "center", padding: "14px 8px",
              borderRadius: 20, background: "white",
              border: b.earned ? "1.5px solid #fde68a" : "1px solid #e2e8f0",
              boxShadow: b.earned ? "0 4px 14px rgba(212,168,67,0.15)" : "none",
              opacity: b.earned ? 1 : 0.4,
              transition: "all 0.3s ease",
            }}>
              <div style={{
                fontSize: 32, marginBottom: 6, lineHeight: 1,
                filter: b.earned ? "drop-shadow(0 0 6px rgba(212,168,67,0.3))" : "grayscale(1)",
              }}>
                {b.emoji}
              </div>
              <div style={{ fontSize: 11, fontWeight: 700, color: b.earned ? "#0f172a" : "#94a3b8" }}>
                {b.name}
              </div>
              <div style={{ fontSize: 9, color: "#94a3b8", marginTop: 2 }}>{b.desc}</div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: 10 }}>
          <button className="game-btn" style={{
            flex: 1, justifyContent: "center",
            background: "linear-gradient(180deg, #64748b, #475569)",
            borderBottomColor: "#334155",
            boxShadow: "0 4px 14px rgba(100,116,139,0.3)",
          }}>
            ✏️ ویرایش
          </button>
          <button className="game-btn" style={{
            flex: 1, justifyContent: "center",
            background: "linear-gradient(180deg, #D4A843, #a8831f)",
            borderBottomColor: "#8b6914",
            boxShadow: "0 4px 14px rgba(212,168,67,0.35)",
          }}>
            🛍️ فروشگاه
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
