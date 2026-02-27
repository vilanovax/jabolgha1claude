"use client";
import { useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import TopHeader from "@/components/layout/TopHeader";
import BottomNav from "@/components/layout/BottomNav";
import { fridgeItems, supermarketItems, player, formatMoney } from "@/data/mock";

export default function FridgePage() {
  const [tab, setTab] = useState<"fridge" | "shop">("fridge");
  const [eaten, setEaten] = useState<number[]>([]);
  const [energy, setEnergy] = useState(player.energy);
  const hunger = player.hunger;

  function eat(id: number, energyBoost: number) {
    setEaten((prev) => [...prev, id]);
    setEnergy((e) => Math.min(100, e + energyBoost));
  }

  const items = tab === "fridge" ? fridgeItems : supermarketItems;

  return (
    <div className="game-bg" style={{ minHeight: "100dvh" }}>
      <TopHeader />

      <div className="page-enter" style={{
        paddingTop: "calc(var(--header-h) + 8px)",
        paddingBottom: "calc(var(--nav-h) + 16px)",
        paddingLeft: 14, paddingRight: 14,
        position: "relative", zIndex: 2,
      }}>
        {/* Sub-page header */}
        <div style={{
          display: "flex", alignItems: "center", gap: 12,
          marginBottom: 14,
        }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <div style={{
              width: 38, height: 38, borderRadius: 14,
              background: "linear-gradient(145deg, #0F2340, #1B3A5C)",
              display: "flex", alignItems: "center", justifyContent: "center",
              border: "1px solid rgba(255,255,255,0.1)",
              boxShadow: "0 4px 14px rgba(10,22,40,0.4)",
            }}>
              <ChevronRight size={18} color="rgba(255,255,255,0.8)" />
            </div>
          </Link>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: "#0f172a", display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 20 }}>🍳</span> آشپزخونه
            </div>
            <div style={{ fontSize: 11, color: "#64748b" }}>یخچال و خرید آنلاین</div>
          </div>
        </div>

        {/* Hunger & Energy stats */}
        <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
          {[
            { label: "سیری", value: hunger, emoji: "🍔", color: "#f97316", glow: "rgba(249,115,22,0.4)" },
            { label: "انرژی", value: energy, emoji: "⚡", color: energy > 60 ? "#22c55e" : "#f97316", glow: energy > 60 ? "rgba(34,197,94,0.4)" : "rgba(249,115,22,0.4)" },
          ].map((s) => (
            <div key={s.label} style={{
              flex: 1, padding: "12px 14px", borderRadius: 20,
              background: "linear-gradient(145deg, #0F2340, #1B3A5C)",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 6px 20px rgba(10,22,40,0.3)",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                <span style={{ fontSize: 16, filter: `drop-shadow(0 0 5px ${s.glow})` }}>{s.emoji}</span>
                <span style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.5)" }}>{s.label}</span>
                <span style={{ fontSize: 12, fontWeight: 800, color: s.color, marginRight: "auto" }}>{s.value}٪</span>
              </div>
              <div style={{
                background: "rgba(255,255,255,0.1)", borderRadius: "var(--r-full)",
                height: 6, overflow: "hidden", border: "1px solid rgba(255,255,255,0.05)",
              }}>
                <div style={{
                  width: `${Math.min(s.value, 100)}%`, height: "100%",
                  borderRadius: "var(--r-full)",
                  background: `linear-gradient(90deg, ${s.color}, ${s.color}cc)`,
                  boxShadow: `0 0 8px ${s.glow}`,
                  transition: "width 0.5s ease",
                }} />
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{
          display: "flex", padding: 4, marginBottom: 14,
          background: "linear-gradient(145deg, #0F2340, #1B3A5C)",
          borderRadius: 18, border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 4px 16px rgba(10,22,40,0.3)",
        }}>
          {[
            { key: "fridge", label: "❄️ یخچال من" },
            { key: "shop", label: "🛒 خرید آنلاین" },
          ].map((t) => (
            <button key={t.key} onClick={() => setTab(t.key as "fridge" | "shop")}
              style={{
                flex: 1, padding: "10px 0", border: "none", cursor: "pointer",
                borderRadius: 14, fontSize: 13, fontWeight: 700,
                fontFamily: "inherit", transition: "all .2s",
                background: tab === t.key
                  ? "linear-gradient(180deg, #22c55e, #16a34a)"
                  : "transparent",
                color: tab === t.key ? "white" : "rgba(255,255,255,0.4)",
                boxShadow: tab === t.key ? "0 4px 14px rgba(34,197,94,0.35)" : "none",
                textShadow: tab === t.key ? "0 1px 2px rgba(0,0,0,0.15)" : "none",
              }}
            >{t.label}</button>
          ))}
        </div>

        {/* Food Items */}
        {items.map((item) => {
          const isEaten = eaten.includes(item.id);
          return (
            <div key={item.id} className={`activity-card ${isEaten ? "activity-card--done" : "activity-card--survival"}`}>
              <div style={{
                display: "flex", alignItems: "center", gap: 14,
                padding: "16px 16px 12px",
              }}>
                <div style={{
                  width: 54, height: 54, borderRadius: 18, flexShrink: 0,
                  background: "linear-gradient(135deg, rgba(249,115,22,0.15), rgba(249,115,22,0.05))",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 28,
                  border: "1px solid rgba(249,115,22,0.2)",
                  boxShadow: "0 4px 12px rgba(249,115,22,0.1)",
                }}>
                  {item.emoji}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                    <span style={{ fontSize: 15, fontWeight: 700, color: "#0f172a" }}>{item.name}</span>
                    {item.sponsor && (
                      <span style={{
                        fontSize: 9, fontWeight: 800, padding: "2px 7px",
                        background: "linear-gradient(135deg, #D4A843, #F0C966)",
                        color: "white", borderRadius: "var(--r-full)",
                        textShadow: "0 1px 2px rgba(0,0,0,0.2)",
                      }}>✦ اسپانسر</span>
                    )}
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#a16207" }}>
                    {formatMoney(item.price)} تومن
                  </div>
                </div>

                {isEaten ? (
                  <button className="game-btn game-btn-done" style={{ fontSize: 11, padding: "7px 14px" }}>
                    ✓ شد
                  </button>
                ) : (
                  <button className="game-btn" onClick={() => eat(item.id, item.energy)}>
                    {tab === "fridge" ? "بخور" : "بخر"}
                  </button>
                )}
              </div>

              {/* Stats badges */}
              <div style={{
                display: "flex", gap: 6, flexWrap: "wrap",
                padding: "10px 16px 14px",
                borderTop: `1px solid ${isEaten ? "#e2e8f0" : "rgba(0,0,0,0.04)"}`,
              }}>
                <span className="badge-reward" style={{
                  background: "#f0fdf4", color: "#16a34a", borderColor: "#bbf7d0",
                }}>⚡ +{item.energy} انرژی</span>
                <span className="badge-reward" style={{
                  background: "#f5f3ff", color: "#7c3aed", borderColor: "#ddd6fe",
                }}>😊 +{item.happiness} خوشحالی</span>
                {item.study > 0 && (
                  <span className="badge-reward" style={{
                    background: "#eff6ff", color: "#1d4ed8", borderColor: "#bfdbfe",
                  }}>🧠 +{item.study}٪ تمرکز</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <BottomNav />
    </div>
  );
}
