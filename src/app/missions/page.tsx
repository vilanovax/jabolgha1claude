"use client";
import TopHeader from "@/components/layout/TopHeader";
import BottomNav from "@/components/layout/BottomNav";
import ActiveStoryArcCard from "@/components/missions/ActiveStoryArcCard";
import DailyMissionCard from "@/components/missions/DailyMissionCard";
import WeeklyMissionCard from "@/components/missions/WeeklyMissionCard";
import MilestoneCard from "@/components/missions/MilestoneCard";
import { dailyMissions, weeklyMissions, milestones, getMissionStats, toPersian } from "@/data/mock";

export default function MissionsPage() {
  const stats = getMissionStats();
  const dailyDone = dailyMissions.filter(
    (m) => m.status === "done" || m.status === "claimable"
  ).length;
  const dailyPct = Math.round((dailyDone / dailyMissions.length) * 100);

  return (
    <div className="scene-bg" style={{ minHeight: "100dvh" }}>
      <TopHeader />

      {/* Floating particles */}
      {[0, 1, 2].map((i) => (
        <div key={i} style={{
          position: "fixed",
          width: 3,
          height: 3,
          borderRadius: "50%",
          background: "rgba(250,204,21,0.3)",
          top: `${25 + i * 25}%`,
          right: `${15 + i * 30}%`,
          animation: `particle-drift ${5 + i * 2}s ease-in-out ${i * 1.5}s infinite`,
          pointerEvents: "none",
          zIndex: 0,
        }} />
      ))}

      <div className="page-enter" style={{
        paddingTop: "calc(var(--header-h) + 10px)",
        paddingBottom: "calc(var(--nav-h) + 16px)",
        paddingLeft: 14,
        paddingRight: 14,
        position: "relative",
        zIndex: 2,
      }}>
        {/* Page Header */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          marginBottom: 16,
        }}>
          <div style={{
            fontSize: 20, fontWeight: 900, color: "white",
            display: "flex", alignItems: "center", gap: 8,
            textShadow: "0 0 16px rgba(250,204,21,0.2)",
          }}>
            <span style={{ fontSize: 22 }}>🎯</span>
            ماموریت‌ها
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <div style={{
              fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.5)",
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 12, padding: "4px 10px",
            }}>
              {toPersian(stats.activeCount)} فعال
            </div>
            {stats.claimableCount > 0 && (
              <div className="anim-badge-bounce" style={{
                fontSize: 11, fontWeight: 700, color: "#facc15",
                background: "rgba(250,204,21,0.12)",
                border: "1px solid rgba(250,204,21,0.25)",
                borderRadius: 12, padding: "4px 10px",
                boxShadow: "0 0 8px rgba(250,204,21,0.1)",
              }}>
                {toPersian(stats.claimableCount)} پاداش آماده ⭐
              </div>
            )}
          </div>
        </div>

        {/* Active Story Arc */}
        <ActiveStoryArcCard />

        {/* Daily Missions */}
        <div style={{ marginBottom: 14 }}>
          {/* Section header */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            marginBottom: 10,
          }}>
            <div style={{
              fontSize: 14, fontWeight: 800, color: "white",
              display: "flex", alignItems: "center", gap: 6,
            }}>
              <span style={{ fontSize: 16 }}>☀️</span>
              ماموریت‌های امروز
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{
                fontSize: 9, fontWeight: 800, color: "#000",
                background: dailyDone === dailyMissions.length
                  ? "linear-gradient(135deg, #4ade80, #22c55e)"
                  : "linear-gradient(135deg, #facc15, #f59e0b)",
                borderRadius: 6, padding: "2px 6px",
              }}>
                {toPersian(dailyPct)}٪
              </span>
              <div style={{
                fontSize: 11, fontWeight: 700, color: "#4ade80",
                background: "rgba(74,222,128,0.1)",
                border: "1px solid rgba(74,222,128,0.2)",
                borderRadius: 10, padding: "3px 10px",
              }}>
                {toPersian(dailyDone)} / {toPersian(dailyMissions.length)} انجام شده
              </div>
            </div>
          </div>

          {/* Daily progress bar */}
          <div style={{
            height: 5, borderRadius: 3, marginBottom: 10,
            background: "rgba(255,255,255,0.06)",
            overflow: "hidden",
            position: "relative",
          }}>
            <div className="progress-bar-animated" style={{
              width: `${dailyPct}%`,
              height: "100%",
              borderRadius: 3,
              background: dailyDone === dailyMissions.length
                ? "linear-gradient(90deg, #22c55e, #4ade80)"
                : "linear-gradient(90deg, #facc15, #4ade80)",
              boxShadow: "0 0 6px rgba(74,222,128,0.3)",
              transition: "width 0.6s ease",
              position: "relative",
              overflow: "hidden",
            }} />
          </div>

          {/* Daily mission cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {dailyMissions.map((mission) => (
              <DailyMissionCard key={mission.id} mission={mission} />
            ))}
          </div>
        </div>

        {/* Weekly Growth */}
        <div style={{ marginBottom: 14 }}>
          <div style={{
            fontSize: 14, fontWeight: 800, color: "white",
            display: "flex", alignItems: "center", gap: 6,
            marginBottom: 10,
          }}>
            <span style={{ fontSize: 16 }}>📈</span>
            رشد این هفته
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {weeklyMissions.map((mission) => (
              <WeeklyMissionCard key={mission.id} mission={mission} />
            ))}
          </div>
        </div>

        {/* Milestones */}
        <div style={{ marginBottom: 14 }}>
          <div style={{
            fontSize: 14, fontWeight: 800, color: "white",
            display: "flex", alignItems: "center", gap: 6,
            marginBottom: 10,
          }}>
            <span style={{ fontSize: 16 }}>🏆</span>
            دستاوردها
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {milestones.map((milestone) => (
              <MilestoneCard key={milestone.id} milestone={milestone} />
            ))}
          </div>
        </div>

        {/* Episode teaser */}
        <div className="anim-breathe" style={{
          textAlign: "center",
          padding: "24px 16px",
          borderRadius: 20,
          background: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(255,255,255,0.06)",
          boxShadow: "0 0 20px rgba(250,204,21,0.05)",
        }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>🎭</div>
          <div style={{
            fontSize: 14, fontWeight: 800, color: "rgba(255,255,255,0.4)",
          }}>
            اپیزود بعدی فردا باز می‌شود...
          </div>
          <div style={{
            fontSize: 11, color: "rgba(255,255,255,0.2)", marginTop: 6,
            lineHeight: 1.5,
          }}>
            ماموریت‌های جدید هر روز اضافه می‌شن
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
