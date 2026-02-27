"use client";
import { useState } from "react";
import Link from "next/link";
import BottomNav from "@/components/layout/BottomNav";
import { fridgeItems, supermarketItems, player, formatMoney } from "@/data/mock";

export default function FridgePage() {
  const [tab, setTab] = useState<"fridge" | "shop">("fridge");
  const [eaten, setEaten] = useState<number[]>([]);
  const [energy, setEnergy] = useState(player.energy);

  const hunger = 45;

  function eat(id: number, energyBoost: number) {
    setEaten((prev) => [...prev, id]);
    setEnergy((e) => Math.min(100, e + energyBoost));
  }

  const items = tab === "fridge" ? fridgeItems : supermarketItems;

  return (
    <div style={{ minHeight: "100dvh", background: "var(--bg)" }}>
      {/* Header */}
      <div style={{
        background: "var(--primary)", padding: "14px 16px",
        display: "flex", alignItems: "center", gap: 12,
      }}>
        <Link href="/" style={{ color: "white", fontSize: 22, textDecoration: "none", lineHeight: 1 }}>‹</Link>
        <div>
          <div style={{ fontSize: 17, fontWeight: 700, color: "white" }}>🚪 آشپزخونه</div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,.6)" }}>یخچال و خرید آنلاین</div>
        </div>
      </div>

      <div className="safe-bottom" style={{ padding: 16 }}>
        {/* Hunger & Energy */}
        <div className="card" style={{ padding: "14px 16px", marginBottom: 16 }}>
          <div style={{ display: "flex", gap: 16 }}>
            {[
              { label: "گرسنگی", value: hunger, color: "#f97316", emoji: "🍽️" },
              { label: "انرژی", value: energy, color: energy > 60 ? "#22c55e" : "#f97316", emoji: "⚡" },
            ].map((s) => (
              <div key={s.label} style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{s.emoji} {s.label}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: s.color }}>{s.value}٪</span>
                </div>
                <div style={{ background: "var(--surface-2)", borderRadius: "var(--r-full)", height: 7, border: "1px solid var(--border)" }}>
                  <div style={{ width: `${s.value}%`, height: "100%", borderRadius: "var(--r-full)", background: s.color, transition: "width .4s" }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div style={{
          display: "flex", background: "var(--surface)", borderRadius: "var(--r-lg)",
          padding: 4, marginBottom: 16, border: "1px solid var(--border)",
        }}>
          {[
            { key: "fridge", label: "❄️ یخچال من" },
            { key: "shop", label: "🛒 خرید آنلاین" },
          ].map((t) => (
            <button key={t.key} onClick={() => setTab(t.key as "fridge" | "shop")}
              style={{
                flex: 1, padding: "9px 0", border: "none", cursor: "pointer",
                borderRadius: "var(--r-md)", fontSize: 13, fontWeight: 600,
                fontFamily: "inherit", transition: "all .15s",
                background: tab === t.key ? "var(--primary)" : "transparent",
                color: tab === t.key ? "white" : "var(--text-muted)",
              }}
            >{t.label}</button>
          ))}
        </div>

        {/* Items */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {items.map((item) => {
            const isEaten = eaten.includes(item.id);
            return (
              <div key={item.id} className="card" style={{
                padding: "14px 16px",
                opacity: isEaten ? 0.5 : 1,
                transition: "opacity .3s",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{
                    fontSize: 32, width: 52, height: 52,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: "var(--surface-2)", borderRadius: "var(--r-md)",
                    border: "1px solid var(--border)", flexShrink: 0,
                  }}>{item.emoji}</div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                      <span style={{ fontSize: 14, fontWeight: 700 }}>{item.name}</span>
                      {item.sponsor && (
                        <span style={{
                          fontSize: 9, fontWeight: 700, padding: "1px 6px",
                          background: "var(--accent)", color: "white",
                          borderRadius: "var(--r-full)",
                        }}>✦ اسپانسر</span>
                      )}
                    </div>
                    <div style={{ display: "flex", gap: 8, marginBottom: 6 }}>
                      <span style={{ fontSize: 11, color: "#22c55e", fontWeight: 600 }}>⚡+{item.energy}</span>
                      <span style={{ fontSize: 11, color: "#a855f7", fontWeight: 600 }}>😊+{item.happiness}</span>
                      {item.study > 0 && <span style={{ fontSize: 11, color: "var(--primary)", fontWeight: 600 }}>🧠+{item.study}٪</span>}
                    </div>
                    <div style={{ fontSize: 12, color: "var(--accent-dark)", fontWeight: 700 }}>
                      {formatMoney(item.price)} تومن
                    </div>
                  </div>

                  <button
                    onClick={() => !isEaten && eat(item.id, item.energy)}
                    disabled={isEaten}
                    className="btn btn-sm"
                    style={{
                      background: isEaten ? "var(--surface-2)" : "var(--primary)",
                      color: isEaten ? "var(--text-muted)" : "white",
                      flexShrink: 0,
                    }}
                  >
                    {isEaten ? "✓ خورده شد" : tab === "fridge" ? "بخور" : "بخر"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
