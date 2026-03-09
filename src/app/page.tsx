"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import GameHUD from "@/components/home/GameHUD";
import CharacterStage from "@/components/home/CharacterStage";
import StoryBubble from "@/components/home/StoryBubble";
import HeroActionButton from "@/components/home/HeroActionButton";
import RoomObjects from "@/components/home/RoomObjects";
import ActionBottomSheet from "@/components/home/ActionBottomSheet";
import LeisureButton from "@/components/home/LeisureButton";
import CityEventBanner from "@/components/home/CityEventBanner";
import EndOfDaySummary from "@/components/home/EndOfDaySummary";
import DailyCardModal from "@/components/home/DailyCardModal";
import BottomNav from "@/components/layout/BottomNav";
import { useGameStore } from "@/stores/gameStore";
import { useMissionStore } from "@/game/missions/store";
import { getMissionProgressPercent } from "@/game/missions/progress";
import { formatMoney, toPersian } from "@/data/mock";
import { calculateWeeklyBills } from "@/data/livingCosts";

export default function HomePage() {
  const [done, setDone] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [showEndOfDay, setShowEndOfDay] = useState(false);
  const [showDailyCard, setShowDailyCard] = useState(false);
  const startNextDay = useGameStore((s) => s.startNextDay);
  const todayCard = useGameStore((s) => s.todayCard);
  const cardShielded = useGameStore((s) => s.cardShielded);

  const handleStartNextDay = () => {
    startNextDay();
    setShowEndOfDay(false);
    setShowDailyCard(true);
  };

  const handleDone = (id: string) => {
    setDone((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  const handleOpenAction = (categoryId: string) => {
    setActiveCategory(categoryId);
  };

  return (
    <div className="scene-bg" style={{ minHeight: "100dvh" }}>
      {/* Floating HUD */}
      <GameHUD onEndDay={() => setShowEndOfDay(true)} />

      {/* Floating particles (decorative) */}
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
          { x: "15%", delay: "0s", size: 3, dur: "6s" },
          { x: "40%", delay: "2s", size: 2, dur: "8s" },
          { x: "70%", delay: "1s", size: 4, dur: "7s" },
          { x: "85%", delay: "3s", size: 2, dur: "9s" },
          { x: "55%", delay: "4s", size: 3, dur: "6.5s" },
        ].map((p, i) => (
          <div key={i} style={{
            position: "absolute",
            bottom: "20%",
            left: p.x,
            width: p.size,
            height: p.size,
            borderRadius: "50%",
            background: "rgba(99,102,241,0.4)",
            boxShadow: "0 0 6px rgba(99,102,241,0.3)",
            animation: `particle-drift ${p.dur} ease-in-out infinite`,
            animationDelay: p.delay,
          }} />
        ))}
      </div>

      {/* Main content */}
      <div className="page-enter" style={{
        paddingTop: 80,
        paddingBottom: "calc(var(--nav-h) + 16px)",
        paddingLeft: 12,
        paddingRight: 12,
        position: "relative",
        zIndex: 2,
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}>
        {/* 1. Character */}
        <CharacterStage doneCount={done.length} />

        {/* 2. Hero Mission Card */}
        <RecommendedMissionBanner />

        {/* 3. Suggested main action */}
        <HeroActionButton done={done} onOpenAction={handleOpenAction} />

        {/* 4. Section label: actions */}
        <div style={{
          padding: "0 8px",
          display: "flex", alignItems: "center", gap: 6,
        }}>
          <span style={{ fontSize: 13, fontWeight: 800, color: "rgba(255,255,255,0.5)" }}>
            امروز چیکار می‌کنی؟
          </span>
          <div style={{
            flex: 1, height: 1,
            background: "rgba(255,255,255,0.06)",
          }} />
        </div>

        {/* 5. Action grid */}
        <RoomObjects done={done} onOpenAction={handleOpenAction} />

        {/* 6. Leisure: do something fun */}
        <LeisureButton />

        {/* 7. Section label: city */}
        <div style={{
          padding: "0 8px",
          display: "flex", alignItems: "center", gap: 6,
          marginTop: 4,
        }}>
          <span style={{ fontSize: 13, fontWeight: 800, color: "rgba(255,255,255,0.5)" }}>
            وضعیت شهر
          </span>
          <div style={{
            flex: 1, height: 1,
            background: "rgba(255,255,255,0.06)",
          }} />
        </div>

        {/* 8. City event banner */}
        <CityEventBanner />

        {/* 9. Quick links (economy) */}
        <QuickLinks />
      </div>

      {/* Action Bottom Sheet */}
      <ActionBottomSheet
        categoryId={activeCategory}
        onClose={() => setActiveCategory(null)}
        onDone={handleDone}
      />

      {/* End of Day Summary */}
      <EndOfDaySummary
        isOpen={showEndOfDay}
        onClose={handleStartNextDay}
      />

      {/* Daily Card Modal */}
      {showDailyCard && todayCard && (
        <DailyCardModal
          card={todayCard}
          shielded={cardShielded}
          onDismiss={() => setShowDailyCard(false)}
        />
      )}

      <BottomNav />
    </div>
  );
}

function RecommendedMissionBanner() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const getRecommended = useMissionStore((s) => s.getRecommendedMission);
  const mission = mounted ? getRecommended() : null;

  // Fallback to old StoryBubble if not yet mounted or no mission data
  if (!mission) return <StoryBubble />;

  const progressPct = getMissionProgressPercent(mission);
  const isCompleted = mission.status === "completed";

  const categoryColors: Record<string, { color: string; bg: string; border: string }> = {
    story:   { color: "#c084fc", bg: "rgba(168,85,247,0.1)", border: "rgba(168,85,247,0.2)" },
    daily:   { color: "#4ade80", bg: "rgba(74,222,128,0.1)", border: "rgba(74,222,128,0.15)" },
    rescue:  { color: "#fb923c", bg: "rgba(251,146,60,0.1)", border: "rgba(251,146,60,0.15)" },
    weekly:  { color: "#60a5fa", bg: "rgba(96,165,250,0.1)", border: "rgba(96,165,250,0.15)" },
    event:   { color: "#f472b6", bg: "rgba(244,114,182,0.1)", border: "rgba(244,114,182,0.15)" },
    achievement: { color: "#f59e0b", bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.15)" },
  };
  const cat = categoryColors[mission.category] ?? categoryColors.daily;

  return (
    <Link href="/missions" style={{ textDecoration: "none" }}>
      <div className={isCompleted ? "anim-claim-pulse" : "anim-breathe"} style={{
        borderRadius: 18,
        padding: "14px 16px",
        background: isCompleted
          ? "linear-gradient(135deg, rgba(250,204,21,0.1), rgba(245,158,11,0.06))"
          : "rgba(255,255,255,0.04)",
        border: isCompleted
          ? "1.5px solid rgba(250,204,21,0.3)"
          : `1px solid ${cat.border}`,
        boxShadow: isCompleted ? "0 0 16px rgba(250,204,21,0.1)" : "none",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Label */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          marginBottom: 8,
        }}>
          <span style={{
            fontSize: 8, fontWeight: 800,
            padding: "2px 7px", borderRadius: 8,
            background: isCompleted ? "rgba(250,204,21,0.15)" : cat.bg,
            color: isCompleted ? "#facc15" : cat.color,
            border: `1px solid ${isCompleted ? "rgba(250,204,21,0.25)" : cat.border}`,
          }}>
            {isCompleted ? "🎁 آماده دریافت!" : mission.recommendedReasonFa ? "⭐ پیشنهاد امروز" : "🎯 ماموریت فعال"}
          </span>
          <span style={{ fontSize: 9, color: "rgba(255,255,255,0.25)" }}>
            ماموریت‌ها ←
          </span>
        </div>

        {/* Mission title */}
        <div style={{
          fontSize: 14, fontWeight: 800, color: "white", marginBottom: 4,
        }}>
          {mission.emoji} {mission.titleFa}
        </div>

        {/* Reason or subtitle */}
        {(mission.recommendedReasonFa ?? mission.subtitleFa) && (
          <div style={{
            fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 8,
          }}>
            {mission.recommendedReasonFa ?? mission.subtitleFa}
          </div>
        )}

        {/* Progress bar */}
        {progressPct > 0 && (
          <div style={{
            height: 4, borderRadius: 3,
            background: "rgba(255,255,255,0.08)", overflow: "hidden",
          }}>
            <div style={{
              width: `${progressPct}%`, height: "100%", borderRadius: 3,
              background: isCompleted
                ? "linear-gradient(90deg, #facc15, #fbbf24)"
                : `linear-gradient(90deg, ${cat.color}, ${cat.color}cc)`,
              transition: "width 0.6s ease",
            }} />
          </div>
        )}
      </div>
    </Link>
  );
}

function QuickLinks() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const living = useGameStore((s) => s.living);
  const checking = useGameStore((s) => s.bank.checking);
  const { total } = calculateWeeklyBills(
    living.housingId, living.vehicleId, living.mobilePlanId, living.isOwned,
  );

  const links = [
    {
      href: "/bank", emoji: "🏦", label: "بانک",
      value: mounted ? formatMoney(checking) : "...", color: "#4ade80",
    },
    {
      href: "/living", emoji: "📋", label: "قبوض هفتگی",
      value: mounted ? formatMoney(total) : "...", color: "#f87171",
    },
    {
      href: "/market", emoji: "🏪", label: "جمعه‌بازار",
      value: "خرید و فروش", color: "#fbbf24",
    },
    {
      href: "/fridge", emoji: "❄️", label: "یخچال",
      value: "خوراکی‌ها", color: "#38bdf8",
    },
  ];

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(2, 1fr)",
      gap: 8,
      padding: "0 4px",
    }}>
      {links.map((link) => (
        <Link key={link.href} href={link.href} style={{
          textDecoration: "none",
          padding: "10px 12px", borderRadius: 16,
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.06)",
          display: "flex", alignItems: "center", gap: 8,
          transition: "transform 0.15s ease",
        }}>
          <span style={{ fontSize: 18 }}>{link.emoji}</span>
          <div>
            <div style={{ fontSize: 9, fontWeight: 600, color: "rgba(255,255,255,0.3)" }}>{link.label}</div>
            <div style={{ fontSize: 11, fontWeight: 800, color: link.color }}>
              {link.value}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
