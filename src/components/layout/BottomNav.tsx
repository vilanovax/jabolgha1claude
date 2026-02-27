"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Briefcase, Building2, User } from "lucide-react";

const tabs = [
  { href: "/",        Icon: Home,      label: "خونه",  color: "#60a5fa" },
  { href: "/jobs",    Icon: Briefcase, label: "کار",   color: "#facc15" },
  { href: "/city",    Icon: Building2, label: "شهر",   color: "#4ade80" },
  { href: "/profile", Icon: User,      label: "من",    color: "#c084fc" },
];

export default function BottomNav() {
  const path = usePathname();
  const homeRoutes = ["/", "/fridge", "/skills", "/bank"];
  const activeTab = homeRoutes.includes(path) ? "/" : path;

  return (
    <nav style={{
      position: "fixed",
      bottom: 0,
      left: "50%",
      transform: "translateX(-50%)",
      width: "100%",
      maxWidth: 430,
      height: "var(--nav-h)",
      background: "linear-gradient(180deg, #0B1929 0%, #070E1A 100%)",
      borderTop: "1px solid rgba(255,255,255,0.06)",
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
        return (
          <Link
            key={href}
            href={href}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 3,
              padding: "8px 20px",
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
                height: 3,
                borderRadius: "0 0 4px 4px",
                background: color,
                boxShadow: `0 0 10px ${color}, 0 0 20px ${color}60`,
              }} />
            )}

            <div style={{
              filter: isActive ? `drop-shadow(0 0 6px ${color}80)` : "none",
              transition: "filter 0.15s ease",
            }}>
              <Icon
                size={22}
                strokeWidth={isActive ? 2.5 : 1.8}
                color={isActive ? color : "rgba(255,255,255,0.3)"}
              />
            </div>
            <span style={{
              fontSize: 10,
              fontWeight: isActive ? 700 : 400,
              color: isActive ? color : "rgba(255,255,255,0.3)",
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
