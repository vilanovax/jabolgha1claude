"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGameStore } from "@/stores/gameStore";
import { useOpportunityStore } from "@/game/opportunities/store";
import { toPersian } from "@/data/mock";
import { FRIDGE_TIERS } from "@/data/fridgeData";

interface RoomState {
  energy: number;
  hunger: number;
  happiness: number;
  health: number;
  activeCourseDay?: number;
  fridgeCount: number;
  fridgeSlots: number;
  actionsToday: string[];
  oppCount: number;
  actionsCount: number;
}

interface RoomObject {
  id: string;
  emoji: string;
  label: string;
  getHint: (done: string[], state: RoomState) => string;
  getWarn: (done: string[], state: RoomState) => boolean;
  getBadge?: (state: RoomState) => string | null;
  actionCategory?: string;
  glowColor: string;
  navigateTo?: string;
  onSpecial?: "endDay";
}

const OBJECTS: RoomObject[] = [
  {
    id: "work",
    emoji: "💻",
    label: "لپ‌تاپ",
    getHint: (done) => done.includes("work") ? "✅ کار شد" : "شیفت انجام نشده",
    getWarn: (done) => !done.includes("work"),
    actionCategory: "work",
    glowColor: "rgba(212,168,67,0.4)",
  },
  {
    id: "phone",
    emoji: "📱",
    label: "موبایل",
    getHint: (_done, state) =>
      state.oppCount > 0
        ? `${toPersian(state.oppCount)} فرصت!`
        : "فرصت‌ها",
    getWarn: (_done, state) => state.oppCount > 0,
    getBadge: (_state) => null, // badge is handled by oppCount warn+glow
    actionCategory: undefined,
    glowColor: "rgba(99,102,241,0.45)",
    navigateTo: "/opportunities",
  },
  {
    id: "study",
    emoji: "📚",
    label: "کتابخانه",
    getHint: (_done, state) =>
      state.activeCourseDay ? `روز ${toPersian(state.activeCourseDay)}` : "ثبت‌نام کن",
    getWarn: () => false,
    actionCategory: "study",
    glowColor: "rgba(59,130,246,0.4)",
    navigateTo: "/skills",
  },
  {
    id: "exercise",
    emoji: "🏋️",
    label: "باشگاه",
    getHint: (done) => done.includes("exercise") ? "✅ ورزش شد" : "ورزش نکردی",
    getWarn: () => false,
    actionCategory: "exercise",
    glowColor: "rgba(34,197,94,0.4)",
  },
  {
    id: "fridge",
    emoji: "❄️",
    label: "یخچال",
    getHint: (_done, state) => {
      if (state.hunger < 30) return `گرسنه! ${toPersian(state.hunger)}٪`;
      return `${toPersian(state.fridgeCount)}/${toPersian(state.fridgeSlots)} جا`;
    },
    getWarn: (_done, state) => state.hunger < 30 || state.fridgeCount === 0,
    actionCategory: undefined,
    glowColor: "rgba(56,189,248,0.4)",
    navigateTo: "/fridge",
  },
  {
    id: "bed",
    emoji: "🛏️",
    label: "تخت",
    getHint: (_done, state) => {
      if (state.actionsCount === 0) return "روز تازه‌ست";
      return `${toPersian(state.actionsCount)} اکشن امروز`;
    },
    getWarn: (_done, state) => state.actionsCount >= 4,
    actionCategory: undefined,
    glowColor: "rgba(139,92,246,0.4)",
    onSpecial: "endDay",
  },
];

// ─── Opportunity badge dot ───────────────────────────────────────────────────
function OpportunityDot({ count }: { count: number }) {
  if (count === 0) return null;
  return (
    <div
      style={{
        position: "absolute",
        top: 6,
        left: 6,
        minWidth: 18,
        height: 18,
        borderRadius: 9,
        background: "linear-gradient(135deg, #818cf8, #6366f1)",
        border: "2px solid rgba(10,14,39,0.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 8,
        fontWeight: 900,
        color: "white",
        boxShadow: "0 0 10px rgba(99,102,241,0.6)",
        animation: "anim-badge-bounce 1.5s ease-in-out infinite",
        zIndex: 3,
      }}
    >
      {toPersian(count)}
    </div>
  );
}

