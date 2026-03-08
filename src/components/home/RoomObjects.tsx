"use client";
import { useRouter } from "next/navigation";
import { useGameStore } from "@/stores/gameStore";
import { toPersian } from "@/data/mock";
import { FRIDGE_TIERS } from "@/data/fridgeData";

interface RoomState {
  energy: number;
  activeCourseDay?: number;
  fridgeCount: number;
  fridgeSlots: number;
}

interface RoomObject {
  id: string;
  emoji: string;
  label: string;
  getStatus: (done: string[], state: RoomState) => string;
  actionCategory: string;
  glowColor: string;
  navigateTo?: string;
}

const OBJECTS: RoomObject[] = [
  {
    id: "desk",
    emoji: "🖥",
    label: "میز کار",
    getStatus: (done) => done.includes("work") ? "✅" : "شیفت",
    actionCategory: "work",
    glowColor: "rgba(212,168,67,0.3)",
  },
  {
    id: "courses",
    emoji: "📚",
    label: "دوره‌ها",
    getStatus: (_done, state) =>
      state.activeCourseDay ? `روز ${toPersian(state.activeCourseDay)}` : "ثبت‌نام",
    actionCategory: "study",
    glowColor: "rgba(59,130,246,0.3)",
    navigateTo: "/skills",
  },
  {
    id: "library",
    emoji: "📖",
    label: "کتابخانه",
    getStatus: (done) => done.includes("library") ? "✅" : "مطالعه",
    actionCategory: "library",
    glowColor: "rgba(249,115,22,0.3)",
  },
  {
    id: "rest",
    emoji: "🛋️",
    label: "استراحت",
    getStatus: (done, state) => done.includes("rest") ? "✅" : `${toPersian(state.energy)}٪`,
    actionCategory: "rest",
    glowColor: "rgba(139,92,246,0.3)",
  },
  {
    id: "gym",
    emoji: "🏋️",
    label: "باشگاه",
    getStatus: (done) => done.includes("exercise") ? "✅" : "ورزش",
    actionCategory: "exercise",
    glowColor: "rgba(34,197,94,0.3)",
  },
  {
    id: "fridge",
    emoji: "🍳",
    label: "یخچال",
    getStatus: (_done, state) => `${toPersian(state.fridgeCount)}/${toPersian(state.fridgeSlots)}`,
    actionCategory: "fridge",
    glowColor: "rgba(249,115,22,0.3)",
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
  const activeCourse = useGameStore((s) => s.activeCourse);
  const fridge = useGameStore((s) => s.fridge);

  const currentTier = FRIDGE_TIERS.find((t) => t.id === fridge.tierId);

  const stateInfo: RoomState = {
    energy,
    activeCourseDay: activeCourse?.currentDay,
    fridgeCount: fridge.items.length,
    fridgeSlots: currentTier?.slots ?? 4,
  };

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: 12,
      padding: "4px 8px",
    }}>
      {OBJECTS.map((obj) => {
        const status = obj.getStatus(done, stateInfo);

        return (
          <div
            key={obj.id}
            className="room-object"
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
              gap: 4,
              padding: "14px 8px 10px",
              borderRadius: 20,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            {/* Icon with glow */}
            <div style={{
              fontSize: 36,
              lineHeight: 1,
              filter: `drop-shadow(0 3px 10px ${obj.glowColor})`,
              marginBottom: 2,
            }}>
              {obj.emoji}
            </div>

            {/* Label */}
            <div style={{
              fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.6)",
            }}>
              {obj.label}
            </div>

            {/* Status */}
            <div style={{
              fontSize: 9, fontWeight: 600,
              color: status === "✅" ? "#4ade80" : "rgba(255,255,255,0.3)",
            }}>
              {status}
            </div>
          </div>
        );
      })}
    </div>
  );
}
