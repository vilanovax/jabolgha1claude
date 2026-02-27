"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Target, Briefcase, Building2, User } from "lucide-react";
import { getMissionStats, toPersian, dailyMissions } from "@/data/mock";

const tabs = [
  { href: "/",         Icon: Home,      label: "خانه",       color: "#60a5fa" },
  { href: "/missions", Icon: Target,    label: "ماموریت‌ها", color: "#facc15" },
  { href: "/jobs",     Icon: Briefcase, label: "کار",        color: "#4ade80" },
  { href: "/city",     Icon: Building2, label: "شهر",        color: "#fb923c" },
  { href: "/profile",  Icon: User,      label: "من",         color: "#c084fc" },
];

export default function BottomNav() {
  const path = usePathname();
  const homeRoutes = ["/", "/fridge", "/skills", "/bank"];
  const activeTab = homeRoutes.includes(path) ? "/" : path;
  const stats = getMissionStats();
  const hasMissionBadge = stats.claimableCount > 0 || stats.activeCount > 0;
  const dailyDone = dailyMissions.filter(m => m.status === "done" || m.status === "claimable").length;
  const totalMissions = dailyMissions.length;

  return (
    <nav className="glass-nav" style={{
      position: "fixed",
      bottom: 0,
      left: "50%",
      transform: "translateX(-50%)",
      width: "100%",
      maxWidth: 430,
      height: "var(--nav-h)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-around",
      zIndex: 100,
      paddingBottom: "env(safe-area-inset-bottom, 0px)",
    }}>
      {/* Top reflection line */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 1,
        background: "linear-gradient(90deg, transparent 10%, rgba(255,255,255,0.06) 50%, transparent 90%)",
      }} />

      {tabs.map(({ href, Icon, label, color }) => {
        const isActive = activeTab === href;
        const showBadge = href === "/missions" && !isActive && hasMissionBadge;
        const isClaimable = href === "/missions" && stats.claimableCount > 0;

        return (
          <Link
            key={href}
            href={href}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 3,
              padding: "6px 12px",
              borderRadius: 16,
              textDecoration: "none",
              background: isActive
                ? `linear-gradient(180deg, ${color}18, ${color}08)`
                : "transparent",
              transition: "all 0.15s ease",
              position: "relative",
            }}
          >
            {/* Glow dot for active tab */}
            {isActive && (
              <div style={{
                position: "absolute",
                top: -1,
                width: 24,
                height: 2,
                borderRadius: "0 0 3px 3px",
                background: color,
                boxShadow: `0 0 10px ${color}, 0 0 20px ${color}60`,
              }} />
            )}

            {/* Mission badge with count */}
            {showBadge && (
              <div className={isClaimable ? "anim-badge-bounce" : ""} style={{
                position: "absolute",
                top: 0,
                right: 4,
                minWidth: 20,
                height: 16,
                borderRadius: 8,
                background: isClaimable
                  ? "linear-gradient(135deg, #facc15, #f59e0b)"
                  : "linear-gradient(135deg, #ef4444, #dc2626)",
                border: "2px solid rgba(10,14,39,0.65)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "0 4px",
                fontSize: 8,
                fontWeight: 900,
                color: isClaimable ? "#000" : "#fff",
                boxShadow: isClaimable
                  ? "0 0 8px rgba(250,204,21,0.6)"
                  : "0 0 6px rgba(239,68,68,0.5)",
              }}>
                {isClaimable ? "⭐" : `${toPersian(dailyDone)}/${toPersian(totalMissions)}`}
              </div>
            )}

            <div
              className={href === "/missions" && hasMissionBadge && !isActive ? "anim-mission-glow mission-icon-tap" : ""}
              style={{
                filter: isActive ? `drop-shadow(0 0 6px ${color}80)` : "none",
                transition: "filter 0.15s ease",
              }}
            >
              <Icon
                size={22}
                strokeWidth={isActive ? 2.5 : 1.8}
                color={isActive ? color : href === "/missions" && hasMissionBadge ? "#facc15" : "rgba(255,255,255,0.3)"}
              />
            </div>
            <span style={{
              fontSize: 8,
              fontWeight: isActive ? 700 : 400,
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
