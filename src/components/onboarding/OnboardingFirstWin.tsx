"use client";
import { useGameStore } from "@/stores/gameStore";
import { formatMoney } from "@/data/mock";

export default function OnboardingFirstWin({ earnedAmount }: { earnedAmount: number }) {
  const playerGoal      = useGameStore((s) => s.playerGoal);
  const setTutorialStep = useGameStore((s) => s.setTutorialStep);
  const giveStarterGift = useGameStore((s) => s.giveStarterGift);

  const handleClaim = () => {
    giveStarterGift(playerGoal);
    setTutorialStep(4);
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 150,
      background: "rgba(0,0,0,0.75)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "0 20px",
      maxWidth: 430, margin: "0 auto",
    }}>
      <div className="anim-reward-pop" style={{
        width: "100%",
        borderRadius: 24,
        background: "linear-gradient(135deg, rgba(14,16,40,0.98), rgba(8,10,28,0.98))",
        border: "1.5px solid rgba(250,204,21,0.3)",
        padding: "28px 24px",
        boxShadow: "0 8px 48px rgba(0,0,0,0.6), 0 0 40px rgba(250,204,21,0.08)",
        textAlign: "center",
      }}>
        {/* Celebration emoji */}
        <div style={{ fontSize: 52, marginBottom: 12 }}>🎉</div>

        {/* Title */}
        <div style={{ fontSize: 20, fontWeight: 900, color: "white", marginBottom: 6 }}>
          اولین حقوقت!
        </div>

        {/* Amount */}
        {earnedAmount > 0 && (
          <div style={{
            fontSize: 28, fontWeight: 900, color: "#4ade80",
            textShadow: "0 0 20px rgba(74,222,128,0.4)",
            marginBottom: 16,
          }}>
            +{formatMoney(earnedAmount)}
          </div>
        )}

        {/* Achievement badge */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          padding: "6px 14px", borderRadius: 12,
          background: "rgba(250,204,21,0.1)",
          border: "1px solid rgba(250,204,21,0.25)",
          marginBottom: 20,
        }}>
          <span style={{ fontSize: 14 }}>🏅</span>
          <span style={{ fontSize: 11, fontWeight: 800, color: "#facc15" }}>
            دستاورد: اولین روز کاری
          </span>
        </div>

        {/* CTA */}
        <button
          onClick={handleClaim}
          style={{
            width: "100%", padding: "14px",
            borderRadius: 16, fontSize: 15, fontWeight: 900,
            background: "linear-gradient(135deg, rgba(250,204,21,0.9), rgba(245,158,11,0.9))",
            color: "#1a1000", border: "none",
            cursor: "pointer", fontFamily: "inherit",
            boxShadow: "0 4px 20px rgba(250,204,21,0.3)",
          }}
        >
          دریافت هدیه 🎁
        </button>
      </div>
    </div>
  );
}
