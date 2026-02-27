"use client";
import { player, activeCourse, fridgeItems, toPersian } from "@/data/mock";

interface RoomObject {
  id: string;
  emoji: string;
  label: string;
  getStatus: (done: string[]) => string;
  actionCategory: string;
  glowColor: string;
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
    id: "bookshelf",
    emoji: "📚",
    label: "قفسه کتاب",
    getStatus: () =>
      activeCourse ? `روز ${toPersian(activeCourse.currentDay)}` : "—",
    actionCategory: "study",
    glowColor: "rgba(59,130,246,0.3)",
  },
  {
    id: "kitchen",
    emoji: "🍳",
    label: "آشپزخانه",
    getStatus: () => `${toPersian(fridgeItems.length)} آیتم`,
    actionCategory: "eat",
    glowColor: "rgba(249,115,22,0.3)",
  },
  {
    id: "bed",
    emoji: "🛏",
    label: "تخت",
    getStatus: () => `${toPersian(player.energy)}٪`,
    actionCategory: "sleep",
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
    id: "sofa",
    emoji: "☕",
    label: "مبل",
    getStatus: (done) => done.includes("rest") ? "✅" : "آرام",
    actionCategory: "rest",
    glowColor: "rgba(236,72,153,0.3)",
  },
];

export default function RoomObjects({
  done,
  onOpenAction,
}: {
  done: string[];
  onOpenAction: (categoryId: string) => void;
}) {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: 12,
      padding: "4px 8px",
    }}>
      {OBJECTS.map((obj) => {
        const status = obj.getStatus(done);

        return (
          <div
            key={obj.id}
            className="room-object"
            onClick={() => onOpenAction(obj.actionCategory)}
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
