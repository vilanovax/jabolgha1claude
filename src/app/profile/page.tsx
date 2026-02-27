"use client";
import ProfileHero from "@/components/profile/ProfileHero";
import ProfileMissionArc from "@/components/profile/ProfileMissionArc";
import ProfileRoom from "@/components/profile/ProfileRoom";
import ProfileBadges from "@/components/profile/ProfileBadges";
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
        paddingTop: 16,
        paddingBottom: "calc(var(--nav-h) + 16px)",
        paddingLeft: 12,
        paddingRight: 12,
        position: "relative",
        zIndex: 2,
      }}>
        <ProfileHero />
        <ProfileMissionArc />
        <ProfileRoom />
        <ProfileBadges />

        {/* Action buttons */}
        <div style={{
          display: "flex", gap: 10, padding: "0 8px",
        }}>
          <button style={{
            flex: 1, padding: "12px 0", borderRadius: 16,
            border: "1px solid rgba(255,255,255,0.08)",
            background: "rgba(255,255,255,0.04)",
            color: "rgba(255,255,255,0.5)",
            fontSize: 12, fontWeight: 700,
            fontFamily: "inherit", cursor: "pointer",
            transition: "background 0.15s ease",
          }}>
            ✏️ ویرایش پروفایل
          </button>
          <button style={{
            flex: 1, padding: "12px 0", borderRadius: 16,
            border: "1px solid rgba(250,204,21,0.15)",
            background: "rgba(250,204,21,0.06)",
            color: "#facc15",
            fontSize: 12, fontWeight: 700,
            fontFamily: "inherit", cursor: "pointer",
            transition: "background 0.15s ease",
          }}>
            🛍️ فروشگاه
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
