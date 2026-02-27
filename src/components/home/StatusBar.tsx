"use client";
import { useState, useEffect } from "react";
import { player, bank, formatMoney } from "@/data/mock";

function getMoodText(happiness: number): string {
  if (happiness >= 75) return "عالی";
  if (happiness >= 50) return "خوبه";
  if (happiness >= 30) return "نه‌چندان";
  return "بد";
}

export default function StatusBar() {
  const [clock, setClock] = useState("--:--");

  useEffect(() => {
    const tick = () => {
      const d = new Date();
      setClock(
        `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`
      );
    };
    tick();
    const id = setInterval(tick, 10_000);
    return () => clearInterval(id);
  }, []);

  const mood = getMoodText(player.happiness);

  return (
    <div style={{
      borderRadius: 20,
      padding: "12px 14px",
      marginBottom: 10,
      background: "linear-gradient(145deg, #0F2340, #1B3A5C)",
      border: "1px solid rgba(255,255,255,0.08)",
      boxShadow: "0 4px 20px rgba(10,22,40,0.4)",
    }}>
      {/* Row 1: XP · Clock · Day */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 8,
      }}>
        {/* XP pill */}
        <div style={{
          fontSize: 11, fontWeight: 700, color: "#F0C966",
          background: "rgba(212,168,67,0.15)",
          border: "1px solid rgba(212,168,67,0.25)",
          borderRadius: 20, padding: "3px 10px",
        }}>
          XP {player.xp}★
        </div>

        {/* Clock */}
        <div style={{
          fontSize: 20, fontWeight: 900, color: "white",
          letterSpacing: "0.08em",
          fontVariantNumeric: "tabular-nums",
        }}>
          {clock}
        </div>

        {/* Day */}
        <div style={{
          fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.6)",
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 20, padding: "3px 10px",
        }}>
          روز {player.dayInGame}
        </div>
      </div>

      {/* Row 2: 4 compact stat pills */}
      <div style={{
        display: "flex",
        gap: 6,
      }}>
        {[
          { icon: "💰", value: formatMoney(bank.checking + bank.savings), color: "#4ade80" },
          { icon: "⚡", value: `${player.energy}٪`, color: "#facc15" },
          { icon: "🍔", value: `${player.hunger}٪`, color: "#f87171" },
          { icon: "😊", value: mood, color: "#93c5fd" },
        ].map((s) => (
          <div key={s.icon} style={{
            flex: 1,
            display: "flex", alignItems: "center", justifyContent: "center",
            gap: 4,
            padding: "4px 0",
            background: "rgba(255,255,255,0.05)",
            borderRadius: 12,
            border: "1px solid rgba(255,255,255,0.06)",
          }}>
            <span style={{ fontSize: 12 }}>{s.icon}</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: s.color }}>{s.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
