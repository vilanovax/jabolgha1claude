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
import HomeOpportunityWidget from "@/components/opportunities/HomeOpportunityWidget";
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
import { formatMoney, toPersian } from "@/data/mock";
import { calculateWeeklyBills } from "@/data/livingCosts";

export default function HomePage() {
  const [done, setDone] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [showEndOfDay, setShowEndOfDay] = useState(false);
  const [showDailyCard, setShowDailyCard] = useState(false);
  const [showRoomShop, setShowRoomShop] = useState(false);
  const [showPhone, setShowPhone] = useState(false);
  const [showBazaar, setShowBazaar] = useState(false);

  const roomItems = useGameStore((s) => s.roomItems ?? []);
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

        {/* 3. Section label + room tier + shop button */}
        <div style={{ padding: "0 8px", display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 12, fontWeight: 800, color: "rgba(255,255,255,0.4)" }}>
            اتاق
          </span>
          {roomItems.length > 0 && (
            <span style={{
              fontSize: 9, fontWeight: 700,
              color: getRoomTier(roomItems.length).color,
              opacity: 0.8,
            }}>
              · {getRoomTier(roomItems.length).nameFa}
            </span>
          )}
          <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.06)" }} />
          <button
            onClick={() => setShowRoomShop(true)}
            style={{
              fontSize: 9, fontWeight: 800,
              padding: "3px 10px", borderRadius: 10,
              background: "rgba(99,102,241,0.1)",
              color: "#818cf8",
              border: "1px solid rgba(99,102,241,0.2)",
              cursor: "pointer", fontFamily: "inherit",
            }}
          >
            🛒 ارتقاء
          </button>
        </div>

        {/* 4. Room objects (scene interaction) */}
        <RoomObjects
          done={done}
          onOpenAction={handleOpenAction}
          onEndDay={() => setShowEndOfDay(true)}
        />

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

        {/* 8b. Opportunity widget */}
        <HomeOpportunityWidget />

        {/* 9. Quick access hub */}
        <div style={{ padding: "0 8px", display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
          <span style={{ fontSize: 13, fontWeight: 800, color: "rgba(255,255,255,0.5)" }}>دسترسی سریع</span>
          <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.06)" }} />
        </div>
        <QuickLinks onOpenPhone={() => setShowPhone(true)} onOpenBazaar={() => setShowBazaar(true)} />
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

function QuickLinks({
  onOpenPhone,
  onOpenBazaar,
}: {
  onOpenPhone: () => void;
  onOpenBazaar: () => void;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const living = useGameStore((s) => s.living);
  const checking = useGameStore((s) => s.bank.checking);
  const savings = useGameStore((s) => s.bank.savings);
  const pendingCount = useGameStore((s) => (s.pendingDeliveries ?? []).length);
  const { total } = calculateWeeklyBills(
    living.housingId, living.vehicleId, living.mobilePlanId, living.isOwned,
  );

  const navGroups = [
    {
      label: "💼 کار و مهارت",
      color: "#4ade80",
      links: [
        { href: "/jobs",   emoji: "🏢", label: "بازار کار",  value: "پیشنهادها" },
        { href: "/skills", emoji: "📚", label: "مهارت‌ها",   value: "آموزش" },
      ],
    },
    {
      label: "📈 سرمایه",
      color: "#f59e0b",
      links: [
        { href: "/bank",   emoji: "🏦", label: "حساب جاری",  value: mounted ? formatMoney(checking) : "..." },
        { href: "/bank",   emoji: "💰", label: "پس‌انداز",   value: mounted ? formatMoney(savings) : "..." },
        { href: "/stocks", emoji: "📊", label: "بورس",       value: "سهام و طلا" },
        { href: "/market", emoji: "🏪", label: "بازار",      value: "خرید و فروش" },
      ],
    },
    {
      label: "🌆 شهر و زندگی",
      color: "#fb923c",
      links: [
        { href: "/city",   emoji: "🏙️", label: "شهر",        value: "وضعیت اقتصاد" },
        { href: "/living", emoji: "📋", label: "قبوض",       value: mounted ? formatMoney(total) + "/هفته" : "..." },
        { href: "/fridge", emoji: "❄️", label: "یخچال",      value: "خوراکی‌ها" },
      ],
    },
  ];

  // Commerce button type
  type CommerceBtn = { isButton: true; onClick: () => void; emoji: string; label: string; value: string; badge?: string };
  type NavLink = { href: string; emoji: string; label: string; value: string };

  const commerceButtons: CommerceBtn[] = [
    {
      isButton: true,
      onClick: onOpenPhone,
      emoji: "📱",
      label: "گوشی",
      value: "سفارش آنلاین",
      badge: mounted && pendingCount > 0 ? `📦 ${toPersian(pendingCount)}` : undefined,
    },
    {
      isButton: true,
      onClick: onOpenBazaar,
      emoji: "🧺",
      label: "جمعه‌بازار",
      value: "خرید حضوری",
    },
  ];

  function renderLink(link: NavLink | CommerceBtn, color: string, i: number) {
    const content = (
      <>
        <span style={{ fontSize: 18 }}>{link.emoji}</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 9, fontWeight: 600, color: "rgba(255,255,255,0.3)" }}>{link.label}</div>
          <div style={{ fontSize: 11, fontWeight: 800, color }}>{link.value}</div>
        </div>
        {"badge" in link && link.badge && (
          <span style={{
            fontSize: "9px", fontWeight: 800,
            color: "#f59e0b",
            background: "rgba(245,158,11,0.12)",
            border: "1px solid rgba(245,158,11,0.2)",
            borderRadius: 8, padding: "1px 5px",
          }}>
            {link.badge}
          </span>
        )}
      </>
    );

    const sharedStyle: React.CSSProperties = {
      padding: "10px 12px", borderRadius: 14,
      background: "rgba(255,255,255,0.04)",
      border: "1px solid rgba(255,255,255,0.06)",
      display: "flex", alignItems: "center", gap: 8,
    };

    if ("isButton" in link) {
      return (
        <button
          key={i}
          onClick={link.onClick}
          style={{ ...sharedStyle, cursor: "pointer", fontFamily: "inherit", textAlign: "right" }}
        >
          {content}
        </button>
      );
    }

    return (
      <Link key={`${link.href}-${i}`} href={link.href} style={{ ...sharedStyle, textDecoration: "none" }}>
        {content}
      </Link>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14, padding: "0 4px" }}>
      {/* Commerce section */}
      <div>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#a3e635", marginBottom: 8, padding: "0 2px" }}>
          🛒 خرید و سفارش
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 7 }}>
          {commerceButtons.map((btn, i) => renderLink(btn, "#a3e635", i))}
        </div>
      </div>

      {/* Navigation groups */}
      {navGroups.map((group) => (
        <div key={group.label}>
          <div style={{ fontSize: 11, fontWeight: 700, color: group.color, marginBottom: 8, padding: "0 2px" }}>
            {group.label}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 7 }}>
            {group.links.map((link, i) => renderLink(link as NavLink, group.color, i))}
          </div>
        </div>
      ))}
    </div>
  );
}
