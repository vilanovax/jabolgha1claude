"use client";
import { formatMoney, toPersian } from "@/data/mock";
import { getMissionProgressPercent, getMissionRemainingTextFa, getObjectiveTarget } from "@/game/missions/progress";
import { getCategoryDisplay } from "@/game/missions/helpers";
import type { Mission, MissionRewards } from "@/game/missions/types";

export default function MissionCard({ mission, recommended, onClaim }: {
  mission: Mission;
  recommended?: boolean;
  onClaim?: () => void;
}) {
  const cat = getCategoryDisplay(mission.category);
  const progressPct = getMissionProgressPercent(mission);
  const remainingText = getMissionRemainingTextFa(mission);
  const isCompleted = mission.status === "completed";
  const isClaimed = mission.status === "claimed";
  const isNear = progressPct >= 75 && !isCompleted && !isClaimed;
  const hasProgress = mission.objectives.some((obj) => getObjectiveTarget(obj) > 1);

  return (
    <div style={{
      padding: "12px 14px",
      background: isCompleted ? cat.bgColor : recommended ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.03)",
      borderRadius: 16,
      border: isCompleted
        ? `1.5px solid ${cat.color}50`
        : recommended ? `1px solid ${cat.borderColor}` : "1px solid rgba(255,255,255,0.06)",
      opacity: isClaimed ? 0.5 : 1,
      position: "relative",
      overflow: "hidden",
      transition: "all 0.2s ease",
    }}>
      {recommended && !isCompleted && !isClaimed && (
        <div style={{
          position: "absolute", top: 0, right: 0,
          fontSize: 7, fontWeight: 800, padding: "2px 8px",
          borderRadius: "0 16px 0 8px",
          background: cat.bgColor, color: cat.color,
          border: `1px solid ${cat.borderColor}`,
        }}>
          پیشنهادی ✦
        </div>
      )}
      {isNear && (
        <div style={{
          position: "absolute", top: 0, left: 0,
          fontSize: 7, fontWeight: 800, padding: "2px 8px",
          borderRadius: "0 0 8px 0",
          background: "rgba(251,146,60,0.15)", color: "#fb923c",
        }}>
          نزدیکه! 🔥
        </div>
      )}

      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div className={isCompleted ? "anim-mission-glow" : isNear ? "icon-idle-float" : ""} style={{
          width: 42, height: 42, borderRadius: 14, flexShrink: 0,
          background: isCompleted ? cat.bgColor : "rgba(255,255,255,0.05)",
          border: isCompleted ? `1px solid ${cat.borderColor}` : "none",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 22,
        }}>
          {isClaimed ? "✅" : isCompleted ? "🎁" : mission.emoji}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: 13, fontWeight: 700, color: "white", marginBottom: 4,
            textDecoration: isClaimed ? "line-through" : "none",
            textDecorationColor: "rgba(255,255,255,0.2)",
          }}>
            {mission.titleFa}
          </div>
          <div style={{ display: "flex", gap: 5, flexWrap: "wrap", alignItems: "center" }}>
            <span style={{
              fontSize: 8, fontWeight: 800, padding: "1px 6px", borderRadius: 6,
              background: cat.bgColor, color: cat.color,
              border: `1px solid ${cat.borderColor}`,
            }}>
              {cat.labelFa}
            </span>
            <RewardChips rewards={mission.rewards} />
          </div>

          {hasProgress && !isClaimed && (
            <div style={{ marginTop: 6 }}>
              {remainingText && (
                <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", marginBottom: 3 }}>
                  {remainingText}
                </div>
              )}
              <div style={{
                height: 4, borderRadius: 3,
                background: "rgba(255,255,255,0.08)", overflow: "hidden",
              }}>
                <div className={isNear ? "progress-bar-animated" : ""} style={{
                  width: `${progressPct}%`, height: "100%", borderRadius: 3,
                  background: cat.progressGradient,
                  boxShadow: `0 0 6px ${cat.color}40`,
                  transition: "width 0.6s ease",
                }} />
              </div>
            </div>
          )}
        </div>

        <StatusButton status={mission.status} cat={cat} onClaim={onClaim} />
      </div>
    </div>
  );
}

function RewardChips({ rewards }: { rewards: MissionRewards }) {
  return (
    <>
      {(rewards.xp ?? 0) > 0 && (
        <span style={{ fontSize: 9, color: "#c084fc", fontWeight: 600 }}>+{toPersian(rewards.xp!)} XP</span>
      )}
      {(rewards.stars ?? 0) > 0 && (
        <span style={{ fontSize: 9, color: "#facc15", fontWeight: 600 }}>+{toPersian(rewards.stars!)} ⭐</span>
      )}
      {(rewards.money ?? 0) > 0 && (
        <span style={{ fontSize: 9, color: "#4ade80", fontWeight: 600 }}>+{formatMoney(rewards.money!)}</span>
      )}
    </>
  );
}

function StatusButton({ status, cat, onClaim }: {
  status: string;
  cat: ReturnType<typeof getCategoryDisplay>;
  onClaim?: () => void;
}) {
  if (status === "claimed") {
    return (
      <div style={{
        fontSize: 11, fontWeight: 700, color: "#4ade80",
        padding: "6px 10px", borderRadius: 12,
        background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.2)",
      }}>✓</div>
    );
  }
  if (status === "completed") {
    return (
      <button className="btn-bounce anim-claim-pulse" onClick={onClaim} style={{
        fontSize: 10, fontWeight: 700, color: cat.color,
        padding: "6px 12px", borderRadius: 12,
        background: cat.bgColor, border: `1px solid ${cat.color}50`,
        fontFamily: "inherit", cursor: "pointer",
        boxShadow: `0 0 10px ${cat.color}20`, whiteSpace: "nowrap",
      }}>
        جایزه ⭐
      </button>
    );
  }
  return (
    <button className="btn-bounce" style={{
      fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.5)",
      padding: "6px 12px", borderRadius: 12,
      background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
      fontFamily: "inherit", cursor: "pointer", whiteSpace: "nowrap",
    }}>
      برو
    </button>
  );
}
