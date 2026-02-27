"use client";
import { useState } from "react";
import TopHeader from "@/components/layout/TopHeader";
import BottomNav from "@/components/layout/BottomNav";
import CityHeader from "@/components/city/CityHeader";
import EconomicWave from "@/components/city/EconomicWave";
import EventCard from "@/components/city/EventCard";
import LimitedOpportunity from "@/components/city/LimitedOpportunity";
import MarketAnalysis from "@/components/city/MarketAnalysis";
import { useGameStore } from "@/stores/gameStore";
import { formatMoney, toPersian } from "@/data/mock";
import type { ActiveEvent } from "@/engine/types";

const cityTabs = ["رویدادها", "بازار", "رنکینگ"];

const TICK_MS = 10_000;

function hashCode(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

function toDisplayEvent(event: ActiveEvent) {
  const remainingSeconds = event.remainingTicks * (TICK_MS / 1000);
  const remainingHours = Math.max(1, Math.ceil(remainingSeconds / 3600));
  return {
    id: hashCode(event.templateId),
    type: event.category,
    emoji: event.emoji,
    severity: event.severity,
    title: event.title,
    desc: event.description,
    impacts: event.displayImpacts,
    remainingHours,
    affectedPlayers: event.affectedPlayers,
  };
}

export default function CityPage() {
  const [tab, setTab] = useState(0);
  const activeEvents = useGameStore((s) => s.activeEvents);
  const cityOpportunities = useGameStore((s) => s.cityOpportunities);
  const cityPlayers = useGameStore((s) => s.cityPlayers);

  const displayEvents = activeEvents.map(toDisplayEvent);
  const criticalEvents = displayEvents.filter(
    (e) => e.severity === "critical" || e.severity === "important",
  );
  const otherEvents = displayEvents.filter(
    (e) => e.severity !== "critical" && e.severity !== "important",
  );

  return (
    <div className="game-bg" style={{ minHeight: "100dvh" }}>
      <TopHeader />

      <div className="page-enter" style={{
        paddingTop: "calc(var(--header-h) + 8px)",
        paddingBottom: "calc(var(--nav-h) + 16px)",
        paddingLeft: 14, paddingRight: 14,
        position: "relative", zIndex: 2,
      }}>
        {/* City Header — always visible */}
        <CityHeader />

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

        {/* Tab 0: Events */}
        {tab === 0 && (
          <>
            {/* Economic Wave */}
            <EconomicWave />

            {/* Critical / Important Events */}
            {criticalEvents.length > 0 && (
              <>
                <div style={{
                  fontSize: 14, fontWeight: 800, color: "#1e293b",
                  display: "flex", alignItems: "center", gap: 6,
                  marginBottom: 10, padding: "0 2px",
                }}>
                  <span style={{ fontSize: 16 }}>⚡</span> رویدادهای بحرانی
                </div>
                {criticalEvents.map((ev) => (
                  <EventCard key={ev.id} event={ev} />
                ))}
              </>
            )}

            {/* Other Events */}
            {otherEvents.length > 0 && (
              <>
                <div style={{
                  fontSize: 14, fontWeight: 800, color: "#1e293b",
                  display: "flex", alignItems: "center", gap: 6,
                  marginBottom: 10, padding: "0 2px",
                }}>
                  <span style={{ fontSize: 16 }}>📢</span> سایر رویدادها
                </div>
                {otherEvents.map((ev) => (
                  <EventCard key={ev.id} event={ev} />
                ))}
              </>
            )}

            {/* Empty state for events */}
            {displayEvents.length === 0 && (
              <div style={{
                textAlign: "center", padding: "30px 20px",
                color: "#94a3b8", fontSize: 12,
                background: "rgba(255,255,255,0.02)",
                borderRadius: 16, border: "1px solid rgba(0,0,0,0.04)",
                marginBottom: 14,
              }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>🔍</div>
                در حال بررسی وضعیت اقتصادی شهر...
              </div>
            )}

            {/* Limited Opportunities */}
            <div style={{
              fontSize: 14, fontWeight: 800, color: "#1e293b",
              display: "flex", alignItems: "center", gap: 6,
              marginTop: 6, marginBottom: 10, padding: "0 2px",
            }}>
              <span style={{ fontSize: 16 }}>🔥</span> فرصت‌های محدود امروز
            </div>
            {cityOpportunities.map((op) => (
              <LimitedOpportunity key={op.id} opportunity={op} />
            ))}
          </>
        )}

        {/* Tab 1: Market */}
        {tab === 1 && <MarketAnalysis />}

        {/* Tab 2: Ranking */}
        {tab === 2 && (
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
        )}
      </div>

      <BottomNav />
    </div>
  );
}
