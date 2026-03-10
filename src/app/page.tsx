"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import GameHUD from "@/components/home/GameHUD";
import CharacterStage from "@/components/home/CharacterStage";
import StoryBubble from "@/components/home/StoryBubble";
import RoomObjects from "@/components/home/RoomObjects";
import ActionBottomSheet from "@/components/home/ActionBottomSheet";
import LeisureButton from "@/components/home/LeisureButton";
import CityMiniMap from "@/components/home/CityMiniMap";
import OnboardingSetup from "@/components/onboarding/OnboardingSetup";
import OnboardingStory from "@/components/onboarding/OnboardingStory";
import OnboardingFirstWin from "@/components/onboarding/OnboardingFirstWin";
import OnboardingGift from "@/components/onboarding/OnboardingGift";
import OnboardingNextStep from "@/components/onboarding/OnboardingNextStep";
import DailyHookCard from "@/components/home/DailyHookCard";
import StreakCard from "@/components/home/StreakCard";
import CityNewsCard from "@/components/home/CityNewsCard";
import EndOfDaySummary from "@/components/home/EndOfDaySummary";
import DailyCardModal from "@/components/home/DailyCardModal";
import RoomShop from "@/components/home/RoomShop";
import PhoneCommerceSheet from "@/components/commerce/PhoneCommerceSheet";
import JomehBazaarSheet from "@/components/commerce/JomehBazaarSheet";
import BottomNav from "@/components/layout/BottomNav";
import { useGameStore } from "@/stores/gameStore";
import { getRoomTier } from "@/data/roomItems";
import { useMissionStore } from "@/game/missions/store";
import { getMissionProgressPercent } from "@/game/missions/progress";
import { toPersian, formatMoney } from "@/data/mock";

export default function HomePage() {
  const [done, setDone] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [showEndOfDay, setShowEndOfDay] = useState(false);
  const [showDailyCard, setShowDailyCard] = useState(false);
  const [showRoomShop, setShowRoomShop] = useState(false);
  const [showPhone, setShowPhone] = useState(false);
  const [showBazaar, setShowBazaar] = useState(false);
  const roomItems       = useGameStore((s) => s.roomItems ?? []);
  const startNextDay    = useGameStore((s) => s.startNextDay);
  const todayCard       = useGameStore((s) => s.todayCard);
  const cardShielded    = useGameStore((s) => s.cardShielded);
  const tutorialStep    = useGameStore((s) => s.tutorialStep);
  const playerGoal      = useGameStore((s) => s.playerGoal);
  const setTutorialStep = useGameStore((s) => s.setTutorialStep);

  const handleStartNextDay = () => {
    startNextDay();
    setShowEndOfDay(false);
    setShowDailyCard(true);
  };

  const handleDone = (id: string) => {
    setDone((prev) => (prev.includes(id) ? prev : [...prev, id]));
    if (id === "work" && tutorialStep === 2) {
      setTutorialStep(3);
    }
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
        paddingTop: 90,
        paddingBottom: "calc(var(--nav-h) + 24px)",
        paddingLeft: 14,
        paddingRight: 14,
        position: "relative",
        zIndex: 2,
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}>
        {/* 1. Character — compact card */}
        <CharacterStage doneCount={done.length} />

        {/* Goal reminder — shown after onboarding */}
        <GoalReminder />

        {/* 2. Delivery status — only when pending */}
        <DeliveryWidget />

        {/* 3. Streak card */}
        <StreakCard />

        {/* 4. Daily hook — today's reward, mission, city signal, deals */}
        <DailyHookCard />

        {/* 5. City news — wave headline, active events, sector bars */}
        <CityNewsCard />

        {/* 4. Mission of the day */}
        <div>
          <SectionDivider label="🎯 ماموریت" />
          <div style={{ marginTop: 10 }}>
            <RecommendedMissionBanner />
          </div>
        </div>

        {/* 4. Room — header + grid */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <span style={{ fontSize: 11, fontWeight: 800, color: "rgba(255,255,255,0.35)" }}>🏠 اتاق</span>
            {roomItems.length > 0 && (
              <span style={{ fontSize: 10, fontWeight: 700, color: getRoomTier(roomItems.length).color }}>
                {getRoomTier(roomItems.length).nameFa}
              </span>
            )}
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.05)" }} />
            <button
              onClick={() => setShowRoomShop(true)}
              style={{
                fontSize: 10, fontWeight: 800, padding: "4px 12px", borderRadius: 10,
                background: "rgba(99,102,241,0.1)", color: "#818cf8",
                border: "1px solid rgba(99,102,241,0.2)",
                cursor: "pointer", fontFamily: "inherit",
              }}
            >
              🛒 ارتقاء
            </button>
          </div>
          <RoomObjects done={done} onOpenAction={handleOpenAction} onEndDay={() => setShowEndOfDay(true)} />
        </div>

        {/* 5. Main CTA — leisure / random action */}
        <LeisureButton />

        {/* 6. City — mini map */}
        <div>
          <SectionDivider label="🌆 وضعیت شهر" />
          <div style={{ marginTop: 10 }}>
            <CityMiniMap />
          </div>
        </div>

        {/* 7. Quick access — grouped categories */}
        <div>
          <SectionDivider label="⚡ دسترسی سریع" />
          <div style={{ marginTop: 10 }}>
            <QuickLinks onOpenPhone={() => setShowPhone(true)} onOpenBazaar={() => setShowBazaar(true)} />
          </div>
        </div>
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

      {/* Room Shop */}
      <RoomShop isOpen={showRoomShop} onClose={() => setShowRoomShop(false)} />

      {/* Commerce Sheets */}
      <PhoneCommerceSheet isOpen={showPhone} onClose={() => setShowPhone(false)} />
      <JomehBazaarSheet isOpen={showBazaar} onClose={() => setShowBazaar(false)} />

      <BottomNav />

      {/* ── Onboarding overlays ── */}
      {tutorialStep === 0 && <OnboardingSetup />}
      {tutorialStep === 1 && <OnboardingStory />}
      {tutorialStep === 3 && <OnboardingFirstWin earnedAmount={0} />}
      {tutorialStep === 4 && <OnboardingGift />}
      {tutorialStep === 5 && (
        <OnboardingNextStep
          onOpenAction={handleOpenAction}
          onOpenBazaar={() => setShowBazaar(true)}
        />
      )}
    </div>
  );
}

