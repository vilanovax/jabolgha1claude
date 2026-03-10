"use client";
import { useGameStore } from "@/stores/gameStore";

const GIFT_META: Record<string, { emoji: string; nameFa: string; descFa: string }> = {
  developer:   { emoji: "💺", nameFa: "صندلی ارگونومیک", descFa: "درآمد کاری ۱۰٪ بهتر" },
  rich:        { emoji: "💺", nameFa: "صندلی ارگونومیک", descFa: "درآمد کاری ۱۰٪ بهتر" },
  house:       { emoji: "📖", nameFa: "قفسه کتاب",       descFa: "سرعت یادگیری ۱۵٪ بیشتر" },
  comfortable: { emoji: "☕", nameFa: "دستگاه قهوه",     descFa: "هر روز ۱۰ انرژی اضافه" },
};

export default function OnboardingGift() {
  const playerGoal      = useGameStore((s) => s.playerGoal);
  const setTutorialStep = useGameStore((s) => s.setTutorialStep);

  const gift = GIFT_META[playerGoal] ?? GIFT_META.developer;

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
        border: "1.5px solid rgba(251,146,60,0.3)",
        padding: "28px 24px",
        boxShadow: "0 8px 48px rgba(0,0,0,0.6), 0 0 40px rgba(251,146,60,0.08)",
        textAlign: "center",
      }}>
        {/* Header */}
        <div style={{
          fontSize: 11, fontWeight: 800, color: "#fb923c",
          marginBottom: 16, letterSpacing: "0.5px",
        }}>
          🎁 هدیه شروع — مال توئه!
        </div>

        {/* Gift item */}
        <div style={{ fontSize: 56, marginBottom: 12 }}>{gift.emoji}</div>
        <div style={{ fontSize: 18, fontWeight: 900, color: "white", marginBottom: 6 }}>
          {gift.nameFa}
        </div>
        <div style={{
          fontSize: 12, fontWeight: 700, color: "#4ade80",
          marginBottom: 24,
        }}>
          ✨ {gift.descFa}
        </div>

        {/* Added to room */}
        <div style={{
          padding: "8px 14px", borderRadius: 12,
          background: "rgba(74,222,128,0.08)",
          border: "1px solid rgba(74,222,128,0.15)",
          fontSize: 10, fontWeight: 700, color: "rgba(74,222,128,0.8)",
          marginBottom: 20,
        }}>
          ✅ به اتاقت اضافه شد
        </div>

        {/* CTA */}
        <button
          onClick={() => setTutorialStep(5)}
          style={{
            width: "100%", padding: "14px",
            borderRadius: 16, fontSize: 15, fontWeight: 900,
            background: "rgba(99,102,241,0.85)",
            color: "white", border: "none",
            cursor: "pointer", fontFamily: "inherit",
            boxShadow: "0 4px 20px rgba(99,102,241,0.3)",
          }}
        >
          ادامه ←
        </button>
      </div>
    </div>
  );
}
