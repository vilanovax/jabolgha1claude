"use client";
import { useState, useEffect } from "react";
import { useGameStore } from "@/stores/gameStore";
import { getStreakReward, STREAK_MILESTONES } from "@/data/streakRewards";
import { toPersian } from "@/data/mock";

export default function StreakCard() {
  const [mounted, setMounted] = useState(false);
  const [flash, setFlash] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const streak           = useGameStore((s) => s.streak);
  const dayInGame        = useGameStore((s) => s.player.dayInGame);
  const claimStreakReward = useGameStore((s) => s.claimStreakReward);

  if (!mounted) return null;

  const { currentStreak, claimed, shieldAvailable } = streak;

  // Today's reward (next streak after claim)
  const nextStreak = currentStreak + 1;
  const todayReward = getStreakReward(nextStreak);

  // Find next milestone within visible window
  const nextMilestone = [7, 14, 30].find((m) => m > currentStreak);
  const daysToMilestone = nextMilestone ? nextMilestone - currentStreak : null;

  // Tomorrow's reward (for teaser)
  const tomorrowStreak = nextStreak + 1;
  const tomorrowReward = getStreakReward(tomorrowStreak);
  const tomorrowIsMilestone = STREAK_MILESTONES[tomorrowStreak] !== undefined;

  const handleClaim = () => {
    const result = claimStreakReward();
    if (result) {
      setFlash(true);
      setTimeout(() => setFlash(false), 1200);
    }
  };

  // 7-day calendar dots centered around current day
  const calendarDays = Array.from({ length: 7 }, (_, i) => {
    const dayOffset = i - 3; // -3 to +3 around current position
    const streakDay = currentStreak + dayOffset + (claimed ? 0 : -1) + 1;
    if (streakDay < 1) return { streakDay: -1, state: "empty" as const };
    const isMilestone = STREAK_MILESTONES[streakDay] !== undefined;
    const isToday = streakDay === (claimed ? currentStreak : nextStreak);
    const isPast = streakDay < (claimed ? currentStreak : nextStreak);
    const isFuture = streakDay > (claimed ? currentStreak : nextStreak);
    return { streakDay, state: isToday ? "today" as const : isPast ? "done" as const : "future" as const, isMilestone };
  });

  return (
    <div style={{
      borderRadius: 20,
      background: "rgba(255,255,255,0.03)",
      border: claimed
        ? "1px solid rgba(255,255,255,0.06)"
        : "1px solid rgba(251,146,60,0.18)",
      overflow: "hidden",
    }}>
      {/* Header */}
      <div style={{
        padding: "12px 14px 10px",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        display: "flex", alignItems: "center", gap: 8,
      }}>
        <span style={{ fontSize: 14 }}>🔥</span>
        <span style={{ fontSize: 12, fontWeight: 900, color: "white", flex: 1 }}>
          استریک روزانه
        </span>
        {/* Streak counter */}
        <span style={{
          fontSize: 11, fontWeight: 900,
          color: currentStreak >= 10 ? "#fb923c" : currentStreak >= 5 ? "#facc15" : "rgba(255,255,255,0.5)",
          background: currentStreak >= 10 ? "rgba(251,146,60,0.1)" : "rgba(255,255,255,0.04)",
          border: `1px solid ${currentStreak >= 10 ? "rgba(251,146,60,0.2)" : "rgba(255,255,255,0.06)"}`,
          borderRadius: 8, padding: "2px 8px",
        }}>
          {toPersian(currentStreak)} روز 🔥
        </span>
        {/* Shield pill */}
        {shieldAvailable && (
          <span style={{
            fontSize: 9, fontWeight: 700,
            color: "#60a5fa", background: "rgba(96,165,250,0.08)",
            border: "1px solid rgba(96,165,250,0.15)",
            borderRadius: 8, padding: "2px 7px",
          }}>
            🛡 سپر فعال
          </span>
        )}
      </div>

      <div style={{ padding: "10px 14px 14px", display: "flex", flexDirection: "column", gap: 10 }}>

        {/* 7-day mini calendar */}
        <div style={{ display: "flex", gap: 4, justifyContent: "space-between" }}>
          {calendarDays.map((d, i) => {
            if (d.state === "empty") return <div key={i} style={{ flex: 1 }} />;
            const isDone = d.state === "done";
            const isToday = d.state === "today";
            return (
              <div key={i} style={{
                flex: 1, display: "flex", flexDirection: "column",
                alignItems: "center", gap: 3,
              }}>
                <div style={{
                  width: 28, height: 28, borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: isDone
                    ? "rgba(74,222,128,0.15)"
                    : isToday
                      ? (claimed ? "rgba(74,222,128,0.15)" : "rgba(251,146,60,0.15)")
                      : d.isMilestone
                        ? "rgba(250,204,21,0.08)"
                        : "rgba(255,255,255,0.04)",
                  border: isDone
                    ? "1px solid rgba(74,222,128,0.3)"
                    : isToday
                      ? (claimed ? "1.5px solid rgba(74,222,128,0.5)" : "1.5px solid rgba(251,146,60,0.4)")
                      : d.isMilestone
                        ? "1px solid rgba(250,204,21,0.2)"
                        : "1px solid rgba(255,255,255,0.06)",
                  fontSize: 11,
                }}>
                  {isDone ? "✓" : isToday && claimed ? "✓" : d.isMilestone ? "🎁" : "·"}
                </div>
                <span style={{
                  fontSize: 8, fontWeight: 700,
                  color: isDone || (isToday && claimed)
                    ? "rgba(74,222,128,0.6)"
                    : isToday
                      ? "rgba(251,146,60,0.7)"
                      : "rgba(255,255,255,0.2)",
                }}>
                  {toPersian(d.streakDay)}
                </span>
              </div>
            );
          })}
        </div>

        {/* Today's reward + claim button */}
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          padding: "10px 12px", borderRadius: 14,
          background: claimed ? "rgba(255,255,255,0.02)" : "rgba(251,146,60,0.06)",
          border: `1px solid ${claimed ? "rgba(255,255,255,0.06)" : "rgba(251,146,60,0.2)"}`,
        }}>
          <span style={{ fontSize: 18 }}>{todayReward.emoji}</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: claimed ? "rgba(255,255,255,0.3)" : "white" }}>
              جایزه امروز
            </div>
            <div className={flash ? "anim-reward-pop" : ""} style={{
              fontSize: 10, fontWeight: 700,
              color: claimed ? "rgba(255,255,255,0.2)" : "#fb923c",
            }}>
              {flash ? "✅ دریافت شد!" : todayReward.labelFa}
              {"descFa" in todayReward && !claimed && (
                <span style={{ color: "rgba(255,255,255,0.35)", marginRight: 4 }}>
                  — {todayReward.descFa}
                </span>
              )}
            </div>
          </div>
          {!claimed ? (
            <button
              className="anim-claim-pulse"
              onClick={handleClaim}
              style={{
                padding: "6px 14px", borderRadius: 10,
                background: "rgba(251,146,60,0.85)",
                color: "#1a0800", border: "none",
                fontSize: 11, fontWeight: 900,
                cursor: "pointer", fontFamily: "inherit",
              }}
            >
              دریافت
            </button>
          ) : (
            <span style={{ fontSize: 10, color: "rgba(255,255,255,0.2)", fontWeight: 600 }}>
              ✅ دریافت شد
            </span>
          )}
        </div>

        {/* Next milestone teaser or tomorrow's reward */}
        {claimed && (() => {
          const teaserDay = daysToMilestone !== null && daysToMilestone <= 7 ? nextMilestone! : null;
          const teaserReward = teaserDay
            ? STREAK_MILESTONES[teaserDay]
            : tomorrowReward;
          const label = teaserDay
            ? `روز ${toPersian(teaserDay)}: ${teaserReward.emoji} ${teaserReward.labelFa}`
            : `فردا: ${tomorrowReward.emoji} ${tomorrowReward.labelFa}${tomorrowIsMilestone ? " 🎁" : ""}`;

          return (
            <div style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "6px 10px", borderRadius: 10,
              background: teaserDay ? "rgba(250,204,21,0.05)" : "rgba(255,255,255,0.02)",
              border: `1px solid ${teaserDay ? "rgba(250,204,21,0.12)" : "rgba(255,255,255,0.05)"}`,
            }}>
              <span style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", fontWeight: 700 }}>
                {label}
              </span>
            </div>
          );
        })()}

        {/* Streak bonus label when active */}
        {currentStreak >= 10 && (
          <div style={{
            fontSize: 9, fontWeight: 800, color: "#fb923c",
            textAlign: "center", opacity: 0.7,
          }}>
            🔥 استریک {toPersian(currentStreak)}+ · درآمد کار +{toPersian(currentStreak >= 30 ? 10 : currentStreak >= 14 ? 7 : 5)}٪
          </div>
        )}
      </div>
    </div>
  );
}
