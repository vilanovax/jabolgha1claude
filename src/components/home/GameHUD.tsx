"use client";
import { useGameStore } from "@/stores/gameStore";
import { formatMoney, toPersian } from "@/data/mock";
import TimeBar from "./TimeBar";

export default function GameHUD() {
  const player = useGameStore((s) => s.player);
  const bank = useGameStore((s) => s.bank);

  const stats = [
    { icon: "⭐", value: toPersian(player.stars), color: "#facc15" },
    { icon: "✨", value: toPersian(player.xp), color: "#c084fc" },
    { icon: "💰", value: formatMoney(bank.checking + bank.savings), color: "#4ade80" },
    { icon: "⚡", value: toPersian(player.energy), color: "#fb923c" },
    { icon: "🍔", value: toPersian(player.hunger), color: "#f87171" },
  ];

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: "50%",
      transform: "translateX(-50%)",
      width: "100%",
      maxWidth: 430,
      zIndex: 50,
      padding: "8px 12px",
      pointerEvents: "none",
    }}>
      <div style={{
        borderRadius: 22,
        padding: "8px 14px",
        background: "rgba(10,14,39,0.45)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: "1px solid rgba(255,255,255,0.08)",
        pointerEvents: "auto",
      }}>
        {/* Row 1: Day + Level */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          marginBottom: 6,
        }}>
          <span style={{
            fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.5)",
          }}>
            روز {toPersian(player.dayInGame)}
          </span>
          <span style={{
            fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.5)",
          }}>
            Lv.{toPersian(player.level)}
          </span>
        </div>

        {/* Row 2: TimeBar */}
        <div style={{ marginBottom: 8 }}>
          <TimeBar />
        </div>

        {/* Row 3: Stat icons */}
        <div style={{
          display: "flex", justifyContent: "space-between", gap: 2,
        }}>
          {stats.map((s) => (
            <div key={s.icon} style={{
              display: "flex", alignItems: "center", gap: 3,
            }}>
              <span style={{ fontSize: 11 }}>{s.icon}</span>
              <span style={{
                fontSize: 10, fontWeight: 800, color: s.color,
                fontVariantNumeric: "tabular-nums",
              }}>
                {s.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
