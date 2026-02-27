"use client";
import { formatMoney, toPersian } from "@/data/mock";
import type { MissionStatus } from "@/data/mock";

interface DailyMission {
  id: string;
  title: string;
  emoji: string;
  duration: string;
  reward: { xp: number; stars: number; money: number };
  status: MissionStatus;
}

function StatusButton({ status }: { status: MissionStatus }) {
  if (status === "done") {
    return (
      <div style={{
        fontSize: 11, fontWeight: 700, color: "#4ade80",
        padding: "6px 14px", borderRadius: 12,
        background: "rgba(74,222,128,0.1)",
        border: "1px solid rgba(74,222,128,0.2)",
      }}>
        انجام شد ✓
      </div>
    );
  }
  if (status === "claimable") {
    return (
      <button className="btn-bounce anim-claim-pulse" style={{
        fontSize: 11, fontWeight: 700, color: "#facc15",
        padding: "6px 14px", borderRadius: 12,
        background: "linear-gradient(135deg, rgba(250,204,21,0.15), rgba(245,158,11,0.1))",
        border: "1px solid rgba(250,204,21,0.3)",
        fontFamily: "inherit", cursor: "pointer",
        boxShadow: "0 0 12px rgba(250,204,21,0.15)",
      }}>
        دریافت پاداش ⭐
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
      انجام بده
    </button>
  );
}

export default function DailyMissionCard({ mission }: { mission: DailyMission }) {
  const isDone = mission.status === "done" || mission.status === "claimable";

  return (
    <div style={{
      padding: "12px 14px",
      background: "rgba(255,255,255,0.03)",
      borderRadius: 16,
      border: mission.status === "claimable"
        ? "1px solid rgba(250,204,21,0.2)"
        : "1px solid rgba(255,255,255,0.06)",
      display: "flex",
      alignItems: "center",
      gap: 12,
      opacity: isDone && mission.status !== "claimable" ? 0.6 : 1,
    }}>
      {/* Emoji */}
      <div style={{
        width: 40, height: 40, borderRadius: 12, flexShrink: 0,
        background: "rgba(255,255,255,0.05)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 20,
      }}>
        {mission.emoji}
      </div>

      {/* Title + rewards */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 13, fontWeight: 700, color: "white",
          marginBottom: 4,
          textDecoration: isDone && mission.status !== "claimable" ? "line-through" : "none",
          textDecorationColor: "rgba(255,255,255,0.2)",
        }}>
          {mission.title}
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
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
      <StatusButton status={mission.status} />
    </div>
  );
}
