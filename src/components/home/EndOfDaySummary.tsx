"use client";
import { useGameStore } from "@/stores/gameStore";
import { toPersian, formatMoney } from "@/data/mock";
import { getStreakReward } from "@/data/streakRewards";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

// ─── Motivational message based on day performance ────────────────────────────
function getDayMessage(actionsCount: number, mealsEaten: number): { text: string; emoji: string } {
  if (actionsCount === 0) return { text: "امروز استراحت کردی، فردا بیشتر تلاش کن!", emoji: "😴" };
  if (mealsEaten === 0)   return { text: "فراموش نکن که باید بخوری!", emoji: "⚠️" };
  if (actionsCount >= 4 && mealsEaten === 3) return { text: "امروز عالی بودی! همینطور ادامه بده!", emoji: "🔥" };
  if (actionsCount >= 3)  return { text: "روز خوبی داشتی، آفرین!", emoji: "💪" };
  if (actionsCount >= 2)  return { text: "بدک نبود، فردا بیشتر!", emoji: "👍" };
  return { text: "یه قدم جلوتر رفتی، خوبه!", emoji: "✨" };
}

// ─── Recovery preview based on energy level ──────────────────────────────────
function getRecovery(energy: number): { text: string; amount: number } {
  // base 30% overnight recovery, capped at 100
  const amount = Math.min(100 - energy, Math.round(100 * 0.3));
  if (energy < 20) return { text: "خواب عمیق — انرژی زیادی برمی‌گرده", amount };
  if (energy < 50) return { text: "خواب خوب — انرژی بازیابی می‌شه", amount };
  return { text: "خواب راحت — کمی شارژ می‌شی", amount };
}

