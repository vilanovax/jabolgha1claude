"use client";
import { useState } from "react";
import TopHeader from "@/components/layout/TopHeader";
import BottomNav from "@/components/layout/BottomNav";
import { cityEvents, cityPlayers, formatMoney, toPersian } from "@/data/mock";

const cityTabs = ["رویدادها", "بازار", "رنکینگ"];

export default function CityPage() {
  const [tab, setTab] = useState(0);

  return (
    <div className="game-bg" style={{ minHeight: "100dvh" }}>
      <TopHeader />

      <div className="page-enter" style={{
        paddingTop: "calc(var(--header-h) + 8px)",
        paddingBottom: "calc(var(--nav-h) + 16px)",
        paddingLeft: 14, paddingRight: 14,
        position: "relative", zIndex: 2,
      }}>
        {/* Page title */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          marginBottom: 14,
        }}>
          <div style={{
            fontSize: 18, fontWeight: 800, color: "#0f172a",
            display: "flex", alignItems: "center", gap: 6,
          }}>
            <span style={{ fontSize: 20 }}>🌆</span>
            شهر تهران
          </div>
          <div style={{
            display: "flex", alignItems: "center", gap: 6,
            fontSize: 11, fontWeight: 600, color: "#64748b",
          }}>
            <div style={{
              width: 8, height: 8, borderRadius: "50%",
              background: "#22c55e",
              boxShadow: "0 0 8px rgba(34,197,94,0.5), 0 0 16px rgba(34,197,94,0.25)",
            }} />
            ۷۴۸ بازیکن فعال
          </div>
        </div>

        {/* Tabs */}
        <div style={{
          display: "flex", padding: 4, gap: 4, marginBottom: 14,
          background: "linear-gradient(145deg, #0F2340, #1B3A5C)",
          borderRadius: 18, border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 4px 16px rgba(10,22,40,0.3)",
        }}>
          {cityTabs.map((t, i) => (
            <button key={t} onClick={() => setTab(i)}
              style={{
                flex: 1, padding: "10px 0", border: "none", cursor: "pointer",
                borderRadius: 14, fontSize: 12, fontWeight: 700,
                fontFamily: "inherit", transition: "all .2s",
                background: tab === i
                  ? "linear-gradient(180deg, #22c55e, #16a34a)"
                  : "transparent",
                color: tab === i ? "white" : "rgba(255,255,255,0.4)",
                boxShadow: tab === i ? "0 4px 14px rgba(34,197,94,0.35)" : "none",
                textShadow: tab === i ? "0 1px 2px rgba(0,0,0,0.15)" : "none",
              }}
            >{t}</button>
          ))}
        </div>

        {tab === 0 && <EventsTab />}
        {tab === 1 && <MarketTab />}
        {tab === 2 && <RankingTab />}
      </div>

      <BottomNav />
    </div>
  );
}

function EventsTab() {
  return (
    <>
      <div style={{
        fontSize: 14, fontWeight: 800, color: "#1e293b",
        display: "flex", alignItems: "center", gap: 6,
        marginBottom: 12, padding: "0 2px",
      }}>
        <span style={{ fontSize: 16 }}>📢</span> رویدادهای فعال
      </div>

      {cityEvents.map((ev) => (
        <div key={ev.id} className={`activity-card ${ev.type === "economic" ? "activity-card--work" : "activity-card--survival"}`}>
          <div style={{ padding: "16px", display: "flex", gap: 12, alignItems: "flex-start" }}>
            <div style={{
              width: 50, height: 50, borderRadius: 16, flexShrink: 0,
              background: ev.type === "economic"
                ? "linear-gradient(135deg, #b45309, #f97316)"
                : "linear-gradient(135deg, #15803d, #22c55e)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 24,
              boxShadow: ev.type === "economic"
                ? "0 4px 14px rgba(249,115,22,0.3)"
                : "0 4px 14px rgba(34,197,94,0.3)",
              border: "1px solid rgba(255,255,255,0.15)",
            }}>
              {ev.emoji}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", marginBottom: 3 }}>{ev.title}</div>
              <div style={{ fontSize: 12, color: "#64748b", marginBottom: 6 }}>{ev.desc}</div>
              <div style={{ fontSize: 10, color: "#94a3b8" }}>{ev.time}</div>
            </div>
            <button className="game-btn" style={{
              fontSize: 11, padding: "7px 14px",
              background: "linear-gradient(180deg, #64748b, #475569)",
              borderBottomColor: "#334155",
              boxShadow: "0 4px 12px rgba(100,116,139,0.3)",
            }}>جزئیات</button>
          </div>
        </div>
      ))}

      {/* Opportunities */}
      <div style={{
        fontSize: 14, fontWeight: 800, color: "#1e293b",
        display: "flex", alignItems: "center", gap: 6,
        marginTop: 6, marginBottom: 12, padding: "0 2px",
      }}>
        <span style={{ fontSize: 16 }}>🔥</span> فرصت‌های امروز
      </div>

      {[
        { emoji: "👔", title: "کارمند می‌خوام", sub: "شرکت دیجی‌کد | Lv.6+ | ۵۵M", btn: "درخواست", theme: "work" as const },
        { emoji: "🤝", title: "شریک تجاری می‌خوام", sub: "سرمایه ۲۰۰M | فروشگاه آنلاین", btn: "جزئیات", theme: "development" as const },
        { emoji: "📦", title: "خرید عمده آیفون", sub: "بازرگانی نوری | ۱۵ دستگاه", btn: "مذاکره", theme: "work" as const },
      ].map((op) => (
        <div key={op.title} className={`activity-card activity-card--${op.theme}`}>
          <div style={{ padding: "14px 16px", display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 14, flexShrink: 0,
              background: "linear-gradient(135deg, rgba(212,168,67,0.15), rgba(212,168,67,0.05))",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 22, border: "1px solid rgba(212,168,67,0.2)",
            }}>
              {op.emoji}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>{op.title}</div>
              <div style={{ fontSize: 11, color: "#64748b" }}>{op.sub}</div>
            </div>
            <button className="game-btn" style={{ fontSize: 11, padding: "7px 14px" }}>{op.btn}</button>
          </div>
        </div>
      ))}
    </>
  );
}

