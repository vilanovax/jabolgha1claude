"use client";
import { useState } from "react";
import Link from "next/link";
import { useGameStore } from "@/stores/gameStore";
import { getLeisureSuggestions } from "@/data/leisureData";
import { MARKET_ITEMS } from "@/data/marketplaceData";
import { toPersian, formatMoney } from "@/data/mock";

export default function LeisureButton() {
  const [result, setResult] = useState<{
    name: string;
    emoji: string;
    description: string;
    effects: { energy?: number; happiness?: number; health?: number };
    ateFoodName?: string;
  } | null>(null);
  const [suggestions, setSuggestions] = useState(false);

  const doRandomLeisure = useGameStore((s) => s.doRandomLeisure);
  const inventory = useGameStore((s) => s.inventory);

  const purchaseSuggestions = getLeisureSuggestions(inventory);

  function handleClick() {
    const res = doRandomLeisure();
    if (res.success && res.activity) {
      setResult({
        name: res.activity.name,
        emoji: res.activity.emoji,
        description: res.activity.description,
        effects: res.activity.effects,
        ateFoodName: res.ateFoodName,
      });
      setSuggestions(false);
      setTimeout(() => setResult(null), 3500);
    }
  }

  return (
    <div style={{ marginTop: 12, padding: "0 4px" }}>
      {/* Main button */}
      <button
        onClick={handleClick}
        className="leisure-pulse"
        style={{
          width: "100%",
          minHeight: 72,
          padding: "18px 20px",
          borderRadius: 20,
          border: "1.5px solid rgba(168,85,247,0.25)",
          background: "linear-gradient(135deg, rgba(168,85,247,0.15), rgba(236,72,153,0.1))",
          cursor: "pointer",
          fontFamily: "inherit",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(180deg, rgba(255,255,255,0.06) 0%, transparent 50%)",
          pointerEvents: "none",
        }} />
        <span style={{ fontSize: 24 }}>🎲</span>
        <span style={{
          fontSize: 17, fontWeight: 900, color: "white",
          textShadow: "0 0 10px rgba(168,85,247,0.3)",
        }}>
          یه کاری کن!
        </span>
        <span style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", fontWeight: 600 }}>
          تفریح رندوم
        </span>
      </button>

      {/* Result card */}
      {result && (
        <div className="page-enter" style={{
          marginTop: 8,
          padding: "14px 16px",
          borderRadius: 18,
          background: "linear-gradient(135deg, rgba(168,85,247,0.1), rgba(236,72,153,0.06))",
          border: "1px solid rgba(168,85,247,0.2)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <span style={{ fontSize: 28 }}>{result.emoji}</span>
            <div>
              <div style={{ fontSize: 14, fontWeight: 800, color: "white" }}>{result.name}</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>{result.description}</div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {result.effects.energy && result.effects.energy !== 0 && (
              <span style={{
                fontSize: 10, fontWeight: 700, padding: "3px 8px",
                borderRadius: 8,
                background: result.effects.energy > 0 ? "rgba(34,197,94,0.12)" : "rgba(239,68,68,0.12)",
                color: result.effects.energy > 0 ? "#4ade80" : "#f87171",
              }}>
                ⚡ {result.effects.energy > 0 ? "+" : ""}{toPersian(result.effects.energy)}
              </span>
            )}
            {result.effects.happiness && result.effects.happiness !== 0 && (
              <span style={{
                fontSize: 10, fontWeight: 700, padding: "3px 8px",
                borderRadius: 8,
                background: result.effects.happiness > 0 ? "rgba(168,85,247,0.12)" : "rgba(239,68,68,0.12)",
                color: result.effects.happiness > 0 ? "#c084fc" : "#f87171",
              }}>
                😊 {result.effects.happiness > 0 ? "+" : ""}{toPersian(result.effects.happiness)}
              </span>
            )}
            {result.effects.health && result.effects.health !== 0 && (
              <span style={{
                fontSize: 10, fontWeight: 700, padding: "3px 8px",
                borderRadius: 8,
                background: "rgba(244,63,94,0.12)", color: "#f43f5e",
              }}>
                ❤️ +{toPersian(result.effects.health)}
              </span>
            )}
          </div>

          {result.ateFoodName && (
            <div style={{
              marginTop: 6, fontSize: 10, fontWeight: 600,
              color: "rgba(255,255,255,0.3)",
            }}>
              🍽️ {result.ateFoodName} رو خوردی
            </div>
          )}
        </div>
      )}

      {/* Purchase suggestions toggle */}
      {purchaseSuggestions.length > 0 && !result && (
        <button
          onClick={() => setSuggestions(!suggestions)}
          style={{
            width: "100%", marginTop: 6,
            padding: "8px", borderRadius: 14,
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.04)",
            cursor: "pointer", fontFamily: "inherit",
            fontSize: 10, fontWeight: 600,
            color: "rgba(255,255,255,0.25)",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 4,
          }}
        >
          💡 {toPersian(purchaseSuggestions.length)} تفریح جدید با خرید وسایل
          <span style={{ fontSize: 8 }}>{suggestions ? "▲" : "▼"}</span>
        </button>
      )}

      {/* Suggestions panel */}
      {suggestions && purchaseSuggestions.length > 0 && (
        <div style={{
          marginTop: 6, display: "flex", flexDirection: "column", gap: 6,
        }}>
          {purchaseSuggestions.map((sug) => {
            const item = MARKET_ITEMS.find((m) => m.id === sug.itemId);
            if (!item) return null;
            return (
              <Link key={sug.itemId} href="/market" style={{
                textDecoration: "none",
                padding: "10px 12px", borderRadius: 14,
                background: "rgba(245,158,11,0.06)",
                border: "1px solid rgba(245,158,11,0.1)",
                display: "flex", alignItems: "center", gap: 8,
              }}>
                <span style={{ fontSize: 20 }}>{item.emoji}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.6)" }}>
                    {sug.message}
                  </div>
                  <div style={{ fontSize: 10, fontWeight: 600, color: "#fbbf24" }}>
                    {item.name} · {formatMoney(item.price)} تومن
                  </div>
                </div>
                <span style={{ fontSize: 10, color: "rgba(255,255,255,0.2)" }}>🛒</span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
