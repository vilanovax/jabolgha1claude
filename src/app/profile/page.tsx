"use client";
import PlayerHeroCard from "@/components/profile/PlayerHeroCard";
import PlayerFocusCard from "@/components/profile/PlayerFocusCard";
import ActiveMissionCard from "@/components/profile/ActiveMissionCard";
import RoomPreviewCard from "@/components/profile/RoomPreviewCard";
import AchievementsPreviewCard from "@/components/profile/AchievementsPreviewCard";
import BottomNav from "@/components/layout/BottomNav";

export default function ProfilePage() {
  return (
    <div className="scene-bg" style={{ minHeight: "100dvh" }}>
      {/* Decorative particles */}
      <div style={{
        position: "fixed",
        top: 0,
        left: "50%",
        transform: "translateX(-50%)",
        width: "100%",
        maxWidth: 430,
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
        overflow: "hidden",
      }}>
        {[
          { x: "20%", delay: "0s", size: 3, dur: "7s" },
          { x: "60%", delay: "2.5s", size: 2, dur: "8s" },
          { x: "80%", delay: "1s", size: 3, dur: "6.5s" },
        ].map((p, i) => (
          <div key={i} style={{
            position: "absolute",
            bottom: "30%",
            left: p.x,
            width: p.size,
            height: p.size,
            borderRadius: "50%",
            background: "rgba(212,168,67,0.3)",
            boxShadow: "0 0 6px rgba(212,168,67,0.2)",
            animation: `particle-drift ${p.dur} ease-in-out infinite`,
            animationDelay: p.delay,
          }} />
        ))}
      </div>

      <div className="page-enter" style={{
        paddingTop: 8,
        paddingBottom: "calc(var(--nav-h) + 16px)",
        paddingLeft: 12,
        paddingRight: 12,
        position: "relative",
        zIndex: 2,
      }}>
        <PlayerHeroCard />
        <PlayerFocusCard />
        <ActiveMissionCard />
        <RoomPreviewCard />
        <AchievementsPreviewCard />
      </div>

      <BottomNav />
    </div>
  );
}
