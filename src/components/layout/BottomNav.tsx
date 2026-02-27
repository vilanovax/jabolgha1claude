"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/",        icon: "🏠", label: "خونه" },
  { href: "/jobs",    icon: "💼", label: "کار" },
  { href: "/city",    icon: "🌆", label: "شهر" },
  { href: "/profile", icon: "👤", label: "من" },
];

export default function BottomNav() {
  const path = usePathname();

  // Detect active tab (nested routes like /fridge → home tab)
  const homeRoutes = ["/", "/fridge", "/skills", "/bank"];
  const activeTab = homeRoutes.includes(path) ? "/" : path;

  return (
    <nav
      style={{
        position: "fixed",
        bottom: 0,
        left: "50%",
        transform: "translateX(-50%)",
        width: "100%",
        maxWidth: 430,
        height: "var(--nav-h)",
        background: "var(--surface)",
        borderTop: "1px solid var(--border)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-around",
        zIndex: 100,
        boxShadow: "0 -2px 16px rgba(0,0,0,.06)",
      }}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 3,
              padding: "8px 20px",
              borderRadius: "var(--r-lg)",
              textDecoration: "none",
              transition: "all 0.15s ease",
              background: isActive ? "rgba(27,58,92,.08)" : "transparent",
            }}
          >
            <span style={{ fontSize: 20, lineHeight: 1 }}>{tab.icon}</span>
            <span
              style={{
                fontSize: 11,
                fontWeight: isActive ? 700 : 400,
                color: isActive ? "var(--primary)" : "var(--text-subtle)",
                fontFamily: "inherit",
              }}
            >
              {tab.label}
            </span>
            {isActive && (
              <div
                style={{
                  width: 4,
                  height: 4,
                  borderRadius: "50%",
                  background: "var(--primary)",
                  marginTop: -2,
                }}
              />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