function MarketTab() {
  const sectors = [
    { name: "IT / برنامه‌نویسی", pct: 38, status: "اشباع", color: "#ef4444" },
    { name: "فروش / بازرگانی", pct: 21, status: "متعادل", color: "#22c55e" },
    { name: "آموزش", pct: 12, status: "متعادل", color: "#22c55e" },
    { name: "رستوران / غذا", pct: 6, status: "فرصت", color: "#f97316" },
    { name: "سلامت", pct: 9, status: "نیاز", color: "#3b82f6" },
    { name: "سایر", pct: 14, status: "متعادل", color: "#6b7280" },
  ];

  return (
    <div style={{
      borderRadius: 24, overflow: "hidden",
      background: "white",
      border: "1px solid rgba(0,0,0,0.04)",
      boxShadow: "0 4px 20px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)",
    }}>
      <div style={{ padding: "16px" }}>
        <div style={{
          fontSize: 14, fontWeight: 800, color: "#1e293b",
          display: "flex", alignItems: "center", gap: 6,
          marginBottom: 16,
        }}>
          <span style={{ fontSize: 16 }}>📊</span> توزیع مشاغل شهر
        </div>

        {sectors.map((s) => (
          <div key={s.name} style={{ marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#0f172a" }}>{s.name}</span>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{
                  fontSize: 10, fontWeight: 700, padding: "2px 8px",
                  background: `${s.color}15`, color: s.color,
                  borderRadius: "var(--r-full)", border: `1px solid ${s.color}30`,
                }}>{s.status}</span>
                <span style={{ fontSize: 12, fontWeight: 800, color: "#0f172a", minWidth: 28, textAlign: "left" }}>{toPersian(s.pct)}٪</span>
              </div>
            </div>
            <div style={{
              background: "#f1f5f9", borderRadius: "var(--r-full)",
              height: 6, overflow: "hidden",
            }}>
              <div style={{
                width: `${s.pct}%`, height: "100%",
                borderRadius: "var(--r-full)",
                background: `linear-gradient(90deg, ${s.color}, ${s.color}cc)`,
                boxShadow: `0 0 6px ${s.color}40`,
                transition: "width 0.5s ease",
              }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RankingTab() {
  return (
    <div style={{
      borderRadius: 24, overflow: "hidden",
      background: "white",
      border: "1px solid rgba(0,0,0,0.04)",
      boxShadow: "0 4px 20px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)",
    }}>
      <div style={{ padding: "16px" }}>
        <div style={{
          fontSize: 14, fontWeight: 800, color: "#1e293b",
          display: "flex", alignItems: "center", gap: 6,
          marginBottom: 14,
        }}>
          <span style={{ fontSize: 16 }}>🏆</span> ثروتمندترین‌های شهر
        </div>

        {cityPlayers.map((p) => (
          <div key={p.rank} style={{
            display: "flex", alignItems: "center", gap: 12,
            padding: "12px 14px", marginBottom: 8,
            borderRadius: 16,
            background: p.isMe
              ? "linear-gradient(135deg, rgba(59,130,246,0.08), rgba(59,130,246,0.03))"
              : p.rank <= 3 ? "linear-gradient(135deg, rgba(212,168,67,0.06), transparent)" : "transparent",
            border: p.isMe ? "1.5px solid rgba(59,130,246,0.2)" : p.rank <= 3 ? "1px solid rgba(212,168,67,0.1)" : "1px solid transparent",
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: 10, flexShrink: 0,
              background: p.rank <= 3
                ? "linear-gradient(135deg, #D4A843, #F0C966)"
                : p.isMe ? "linear-gradient(135deg, #3b82f6, #60a5fa)" : "#f1f5f9",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: p.rank <= 3 ? 16 : 12, fontWeight: 800,
              color: p.rank <= 3 || p.isMe ? "white" : "#64748b",
              boxShadow: p.rank <= 3 ? "0 4px 12px rgba(212,168,67,0.3)" : "none",
            }}>
              {p.rank <= 3 ? p.badge : toPersian(p.rank)}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{
                fontSize: 13, fontWeight: p.isMe ? 800 : 600,
                color: p.isMe ? "#2563eb" : "#0f172a",
              }}>
                {p.name} {p.isMe && "(من)"}
              </div>
              <div style={{ fontSize: 11, color: "#64748b" }}>{p.title}</div>
            </div>
            <div style={{
              fontSize: 13, fontWeight: 800,
              color: p.rank <= 3 ? "#D4A843" : "#0f172a",
              textShadow: p.rank <= 3 ? "0 0 8px rgba(212,168,67,0.2)" : "none",
            }}>
              {formatMoney(p.netWorth)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
