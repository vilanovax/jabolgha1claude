// ─── Mission Selector ───
// Generates a set of missions for each new day based on player context.

import type {
  Mission,
  MissionTemplate,
  MissionGenerationContext,
  GeneratedMissionSet,
} from "./types";
import { analyzePlayerForMissions } from "./analyzer";
import { STORY_ARCS, getNextAvailableArc } from "./story-arcs";
import {
  DAILY_TEMPLATES,
  WEEKLY_TEMPLATES,
  EVENT_TEMPLATES,
  RESCUE_TEMPLATES,
} from "./templates";

let _missionIdCounter = 0;
function nextId(prefix: string): string {
  _missionIdCounter++;
  return `${prefix}_${Date.now()}_${_missionIdCounter}`;
}

// Check if a template's conditions are met
function meetsConditions(
  template: MissionTemplate,
  ctx: MissionGenerationContext
): boolean {
  const c = template.conditions;
  if (!c) return true;

  if (c.minLevel != null && ctx.player.level < c.minLevel) return false;
  if (c.maxLevel != null && ctx.player.level > c.maxLevel) return false;
  if (c.moneyBelow != null && ctx.player.money >= c.moneyBelow) return false;
  if (c.moneyAbove != null && ctx.player.money < c.moneyAbove) return false;
  if (c.minStress != null && (ctx.player.stress ?? 0) < c.minStress) return false;
  if (c.maxStress != null && (ctx.player.stress ?? 0) > c.maxStress) return false;
  if (c.jobRequired && !ctx.player.currentJobId) return false;
  if (c.unemployedOnly && ctx.player.currentJobId) return false;
  if (c.currentWaveType && ctx.world.currentWaveType !== c.currentWaveType) return false;

  return true;
}

// Weighted random selection from eligible templates
function selectTemplates(
  templates: MissionTemplate[],
  ctx: MissionGenerationContext,
  count: number,
  recentlyUsedIds: string[] = []
): MissionTemplate[] {
  // Filter eligible
  let eligible = templates.filter((t) => meetsConditions(t, ctx));

  // Penalize recently used
  const weighted = eligible.map((t) => ({
    template: t,
    weight: recentlyUsedIds.includes(t.id) ? t.weight * 0.3 : t.weight,
  }));

  // Weighted random selection without replacement
  const selected: MissionTemplate[] = [];
  const pool = [...weighted];

  for (let i = 0; i < count && pool.length > 0; i++) {
    const totalWeight = pool.reduce((sum, w) => sum + w.weight, 0);
    if (totalWeight <= 0) break;

    let roll = Math.random() * totalWeight;
    let picked = 0;
    for (let j = 0; j < pool.length; j++) {
      roll -= pool[j].weight;
      if (roll <= 0) {
        picked = j;
        break;
      }
    }

    selected.push(pool[picked].template);
    pool.splice(picked, 1);
  }

  return selected;
}

// Create a mission instance from a template
function instantiateTemplate(
  template: MissionTemplate,
  ctx: MissionGenerationContext
): Mission {
  const objectives = template.objectiveFactory(ctx);
  const rewards = template.rewardFactory(ctx);
  const recommendedReasonFa = template.recommendedReasonFactory?.(ctx);

  const progress: Record<string, number> = {};
  objectives.forEach((_, i) => {
    progress[`obj_${i}`] = 0;
  });

  return {
    id: nextId(template.id),
    category: template.category,
    status: "active",
    titleFa: template.titleFa,
    subtitleFa: template.subtitleFa,
    descriptionFa: template.descriptionFa,
    emoji: template.emoji,
    objectives,
    progress,
    rewards,
    createdAtDay: ctx.day,
    expiresAtDay: template.category === "daily"
      ? ctx.day
      : template.category === "weekly"
        ? ctx.day + 7
        : undefined,
    recommendedReasonFa,
  };
}

// ─── Main Generation Function ───