const GOAL_META: Record<string, { emoji: string; label: string; color: string }> = {
  developer:   { emoji: "💻", label: "برنامه‌نویس موفق", color: "#a78bfa" },
  rich:        { emoji: "💰", label: "پولدار شدن",        color: "#facc15" },
  house:       { emoji: "🏠", label: "خرید خانه",         color: "#34d399" },
  comfortable: { emoji: "🌍", label: "زندگی راحت",        color: "#60a5fa" },
};

function GoalReminder() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const tutorialStep = useGameStore((s) => s.tutorialStep);
  const playerGoal   = useGameStore((s) => s.playerGoal);

  if (!mounted || tutorialStep !== -1 || !playerGoal) return null;

  const meta = GOAL_META[playerGoal];
  if (!meta) return null;

  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 6,
      padding: "5px 10px", borderRadius: 12,
      background: `${meta.color}0D`,
      border: `1px solid ${meta.color}20`,
      alignSelf: "flex-start",
    }}>
      <span style={{ fontSize: 12 }}>{meta.emoji}</span>
      <span style={{ fontSize: 10, fontWeight: 700, color: meta.color }}>
        هدف: {meta.label}
      </span>
    </div>
  );
}

function DeliveryWidget() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const pending = useGameStore((s) => s.pendingDeliveries ?? []);
  const dayInGame = useGameStore((s) => s.player.dayInGame);

  if (!mounted || pending.length === 0) return null;

  const next = pending.reduce((a, b) => a.deliverOnDay < b.deliverOnDay ? a : b);
  const daysLeft = Math.max(0, next.deliverOnDay - dayInGame);

  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 10,
      padding: "10px 14px", borderRadius: 16,
      background: "rgba(245,158,11,0.07)",
      border: "1px solid rgba(245,158,11,0.18)",
    }}>
      <span style={{ fontSize: 20 }}>📦</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 12, fontWeight: 800, color: "#f59e0b" }}>
          {toPersian(pending.length)} سفارش در راه
        </div>
        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", marginTop: 1 }}>
          {daysLeft === 0 ? "تحویل امروز!" : `نزدیک‌ترین: ${toPersian(daysLeft)} روز دیگر`}
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 2, alignItems: "flex-end" }}>
        {pending.slice(0, 2).map((d, i) => (
          <span key={i} style={{
            fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.4)",
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 90,
          }}>
            {d.nameFa}
          </span>
        ))}
      </div>
    </div>
  );
}

