"use client";
import { useRouter } from "next/navigation";
import { useGameStore } from "@/stores/gameStore";
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
}

interface RoomObject {
  id: string;
  emoji: string;
  label: string;
  getHint: (done: string[], state: RoomState) => string;
  getWarn: (done: string[], state: RoomState) => boolean;
  actionCategory: string;
  glowColor: string;
  navigateTo?: string;
}

const OBJECTS: RoomObject[] = [
  {
    id: "eat",
    emoji: "🍳",
    label: "بخور",
    getHint: (_done, state) => {
      if (state.hunger < 30) return `گرسنه‌ای! ${toPersian(state.hunger)}٪`;
      if (state.hunger < 50) return `گرسنگی ${toPersian(state.hunger)}٪`;
      return `سیری ${toPersian(state.hunger)}٪`;
    },
    getWarn: (_done, state) => state.hunger < 35,
    actionCategory: "eat",
    glowColor: "rgba(249,115,22,0.4)",
  },
  {
    id: "work",
    emoji: "💻",
    label: "کار",
    getHint: (done) => done.includes("work") ? "✅ انجام شد" : "شیفت انجام نشده",
    getWarn: (done) => !done.includes("work"),
    actionCategory: "work",
    glowColor: "rgba(212,168,67,0.4)",
  },
  {
    id: "exercise",
    emoji: "🏋️",
    label: "ورزش",
    getHint: (done) => done.includes("exercise") ? "✅ انجام شد" : "ورزش نکردی",
    getWarn: () => false,
    actionCategory: "exercise",
    glowColor: "rgba(34,197,94,0.4)",
  },
  {
    id: "study",
    emoji: "📚",
    label: "مطالعه",
    getHint: (_done, state) =>
      state.activeCourseDay ? `روز ${toPersian(state.activeCourseDay)}` : "ثبت‌نام کن",
    getWarn: () => false,
    actionCategory: "study",
    glowColor: "rgba(59,130,246,0.4)",
    navigateTo: "/skills",
  },
  {
    id: "rest",
    emoji: "🛋️",
    label: "استراحت",
    getHint: (_done, state) => {
      if (state.energy < 30) return `خسته‌ای! ${toPersian(state.energy)}٪`;
      return `انرژی ${toPersian(state.energy)}٪`;
    },
    getWarn: (_done, state) => state.energy < 30,
    actionCategory: "rest",
    glowColor: "rgba(139,92,246,0.4)",
  },
  {
    id: "fridge",
    emoji: "❄️",
    label: "یخچال",
    getHint: (_done, state) => `${toPersian(state.fridgeCount)}/${toPersian(state.fridgeSlots)} جا`,
    getWarn: (_done, state) => state.fridgeCount === 0,
    actionCategory: "fridge",
    glowColor: "rgba(56,189,248,0.4)",
    navigateTo: "/fridge",
  },
];

export default function RoomObjects({
  done,
  onOpenAction,
}: {
  done: string[];
  onOpenAction: (categoryId: string) => void;
}) {
  const router = useRouter();
  const energy = useGameStore((s) => s.player.energy);
  const hunger = useGameStore((s) => s.player.hunger);
  const happiness = useGameStore((s) => s.player.happiness);
  const health = useGameStore((s) => s.player.health ?? 80);
  const activeCourse = useGameStore((s) => s.activeCourse);
  const fridge = useGameStore((s) => s.fridge);
  const actionsToday = useGameStore((s) => s.actionsCompletedToday);

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
  };

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: 10,
      padding: "0 4px",
    }}>
      {OBJECTS.map((obj) => {
        const hint = obj.getHint(done, stateInfo);
        const warn = obj.getWarn(done, stateInfo);
        const isDone = hint.startsWith("✅");

        return (
          <button
            key={obj.id}
            className={`room-object-btn ${warn ? "room-warn-pulse" : ""}`}
            onClick={() => {
              if (obj.navigateTo) {
                router.push(obj.navigateTo);
              } else {
                onOpenAction(obj.actionCategory);
              }
            }}
            style={{
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 3,
              padding: "14px 8px 10px",
              borderRadius: 20,
              background: isDone
                ? "rgba(74,222,128,0.06)"
                : warn
                  ? "rgba(239,68,68,0.06)"
                  : "rgba(255,255,255,0.04)",
              border: isDone
                ? "1px solid rgba(74,222,128,0.15)"
                : warn
                  ? "1.5px solid rgba(239,68,68,0.2)"
                  : "1px solid rgba(255,255,255,0.06)",
              fontFamily: "inherit",
              position: "relative",
              overflow: "hidden",
              transition: "all 0.2s ease",
            }}
          >
            {/* Icon with glow */}
            <div className={warn ? "icon-warn-bounce" : "icon-idle-float"} style={{
              fontSize: 32,
              lineHeight: 1,
              filter: `drop-shadow(0 3px 12px ${obj.glowColor})`,
              marginBottom: 2,
            }}>
              {obj.emoji}
            </div>

            {/* Label */}
            <div style={{
              fontSize: 11, fontWeight: 700,
              color: isDone ? "#4ade80" : "rgba(255,255,255,0.6)",
            }}>
              {obj.label}
            </div>

            {/* Contextual hint */}
            <div style={{
              fontSize: 9, fontWeight: 600,
              color: isDone
                ? "#4ade80"
                : warn
                  ? "#f87171"
                  : "rgba(255,255,255,0.3)",
            }}>
              {hint}
            </div>
          </button>
        );
      })}
    </div>
  );
}
