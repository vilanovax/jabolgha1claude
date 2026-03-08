"use client";
import { useState, useEffect } from "react";
import TopHeader from "@/components/layout/TopHeader";
import BottomNav from "@/components/layout/BottomNav";
import StoryMissionHero from "@/components/missions/StoryMissionHero";
import MissionCard from "@/components/missions/MissionCard";
import LockedEpisodeTeaser from "@/components/missions/LockedEpisodeTeaser";
import RewardPopup from "@/components/missions/RewardPopup";
import { useMissionStore } from "@/game/missions/store";
import { useGameStore } from "@/stores/gameStore";
import type { MissionRewards, Mission } from "@/game/missions/types";
import { toPersian } from "@/data/mock";

export default function MissionsPage() {
  const [claimedReward, setClaimedReward] = useState<MissionRewards | null>(null);

  // Mission store
  const storyMission = useMissionStore((s) => s.activeStoryMission);
  const dailyMissions = useMissionStore((s) => s.activeDailyMissions);
  const weeklyMissions = useMissionStore((s) => s.activeWeeklyMissions);
  const eventMission = useMissionStore((s) => s.activeEventMission);
  const rescueMission = useMissionStore((s) => s.activeRescueMission);
  const achievements = useMissionStore((s) => s.achievements);
  const completedUnclaimed = useMissionStore((s) => s.completedUnclaimed);
  const claimRewards = useMissionStore((s) => s.claimMissionRewards);
  const currentArcId = useMissionStore((s) => s.currentArcId);
  const currentEpisodeIndex = useMissionStore((s) => s.currentEpisodeIndex);
  const initMissions = useMissionStore((s) => s.initMissionsForNewDay);
  const refreshAchievements = useMissionStore((s) => s.refreshAchievements);

  // Game store for context
  const player = useGameStore((s) => s.player);
  const bank = useGameStore((s) => s.bank);
  const wave = useGameStore((s) => s.wave);
  const completedCourses = useGameStore((s) => s.completedCourses);

  // Init missions if empty (first load)
  useEffect(() => {
    if (dailyMissions.length === 0 && !storyMission) {
      const ctx = {
        day: player.dayInGame,
        player: {
          level: player.level,
          xp: player.xp,
          money: bank.checking,
          stars: player.stars ?? 0,
          energy: player.energy,
          hunger: player.hunger,
          stress: player.happiness < 40 ? 60 : 30,
          happiness: player.happiness,
          health: player.health ?? 80,
          reputation: 50,
          currentJobId: null,
          strongestSkillTree: null,
          studySessionsLast7Days: 2,
          workShiftsLast7Days: 3,
          exerciseSessionsLast7Days: 1,
          restSessionsLast7Days: 1,
          jobsAppliedLast7Days: 0,
          jobRejectionsLast7Days: 0,
          savings: bank.savings,
          debt: bank.loans?.reduce((s, l) => s + (l.remainingPrincipal ?? 0), 0) ?? 0,
          investmentsTotal: 0,
          routineConsistencyScore: 0.5,
        },
        world: {
          currentWaveType: wave.currentPhase,
          inflationLevel: 45,
          unemploymentRate: 30,
          techDemandLevel: 55,
        },
      };
      initMissions(ctx);
      refreshAchievements({
        totalMoneyEarned: 0,
        totalJobsAccepted: 0,
        totalWorkShifts: 0,
        totalStudySessions: 0,
        totalExerciseSessions: 0,
        totalInvested: 0,
        totalCoursesCompleted: completedCourses.length,
        currentSavings: bank.savings,
        currentLevel: player.level,
        daysPlayed: player.dayInGame,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClaim = (missionId: string) => {
    const rewards = claimRewards(missionId);
    if (rewards) {
      // Apply rewards to game store
      const gs = useGameStore.getState();
      const newPlayer = { ...gs.player };
      const newBank = { ...gs.bank };
      if (rewards.xp) newPlayer.xp += rewards.xp;
      if (rewards.stars) newPlayer.stars = (newPlayer.stars ?? 0) + rewards.stars;
      if (rewards.money) newBank.checking += rewards.money;
      if (rewards.energy) newPlayer.energy = Math.min(100, newPlayer.energy + rewards.energy);
      if (rewards.happiness) newPlayer.happiness = Math.min(100, newPlayer.happiness + rewards.happiness);
      useGameStore.setState({ player: newPlayer, bank: newBank });
      setClaimedReward(rewards);
    }
  };

  // Stats
  const dailyDone = dailyMissions.filter(
    (m) => m.status === "completed" || m.status === "claimed"
  ).length;
  const dailyPct = dailyMissions.length > 0
    ? Math.round((dailyDone / dailyMissions.length) * 100) : 0;

  const totalActive = (storyMission ? 1 : 0) +
    dailyMissions.filter((m) => m.status === "active").length +
    weeklyMissions.filter((m) => m.status === "active").length;
  const totalClaimable = completedUnclaimed.length +
    dailyMissions.filter((m) => m.status === "completed").length;

  const recommendedId = dailyMissions.find(
    (m) => m.status === "active" && m.recommendedReasonFa
  )?.id ?? dailyMissions.find((m) => m.status === "active")?.id;

  const visibleAchievements = achievements.filter((a) => a.status !== "claimed").slice(0, 4);

  return (
    <div className="scene-bg" style={{ minHeight: "100dvh" }}>
      <TopHeader />

      {/* Floating particles */}
      {[0, 1, 2, 3].map((i) => (
        <div key={i} style={{
          position: "fixed",
          width: 3, height: 3, borderRadius: "50%",
          background: i % 2 === 0 ? "rgba(250,204,21,0.3)" : "rgba(168,85,247,0.3)",
          top: `${20 + i * 20}%`,
          right: `${10 + i * 22}%`,
          animation: `particle-drift ${5 + i * 2}s ease-in-out ${i * 1.5}s infinite`,
          pointerEvents: "none", zIndex: 0,
        }} />
      ))}

      <div className="page-enter" style={{
        paddingTop: "calc(var(--header-h) + 10px)",
        paddingBottom: "calc(var(--nav-h) + 16px)",
        paddingLeft: 14, paddingRight: 14,
        position: "relative", zIndex: 2,
        display: "flex", flexDirection: "column", gap: 16,
      }}>
        {/* Page Header */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div style={{
            fontSize: 20, fontWeight: 900, color: "white",
            display: "flex", alignItems: "center", gap: 8,
            textShadow: "0 0 16px rgba(250,204,21,0.2)",
          }}>
            <span style={{ fontSize: 22 }}>🎯</span>
            ماموریت‌ها
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <Badge label={`${toPersian(totalActive)} فعال`} color="rgba(255,255,255,0.5)" bg="rgba(255,255,255,0.06)" border="rgba(255,255,255,0.1)" />
            {totalClaimable > 0 && (
              <Badge label={`${toPersian(totalClaimable)} پاداش ⭐`} color="#facc15" bg="rgba(250,204,21,0.12)" border="rgba(250,204,21,0.25)" glow />
            )}
          </div>
        </div>

        {/* ═══ Hero Story Mission ═══ */}
        {storyMission && (
          <StoryMissionHero
            mission={storyMission}
            arcId={currentArcId}
            episodeIndex={currentEpisodeIndex}
            onClaim={() => handleClaim(storyMission.id)}
          />
        )}

        {/* ═══ Rescue Mission ═══ */}
        {rescueMission && rescueMission.status === "active" && (
          <div>
            <SectionHeader emoji="🆘" title="ماموریت نجات" color="#fb923c" />
            <MissionCard mission={rescueMission} recommended onClaim={() => handleClaim(rescueMission.id)} />
          </div>
        )}

        {/* ═══ Event Mission ═══ */}
        {eventMission && eventMission.status === "active" && (
          <div>
            <SectionHeader emoji="⚡" title="رویداد شهر" color="#f472b6" />
            <MissionCard mission={eventMission} onClaim={() => handleClaim(eventMission.id)} />
          </div>
        )}

        {/* ═══ Daily Missions ═══ */}
        {dailyMissions.length > 0 && (
          <div>
            <SectionHeader
              emoji="☀️" title="ماموریت‌های امروز" color="#4ade80"
              rightContent={
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{
                    fontSize: 9, fontWeight: 800, color: "#000",
                    background: dailyDone === dailyMissions.length
                      ? "linear-gradient(135deg, #4ade80, #22c55e)"
                      : "linear-gradient(135deg, #4ade80, #86efac)",
                    borderRadius: 6, padding: "2px 6px",
                  }}>{toPersian(dailyPct)}٪</span>
                  <span style={{
                    fontSize: 10, fontWeight: 700, color: "#4ade80",
                    background: "rgba(74,222,128,0.1)",
                    border: "1px solid rgba(74,222,128,0.2)",
                    borderRadius: 10, padding: "3px 8px",
                  }}>{toPersian(dailyDone)}/{toPersian(dailyMissions.length)}</span>
                </div>
              }
            />
            <div style={{
              height: 5, borderRadius: 3, marginBottom: 10,
              background: "rgba(255,255,255,0.06)", overflow: "hidden",
            }}>
              <div className="progress-bar-animated" style={{
                width: `${dailyPct}%`, height: "100%", borderRadius: 3,
                background: dailyDone === dailyMissions.length
                  ? "linear-gradient(90deg, #22c55e, #4ade80)"
                  : "linear-gradient(90deg, #4ade80, #86efac)",
                boxShadow: "0 0 6px rgba(74,222,128,0.3)",
                transition: "width 0.6s ease",
              }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {dailyMissions.map((m) => (
                <MissionCard key={m.id} mission={m} recommended={m.id === recommendedId} onClaim={() => handleClaim(m.id)} />
              ))}
            </div>
          </div>
        )}

        {/* ═══ Weekly Missions ═══ */}
        {weeklyMissions.length > 0 && (
          <div>
            <SectionHeader emoji="📈" title="رشد این هفته" color="#60a5fa" />
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {weeklyMissions.map((m) => (
                <MissionCard key={m.id} mission={m} onClaim={() => handleClaim(m.id)} />
              ))}
            </div>
          </div>
        )}

        {/* ═══ Achievements ═══ */}
        {visibleAchievements.length > 0 && (
          <div>
            <SectionHeader emoji="🏆" title="دستاوردها" color="#f59e0b" />
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {visibleAchievements.map((m) => (
                <MissionCard key={m.id} mission={m} onClaim={() => handleClaim(m.id)} />
              ))}
            </div>
          </div>
        )}

        {/* ═══ Completed Unclaimed ═══ */}
        {completedUnclaimed.length > 0 && (
          <div>
            <SectionHeader emoji="🎁" title="پاداش‌های آماده" color="#facc15" />
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {completedUnclaimed.map((m) => (
                <MissionCard key={m.id} mission={m} onClaim={() => handleClaim(m.id)} />
              ))}
            </div>
          </div>
        )}

        {/* ═══ Locked Episode ═══ */}
        <LockedEpisodeTeaser />
      </div>

      {claimedReward && (
        <RewardPopup reward={claimedReward} onDismiss={() => setClaimedReward(null)} />
      )}

      <BottomNav />
    </div>
  );
}

function Badge({ label, color, bg, border, glow }: {
  label: string; color: string; bg: string; border: string; glow?: boolean;
}) {
  return (
    <div className={glow ? "anim-badge-bounce" : ""} style={{
      fontSize: 11, fontWeight: 700, color,
      background: bg, border: `1px solid ${border}`,
      borderRadius: 12, padding: "4px 10px",
      boxShadow: glow ? `0 0 8px ${border}` : "none",
    }}>
      {label}
    </div>
  );
}

function SectionHeader({ emoji, title, color, rightContent }: {
  emoji: string; title: string; color: string; rightContent?: React.ReactNode;
}) {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      marginBottom: 10,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <span style={{ fontSize: 16 }}>{emoji}</span>
        <span style={{ fontSize: 14, fontWeight: 800, color: "white" }}>{title}</span>
        <div style={{
          width: 6, height: 6, borderRadius: "50%",
          background: color, opacity: 0.6,
          boxShadow: `0 0 6px ${color}`,
        }} />
      </div>
      {rightContent}
    </div>
  );
}
