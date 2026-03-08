"use client";
import { useState } from "react";
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
import { formatMoney } from "@/data/mock";
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
        <StoryBubble />

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

function QuickLinks() {
  const living = useGameStore((s) => s.living);
  const checking = useGameStore((s) => s.bank.checking);
  const { total } = calculateWeeklyBills(
    living.housingId, living.vehicleId, living.mobilePlanId, living.isOwned,
  );

  const links = [
    {
      href: "/bank", emoji: "🏦", label: "بانک",
      value: formatMoney(checking), color: "#4ade80",
    },
    {
      href: "/living", emoji: "📋", label: "قبوض هفتگی",
      value: formatMoney(total), color: "#f87171",
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
