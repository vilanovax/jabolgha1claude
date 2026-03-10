"use client";
import { useState, useEffect } from "react";
import { useGameStore } from "@/stores/gameStore";

const BUBBLE_DELAY = 1800;

export default function OnboardingStory() {
  const [visibleCount, setVisibleCount] = useState(0);
  const playerName  = useGameStore((s) => s.player.name.split(" ")[0]);
  const setTutorialStep = useGameStore((s) => s.setTutorialStep);

  const bubbles = [
    `سلام ${playerName}! خوش اومدی به شهر.`,
    "امروز اولین روز کاریته. ۵۰۰ هزار تومن توی جیبت داری.",
    "باید کار کنی، پول دربیاری و زندگیت رو بسازی.",
  ];

  useEffect(() => {
    if (visibleCount >= bubbles.length) return;
    const t = setTimeout(() => setVisibleCount((n) => n + 1), BUBBLE_DELAY);
    return () => clearTimeout(t);
  }, [visibleCount, bubbles.length]);

  const handleDone = () => setTutorialStep(2);

  return (
    <div style={{
      position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
      width: "100%", maxWidth: 430, zIndex: 100,
      padding: "0 16px 32px",
      pointerEvents: "none",
    }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, pointerEvents: "auto" }}>
        {bubbles.slice(0, visibleCount).map((text, i) => (
          <div
            key={i}
            className="page-enter"
            style={{
              padding: "12px 16px",
              borderRadius: 18,
              background: "rgba(6,9,28,0.92)",
              border: "1px solid rgba(129,140,248,0.25)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              boxShadow: "0 4px 24px rgba(0,0,0,0.5)",
            }}
          >
            <span style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.85)", lineHeight: 1.6 }}>
              {i === 0 && <span style={{ marginLeft: 6 }}>🙂</span>}
              {text}
            </span>
          </div>
        ))}

        {visibleCount >= bubbles.length && (
          <button
            className="page-enter"
            onClick={handleDone}
            style={{
              width: "100%", padding: "14px",
              borderRadius: 16, fontSize: 14, fontWeight: 900,
              background: "rgba(99,102,241,0.85)",
              color: "white", border: "none",
              cursor: "pointer", fontFamily: "inherit",
              boxShadow: "0 4px 20px rgba(99,102,241,0.4)",
            }}
          >
            💻 بریم — لپ‌تاپ رو باز کن!
          </button>
        )}
      </div>
    </div>
  );
}
