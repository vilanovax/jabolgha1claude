// ─── Mission Progress Tracking ───
// Updates mission progress based on gameplay events.

import type { Mission, GameplayEvent, MissionObjective } from "./types";

// Update a single mission's progress based on a gameplay event.
// Returns a new mission object with updated progress (immutable).
export function updateMissionProgress(
  mission: Mission,
  event: GameplayEvent
): Mission {
  if (mission.status !== "active") return mission;

  let changed = false;
  const newProgress = { ...mission.progress };

  mission.objectives.forEach((obj, i) => {
    const key = `obj_${i}`;
    const current = newProgress[key] ?? 0;
    const delta = getProgressDelta(obj, event);

    if (delta > 0) {
      newProgress[key] = current + delta;
      changed = true;
    }
  });

  if (!changed) return mission;

  return { ...mission, progress: newProgress };
}

// Check if all objectives in a mission are completed.
export function isMissionCompleted(mission: Mission): boolean {
  return mission.objectives.every((obj, i) => {
    const key = `obj_${i}`;
    const current = mission.progress[key] ?? 0;
    const target = getObjectiveTarget(obj);
    return current >= target;
  });
}

// Get the target value for an objective.
export function getObjectiveTarget(obj: MissionObjective): number {
  switch (obj.type) {
    case "complete_action":
    case "complete_work_shift":
    case "study_sessions":
    case "exercise_sessions":
    case "apply_to_jobs":
    case "jobs_accepted":
    case "eat_meals":
    case "rest_sessions":
    case "keep_streak":
    case "survive_without_loan":
      return "count" in obj ? obj.count : "days" in obj ? obj.days : 1;
    case "earn_money":
    case "save_money":
    case "invest_money":
    case "gain_xp":
      return obj.amount;
    case "reach_stat":
      return obj.value;
    case "unlock_skill":
      return 1; // binary
  }
}

// Calculate how much progress an event gives to an objective.
function getProgressDelta(obj: MissionObjective, event: GameplayEvent): number {
  switch (obj.type) {
    case "complete_action":
      if (event.type === "action_completed" && event.actionId === obj.actionId) return 1;
      return 0;

    case "complete_work_shift":
      if (event.type === "work_shift_completed") return 1;
      return 0;

    case "study_sessions":
      if (event.type === "study_session_completed") return 1;
      return 0;

    case "exercise_sessions":
      if (event.type === "exercise_completed") return 1;
      return 0;

    case "eat_meals":
      if (event.type === "eat_completed") return 1;
      return 0;

    case "rest_sessions":
      if (event.type === "rest_completed") return 1;
      return 0;

    case "earn_money":
      if (event.type === "money_earned") return event.amount;
      return 0;

    case "save_money":
      if (event.type === "money_saved") return event.amount;
      return 0;

    case "gain_xp":
      if (event.type === "xp_gained") return event.amount;
      return 0;

    case "apply_to_jobs":
      if (event.type === "job_applied") return 1;
      return 0;

    case "jobs_accepted":
      if (event.type === "job_accepted") return 1;
      return 0;

    case "invest_money":
      if (event.type === "investment_made") return event.amount;
      return 0;

    case "unlock_skill":
      if (event.type === "skill_unlocked" && event.skillId === obj.skillId) return 1;
      return 0;

    case "keep_streak":
      // Streaks update on day_ended via a separate mechanism
      if (event.type === "day_ended") return 1;
      return 0;

    case "survive_without_loan":
      // Tracked per day end
      if (event.type === "day_ended") return 1;
      return 0;

    case "reach_stat":
      // Stats are checked externally, not via events
      return 0;
  }
}

// Get progress percentage for a mission (0-100)
export function getMissionProgressPercent(mission: Mission): number {
  if (mission.objectives.length === 0) return 100;

  let totalPct = 0;
  mission.objectives.forEach((obj, i) => {
    const key = `obj_${i}`;
    const current = mission.progress[key] ?? 0;
    const target = getObjectiveTarget(obj);
    totalPct += Math.min(100, (current / target) * 100);
  });

  return Math.round(totalPct / mission.objectives.length);
}

// Get remaining text in Persian for display
export function getMissionRemainingTextFa(mission: Mission): string {
  if (mission.objectives.length === 0) return "";

  const parts: string[] = [];

  mission.objectives.forEach((obj, i) => {
    const key = `obj_${i}`;
    const current = mission.progress[key] ?? 0;
    const target = getObjectiveTarget(obj);
    const remaining = Math.max(0, target - current);

    if (remaining <= 0) return;

    switch (obj.type) {
      case "earn_money":
      case "save_money":
      case "invest_money":
        parts.push(`${formatCompact(remaining)} باقیمانده`);
        break;
      case "gain_xp":
        parts.push(`${remaining} XP باقیمانده`);
        break;
      case "complete_work_shift":
        parts.push(`${remaining} شیفت دیگه`);
        break;
      case "study_sessions":
        parts.push(`${remaining} جلسه مطالعه دیگه`);
        break;
      case "exercise_sessions":
        parts.push(`${remaining} جلسه ورزش دیگه`);
        break;
      case "eat_meals":
        parts.push(`${remaining} وعده دیگه`);
        break;
      case "rest_sessions":
        parts.push(`${remaining} استراحت دیگه`);
        break;
      case "keep_streak":
      case "survive_without_loan":
        parts.push(`${remaining} روز دیگه`);
        break;
      case "apply_to_jobs":
        parts.push(`${remaining} درخواست دیگه`);
        break;
      case "jobs_accepted":
        parts.push(`${remaining} استخدام دیگه`);
        break;
      default:
        parts.push(`${remaining} مونده`);
    }
  });

  return parts.join(" · ");
}

function formatCompact(n: number): string {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return String(n);
}
