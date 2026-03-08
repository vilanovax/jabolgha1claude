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
      }}>
        <CharacterStage doneCount={done.length} />
        <StoryBubble />
        <HeroActionButton done={done} onOpenAction={handleOpenAction} />
        <RoomObjects done={done} onOpenAction={handleOpenAction} />

        {/* Leisure: do something fun */}
        <LeisureButton />

        {/* Quick links */}
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

  return (
    <div style={{
      display: "flex", gap: 8, marginTop: 12,
      padding: "0 4px",
    }}>
      <Link href="/bank" style={{
        flex: 1, textDecoration: "none",
        padding: "10px 12px", borderRadius: 16,
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.06)",
        display: "flex", alignItems: "center", gap: 8,
      }}>
        <span style={{ fontSize: 18 }}>🏦</span>
        <div>
          <div style={{ fontSize: 9, fontWeight: 600, color: "rgba(255,255,255,0.3)" }}>بانک</div>
          <div style={{ fontSize: 11, fontWeight: 800, color: "#4ade80" }}>
            {formatMoney(checking)}
          </div>
        </div>
      </Link>
      <Link href="/living" style={{
        flex: 1, textDecoration: "none",
        padding: "10px 12px", borderRadius: 16,
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.06)",
        display: "flex", alignItems: "center", gap: 8,
      }}>
        <span style={{ fontSize: 18 }}>📋</span>
        <div>
          <div style={{ fontSize: 9, fontWeight: 600, color: "rgba(255,255,255,0.3)" }}>قبوض هفتگی</div>
          <div style={{ fontSize: 11, fontWeight: 800, color: "#f87171" }}>
            {formatMoney(total)}
          </div>
        </div>
      </Link>
      <Link href="/market" style={{
        flex: 1, textDecoration: "none",
        padding: "10px 12px", borderRadius: 16,
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.06)",
        display: "flex", alignItems: "center", gap: 8,
      }}>
        <span style={{ fontSize: 18 }}>🏪</span>
        <div>
          <div style={{ fontSize: 9, fontWeight: 600, color: "rgba(255,255,255,0.3)" }}>جمعه‌بازار</div>
          <div style={{ fontSize: 11, fontWeight: 800, color: "#fbbf24" }}>
            خرید و فروش
          </div>
        </div>
      </Link>
    </div>
  );
}
