// ─── Mission Helpers ───
// Utility functions for UI integration.

import type { Mission, MissionCategory } from "./types";
import { getMissionProgressPercent, getMissionRemainingTextFa } from "./progress";
import { getMissionRewardPreviewFa } from "./rewards";

// Category display info
export function getCategoryDisplay(category: MissionCategory): {
  labelFa: string;
  color: string;
  bgColor: string;
  borderColor: string;
  progressGradient: string;
} {
  switch (category) {
    case "story":
      return {
        labelFa: "داستان",
        color: "#c084fc",
        bgColor: "rgba(168,85,247,0.1)",
        borderColor: "rgba(168,85,247,0.2)",
        progressGradient: "linear-gradient(90deg, #facc15, #f59e0b)",
      };
    case "daily":
      return {
        labelFa: "روزانه",
        color: "#4ade80",
        bgColor: "rgba(74,222,128,0.1)",
        borderColor: "rgba(74,222,128,0.15)",
        progressGradient: "linear-gradient(90deg, #4ade80, #86efac)",
      };
    case "weekly":
      return {
        labelFa: "هفتگی",
        color: "#60a5fa",
        bgColor: "rgba(96,165,250,0.1)",
        borderColor: "rgba(96,165,250,0.15)",
        progressGradient: "linear-gradient(90deg, #3b82f6, #60a5fa)",
      };
    case "achievement":
      return {
        labelFa: "دستاورد",
        color: "#f59e0b",
        bgColor: "rgba(245,158,11,0.1)",
        borderColor: "rgba(245,158,11,0.15)",
        progressGradient: "linear-gradient(90deg, #f59e0b, #fb923c)",
      };
    case "event":
      return {
        labelFa: "رویداد",
        color: "#f472b6",
        bgColor: "rgba(244,114,182,0.1)",
        borderColor: "rgba(244,114,182,0.15)",
        progressGradient: "linear-gradient(90deg, #ec4899, #f472b6)",
      };
    case "rescue":
      return {
        labelFa: "نجات",
        color: "#fb923c",
        bgColor: "rgba(251,146,60,0.1)",
        borderColor: "rgba(251,146,60,0.15)",
        progressGradient: "linear-gradient(90deg, #f97316, #fb923c)",
      };
  }
}

// Get full display data for a mission (for UI rendering)
export function getMissionDisplayData(mission: Mission) {
  const category = getCategoryDisplay(mission.category);
  const progressPct = getMissionProgressPercent(mission);
  const remainingText = getMissionRemainingTextFa(mission);
  const rewardPreview = getMissionRewardPreviewFa(mission.rewards);
  const isCompleted = mission.status === "completed";
  const isClaimed = mission.status === "claimed";
  const isNearCompletion = progressPct >= 75 && !isCompleted && !isClaimed;

  return {
    ...mission,
    category: category,
    progressPct,
    remainingText,
    rewardPreview,
    isCompleted,
    isClaimed,
    isNearCompletion,
  };
}

// Sort missions by priority for display
export function sortMissionsByPriority(missions: Mission[]): Mission[] {
  return [...missions].sort((a, b) => {
    // Completed first (for claiming)
    if (a.status === "completed" && b.status !== "completed") return -1;
    if (b.status === "completed" && a.status !== "completed") return 1;

    // Then by priority
    const pa = a.priority ?? 5;
    const pb = b.priority ?? 5;
    if (pa !== pb) return pb - pa;

    // Then by progress (closer to completion first)
    const progA = getMissionProgressPercent(a);
    const progB = getMissionProgressPercent(b);
    return progB - progA;
  });
}