// ─── RoomObjects ─────────────────────────────────────────────────────────────
export default function RoomObjects({
  done,
  onOpenAction,
  onEndDay,
}: {
  done: string[];
  onOpenAction: (categoryId: string) => void;
  onEndDay: () => void;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const router = useRouter();

  const energy      = useGameStore((s) => s.player.energy);
  const hunger      = useGameStore((s) => s.player.hunger);
  const happiness   = useGameStore((s) => s.player.happiness);
  const health      = useGameStore((s) => s.player.health ?? 80);
  const activeCourse = useGameStore((s) => s.activeCourse);
  const fridge      = useGameStore((s) => s.fridge);
  const actionsToday = useGameStore((s) => s.actionsCompletedToday);

  // Opportunity count (with mounted guard)
  const dayInGame   = useGameStore((s) => s.player.dayInGame);
  const getVisible  = useOpportunityStore((s) => s.getVisible);
  const oppCount    = mounted ? getVisible(dayInGame).length : 0;

  const currentTier = FRIDGE_TIERS.find((t) => t.id === fridge.tierId);

  const stateInfo: RoomState = {
    energy,
    hunger,
    happiness,
    health,
    activeCourseDay: activeCourse?.currentDay,
    fridgeCount: fridge.items.length,
    fridgeSlots: currentTier?.slots ?? 4,
    actionsToday,
    oppCount,
    actionsCount: actionsToday.length,
  };

  const handleTap = (obj: RoomObject) => {
    if (obj.onSpecial === "endDay") {
      onEndDay();
      return;
    }
    if (obj.navigateTo) {
      router.push(obj.navigateTo);
      return;
    }
    if (obj.actionCategory) {
      onOpenAction(obj.actionCategory);
    }
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: 10,
      }}
    >
      {OBJECTS.map((obj) => {
        const hint   = obj.getHint(done, stateInfo);
        const warn   = obj.getWarn(done, stateInfo);
        const isDone = hint.startsWith("✅");
        const isPhone = obj.id === "phone";
        const isBed   = obj.id === "bed";

        // Bed glows more when day is advanced
        const bedGlow = isBed && stateInfo.actionsCount >= 4;

        // Phone pulses when opportunities exist
        const phonePulse = isPhone && oppCount > 0;

        const labelColor = isDone
          ? "#4ade80"
          : phonePulse
            ? "#818cf8"
            : bedGlow
              ? "#a78bfa"
              : "rgba(255,255,255,0.75)";

        const hintColor = isDone
          ? "#4ade80"
          : phonePulse
            ? "#818cf8"
            : warn && !isPhone
              ? "#f87171"
              : "rgba(255,255,255,0.32)";

        return (
          <button
            key={obj.id}
            className={phonePulse ? "room-warn-pulse" : warn && !isPhone ? "room-warn-pulse" : ""}
            onClick={() => handleTap(obj)}
            style={{
              cursor: "pointer",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 12,
              height: 110,
              padding: "12px 14px",
              borderRadius: 20,
              background: isDone
                ? "rgba(74,222,128,0.06)"
                : phonePulse
                  ? "rgba(99,102,241,0.08)"
                  : bedGlow
                    ? "rgba(139,92,246,0.08)"
                    : warn && !isPhone
                      ? "rgba(239,68,68,0.06)"
                      : "rgba(255,255,255,0.04)",
              border: isDone
                ? "1px solid rgba(74,222,128,0.15)"
                : phonePulse
                  ? "1.5px solid rgba(99,102,241,0.3)"
                  : bedGlow
                    ? "1.5px solid rgba(139,92,246,0.25)"
                    : warn && !isPhone
                      ? "1.5px solid rgba(239,68,68,0.2)"
                      : "1px solid rgba(255,255,255,0.06)",
              fontFamily: "inherit",
              position: "relative",
              overflow: "visible",
              transition: "all 0.2s ease",
              textAlign: "right",
            }}
          >
            {/* Opportunity badge on phone */}
            {isPhone && mounted && <OpportunityDot count={oppCount} />}

            {/* Icon */}
            <div
              className={
                phonePulse
                  ? "icon-warn-bounce"
                  : bedGlow
                    ? "anim-breathe"
                    : warn && !isPhone
                      ? "icon-warn-bounce"
                      : "icon-idle-float"
              }
              style={{
                fontSize: 34,
                lineHeight: 1,
                filter: `drop-shadow(0 3px 12px ${obj.glowColor})`,
                flexShrink: 0,
              }}
            >
              {obj.emoji}
            </div>

            {/* Text block */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4, minWidth: 0 }}>
              <div style={{
                fontSize: 14, fontWeight: 800, color: labelColor,
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              }}>
                {obj.label}
              </div>
              <div style={{
                fontSize: 11, fontWeight: 600, color: hintColor,
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              }}>
                {hint}
              </div>
              {/* Done indicator bar */}
              {isDone && (
                <div style={{
                  height: 3, borderRadius: 2,
                  background: "linear-gradient(90deg, #4ade80, #22c55e)",
                  width: "60%",
                }} />
              )}
            </div>

            {/* Arrow chevron */}
            <span style={{ fontSize: 10, color: "rgba(255,255,255,0.15)", flexShrink: 0 }}>›</span>
          </button>
        );
      })}
    </div>
  );
}
