"use client";
import { useState, useEffect } from "react";
import { player, bank, formatMoney, toPersian } from "@/data/mock";

export default function TopHeader() {
  const [clock, setClock] = useState("--:--");

  useEffect(() => {
    const tick = () => {
      const d = new Date();
      const h = String(d.getHours()).padStart(2, "0");
      const m = String(d.getMinutes()).padStart(2, "0");
      setClock(toPersian(`${h}:${m}`));
    };
    tick();
    const id = setInterval(tick, 10_000);
    return () => clearInterval(id);
  }, []);

  const energy = player.energy;
  const hunger = player.hunger;
  const xp = player.xp;

  return (
    <header style={{
      position: "fixed",
      top: 0,
      left: "50%",
      transform: "translateX(-50%)",
      width: "100%",
      maxWidth: 430,
      height: "var(--header-h)",
      background: "linear-gradient(160deg, #070E1A 0%, #0F2340 40%, #1B3A5C 100%)",
      borderBottom: "1px solid rgba(255,255,255,0.06)",
      zIndex: 100,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
    }}>
      {/* Subtle top reflection */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: "40%",
        background: "linear-gradient(180deg, rgba(255,255,255,0.03), transparent)",
        pointerEvents: "none",
      }} />

      {/* Row 1: Day · Clock · XP */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 16px",
        marginBottom: 8,
        position: "relative",
      }}>
        {/* Day pill */}
        <div className="stat-pill" style={{ padding: "3px 10px", gap: 4 }}>
          <span style={{ fontSize: 12 }}>📅</span>
          <span style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.7)" }}>
            روز {toPersian(player.dayInGame)}
          </span>
        </div>

        {/* Digital clock */}
        <div style={{
          fontSize: 22,
          fontWeight: 900,
          color: "white",
          letterSpacing: "0.1em",
          fontVariantNumeric: "tabular-nums",
          textShadow: "0 0 20px rgba(96,165,250,0.3)",
        }}>
          {clock}
        </div>

        {/* XP pill */}
        <div className="stat-pill" style={{
          padding: "3px 10px", gap: 4,
          borderColor: "rgba(212,168,67,0.25)",
          background: "rgba(212,168,67,0.1)",
        }}>
          <span style={{ fontSize: 12, filter: "drop-shadow(0 0 4px rgba(240,201,102,0.5))" }}>⭐</span>
          <span style={{ fontSize: 11, fontWeight: 800, color: "#F0C966" }}>
            {toPersian(xp)} XP
          </span>
        </div>
      </div>

      {/* Row 2: Cash · Energy · Hunger */}
      <div style={{
        display: "flex",
        gap: 6,
        padding: "0 10px",
        position: "relative",
      }}>
        {/* Cash */}
        <div className="stat-pill" style={{
          flex: 1,
          borderColor: "rgba(74,222,128,0.2)",
          background: "rgba(74,222,128,0.08)",
          "--glow-color": "rgba(74,222,128,0.4)",
        } as React.CSSProperties}>
          <span className="icon-glow" style={{
            fontSize: 14, flexShrink: 0,
            filter: "drop-shadow(0 0 5px rgba(74,222,128,0.6))",
          }}>💵</span>
          <span style={{ fontSize: 12, fontWeight: 800, color: "#4ade80" }}>
            {formatMoney(bank.checking + bank.savings)}
          </span>
        </div>

        {/* Energy */}
        <GlowPill
          emoji="⚡"
          value={energy}
          color="#facc15"
          bgTint="rgba(250,204,21,0.08)"
          borderTint="rgba(250,204,21,0.2)"
          glowColor="rgba(250,204,21,0.5)"
        />

        {/* Hunger */}
        <GlowPill
          emoji="🍔"
          value={hunger}
          color="#f87171"
          bgTint="rgba(248,113,113,0.08)"
          borderTint="rgba(248,113,113,0.2)"
          glowColor="rgba(248,113,113,0.5)"
        />
      </div>
    </header>
  );
}

function GlowPill({
  emoji, value, color, bgTint, borderTint, glowColor,
}: {
  emoji: string; value: number; color: string;
  bgTint: string; borderTint: string; glowColor: string;
}) {
  return (
    <div className="stat-pill" style={{
      flex: 1.15,
      background: bgTint,
      borderColor: borderTint,
    }}>
      <span style={{
        fontSize: 14, flexShrink: 0,
        filter: `drop-shadow(0 0 5px ${glowColor})`,
      }}>{emoji}</span>
      <div style={{
        flex: 1,
        background: "rgba(255,255,255,0.1)",
        borderRadius: "var(--r-full)",
        height: 6,
        overflow: "hidden",
        border: "1px solid rgba(255,255,255,0.05)",
      }}>
        <div style={{
          width: `${Math.min(value, 100)}%`,
          height: "100%",
          borderRadius: "var(--r-full)",
          background: `linear-gradient(90deg, ${color}, ${color}cc)`,
          boxShadow: `0 0 8px ${glowColor}`,
          transition: "width 0.5s ease",
        }} />
      </div>
      <span style={{
        fontSize: 10,
        fontWeight: 800,
        color,
        minWidth: 24,
        textAlign: "left",
        textShadow: `0 0 6px ${glowColor}`,
      }}>
        {toPersian(value)}٪
      </span>
    </div>
  );
}
