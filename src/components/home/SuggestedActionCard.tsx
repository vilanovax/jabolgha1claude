"use client";
import Link from "next/link";
import { player, homeActivities, activeCourse } from "@/data/mock";

type Activity = (typeof homeActivities)[0];

/** Pick the best suggestion based on player state */
function getSuggestion(done: string[]): Activity {
  // 1. Hungry → eat
  if (player.hunger < 30) {
    return homeActivities.find((a) => a.id === "eat")!;
  }
  // 2. Low energy → sleep
  if (player.energy < 30) {
    return homeActivities.find((a) => a.id === "sleep")!;
  }
  // 3. Active course with sessions left → study
  if (activeCourse.completedToday < activeCourse.sessionsPerDay && !done.includes("study")) {
    return homeActivities.find((a) => a.id === "study")!;
  }
  // 4. Work not done today → work
  if (!done.includes("work")) {
    return homeActivities.find((a) => a.id === "work")!;
  }
  // 5. Fallback → invest
  return homeActivities.find((a) => a.id === "invest")!;
}

export default function SuggestedActionCard({
  done,
  onDone,
}: {
  done: string[];
  onDone: (id: string) => void;
}) {
  const suggestion = getSuggestion(done);
  const isDone = done.includes(suggestion.id);

  // Pick up to 3 chips: first cost (time), first energy cost, first reward
  const timeCost = suggestion.costs.find((c) => c.icon === "⏱️");
  const energyCost = suggestion.costs.find((c) => c.icon === "⚡");
  const mainReward = suggestion.rewards[0];

  return (
    <div style={{
      borderRadius: 20,
      padding: "16px",
      marginBottom: 10,
      background: "white",
      border: "1.5px solid rgba(34,197,94,0.2)",
      boxShadow: "0 4px 20px rgba(34,197,94,0.08), 0 1px 3px rgba(0,0,0,0.04)",
    }}>
      {/* Header */}
      <div style={{
        fontSize: 11, fontWeight: 700, color: "#64748b",
        marginBottom: 8,
      }}>
        🎯 پیشنهاد الان
      </div>

      {/* Action title */}
      <div style={{
        fontSize: 16, fontWeight: 800, color: "#0f172a",
        marginBottom: 10,
        display: "flex", alignItems: "center", gap: 8,
      }}>
        <span style={{ fontSize: 22 }}>{suggestion.emoji}</span>
        {suggestion.label}
      </div>

      {/* Sublabel */}
      <div style={{ fontSize: 12, color: "#64748b", marginBottom: 12 }}>
        {suggestion.sublabel}
      </div>

      {/* Chips row */}
      <div style={{ display: "flex", gap: 6, marginBottom: 14, flexWrap: "wrap" }}>
        {timeCost && (
          <span style={{
            fontSize: 11, fontWeight: 700, padding: "4px 10px",
            borderRadius: 20, background: "#fefce8", color: "#a16207",
            border: "1px solid #fde68a",
          }}>
            {timeCost.icon} {timeCost.label}
          </span>
        )}
        {energyCost && (
          <span style={{
            fontSize: 11, fontWeight: 700, padding: "4px 10px",
            borderRadius: 20, background: "#fff1f2", color: "#dc2626",
            border: "1px solid #fecdd3",
          }}>
            {energyCost.icon} {energyCost.label}
          </span>
        )}
        {mainReward && (
          <span style={{
            fontSize: 11, fontWeight: 700, padding: "4px 10px",
            borderRadius: 20, background: "#f0fdf4", color: "#16a34a",
            border: "1px solid #bbf7d0",
          }}>
            {mainReward.icon} {mainReward.label}
          </span>
        )}
      </div>

      {/* CTA Button */}
      {isDone ? (
        <button className="game-btn game-btn-done" style={{
          width: "100%", justifyContent: "center", padding: "11px 0",
        }}>
          ✓ انجام شد
        </button>
      ) : (
        <Link href={suggestion.href} style={{ textDecoration: "none" }} onClick={() => onDone(suggestion.id)}>
          <button className="game-btn" style={{
            width: "100%", justifyContent: "center", padding: "11px 0",
          }}>
            انجام بده
          </button>
        </Link>
      )}
    </div>
  );
}
