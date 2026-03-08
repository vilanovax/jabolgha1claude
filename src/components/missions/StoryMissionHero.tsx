"use client";
import { formatMoney, toPersian } from "@/data/mock";
import { getMissionProgressPercent, getMissionRemainingTextFa } from "@/game/missions/progress";
import { STORY_ARCS } from "@/game/missions/story-arcs";
import type { Mission } from "@/game/missions/types";

function RewardChip({ icon, label, color, bg, border }: {
  icon: string; label: string; color: string; bg: string; border: string;
}) {
  return (
    <span style={{
      fontSize: 10, fontWeight: 700, padding: "3px 8px",
      borderRadius: 10, background: bg, color, border: `1px solid ${border}`,
      display: "inline-flex", alignItems: "center", gap: 3,
    }}>
      {icon} {label}
    </span>
  );
}

export default function StoryMissionHero({ mission, arcId, episodeIndex, onClaim }: {
  mission: Mission;
  arcId: string | null;
  episodeIndex: number;
  onClaim: () => void;
}) {
  const arc = arcId ? STORY_ARCS.find((a) => a.id === arcId) : null;
  const totalEpisodes = arc?.episodes.length ?? 5;
  const progressPct = getMissionProgressPercent(mission);
  const remainingText = getMissionRemainingTextFa(mission);
  const isClaimable = mission.status === "completed";
  const { rewards } = mission;

  return (
    <div className={isClaimable ? "anim-claim-pulse" : ""} style={{
      borderRadius: 22,
      padding: "20px 18px",
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
      <div style={{
        position: "absolute", top: -40, left: -40, width: 140, height: 140,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(250,204,21,0.06) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      {isClaimable && [0, 1, 2, 3].map((i) => (
        <div key={i} style={{
          position: "absolute",
          top: `${15 + i * 20}%`, right: `${10 + i * 22}%`,
          width: 4, height: 4, borderRadius: "50%", background: "#facc15",
          animation: `sparkle ${1.5 + i * 0.3}s ease-in-out ${i * 0.4}s infinite`,
          pointerEvents: "none",
        }} />
      ))}

      {/* Category label */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        marginBottom: 14,
      }}>
        <span style={{
          fontSize: 9, fontWeight: 800, padding: "3px 10px", borderRadius: 12,
          background: "linear-gradient(135deg, rgba(168,85,247,0.2), rgba(168,85,247,0.08))",
          color: "#c084fc", border: "1px solid rgba(168,85,247,0.25)",
          display: "flex", alignItems: "center", gap: 4,
        }}>
          <span style={{ fontSize: 12 }}>🎬</span>
          داستان فعال
        </span>
        <span style={{ fontSize: 9, color: "rgba(255,255,255,0.25)", fontWeight: 700 }}>
          اپیزود {toPersian(episodeIndex + 1)} از {toPersian(totalEpisodes)}
        </span>
      </div>

      {/* Character + dialogue */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 14 }}>
        <div className="anim-breathe" style={{
          width: 56, height: 56, borderRadius: "50%", flexShrink: 0,
          background: "rgba(255,255,255,0.06)",
          border: "2.5px solid rgba(250,204,21,0.25)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 30,
          boxShadow: "0 0 20px rgba(250,204,21,0.12)",
        }}>
          {mission.character ?? "🧑"}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#facc15", marginBottom: 4 }}>
            {mission.characterName ?? "راهنما"}
          </div>
          <div style={{
            fontSize: 14, fontWeight: 800, color: "rgba(255,255,255,0.85)",
            lineHeight: 1.5, padding: "8px 12px",
            background: "rgba(255,255,255,0.04)",
            borderRadius: "4px 16px 16px 16px",
            border: "1px solid rgba(255,255,255,0.06)",
          }}>
            «{mission.titleFa}»
          </div>
        </div>
      </div>

      {mission.dialogue && (
        <div style={{
          fontSize: 12, color: "rgba(255,255,255,0.5)",
          marginBottom: 14, lineHeight: 1.6,
        }}>
          {mission.dialogue}
        </div>
      )}

      {/* Episode nodes */}
      <div style={{
        display: "flex", alignItems: "center", gap: 4,
        marginBottom: 14, padding: "0 4px",
      }}>
        {Array.from({ length: totalEpisodes }).map((_, i) => {
          const done = i < episodeIndex;
          const current = i === episodeIndex;
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", flex: 1 }}>
              <div className={current ? "anim-mission-glow" : ""} style={{
                width: 22, height: 22, borderRadius: "50%", flexShrink: 0,
                background: done
                  ? "linear-gradient(135deg, #facc15, #f59e0b)"
                  : current
                    ? "linear-gradient(135deg, rgba(250,204,21,0.3), rgba(245,158,11,0.2))"
                    : "rgba(255,255,255,0.04)",
                border: current
                  ? "2px solid rgba(250,204,21,0.5)"
                  : done ? "1.5px solid rgba(250,204,21,0.3)"
                  : "1px solid rgba(255,255,255,0.06)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: done ? 9 : 8, fontWeight: 800,
                color: done ? "#000" : current ? "#facc15" : "rgba(255,255,255,0.15)",
                boxShadow: done ? "0 0 6px rgba(250,204,21,0.3)"
                  : current ? "0 0 10px rgba(250,204,21,0.2)" : "none",
              }}>
                {done ? "✓" : i > episodeIndex ? "🔒" : toPersian(i + 1)}
              </div>
              {i < totalEpisodes - 1 && (
                <div style={{
                  flex: 1, height: 2, marginRight: 2, marginLeft: 2,
                  background: done
                    ? "linear-gradient(90deg, #facc15, #f59e0b)"
                    : "rgba(255,255,255,0.05)",
                  borderRadius: 1,
                }} />
              )}
            </div>
          );
        })}
      </div>

      {/* Progress bar */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.4)" }}>
            پیشرفت اپیزود
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {remainingText && (
              <span style={{ fontSize: 9, color: "rgba(255,255,255,0.3)" }}>{remainingText}</span>
            )}
            <span style={{
              fontSize: 9, fontWeight: 800, color: "#000",
              background: "linear-gradient(135deg, #facc15, #f59e0b)",
              borderRadius: 6, padding: "1px 6px",
            }}>
              {toPersian(progressPct)}٪
            </span>
          </div>
        </div>
        <div style={{ height: 10, borderRadius: 6, background: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
          <div className="progress-bar-animated" style={{
            width: `${progressPct}%`, height: "100%", borderRadius: 6,
            background: isClaimable
              ? "linear-gradient(90deg, #facc15, #fbbf24)"
              : "linear-gradient(90deg, #facc15, #f59e0b)",
            boxShadow: "0 0 12px rgba(250,204,21,0.4)",
            transition: "width 0.8s ease",
          }} />
        </div>
      </div>

      {/* Reward chips */}
      <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
        {(rewards.xp ?? 0) > 0 && (
          <RewardChip icon="✨" label={`+${toPersian(rewards.xp!)} XP`}
            color="#c084fc" bg="rgba(168,85,247,0.12)" border="rgba(168,85,247,0.2)" />
        )}
        {(rewards.stars ?? 0) > 0 && (
          <RewardChip icon="⭐" label={`+${toPersian(rewards.stars!)}`}
            color="#facc15" bg="rgba(250,204,21,0.12)" border="rgba(250,204,21,0.2)" />
        )}
        {(rewards.money ?? 0) > 0 && (
          <RewardChip icon="💰" label={`+${formatMoney(rewards.money!)}`}
            color="#4ade80" bg="rgba(74,222,128,0.12)" border="rgba(74,222,128,0.2)" />
        )}
      </div>

      <button
        className={isClaimable ? "btn-bounce anim-claim-pulse" : "btn-bounce"}
        onClick={onClaim}
        style={{
          width: "100%", padding: "14px 0", borderRadius: 16,
          border: isClaimable
            ? "1.5px solid rgba(250,204,21,0.4)"
            : "1px solid rgba(250,204,21,0.2)",
          background: isClaimable
            ? "linear-gradient(135deg, rgba(250,204,21,0.25), rgba(245,158,11,0.2))"
            : "rgba(250,204,21,0.08)",
          color: "#facc15", fontSize: 14, fontWeight: 800,
          fontFamily: "inherit", cursor: "pointer",
          transition: "all 0.2s ease",
          boxShadow: isClaimable ? "0 0 20px rgba(250,204,21,0.15)" : "none",
        }}
      >
        {isClaimable ? "🎉 دریافت پاداش ⭐" : "ادامه بده →"}
      </button>
    </div>
  );
}
