"use client";
import Link from "next/link";
import { player, activeCourse, fridgeItems, job, housing, toPersian } from "@/data/mock";

interface RoomItem {
  id: string;
  emoji: string;
  label: string;
  status: string;
  href: string;
  glowColor: string;
  level: number;
}

const ROOM_ITEMS: RoomItem[] = [
  {
    id: "desk",
    emoji: "🖥",
    label: "میز کار",
    status: `${job.title}`,
    href: "/jobs",
    glowColor: "rgba(212,168,67,0.35)",
    level: 2,
  },
  {
    id: "bookshelf",
    emoji: "📚",
    label: "قفسه کتاب",
    status: activeCourse ? `${activeCourse.name}` : "خالی",
    href: "/skills",
    glowColor: "rgba(59,130,246,0.35)",
    level: 2,
  },
  {
    id: "kitchen",
    emoji: "🍳",
    label: "آشپزخانه",
    status: `${toPersian(fridgeItems.length)} آیتم`,
    href: "/fridge",
    glowColor: "rgba(249,115,22,0.35)",
    level: 1,
  },
  {
    id: "bed",
    emoji: "🛏",
    label: "تخت خواب",
    status: `انرژی ${toPersian(player.energy)}٪`,
    href: "#",
    glowColor: "rgba(139,92,246,0.35)",
    level: 1,
  },
  {
    id: "gym",
    emoji: "🏋️",
    label: "باشگاه",
    status: "عضویت فعال",
    href: "#",
    glowColor: "rgba(34,197,94,0.35)",
    level: 1,
  },
  {
    id: "home",
    emoji: "🏠",
    label: "مسکن",
    status: housing.type,
    href: "#",
    glowColor: "rgba(236,72,153,0.35)",
    level: housing.isOwned ? 3 : 1,
  },
];

function LevelDots({ level }: { level: number }) {
  return (
    <div style={{ display: "flex", gap: 2 }}>
      {[1, 2, 3].map((i) => (
        <div key={i} style={{
          width: 4, height: 4, borderRadius: "50%",
          background: i <= level ? "#facc15" : "rgba(255,255,255,0.1)",
          boxShadow: i <= level ? "0 0 4px rgba(250,204,21,0.4)" : "none",
        }} />
      ))}
    </div>
  );
}

export default function ProfileRoom() {
  return (
    <div style={{ padding: "0 4px", marginBottom: 16 }}>
      {/* Section header */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        marginBottom: 12, padding: "0 8px",
      }}>
        <div style={{
          fontSize: 14, fontWeight: 800, color: "white",
          display: "flex", alignItems: "center", gap: 6,
        }}>
          <span style={{ fontSize: 16 }}>🏠</span>
          اتاق من
        </div>
        <div style={{
          fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.3)",
        }}>
          سطح لوازم
        </div>
      </div>

      {/* Room grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: 10,
      }}>
        {ROOM_ITEMS.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className="room-object"
            style={{
              textDecoration: "none",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
              padding: "14px 6px 10px",
              borderRadius: 20,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.06)",
              position: "relative",
            }}
          >
            {/* Level dots */}
            <div style={{ position: "absolute", top: 6, left: 8 }}>
              <LevelDots level={item.level} />
            </div>

            {/* Icon */}
            <div style={{
              fontSize: 34,
              lineHeight: 1,
              filter: `drop-shadow(0 3px 10px ${item.glowColor})`,
              marginBottom: 2,
            }}>
              {item.emoji}
            </div>

            {/* Label */}
            <div style={{
              fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.6)",
            }}>
              {item.label}
            </div>

            {/* Status */}
            <div style={{
              fontSize: 8, fontWeight: 600,
              color: "rgba(255,255,255,0.3)",
              textAlign: "center",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "100%",
            }}>
              {item.status}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
