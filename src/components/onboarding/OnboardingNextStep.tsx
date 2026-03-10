"use client";
import { useRouter } from "next/navigation";
import { useGameStore } from "@/stores/gameStore";

interface Props {
  onOpenAction: (categoryId: string) => void;
  onOpenBazaar: () => void;
}

export default function OnboardingNextStep({ onOpenAction, onOpenBazaar }: Props) {
  const router          = useRouter();
  const playerGoal      = useGameStore((s) => s.playerGoal);
  const setTutorialStep = useGameStore((s) => s.setTutorialStep);

  const done = () => setTutorialStep(-1);

  const thirdOption =
    playerGoal === "house" || playerGoal === "comfortable"
      ? { emoji: "🧺", label: "یه خرید کوچیک بکن", action: () => { done(); onOpenBazaar(); } }
      : { emoji: "🏦", label: "موجودیتت رو ببین", action: () => { done(); router.push("/bank"); } };

  const options = [
    { emoji: "💼", label: "یه شیفت کاری دیگه انجام بده", action: () => { done(); onOpenAction("work"); } },
    { emoji: "📚", label: "یه مهارت یاد بگیر",           action: () => { done(); router.push("/skills"); } },
    thirdOption,
  ];

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 150,
      background: "rgba(0,0,0,0.7)",
      display: "flex", alignItems: "flex-end", justifyContent: "center",
      maxWidth: 430, margin: "0 auto",
    }}>
      <div className="anim-sheet-up" style={{
        width: "100%",
        borderRadius: "24px 24px 0 0",
        background: "linear-gradient(170deg, rgba(12,14,36,0.99), rgba(6,8,24,0.99))",
        border: "1.5px solid rgba(255,255,255,0.08)",
        borderBottom: "none",
        padding: "24px 20px 40px",
      }}>
        {/* Handle */}
        <div style={{
          width: 40, height: 4, borderRadius: 2,
          background: "rgba(255,255,255,0.12)",
          margin: "0 auto 20px",
        }} />

        {/* Title */}
        <div style={{ fontSize: 18, fontWeight: 900, color: "white", marginBottom: 16, textAlign: "center" }}>
          🚀 حالا چی کار کنی؟
        </div>

        {/* Options */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {options.map((opt, i) => (
            <button
              key={i}
              onClick={opt.action}
              style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "14px 16px", borderRadius: 16,
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                cursor: "pointer", fontFamily: "inherit",
                textAlign: "right",
                transition: "all 0.15s",
              }}
            >
              <span style={{ fontSize: 22 }}>{opt.emoji}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.75)", flex: 1 }}>
                {opt.label}
              </span>
              <span style={{ fontSize: 12, color: "rgba(255,255,255,0.2)" }}>←</span>
            </button>
          ))}
        </div>

        {/* Skip */}
        <button
          onClick={done}
          style={{
            width: "100%", marginTop: 16,
            background: "none", border: "none",
            color: "rgba(255,255,255,0.2)", fontSize: 11, fontWeight: 600,
            cursor: "pointer", fontFamily: "inherit", padding: "8px",
          }}
        >
          رد کردن
        </button>
      </div>
    </div>
  );
}
