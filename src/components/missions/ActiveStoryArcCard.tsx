"use client";
import { storyArc, formatMoney, toPersian } from "@/data/mock";

function RewardChip({ icon, label, color, bg, border }: {
  icon: string; label: string; color: string; bg: string; border: string;
}) {
  return (
    <span className="anim-reward-pop" style={{
      fontSize: 10, fontWeight: 700, padding: "3px 8px",
      borderRadius: 10, background: bg, color, border: `1px solid ${border}`,
      display: "inline-flex", alignItems: "center", gap: 3,
    }}>
      {icon} {label}
    </span>
  );
}

export default function ActiveStoryArcCard() {
  const arc = storyArc;
  const progressPct = Math.min(100, Math.round((arc.progress / arc.target) * 100));
  const isClaimable = arc.status === "claimable";
  const progressLabel = arc.unit === "تومان"
    ? `${formatMoney(arc.progress)} / ${formatMoney(arc.target)}`
    : `${toPersian(arc.progress)} / ${toPersian(arc.target)}`;

  return (
    <div className={isClaimable ? "anim-claim-pulse" : ""} style={{
      borderRadius: 22,
      padding: "20px 18px",
      marginBottom: 14,
      background: "linear-gradient(145deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
      border: isClaimable
        ? "1.5px solid rgba(250,204,21,0.4)"
        : "1px solid rgba(255,255,255,0.08)",
      boxShadow: isClaimable
        ? "0 0 24px rgba(250,204,21,0.15), 0 6px 24px rgba(10,22,40,0.4)"
        : "0 6px 24px rgba(10,22,40,0.4)",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Subtle glow background */}
      <div style={{
        position: "absolute", top: -40, left: -40, width: 120, height: 120,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(250,204,21,0.06) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* Sparkle particles for claimable */}
      {isClaimable && (
        <>
          {[0, 1, 2, 3].map((i) => (
            <div key={i} style={{
              position: "absolute",
              top: `${15 + i * 20}%`,
              right: `${10 + i * 22}%`,
              width: 4,
              height: 4,
              borderRadius: "50%",
              background: "#facc15",
              animation: `sparkle ${1.5 + i * 0.3}s ease-in-out ${i * 0.4}s infinite`,
              pointerEvents: "none",
            }} />
          ))}
        </>
      )}

      {/* Section label */}
      <div style={{
        fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.4)",
        marginBottom: 14, display: "flex", alignItems: "center", gap: 6,
      }}>
        <span style={{ fontSize: 14 }}>🎬</span>
        داستان فعال
        <span style={{
          fontSize: 9, color: "rgba(255,255,255,0.25)",
          marginRight: "auto",
        }}>
          اپیزود {toPersian(arc.episode)} از {toPersian(arc.totalEpisodes)}
        </span>
      </div>

      {/* Character + dialogue */}
      <div style={{
        display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 16,
      }}>
        {/* Character avatar */}
        <div className="anim-breathe" style={{
          width: 52, height: 52, borderRadius: "50%", flexShrink: 0,
          background: "rgba(255,255,255,0.06)",
          border: "2px solid rgba(250,204,21,0.2)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 28,
          boxShadow: "0 0 16px rgba(250,204,21,0.1)",
        }}>
          {arc.character}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Character name */}
          <div style={{
            fontSize: 11, fontWeight: 700, color: "#facc15", marginBottom: 4,
          }}>
            {arc.characterName}
          </div>
          {/* Dialogue bubble */}
          <div style={{
            fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,0.75)",
            lineHeight: 1.6,
            padding: "8px 12px",
            background: "rgba(255,255,255,0.04)",
            borderRadius: "4px 16px 16px 16px",
            border: "1px solid rgba(255,255,255,0.06)",
          }}>
            «{arc.title}»
          </div>
        </div>
      </div>

      {/* Dialogue text (the instruction) */}
      <div style={{
        fontSize: 12, color: "rgba(255,255,255,0.5)",
        marginBottom: 14, lineHeight: 1.5,
      }}>
        {arc.dialogue}
      </div>

      {/* Episode stages */}
      <div style={{
        display: "flex", alignItems: "center", gap: 4,
        marginBottom: 14, padding: "0 4px",
      }}>
        {Array.from({ length: arc.totalEpisodes }).map((_, i) => {
          const done = i + 1 < arc.episode;
          const current = i + 1 === arc.episode;
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", flex: 1 }}>
              <div style={{
                width: 20, height: 20, borderRadius: "50%", flexShrink: 0,
                background: done
                  ? "linear-gradient(135deg, #facc15, #f59e0b)"
                  : current
                    ? "linear-gradient(135deg, rgba(250,204,21,0.3), rgba(245,158,11,0.2))"
                    : "rgba(255,255,255,0.06)",
                border: current
                  ? "1.5px solid rgba(250,204,21,0.5)"
                  : done
                    ? "1.5px solid rgba(250,204,21,0.3)"
                    : "1px solid rgba(255,255,255,0.08)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: done ? 8 : 7,
                fontWeight: 800,
                color: done ? "#000" : current ? "#facc15" : "rgba(255,255,255,0.2)",
                boxShadow: done ? "0 0 6px rgba(250,204,21,0.3)" : "none",
              }}>
                {done ? "✓" : toPersian(i + 1)}
              </div>
              {i < arc.totalEpisodes - 1 && (
                <div style={{
                  flex: 1, height: 2, marginRight: 2, marginLeft: 2,
                  background: done
                    ? "linear-gradient(90deg, #facc15, #f59e0b)"
                    : "rgba(255,255,255,0.06)",
                  borderRadius: 1,
                }} />
              )}
            </div>
          );
        })}
      </div>

      {/* Progress bar */}
      <div style={{ marginBottom: 14 }}>
        <div style={{
          display: "flex", justifyContent: "space-between", marginBottom: 5,
        }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.4)" }}>
            پیشرفت
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: "#facc15" }}>
              {progressLabel}
            </span>
            <span style={{
              fontSize: 9, fontWeight: 800, color: "#000",
              background: "linear-gradient(135deg, #facc15, #f59e0b)",
              borderRadius: 6, padding: "1px 6px",
            }}>
              {toPersian(progressPct)}٪
            </span>
          </div>
        </div>
        <div style={{
          height: 8, borderRadius: 5,
          background: "rgba(255,255,255,0.08)",
          overflow: "hidden",
          position: "relative",
        }}>
          <div className="progress-bar-animated" style={{
            width: `${progressPct}%`,
            height: "100%",
            borderRadius: 5,
            background: isClaimable
              ? "linear-gradient(90deg, #facc15, #fbbf24)"
              : "linear-gradient(90deg, #facc15, #f59e0b)",
            boxShadow: "0 0 10px rgba(250,204,21,0.4)",
            transition: "width 0.8s ease",
            position: "relative",
            overflow: "hidden",
          }} />
        </div>
      </div>

      {/* Reward chips */}
      <div style={{
        display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap",
      }}>
        {arc.reward.xp > 0 && (
          <RewardChip icon="✨" label={`+${toPersian(arc.reward.xp)} XP`}
            color="#c084fc" bg="rgba(168,85,247,0.12)" border="rgba(168,85,247,0.2)" />
        )}
        {arc.reward.stars > 0 && (
          <RewardChip icon="⭐" label={`+${toPersian(arc.reward.stars)}`}
            color="#facc15" bg="rgba(250,204,21,0.12)" border="rgba(250,204,21,0.2)" />
        )}
        {arc.reward.money > 0 && (
          <RewardChip icon="💰" label={`+${formatMoney(arc.reward.money)}`}
            color="#4ade80" bg="rgba(74,222,128,0.12)" border="rgba(74,222,128,0.2)" />
        )}
      </div>

      {/* CTA Button */}
      <button className={isClaimable ? "btn-bounce anim-claim-pulse" : "btn-bounce"} style={{
        width: "100%",
        padding: "12px 0",
        borderRadius: 16,
        border: isClaimable
          ? "1.5px solid rgba(250,204,21,0.4)"
          : "1px solid rgba(250,204,21,0.2)",
        background: isClaimable
          ? "linear-gradient(135deg, rgba(250,204,21,0.25), rgba(245,158,11,0.2))"
          : "rgba(250,204,21,0.08)",
        color: "#facc15",
        fontSize: 14,
        fontWeight: 800,
        fontFamily: "inherit",
        cursor: "pointer",
        transition: "all 0.2s ease",
        boxShadow: isClaimable ? "0 0 20px rgba(250,204,21,0.15)" : "none",
      }}>
        {isClaimable ? "🎉 دریافت پاداش ⭐" : "ادامه بده"}
      </button>
    </div>
  );
}
