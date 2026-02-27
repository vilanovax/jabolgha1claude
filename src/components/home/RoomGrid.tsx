"use client";
import Link from "next/link";
import { player, activeCourse, fridgeItems } from "@/data/mock";

interface RoomTile {
  id: string;
  emoji: string;
  title: string;
  getStatus: (done: string[]) => string;
  href: string;
  accentColor: string;
}

const ROOMS: RoomTile[] = [
  {
    id: "desk",
    emoji: "🖥",
    title: "میز کار",
    getStatus: (done) =>
      done.includes("work") ? "امروز کار کردی ✅" : "شیفت امروز انجام نشده",
    href: "/jobs",
    accentColor: "#D4A843",
  },
  {
    id: "bookshelf",
    emoji: "📚",
    title: "قفسه کتاب",
    getStatus: () =>
      activeCourse
        ? `${activeCourse.name} – روز ${activeCourse.currentDay} از ${activeCourse.totalDays}`
        : "هیچ دوره فعالی نداری",
    href: "/skills",
    accentColor: "#3b82f6",
  },
  {
    id: "kitchen",
    emoji: "🍳",
    title: "آشپزخانه",
    getStatus: () => `یخچال: ${fridgeItems.length} آیتم آماده`,
    href: "/fridge",
    accentColor: "#f97316",
  },
  {
    id: "bed",
    emoji: "🛏",
    title: "تخت خواب",
    getStatus: () => `انرژی فعلی: ${player.energy}٪`,
    href: "#",
    accentColor: "#8b5cf6",
  },
  {
    id: "gym",
    emoji: "🏋️",
    title: "باشگاه",
    getStatus: (done) =>
      done.includes("exercise") ? "امروز ورزش کردی ✅" : "آخرین ورزش: ۲ روز پیش",
    href: "#",
    accentColor: "#22c55e",
  },
  {
    id: "sofa",
    emoji: "☕",
    title: "مبل",
    getStatus: (done) =>
      done.includes("rest")
        ? "استراحت کردی ✅"
        : player.energy < 50
          ? "استراحت پیشنهاد می‌شود"
          : "استرس: متوسط",
    href: "#",
    accentColor: "#ec4899",
  },
];

export default function RoomGrid({ done }: { done: string[] }) {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(2, 1fr)",
      gap: 10,
      marginBottom: 10,
    }}>
      {ROOMS.map((room) => {
        const status = room.getStatus(done);
        const isDone = status.includes("✅");

        return (
          <Link
            key={room.id}
            href={room.href}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div style={{
              borderRadius: 20,
              padding: "16px 14px",
              background: "white",
              border: `1px solid rgba(0,0,0,0.04)`,
              boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
              borderRight: `3px solid ${room.accentColor}25`,
              transition: "transform 0.1s ease, box-shadow 0.1s ease",
              cursor: "pointer",
              minHeight: 110,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}>
              {/* Icon + Title */}
              <div>
                <div style={{
                  fontSize: 32, marginBottom: 8, lineHeight: 1,
                  filter: `drop-shadow(0 2px 6px ${room.accentColor}30)`,
                }}>
                  {room.emoji}
                </div>
                <div style={{
                  fontSize: 14, fontWeight: 800, color: "#0f172a",
                  marginBottom: 6,
                }}>
                  {room.title}
                </div>
              </div>

              {/* Status line */}
              <div style={{
                fontSize: 11, fontWeight: 600,
                color: isDone ? "#16a34a" : "#64748b",
                lineHeight: 1.4,
              }}>
                {status}
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
