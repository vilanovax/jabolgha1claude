"use client";
import { formatMoney, toPersian } from "@/data/mock";
import type { MissionStatus, MissionReward } from "@/data/mock";

interface DailyMission {
  id: string;
  title: string;
  emoji: string;
  duration: string;
  reward: MissionReward;
  status: MissionStatus;
}

export default function DailyMissionCard({ mission, recommended, onClaim }: {
  mission: DailyMission;
  recommended?: boolean;
  onClaim?: (reward: MissionReward) => void;
}) {
  const isDone = mission.status === "done" || mission.status === "claimable";
  const isClaimable = mission.status === "claimable";

  return (
    <div style={{
      padding: "12px 14px",
      background: recommended
        ? "rgba(74,222,128,0.04)"
        : "rgba(255,255,255,0.03)",
      borderRadius: 16,
      border: isClaimable
        ? "1.5px solid rgba(250,204,21,0.25)"
        : recommended
          ? "1px solid rgba(74,222,128,0.15)"
          : "1px solid rgba(255,255,255,0.06)",
      display: "flex",
      alignItems: "center",
      gap: 12,
      opacity: isDone && !isClaimable ? 0.55 : 1,
      position: "relative",
      overflow: "hidden",
      transition: "all 0.3s ease",
    }}>
      {/* Recommended badge */}
      {recommended && (
        <div style={{
          position: "absolute", top: 0, right: 0,
          fontSize: 7, fontWeight: 800,
          padding: "2px 8px",
          borderRadius: "0 16px 0 8px",
          background: "linear-gradient(135deg, rgba(74,222,128,0.2), rgba(74,222,128,0.1))",
          color: "#4ade80",
          border: "1px solid rgba(74,222,128,0.2)",
        }}>
          پیشنهادی ✦
        </div>
      )}

      {/* Emoji icon */}
      <div className={isClaimable ? "anim-mission-glow" : recommended ? "icon-idle-float" : ""} style={{
        width: 42, height: 42, borderRadius: 14, flexShrink: 0,
        background: isClaimable
          ? "rgba(250,204,21,0.08)"
          : "rgba(255,255,255,0.05)",
        border: isClaimable
          ? "1px solid rgba(250,204,21,0.15)"
          : "none",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 22,
      }}>
        {isDone && !isClaimable ? "✅" : mission.emoji}
      </div>

      {/* Title + reward chips */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 13, fontWeight: 700, color: "white",
          marginBottom: 4,
          textDecoration: isDone && !isClaimable ? "line-through" : "none",
          textDecorationColor: "rgba(255,255,255,0.2)",
        }}>
          {mission.title}
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
          {/* Category label */}
          <span style={{
            fontSize: 8, fontWeight: 800,
            padding: "1px 6px", borderRadius: 6,
            background: "rgba(74,222,128,0.1)",
            color: "#4ade80",
            border: "1px solid rgba(74,222,128,0.15)",
          }}>
            روزانه
          </span>
          {mission.duration && (
            <span style={{ fontSize: 9, color: "rgba(255,255,255,0.35)" }}>
              ⏱ {mission.duration}
            </span>
          )}
          {mission.reward.xp > 0 && (
            <span style={{ fontSize: 9, color: "#c084fc", fontWeight: 600 }}>
              +{toPersian(mission.reward.xp)} XP
            </span>
          )}
          {mission.reward.stars > 0 && (
            <span style={{ fontSize: 9, color: "#facc15", fontWeight: 600 }}>
              +{toPersian(mission.reward.stars)} ⭐
            </span>
          )}
          {mission.reward.money > 0 && (
            <span style={{ fontSize: 9, color: "#4ade80", fontWeight: 600 }}>
              +{formatMoney(mission.reward.money)}
            </span>
          )}
        </div>
      </div>

      {/* Status button */}
      <StatusButton
        status={mission.status}
        onClaim={() => onClaim?.(mission.reward)}
      />
    </div>
  );
}

function StatusButton({ status, onClaim }: { status: MissionStatus; onClaim: () => void }) {
  if (status === "done") {
    return (
      <div style={{
        fontSize: 11, fontWeight: 700, color: "#4ade80",
        padding: "6px 12px", borderRadius: 12,
        background: "rgba(74,222,128,0.1)",
        border: "1px solid rgba(74,222,128,0.2)",
      }}>
        ✓
      </div>
    );
  }
  if (status === "claimable") {
    return (
      <button
        className="btn-bounce anim-claim-pulse"
        onClick={onClaim}
        style={{
          fontSize: 11, fontWeight: 700, color: "#facc15",
          padding: "6px 14px", borderRadius: 12,
          background: "linear-gradient(135deg, rgba(250,204,21,0.15), rgba(245,158,11,0.1))",
          border: "1px solid rgba(250,204,21,0.3)",
          fontFamily: "inherit", cursor: "pointer",
          boxShadow: "0 0 12px rgba(250,204,21,0.15)",
        }}
      >
        جایزه ⭐
      </button>
    );
  }
  return (
    <button className="btn-bounce" style={{
      fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.6)",
      padding: "6px 14px", borderRadius: 12,
      background: "rgba(255,255,255,0.06)",
      border: "1px solid rgba(255,255,255,0.1)",
      fontFamily: "inherit", cursor: "pointer",
    }}>
      برو
    </button>
  );
}
