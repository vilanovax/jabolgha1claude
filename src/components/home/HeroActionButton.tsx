"use client";
import Link from "next/link";
import { player, homeActivities, activeCourse, toPersian } from "@/data/mock";

type Activity = (typeof homeActivities)[0];

function getSuggestion(done: string[]): Activity {
  if (player.hunger < 30) return homeActivities.find((a) => a.id === "eat")!;
  if (player.energy < 30) return homeActivities.find((a) => a.id === "sleep")!;
  if (activeCourse.completedToday < activeCourse.sessionsPerDay && !done.includes("study"))
    return homeActivities.find((a) => a.id === "study")!;
  if (!done.includes("work")) return homeActivities.find((a) => a.id === "work")!;
  return homeActivities.find((a) => a.id === "invest")!;
}

export default function HeroActionButton({
  done,
  onDone,
}: {
  done: string[];
  onDone: (id: string) => void;
}) {
  const suggestion = getSuggestion(done);
  const isDone = done.includes(suggestion.id);
  const mainReward = suggestion.rewards[0];

  if (isDone) {
    return (
      <div style={{
        display: "flex", justifyContent: "center",
        padding: "8px 0 12px",
      }}>
        <div style={{
          padding: "12px 32px",
          borderRadius: 50,
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.06)",
          color: "rgba(255,255,255,0.3)",
          fontSize: 13,
          fontWeight: 700,
          textAlign: "center",
        }}>
          ✓ {suggestion.label} انجام شد
        </div>
      </div>
    );
  }

  return (
    <div style={{
      display: "flex", justifyContent: "center",
      padding: "8px 0 12px",
    }}>
      <Link
        href={suggestion.href}
        onClick={() => onDone(suggestion.id)}
        style={{ textDecoration: "none" }}
      >
        <button className="anim-hero-pulse" style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 4,
          padding: "16px 40px",
          borderRadius: 50,
          border: "1.5px solid rgba(99,102,241,0.3)",
          background: "linear-gradient(135deg, rgba(99,102,241,0.25), rgba(139,92,246,0.2))",
          cursor: "pointer",
          fontFamily: "inherit",
          position: "relative",
          overflow: "hidden",
        }}>
          {/* Inner shine */}
          <div style={{
            position: "absolute", inset: 0,
            borderRadius: "inherit",
            background: "linear-gradient(180deg, rgba(255,255,255,0.08) 0%, transparent 50%)",
            pointerEvents: "none",
          }} />

          <div style={{
            fontSize: 15, fontWeight: 900, color: "white",
            display: "flex", alignItems: "center", gap: 6,
            textShadow: "0 0 10px rgba(99,102,241,0.4)",
          }}>
            <span style={{ fontSize: 18 }}>{suggestion.emoji}</span>
            {suggestion.label}
          </div>

          <div style={{
            fontSize: 10, fontWeight: 600,
            color: "rgba(255,255,255,0.45)",
            display: "flex", alignItems: "center", gap: 4,
          }}>
            {mainReward && (
              <span style={{ color: "#4ade80" }}>
                {mainReward.icon} {toPersian(mainReward.label)}
              </span>
            )}
            <span>· شروع کن</span>
          </div>
        </button>
      </Link>
    </div>
  );
}