export default function EndOfDaySummary({ isOpen, onClose }: Props) {
  const player      = useGameStore((s) => s.player);
  const bank        = useGameStore((s) => s.bank);
  const daySnapshot = useGameStore((s) => s.daySnapshot);
  const streak      = useGameStore((s) => s.streak);
  const todayCard   = useGameStore((s) => s.todayCard);
  const cardShielded = useGameStore((s) => s.cardShielded);
  const actionsCompletedToday = useGameStore((s) => s.actionsCompletedToday);

  if (!isOpen) return null;

  // ─── Derived values ──────────────────────────────────────────────────────
  const totalMoney   = bank.checking + bank.savings;
  const moneyDelta   = bank.checking - daySnapshot.checking;
  const xpDelta      = player.xp - daySnapshot.xp;
  const actionsCount = actionsCompletedToday.length;
  const meals        = player.mealsToday ?? { breakfast: false, lunch: false, dinner: false, snackCount: 0 };
  const mealsEaten   = [meals.breakfast, meals.lunch, meals.dinner].filter(Boolean).length;

  const message    = getDayMessage(actionsCount, mealsEaten);
  const recovery   = getRecovery(player.energy);
  const nextReward = getStreakReward(streak.currentStreak + 1);

  // Level progress
  const xpForNextLevel = player.level * 100;
  const xpProgress     = Math.min(100, Math.round((player.xp % xpForNextLevel) / xpForNextLevel * 100));

  // Money delta label
  const deltaPositive = moneyDelta >= 0;
  const deltaColor    = deltaPositive ? "#4ade80" : "#f87171";
  const deltaSign     = deltaPositive ? "+" : "";

  // ─── Meal dots ───────────────────────────────────────────────────────────
  const MEAL_DOTS = [
    { key: "breakfast" as const, emoji: "🌅", label: "صبحانه" },
    { key: "lunch"     as const, emoji: "☀️",  label: "ناهار"  },
    { key: "dinner"    as const, emoji: "🌙", label: "شام"    },
  ];

  // ─── Action category labels ──────────────────────────────────────────────
  const CAT_LABELS: Record<string, { emoji: string; labelFa: string }> = {
    work:     { emoji: "💼", labelFa: "کار" },
    exercise: { emoji: "💪", labelFa: "ورزش" },
    study:    { emoji: "📚", labelFa: "درس" },
    library:  { emoji: "🏛️", labelFa: "کتابخانه" },
    rest:     { emoji: "😴", labelFa: "استراحت" },
    invest:   { emoji: "📈", labelFa: "سرمایه" },
    food:     { emoji: "🍔", labelFa: "غذا" },
  };

  return (
    <div
      className="anim-backdrop-in"
      style={{
        position: "fixed", inset: 0,
        background: "rgba(0,0,0,0.72)",
        backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)",
        zIndex: 250,
        display: "flex", alignItems: "flex-end", justifyContent: "center",
        padding: "0 0 env(safe-area-inset-bottom, 0)",
      }}
    >
      <div
        className="anim-summary-card"
        style={{
          width: "100%", maxWidth: 430,
          maxHeight: "92dvh", overflowY: "auto",
          borderRadius: "28px 28px 0 0",
          background: "linear-gradient(180deg, #12142e 0%, #0a0e27 100%)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderBottom: "none",
          boxShadow: "0 -20px 60px rgba(0,0,0,0.6)",
          padding: "6px 0 28px",
        }}
      >
        {/* Drag handle */}
        <div style={{ display: "flex", justifyContent: "center", padding: "10px 0 4px" }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.15)" }} />
        </div>

        {/* ── Header ── */}
        <div style={{ textAlign: "center", padding: "12px 20px 16px" }}>
          <div className="anim-reward-pop" style={{ fontSize: 44, marginBottom: 6 }}>🌙</div>
          <div style={{ fontSize: 18, fontWeight: 900, color: "white", marginBottom: 4 }}>
            پایان روز {toPersian(player.dayInGame)}
          </div>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 5,
            background: "rgba(255,255,255,0.05)", borderRadius: 20,
            padding: "4px 12px",
            fontSize: 11, color: "rgba(255,255,255,0.6)",
          }}>
            <span>{message.emoji}</span>
            <span>{message.text}</span>
          </div>
        </div>

        <div style={{ padding: "0 16px", display: "flex", flexDirection: "column", gap: 10 }}>

          {/* ── Money card ── */}
          <div style={{
            borderRadius: 18, padding: "14px 16px",
            background: "rgba(74,222,128,0.06)",
            border: "1px solid rgba(74,222,128,0.12)",
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 18 }}>💰</span>
                <div>
                  <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", marginBottom: 2 }}>موجودی کل</div>
                  <div style={{ fontSize: 18, fontWeight: 900, color: "#4ade80" }}>
                    {formatMoney(totalMoney)}
                  </div>
                </div>
              </div>
              <div style={{ textAlign: "left" }}>
                <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", marginBottom: 2 }}>امروز</div>
                <div style={{ fontSize: 14, fontWeight: 800, color: deltaColor }}>
                  {deltaSign}{formatMoney(Math.abs(moneyDelta))}
                </div>
              </div>
            </div>
          </div>

          {/* ── XP + Streak row ── */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {/* XP */}
            <div style={{
              borderRadius: 18, padding: "12px 14px",
              background: "rgba(192,132,252,0.06)",
              border: "1px solid rgba(192,132,252,0.12)",
            }}>
              <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", marginBottom: 4 }}>⭐ تجربه</div>
              <div style={{ fontSize: 16, fontWeight: 900, color: "#c084fc" }}>{toPersian(player.xp)}</div>
              {xpDelta > 0 && (
                <div style={{ fontSize: 10, fontWeight: 700, color: "#a855f7", marginTop: 2 }}>
                  +{toPersian(xpDelta)} امروز
                </div>
              )}
              {/* Level progress bar */}
              <div style={{
                marginTop: 8, height: 4, borderRadius: 2,
                background: "rgba(255,255,255,0.08)", overflow: "hidden",
              }}>
                <div style={{
                  height: "100%", borderRadius: 2,
                  width: `${xpProgress}%`,
                  background: "#a855f7",
                  transition: "width 0.8s ease",
                }} />
              </div>
              <div style={{ fontSize: 8, color: "rgba(255,255,255,0.3)", marginTop: 3 }}>
                سطح {toPersian(player.level)} — {toPersian(xpProgress)}٪
              </div>
            </div>

            {/* Streak */}
            <div style={{
              borderRadius: 18, padding: "12px 14px",
              background: streak.currentStreak > 0 ? "rgba(251,146,60,0.07)" : "rgba(255,255,255,0.03)",
              border: `1px solid ${streak.currentStreak > 0 ? "rgba(251,146,60,0.15)" : "rgba(255,255,255,0.06)"}`,
            }}>
              <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", marginBottom: 4 }}>🔥 استریک</div>
              <div style={{ fontSize: 16, fontWeight: 900, color: "#fb923c" }}>
                {toPersian(streak.currentStreak)} روز
              </div>
              {streak.claimed ? (
                <div style={{ fontSize: 10, fontWeight: 700, color: "#4ade80", marginTop: 2 }}>✓ دریافت شد</div>
              ) : (
                <div style={{ fontSize: 10, fontWeight: 700, color: "#fbbf24", marginTop: 2 }}>⏳ دریافت نشد</div>
              )}
              <div style={{
                marginTop: 6, padding: "3px 7px", borderRadius: 8, display: "inline-flex",
                alignItems: "center", gap: 4,
                background: "rgba(255,255,255,0.05)",
                fontSize: 9, color: "rgba(255,255,255,0.5)",
              }}>
                <span>فردا:</span>
                <span>{nextReward.emoji}</span>
                <span>{nextReward.labelFa}</span>
              </div>
              {streak.shieldAvailable && (
                <div style={{ fontSize: 8, color: "rgba(99,102,241,0.8)", marginTop: 4 }}>🛡 سپر فعال</div>
              )}
            </div>
          </div>

          {/* ── Meals ── */}
          <div style={{
            borderRadius: 18, padding: "12px 16px",
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.06)",
            display: "flex", alignItems: "center", gap: 8,
          }}>
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", flexShrink: 0 }}>🍽️ وعده‌ها</span>
            <div style={{ display: "flex", gap: 6, flex: 1 }}>
              {MEAL_DOTS.map(({ key, emoji }) => {
                const done = meals[key];
                return (
                  <div key={key} style={{
                    display: "flex", alignItems: "center", gap: 3,
                    padding: "3px 8px", borderRadius: 10,
                    background: done ? "rgba(74,222,128,0.1)" : "rgba(255,255,255,0.03)",
                    border: `1px solid ${done ? "rgba(74,222,128,0.2)" : "rgba(255,255,255,0.06)"}`,
                  }}>
                    <span style={{ fontSize: 9 }}>{emoji}</span>
                    <span style={{ fontSize: 9, fontWeight: 800, color: done ? "#4ade80" : "rgba(255,255,255,0.2)" }}>
                      {done ? "✓" : "·"}
                    </span>
                  </div>
                );
              })}
              {meals.snackCount > 0 && (
                <div style={{
                  padding: "3px 8px", borderRadius: 10,
                  background: "rgba(251,146,60,0.08)",
                  border: "1px solid rgba(251,146,60,0.15)",
                  fontSize: 9, fontWeight: 800, color: "#fb923c",
                }}>
                  +{toPersian(meals.snackCount)} 🍿
                </div>
              )}
            </div>
            {mealsEaten === 0 && (
              <span style={{ fontSize: 9, fontWeight: 800, color: "#f87171" }}>⚠️ نخوردی!</span>
            )}
            {mealsEaten === 3 && (
              <span style={{ fontSize: 9, fontWeight: 800, color: "#4ade80" }}>✅ کامل</span>
            )}
          </div>

          {/* ── Actions done today ── */}
          {actionsCount > 0 && (
            <div style={{
              borderRadius: 18, padding: "12px 16px",
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}>
              <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", marginBottom: 8 }}>
                📋 اکشن‌های امروز — {toPersian(actionsCount)} عدد
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {actionsCompletedToday.map((catId) => {
                  const cat = CAT_LABELS[catId] ?? { emoji: "•", labelFa: catId };
                  return (
                    <div key={catId} style={{
                      display: "flex", alignItems: "center", gap: 4,
                      padding: "3px 10px", borderRadius: 10,
                      background: "rgba(99,102,241,0.1)",
                      border: "1px solid rgba(99,102,241,0.18)",
                      fontSize: 10, fontWeight: 700, color: "#818cf8",
                    }}>
                      <span>{cat.emoji}</span>
                      <span>{cat.labelFa}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── Today's card ── */}
          {todayCard && (
            <div style={{
              borderRadius: 18, padding: "12px 16px",
              background: cardShielded ? "rgba(52,211,153,0.06)" : "rgba(255,255,255,0.03)",
              border: `1px solid ${cardShielded ? "rgba(52,211,153,0.15)" : "rgba(255,255,255,0.06)"}`,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 20 }}>{todayCard.emoji}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: "rgba(255,255,255,0.7)" }}>
                    {todayCard.name}
                  </div>
                  <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>
                    {todayCard.description}
                  </div>
                </div>
                {cardShielded && (
                  <div style={{
                    padding: "3px 8px", borderRadius: 8,
                    background: "rgba(52,211,153,0.1)",
                    border: "1px solid rgba(52,211,153,0.2)",
                    fontSize: 9, fontWeight: 800, color: "#34d399",
                  }}>
                    🛡 سپر
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── Recovery preview ── */}
          <div style={{
            borderRadius: 14, padding: "10px 14px",
            background: "rgba(129,140,248,0.05)",
            border: "1px solid rgba(129,140,248,0.1)",
            display: "flex", alignItems: "center", gap: 8,
          }}>
            <span style={{ fontSize: 16 }}>💤</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.55)" }}>
                {recovery.text}
              </div>
              <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)" }}>
                انرژی: {toPersian(player.energy)} → {toPersian(Math.min(100, player.energy + recovery.amount))}٪
              </div>
            </div>
            <div style={{
              padding: "3px 9px", borderRadius: 8,
              background: "rgba(250,204,21,0.1)",
              border: "1px solid rgba(250,204,21,0.15)",
              fontSize: 10, fontWeight: 800, color: "#facc15",
            }}>
              +{toPersian(recovery.amount)}⚡
            </div>
          </div>

          {/* ── Continue button ── */}
          <button
            onClick={onClose}
            style={{
              marginTop: 4,
              width: "100%", padding: "15px 0",
              borderRadius: 18,
              border: "1.5px solid rgba(99,102,241,0.3)",
              background: "linear-gradient(135deg, rgba(99,102,241,0.22), rgba(139,92,246,0.16))",
              color: "white", fontSize: 15, fontWeight: 900,
              fontFamily: "inherit", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            }}
          >
            شروع روز {toPersian(player.dayInGame + 1)} ←
          </button>
        </div>
      </div>
    </div>
  );
}
