"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Briefcase, TrendingUp, User } from "lucide-react";
import { toPersian } from "@/data/mock";
import { useGameStore } from "@/stores/gameStore";
import { useMissionStore } from "@/game/missions/store";
import { FOOD_CATALOG } from "@/data/fridgeData";

// ─── Badge helpers ────────────────────────────────────────────────────────────

type BadgeColor = "red" | "orange" | "yellow" | "green";

interface BadgeState {
  show: boolean;
  emoji?: string;
  count?: number;
  color: BadgeColor;
  pulse?: boolean;
}

function Badge({ state }: { state: BadgeState }) {
  if (!state.show) return null;
  const bg =
    state.color === "red"    ? "linear-gradient(135deg, #ef4444, #dc2626)" :
    state.color === "orange" ? "linear-gradient(135deg, #fb923c, #f97316)" :
    state.color === "yellow" ? "linear-gradient(135deg, #facc15, #f59e0b)" :
                               "linear-gradient(135deg, #4ade80, #22c55e)";
  const shadow =
    state.color === "red"    ? "0 0 6px rgba(239,68,68,0.6)" :
    state.color === "orange" ? "0 0 6px rgba(251,146,60,0.6)" :
    state.color === "yellow" ? "0 0 8px rgba(250,204,21,0.6)" :
                               "0 0 6px rgba(74,222,128,0.5)";
  return (
    <div
      className={state.pulse ? "anim-badge-bounce" : ""}
      style={{
        position: "absolute", top: 0, right: 4,
        minWidth: 16, height: 16, borderRadius: 8,
        background: bg,
        border: "2px solid rgba(10,14,39,0.75)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "0 3px",
        fontSize: 8, fontWeight: 900,
        color: state.color === "yellow" ? "#000" : "#fff",
        boxShadow: shadow,
        zIndex: 2,
      }}
    >
      {state.emoji ?? (state.count !== undefined ? toPersian(state.count) : "")}
    </div>
  );
}

// ─── Tab config ───────────────────────────────────────────────────────────────

const TABS = [
  { href: "/",        Icon: Home,       label: "بازی",   color: "#60a5fa", routes: ["/", "/fridge", "/city", "/opportunities", "/living", "/missions"] },
  { href: "/jobs",    Icon: Briefcase,  label: "کار",    color: "#4ade80", routes: ["/jobs", "/skills"] },
  { href: "/bank",    Icon: TrendingUp, label: "سرمایه", color: "#f59e0b", routes: ["/bank", "/stocks", "/market"] },
  { href: "/profile", Icon: User,       label: "من",     color: "#c084fc", routes: ["/profile"] },
] as const;

// ─── BottomNav ────────────────────────────────────────────────────────────────

export default function BottomNav() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const path      = usePathname();
  const activeTab = TABS.find((t) => (t.routes as readonly string[]).includes(path))?.href ?? "/";

  // Store selectors
  const streak      = useGameStore((s) => s.streak);
  const fridge      = useGameStore((s) => s.fridge);
  const living      = useGameStore((s) => s.living);
  const dayInGame   = useGameStore((s) => s.player.dayInGame);
  const dailyReward = useGameStore((s) => s.dailyReward);

  const claimableCount   = useMissionStore((s) => s.activeDailyMissions.filter((m) => m.status === "completed").length);
  const activeDailyCount = useMissionStore((s) => s.activeDailyMissions.filter((m) => m.status === "active" || m.status === "available").length);

  // ── "بازی" badge — priority: food crisis > streak > daily reward > mission ──
  const expiringCount = mounted
    ? fridge.items.filter((slot) => {
        if (slot.spoiled) return false;
        const food = FOOD_CATALOG.find((f) => f.id === slot.foodId);
        return food ? slot.expiresOnDay - dayInGame <= 1 : false;
      }).length
    : 0;

  const streakUnclaimed       = mounted && !streak.claimed;
  const dailyRewardUnclaimed  = mounted && dailyReward?.day === dayInGame && !dailyReward.claimed;

  let homeBadge: BadgeState = { show: false, color: "red" };
  if (expiringCount > 0)          homeBadge = { show: true, color: "red",    count: expiringCount,     pulse: true  };
  else if (streakUnclaimed)        homeBadge = { show: true, color: "orange", emoji: "🔥",              pulse: true  };
  else if (dailyRewardUnclaimed)   homeBadge = { show: true, color: "yellow", emoji: "🎁",              pulse: false };
  else if (claimableCount > 0)     homeBadge = { show: true, color: "yellow", emoji: "⭐",              pulse: true  };
  else if (activeDailyCount > 0)   homeBadge = { show: true, color: "red",    count: activeDailyCount,  pulse: false };

  // ── "سرمایه" badge — bills due in ≤2 days ────────────────────────────────
  const daysUntilBill = mounted ? Math.max(0, 7 - (dayInGame - living.lastBillDay)) : 99;
  const bankBadge: BadgeState = daysUntilBill <= 2
    ? { show: true, color: "orange", emoji: "💸", pulse: daysUntilBill === 0 }
    : { show: false, color: "orange" };

  return (
    <nav className="glass-nav" style={{
      position: "fixed", bottom: 0,
      left: "50%", transform: "translateX(-50%)",
      width: "100%", maxWidth: 430,
      height: "var(--nav-h)",
      display: "flex", alignItems: "center", justifyContent: "space-around",
      zIndex: 100,
      paddingBottom: "env(safe-area-inset-bottom, 0px)",
    }}>
      {/* Top reflection line */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 1,
        background: "linear-gradient(90deg, transparent 10%, rgba(255,255,255,0.06) 50%, transparent 90%)",
      }} />

      {TABS.map(({ href, Icon, label, color }) => {
        const isActive = activeTab === href;
        const badge: BadgeState =
          href === "/"     ? homeBadge :
          href === "/bank" ? bankBadge :
          { show: false, color: "red" };

        const iconColor = isActive ? color
          : badge.show
            ? badge.color === "yellow" ? "#facc15"
            : badge.color === "orange" ? "#fb923c"
            : badge.color === "red"    ? "#f87171"
            : "#4ade80"
          : "rgba(255,255,255,0.3)";

        return (
          <Link
            key={href}
            href={href}
            style={{
              display: "flex", flexDirection: "column", alignItems: "center",
              gap: 3, padding: "6px 12px", borderRadius: 16,
              textDecoration: "none",
              background: isActive ? `linear-gradient(180deg, ${color}18, ${color}08)` : "transparent",
              transition: "all 0.15s ease",
              position: "relative",
            }}
          >
            {/* Active glow bar */}
            {isActive && (
              <div style={{
                position: "absolute", top: -1,
                width: 24, height: 2, borderRadius: "0 0 3px 3px",
                background: color,
                boxShadow: `0 0 10px ${color}, 0 0 20px ${color}60`,
              }} />
            )}

            {/* Badge — only when not active */}
            {!isActive && <Badge state={badge} />}

            {/* Icon */}
            <div style={{
              filter: isActive ? `drop-shadow(0 0 6px ${color}80)` : "none",
              transition: "filter 0.15s ease",
            }}>
              <Icon size={22} strokeWidth={isActive ? 2.5 : 1.8} color={iconColor} />
            </div>

            {/* Label */}
            <span style={{
              fontSize: 8, fontWeight: isActive ? 700 : 400,
              color: isActive ? color : "rgba(255,255,255,0.25)",
              fontFamily: "inherit",
            }}>
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
