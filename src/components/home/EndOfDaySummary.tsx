"use client";
import { useGameStore } from "@/stores/gameStore";
import { toPersian } from "@/data/mock";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function EndOfDaySummary({ isOpen, onClose }: Props) {
  const player = useGameStore((s) => s.player);
  const actionsCompletedToday = useGameStore((s) => s.actionsCompletedToday);
  const routineCompletedToday = useGameStore((s) => s.routineCompletedToday);
  const routineStreak = useGameStore((s) => s.routineStreak);

  if (!isOpen) return null;

  const actionsCount = actionsCompletedToday.length;
  const routineCount = routineCompletedToday.length;
  const allRoutineDone = routineCount === 4;

  const summaryItems = [
    { emoji: "📋", label: "اکشن‌های انجام‌شده", value: `${toPersian(actionsCount)} عدد`, color: "#818cf8" },
    { emoji: "📅", label: "روتین‌های انجام‌شده", value: `${toPersian(routineCount)}/۴`, color: allRoutineDone ? "#4ade80" : "#fb923c" },
    { emoji: "⚡", label: "انرژی باقی‌مونده", value: `${toPersian(player.energy)}٪`, color: player.energy > 30 ? "#facc15" : "#f87171" },
    { emoji: "😊", label: "روحیه", value: toPersian(player.happiness), color: player.happiness > 50 ? "#4ade80" : "#f87171" },
    { emoji: "✨", label: "تجربه کل", value: toPersian(player.xp), color: "#c084fc" },
    { emoji: "⭐", label: "ستاره‌ها", value: toPersian(player.stars), color: "#fbbf24" },
  ];

  return (
    <div className="anim-backdrop-in" style={{
      position: "fixed", inset: 0,
      background: "rgba(0,0,0,0.6)",
      backdropFilter: "blur(10px)",
      WebkitBackdropFilter: "blur(10px)",
      zIndex: 250,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "0 20px",
    }}>
      <div className="anim-summary-card" style={{
        width: "100%",
        maxWidth: 380,
        borderRadius: 28,
        background: "linear-gradient(180deg, #1a1a2e 0%, #0a0e27 100%)",
        border: "1px solid rgba(255,255,255,0.1)",
        boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
        padding: "24px 20px 28px",
      }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div className="anim-reward-pop" style={{ fontSize: 48, marginBottom: 8 }}>
            🌙
          </div>
          <div style={{
            fontSize: 18, fontWeight: 900, color: "white",
            marginBottom: 4,
          }}>
            پایان روز {toPersian(player.dayInGame)}
          </div>
          <div style={{
            fontSize: 10, color: "rgba(255,255,255,0.4)",
          }}>
            خسته نباشی! خلاصه امروزت اینه:
          </div>
        </div>

        {/* Stats grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 8,
          marginBottom: 16,
        }}>
          {summaryItems.map((item) => (
            <div key={item.label} className="anim-reward-float" style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "10px 12px",
              borderRadius: 14,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}>
              <span style={{ fontSize: 18 }}>{item.emoji}</span>
              <div>
                <div style={{
                  fontSize: 8, fontWeight: 600,
                  color: "rgba(255,255,255,0.4)",
                  marginBottom: 2,
                }}>
                  {item.label}
                </div>
                <div style={{
                  fontSize: 13, fontWeight: 900,
                  color: item.color,
                }}>
                  {item.value}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Streak bonus */}
        {allRoutineDone && (
          <div style={{
            textAlign: "center",
            padding: "8px 12px",
            borderRadius: 12,
            background: "rgba(74,222,128,0.06)",
            border: "1px solid rgba(74,222,128,0.15)",
            marginBottom: 16,
            fontSize: 11, fontWeight: 700, color: "#4ade80",
          }}>
            🔥 {toPersian(routineStreak)} روز متوالی روتین کامل! +۵ XP
          </div>
        )}

        {/* Recovery info */}
        <div style={{
          textAlign: "center",
          fontSize: 9, fontWeight: 600,
          color: "rgba(255,255,255,0.3)",
          marginBottom: 16,
        }}>
          💤 با خواب شبانه، ۳۰٪ انرژی ازدست‌رفته برمی‌گرده
        </div>

        {/* Continue button */}
        <button onClick={onClose} style={{
          width: "100%",
          padding: "14px 0",
          borderRadius: 18,
          border: "1.5px solid rgba(99,102,241,0.3)",
          background: "linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.15))",
          color: "white",
          fontSize: 14, fontWeight: 900,
          fontFamily: "inherit",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
        }}>
          شروع روز بعد ←
        </button>
      </div>
    </div>
  );
}
