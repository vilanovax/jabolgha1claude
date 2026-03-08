"use client";
import { useEffect, useState } from "react";
import { formatMoney, toPersian } from "@/data/mock";
import type { MissionRewards } from "@/game/missions/types";

export default function RewardPopup({ reward, onDismiss }: {
  reward: MissionRewards;
  onDismiss: () => void;
}) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setShow(true));
    const timer = setTimeout(() => {
      setShow(false);
      setTimeout(onDismiss, 300);
    }, 2500);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div
      onClick={() => { setShow(false); setTimeout(onDismiss, 300); }}
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        display: "flex", alignItems: "center", justifyContent: "center",
        background: show ? "rgba(0,0,0,0.6)" : "rgba(0,0,0,0)",
        transition: "background 0.3s ease",
      }}
    >
      {/* Particle burst */}
      {show && Array.from({ length: 12 }).map((_, i) => {
        const angle = (i / 12) * 360;
        const rad = (angle * Math.PI) / 180;
        const dist = 60 + Math.random() * 40;
        return (
          <div key={i} style={{
            position: "absolute", top: "50%", left: "50%",
            width: 6, height: 6, borderRadius: "50%",
            background: i % 3 === 0 ? "#facc15" : i % 3 === 1 ? "#c084fc" : "#4ade80",
            transform: `translate(${Math.cos(rad) * dist}px, ${Math.sin(rad) * dist}px)`,
            opacity: 0,
            animation: `reward-particle 0.8s ease-out ${i * 0.05}s forwards`,
            pointerEvents: "none",
          }} />
        );
      })}

      {/* Reward card */}
      <div style={{
        padding: "28px 32px", borderRadius: 24,
        background: "linear-gradient(145deg, #1a1a2e, #16213e)",
        border: "2px solid rgba(250,204,21,0.3)",
        boxShadow: "0 0 40px rgba(250,204,21,0.15), 0 20px 40px rgba(0,0,0,0.4)",
        textAlign: "center",
        transform: show ? "scale(1)" : "scale(0.5)",
        opacity: show ? 1 : 0,
        transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
        maxWidth: 280,
      }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🎉</div>
        <div style={{
          fontSize: 18, fontWeight: 900, color: "#facc15", marginBottom: 16,
          textShadow: "0 0 12px rgba(250,204,21,0.3)",
        }}>
          پاداش دریافت شد!
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 10, flexWrap: "wrap" }}>
          {(reward.xp ?? 0) > 0 && (
            <RewardItem icon="✨" value={`+${toPersian(reward.xp!)}`} label="XP" color="#c084fc" />
          )}
          {(reward.stars ?? 0) > 0 && (
            <RewardItem icon="⭐" value={`+${toPersian(reward.stars!)}`} label="ستاره" color="#facc15" />
          )}
          {(reward.money ?? 0) > 0 && (
            <RewardItem icon="💰" value={`+${formatMoney(reward.money!)}`} label="تومان" color="#4ade80" />
          )}
          {(reward.energy ?? 0) > 0 && (
            <RewardItem icon="⚡" value={`+${toPersian(reward.energy!)}`} label="انرژی" color="#facc15" />
          )}
          {(reward.happiness ?? 0) > 0 && (
            <RewardItem icon="😊" value={`+${toPersian(reward.happiness!)}`} label="شادی" color="#4ade80" />
          )}
        </div>
      </div>
    </div>
  );
}

function RewardItem({ icon, value, label, color }: {
  icon: string; value: string; label: string; color: string;
}) {
  return (
    <div style={{
      padding: "10px 14px", borderRadius: 14,
      background: `${color}18`, border: `1px solid ${color}40`,
      minWidth: 70,
    }}>
      <div style={{ fontSize: 20, marginBottom: 4 }}>{icon}</div>
      <div style={{ fontSize: 16, fontWeight: 800, color }}>{value}</div>
      <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", marginTop: 2 }}>{label}</div>
    </div>
  );
}
