"use client";
import { useState, useEffect } from "react";
import { useGameStore } from "@/stores/gameStore";
import { useIdentityStore } from "@/game/identity/identityStore";
import { getReputationTierLabelFa, getReputationTierColor } from "@/game/identity/reputation";
import { toPersian, formatMoney } from "@/data/mock";

function getMoodEmoji(energy: number, hunger: number, happiness: number): string {
  if (energy < 25 || hunger < 20) return "😫";
  if (energy < 40 || hunger < 35) return "😐";
  if (happiness > 70 && energy > 60) return "😄";
  return "🙂";
}

export default function PlayerHeroCard() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const player = useGameStore((s) => s.player);
  const bank = useGameStore((s) => s.bank);
  const archetype = useIdentityStore((s) => s.archetype);
  const activeTitle = useIdentityStore((s) => s.activeTitle);
  const reputation = useIdentityStore((s) => s.reputation);

  const xpPct = Math.round((player.xp / player.xpNext) * 100);
  const mood = getMoodEmoji(player.energy, player.hunger, player.happiness);
  const repColor = getReputationTierColor(reputation.tier);
  const repLabel = getReputationTierLabelFa(reputation.tier);

  return (
    <div style={{
      padding: "24px 16px 20px",
      marginBottom: 12,
      position: "relative",
      textAlign: "center",
    }}>
      {/* Ambient glow */}
      <div style={{
        position: "absolute",
        top: 0,
        left: "50%",
        transform: "translateX(-50%)",
        width: 220,
        height: 220,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(212,168,67,0.1) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* Avatar */}
      <div style={{
        position: "relative",
        width: 96,
        height: 96,
        margin: "0 auto 14px",
      }}>
        <div className="anim-rotate-slow" style={{
          position: "absolute",
          inset: -6,
          borderRadius: "50%",
          background: "conic-gradient(from 0deg, rgba(212,168,67,0.4), rgba(240,201,102,0.1), rgba(212,168,67,0.4), rgba(240,201,102,0.1), rgba(212,168,67,0.4))",
          padding: 2,
        }}>
          <div style={{ width: "100%", height: "100%", borderRadius: "50%", background: "#0a0e27" }} />
        </div>
        <div className="anim-breathe" style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          background: "radial-gradient(circle at 40% 35%, rgba(212,168,67,0.12), rgba(30,20,60,0.25))",
          border: "2.5px solid rgba(212,168,67,0.35)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 46,
          zIndex: 2,
          boxShadow: "0 0 30px rgba(212,168,67,0.15), 0 8px 24px rgba(0,0,0,0.3)",
        }}>
          {player.avatar || "👨‍💻"}
        </div>
        {/* Mood badge */}
        <div style={{
          position: "absolute",
          top: -2,
          right: -2,
          width: 28,
          height: 28,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #1a1a2e, #16213e)",
          border: "2px solid rgba(212,168,67,0.3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 14,
          zIndex: 3,
          boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
        }}>
          {mood}
        </div>
      </div>

      {/* Name */}
      <div style={{
        fontSize: 22,
        fontWeight: 900,
        color: "white",
        marginBottom: 6,
        textShadow: "0 0 16px rgba(212,168,67,0.2)",
      }}>
        {player.name}
      </div>

      {/* Title */}
      {mounted && (
        <div style={{
          fontSize: 12,
          fontWeight: 700,
          color: "#F0C966",
          marginBottom: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 4,
        }}>
          <span>{activeTitle.emoji}</span>
          {activeTitle.nameFa}
        </div>
      )}

      {/* Identity pills row */}
      {mounted && (
        <div style={{
          display: "flex",
          justifyContent: "center",
          gap: 6,
          marginBottom: 14,
          flexWrap: "wrap",
        }}>
          {/* Level */}
          <span style={{
            fontSize: 10,
            fontWeight: 800,
            padding: "3px 10px",
            borderRadius: 20,
            background: "rgba(212,168,67,0.15)",
            color: "#F0C966",
            border: "1px solid rgba(212,168,67,0.3)",
          }}>
            Lv.{toPersian(player.level)}
          </span>
          {/* Archetype */}
          <span style={{
            fontSize: 10,
            fontWeight: 700,
            padding: "3px 10px",
            borderRadius: 20,
            background: "rgba(255,255,255,0.06)",
            color: "rgba(255,255,255,0.6)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}>
            {archetype.emoji} {archetype.nameFa}
          </span>
          {/* Reputation */}
          <span style={{
            fontSize: 10,
            fontWeight: 700,
            padding: "3px 10px",
            borderRadius: 20,
            background: `${repColor}18`,
            color: repColor,
            border: `1px solid ${repColor}40`,
          }}>
            {repLabel}
          </span>
        </div>
      )}

      {/* XP Bar */}
      <div style={{ marginBottom: 18, padding: "0 4px" }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 6,
        }}>
          <span style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", fontWeight: 600 }}>تجربه</span>
          <span style={{ fontSize: 10, color: "#F0C966", fontWeight: 700 }}>
            {toPersian(player.xp)} / {toPersian(player.xpNext)}
          </span>
        </div>
        <div style={{
          height: 7,
          borderRadius: 4,
          background: "rgba(255,255,255,0.08)",
          overflow: "hidden",
        }}>
          <div className="progress-bar-animated" style={{
            width: `${xpPct}%`,
            height: "100%",
            borderRadius: 4,
            background: "linear-gradient(90deg, #D4A843, #F0C966)",
            boxShadow: "0 0 10px rgba(212,168,67,0.5)",
            transition: "width 0.6s ease",
          }} />
        </div>
      </div>

      {/* 3 Stats */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr",
        gap: 8,
      }}>
        {[
          { emoji: "⭐", label: "ستاره", value: toPersian(player.stars), color: "#facc15" },
          { emoji: "💰", label: "موجودی", value: formatMoney(player.money), color: "#4ade80" },
          { emoji: "🏦", label: "پس‌انداز", value: formatMoney(bank.savings), color: "#60a5fa" },
        ].map((stat) => (
          <div key={stat.label} style={{
            padding: "10px 6px",
            borderRadius: 14,
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}>
            <div style={{ fontSize: 16, marginBottom: 4 }}>{stat.emoji}</div>
            <div style={{
              fontSize: 11,
              fontWeight: 800,
              color: stat.color,
              marginBottom: 2,
              direction: "ltr",
            }}>
              {stat.value}
            </div>
            <div style={{ fontSize: 8, color: "rgba(255,255,255,0.3)", fontWeight: 600 }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
