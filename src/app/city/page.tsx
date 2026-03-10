"use client";
import { useState } from "react";
import TopHeader from "@/components/layout/TopHeader";
import BottomNav from "@/components/layout/BottomNav";
import CityHeader from "@/components/city/CityHeader";
import EconomicWave from "@/components/city/EconomicWave";
import EventCard from "@/components/city/EventCard";
import LimitedOpportunity from "@/components/city/LimitedOpportunity";
import MarketAnalysis from "@/components/city/MarketAnalysis";
import SectorGrid from "@/components/city/SectorGrid";
import CityEventsList from "@/components/city/CityEventsList";
import CityOpportunities from "@/components/city/CityOpportunities";
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
    <div className="scene-bg" style={{ minHeight: "100dvh" }}>
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
            {/* City Sector Grid */}
            <SectorGrid />

            {/* City Events (new simulation engine) */}
            <CityEventsList />

            {/* Player Opportunities */}
            <CityOpportunities />

            {/* Economic Wave (legacy tick-based) */}
            <div style={{
              fontSize: 11, fontWeight: 800, color: "rgba(255,255,255,0.4)",
              margin: "14px 0 8px",
              display: "flex", alignItems: "center", gap: 6,
            }}>
              <span>📡</span> موج اقتصادی (سیستم قدیمی)
            </div>
            <EconomicWave />

            {/* Critical / Important Events (legacy engine) */}
            {criticalEvents.length > 0 && (
              <>
                <div style={{
                  fontSize: 11, fontWeight: 800, color: "rgba(255,255,255,0.4)",
                  display: "flex", alignItems: "center", gap: 6,
                  marginBottom: 8,
                }}>
                  <span>⚡</span> رویدادهای بحرانی (سیستم قدیمی)
                </div>
                {criticalEvents.map((ev) => (
                  <EventCard key={ev.id} event={ev} />
                ))}
              </>
            )}

            {/* Limited Opportunities */}
            {cityOpportunities.length > 0 && (
              <>
                <div style={{
                  fontSize: 11, fontWeight: 800, color: "rgba(255,255,255,0.4)",
                  display: "flex", alignItems: "center", gap: 6,
                  marginTop: 6, marginBottom: 8,
                }}>
                  <span>🔥</span> فرصت‌های محدود امروز
                </div>
                {cityOpportunities.map((op) => (
                  <LimitedOpportunity key={op.id} opportunity={op} />
                ))}
              </>
            )}
          </>
        )}

        {/* Tab 1: Market */}
        {tab === 1 && <MarketAnalysis />}

        {/* Tab 2: Ranking */}
        {tab === 2 && (
          <div style={{
            borderRadius: 20,
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}>
            <div style={{ padding: "14px 14px 10px" }}>
              <div style={{
                fontSize: 12, fontWeight: 800, color: "rgba(255,255,255,0.5)",
                display: "flex", alignItems: "center", gap: 6,
                marginBottom: 12,
              }}>
                <span style={{ fontSize: 14 }}>🏆</span> ثروتمندترین‌های شهر
              </div>

              {cityPlayers.map((p) => (
                <div key={p.rank} style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "10px 12px", marginBottom: 6,
                  borderRadius: 14,
                  background: p.isMe
                    ? "rgba(99,102,241,0.1)"
                    : p.rank <= 3 ? "rgba(212,168,67,0.07)" : "rgba(255,255,255,0.02)",
                  border: p.isMe
                    ? "1px solid rgba(99,102,241,0.25)"
                    : p.rank <= 3 ? "1px solid rgba(212,168,67,0.15)" : "1px solid rgba(255,255,255,0.05)",
                }}>
                  <div style={{
                    width: 30, height: 30, borderRadius: 10, flexShrink: 0,
                    background: p.rank <= 3
                      ? "linear-gradient(135deg, #D4A843, #F0C966)"
                      : p.isMe ? "rgba(99,102,241,0.4)" : "rgba(255,255,255,0.06)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: p.rank <= 3 ? 14 : 11, fontWeight: 800,
                    color: "white",
                    boxShadow: p.rank <= 3 ? "0 3px 10px rgba(212,168,67,0.3)" : "none",
                  }}>
                    {p.rank <= 3 ? p.badge : toPersian(p.rank)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontSize: 12, fontWeight: p.isMe ? 800 : 600,
                      color: p.isMe ? "#818cf8" : "rgba(255,255,255,0.75)",
                    }}>
                      {p.name} {p.isMe && <span style={{ fontSize: 10, color: "#818cf8" }}>(من)</span>}
                    </div>
                    <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", marginTop: 1 }}>{p.title}</div>
                  </div>
                  <div style={{
                    fontSize: 12, fontWeight: 800,
                    color: p.rank <= 3 ? "#D4A843" : "rgba(255,255,255,0.6)",
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