function SectionDivider({ label }: { label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <span style={{ fontSize: 11, fontWeight: 800, color: "rgba(255,255,255,0.35)" }}>{label}</span>
      <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.05)" }} />
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
            marginBottom: 8,
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

        {/* Reward + CTA */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {mission.rewards?.money ? (
            <span style={{ fontSize: 11, fontWeight: 800, color: "#facc15" }}>
              💰 پاداش: {formatMoney(mission.rewards.money)}
            </span>
          ) : <span />}
          <span style={{
            fontSize: 10, fontWeight: 800,
            color: isCompleted ? "#facc15" : cat.color,
            background: isCompleted ? "rgba(250,204,21,0.12)" : `${cat.color}15`,
            border: `1px solid ${isCompleted ? "rgba(250,204,21,0.25)" : `${cat.color}30`}`,
            borderRadius: 10, padding: "3px 10px",
          }}>
            {isCompleted ? "دریافت جایزه ←" : "شروع ماموریت ←"}
          </span>
        </div>
      </div>
    </Link>
  );
}

function QuickLinks({
  onOpenPhone,
  onOpenBazaar,
}: {
  onOpenPhone: () => void;
  onOpenBazaar: () => void;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const pendingCount = useGameStore((s) => (s.pendingDeliveries ?? []).length);

  const tileStyle: React.CSSProperties = {
    display: "flex", flexDirection: "column",
    alignItems: "center", justifyContent: "center",
    gap: 5, padding: "12px 6px",
    borderRadius: 16, textDecoration: "none",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.07)",
    cursor: "pointer", fontFamily: "inherit",
    position: "relative",
  };

  function Tile({ emoji, label, color, bg, href, onClick, badge }: {
    emoji: string; label: string; color: string; bg: string;
    href?: string; onClick?: () => void; badge?: string;
  }) {
    const inner = (
      <>
        {badge && (
          <div style={{
            position: "absolute", top: 5, left: 5,
            minWidth: 14, height: 14, borderRadius: 7,
            background: "#ef4444",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 7, fontWeight: 900, color: "white",
          }}>
            {badge}
          </div>
        )}
        <span style={{ fontSize: 20 }}>{emoji}</span>
        <span style={{ fontSize: 9, fontWeight: 700, color, textAlign: "center", lineHeight: 1.2 }}>
          {label}
        </span>
      </>
    );
    if (onClick) return <button onClick={onClick} style={{ ...tileStyle, background: bg }}>{inner}</button>;
    return <Link href={href!} style={{ ...tileStyle, background: bg }}>{inner}</Link>;
  }

  const categories = [
    {
      label: "خرید",
      tiles: [
        { emoji: "🧺", label: "جمعه‌بازار", color: "#fb923c", bg: "rgba(251,146,60,0.08)", onClick: onOpenBazaar },
        { emoji: "📱", label: "سفارش آنلاین", color: "#60a5fa", bg: "rgba(96,165,250,0.08)", onClick: onOpenPhone, badge: mounted && pendingCount > 0 ? toPersian(pendingCount) : undefined },
        { emoji: "❄️", label: "یخچال", color: "#22d3ee", bg: "rgba(34,211,238,0.08)", href: "/fridge" },
      ],
    },
    {
      label: "کار و مهارت",
      tiles: [
        { emoji: "🏢", label: "بازار کار", color: "#4ade80", bg: "rgba(74,222,128,0.08)", href: "/jobs" },
        { emoji: "📚", label: "مهارت‌ها", color: "#a78bfa", bg: "rgba(167,139,250,0.08)", href: "/skills" },
        { emoji: "🎯", label: "ماموریت‌ها", color: "#f472b6", bg: "rgba(244,114,182,0.08)", href: "/missions" },
      ],
    },
    {
      label: "سرمایه",
      tiles: [
        { emoji: "🏦", label: "بانک", color: "#f59e0b", bg: "rgba(245,158,11,0.08)", href: "/bank" },
        { emoji: "📊", label: "بورس", color: "#34d399", bg: "rgba(52,211,153,0.08)", href: "/stocks" },
        { emoji: "🌆", label: "شهر", color: "#818cf8", bg: "rgba(129,140,248,0.08)", href: "/city" },
      ],
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {categories.map((cat) => (
        <div key={cat.label}>
          <div style={{ fontSize: 9, fontWeight: 800, color: "rgba(255,255,255,0.25)", marginBottom: 6 }}>
            {cat.label}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
            {cat.tiles.map((tile, i) => (
              <Tile key={i} {...tile} badge={tile.badge ?? undefined} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
