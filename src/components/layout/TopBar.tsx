"use client";
import { player, formatMoney, getEnergyColor } from "@/data/mock";

export default function TopBar() {
  const energyColor = getEnergyColor(player.energy);
  const happinessEmoji = player.happiness >= 70 ? "😄" : player.happiness >= 40 ? "😐" : "😔";

  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "var(--primary)",
        padding: "10px 16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        height: "var(--topbar-h)",
        boxShadow: "0 2px 8px rgba(0,0,0,.2)",
      }}
    >
      {/* Energy */}
      <div style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 13 }}>⚡</span>
          <div className="progress-wrap" style={{ flex: 1, height: 6 }}>
            <div
              className="progress-fill"
              style={{ width: `${player.energy}%`, background: energyColor }}
            />
          </div>
          <span style={{ fontSize: 11, color: "rgba(255,255,255,.7)", minWidth: 28, textAlign: "center" }}>
            {player.energy}٪
          </span>
        </div>
      </div>

      {/* Happiness */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 4,
          background: "rgba(255,255,255,.1)",
          borderRadius: "var(--r-full)",
          padding: "4px 10px",
        }}
      >
        <span style={{ fontSize: 16 }}>{happinessEmoji}</span>
        <span style={{ fontSize: 12, color: "rgba(255,255,255,.9)", fontWeight: 600 }}>
          {player.happiness}
        </span>
      </div>

      {/* Money */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 5,
          background: "rgba(212,168,67,.2)",
          border: "1px solid rgba(212,168,67,.4)",
          borderRadius: "var(--r-full)",
          padding: "4px 12px",
        }}
      >
        <span style={{ fontSize: 13 }}>💰</span>
        <span style={{ fontSize: 13, color: "var(--accent-light)", fontWeight: 700 }}>
          {formatMoney(player.money)}
        </span>
      </div>
    </div>
  );
}