export function generateMissionsForNewDay(
  ctx: MissionGenerationContext,
  currentState: {
    activeStoryMission: Mission | null;
    activeWeeklyMissions: Mission[];
    completedArcIds: string[];
    currentArcId: string | null;
    currentEpisodeIndex: number;
    recentDailyTemplateIds: string[];
    recentWeeklyTemplateIds: string[];
  }
): GeneratedMissionSet {
  const profile = analyzePlayerForMissions(ctx);

  // ── Story Mission ──
  let storyMission = currentState.activeStoryMission;
  if (!storyMission) {
    // Try to create next story episode
    const arcId = currentState.currentArcId;
    if (arcId) {
      const arc = STORY_ARCS.find((a) => a.id === arcId);
      if (arc && currentState.currentEpisodeIndex < arc.episodes.length) {
        const ep = arc.episodes[currentState.currentEpisodeIndex];
        const progress: Record<string, number> = {};
        ep.objectives.forEach((_, i) => { progress[`obj_${i}`] = 0; });

        storyMission = {
          id: nextId("story"),
          category: "story",
          status: "active",
          titleFa: ep.titleFa,
          subtitleFa: ep.subtitleFa,
          descriptionFa: ep.descriptionFa,
          emoji: ep.emoji,
          character: ep.character,
          characterName: ep.characterName,
          dialogue: ep.dialogue,
          arcId,
          episodeIndex: currentState.currentEpisodeIndex,
          objectives: ep.objectives,
          progress,
          rewards: ep.rewards,
          createdAtDay: ctx.day,
        };
      }
    } else {
      // Find new arc
      const newArc = getNextAvailableArc(
        currentState.completedArcIds,
        ctx.player.level,
        ctx.player.money
      );
      if (newArc) {
        const ep = newArc.episodes[0];
        const progress: Record<string, number> = {};
        ep.objectives.forEach((_, i) => { progress[`obj_${i}`] = 0; });

        storyMission = {
          id: nextId("story"),
          category: "story",
          status: "active",
          titleFa: ep.titleFa,
          subtitleFa: ep.subtitleFa,
          descriptionFa: ep.descriptionFa,
          emoji: ep.emoji,
          character: ep.character,
          characterName: ep.characterName,
          dialogue: ep.dialogue,
          arcId: newArc.id,
          episodeIndex: 0,
          objectives: ep.objectives,
          progress,
          rewards: ep.rewards,
          createdAtDay: ctx.day,
        };
      }
    }
  }

  // ── Daily Missions (max 3) ──
  const dailyTemplates = selectTemplates(
    DAILY_TEMPLATES,
    ctx,
    3,
    currentState.recentDailyTemplateIds
  );
  const dailyMissions = dailyTemplates.map((t) => instantiateTemplate(t, ctx));

  // ── Weekly Missions (keep existing or generate, max 2) ──
  let weeklyMissions = currentState.activeWeeklyMissions.filter(
    (m) => m.status === "active" && (!m.expiresAtDay || m.expiresAtDay > ctx.day)
  );

  if (weeklyMissions.length < 2) {
    const needed = 2 - weeklyMissions.length;
    const weeklyTemplates = selectTemplates(
      WEEKLY_TEMPLATES,
      ctx,
      needed,
      currentState.recentWeeklyTemplateIds
    );
    const newWeekly = weeklyTemplates.map((t) => instantiateTemplate(t, ctx));
    weeklyMissions = [...weeklyMissions, ...newWeekly];
  }

  // ── Event Mission (max 1, only if wave matches) ──
  let eventMission: Mission | null = null;
  if (ctx.world.currentWaveType) {
    const eventTemplates = selectTemplates(EVENT_TEMPLATES, ctx, 1);
    if (eventTemplates.length > 0) {
      eventMission = instantiateTemplate(eventTemplates[0], ctx);
    }
  }

  // ── Rescue Mission (max 1, only if struggling) ──
  let rescueMission: Mission | null = null;
  if (profile.struggling) {
    const rescueTemplates = selectTemplates(RESCUE_TEMPLATES, ctx, 1);
    if (rescueTemplates.length > 0) {
      rescueMission = instantiateTemplate(rescueTemplates[0], ctx);
    }
  }

  return {
    storyMission,
    dailyMissions,
    weeklyMissions,
    eventMission,
    rescueMission,
  };
}
