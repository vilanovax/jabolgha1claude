"use client";
import { useState } from "react";
import { useGameStore } from "@/stores/gameStore";

const CITIES = ["تهران", "مشهد", "اصفهان", "شیراز"];
const JOBS = ["برنامه‌نویس", "طراح", "حسابدار", "فروشنده"];
const GOALS = [
  { id: "developer",   emoji: "💻", label: "برنامه‌نویس موفق" },
  { id: "rich",        emoji: "💰", label: "پولدار شدن" },
  { id: "house",       emoji: "🏠", label: "خرید خانه" },
  { id: "comfortable", emoji: "🌍", label: "زندگی راحت" },
];

export default function OnboardingSetup() {
  const [slide, setSlide] = useState(0);
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [job, setJob] = useState("");

  const setTutorialStep = useGameStore((s) => s.setTutorialStep);
  const setPlayerGoal   = useGameStore((s) => s.setPlayerGoal);
  const setPlayerName   = useGameStore((s) => s.setPlayerName);

  const skip = () => setTutorialStep(-1);

  const handleNext = () => {
    if (slide === 0 && name.trim()) {
      setPlayerName(name.trim());
      setSlide(1);
    } else if (slide === 1 && city) {
      setSlide(2);
    } else if (slide === 2 && job) {
      setSlide(3);
    }
  };

  const handleGoal = (goalId: string) => {
    setPlayerGoal(goalId);
    setTutorialStep(1);
  };

  const canNext =
    (slide === 0 && name.trim().length > 0) ||
    (slide === 1 && city !== "") ||
    (slide === 2 && job !== "");

  const chipStyle = (selected: boolean): React.CSSProperties => ({
    padding: "10px 16px",
    borderRadius: 14,
    border: selected ? "1.5px solid rgba(129,140,248,0.6)" : "1px solid rgba(255,255,255,0.1)",
    background: selected ? "rgba(99,102,241,0.18)" : "rgba(255,255,255,0.04)",
    color: selected ? "white" : "rgba(255,255,255,0.5)",
    fontSize: 13, fontWeight: 700,
    cursor: "pointer", fontFamily: "inherit",
    transition: "all 0.15s",
  });

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 200,
      background: "linear-gradient(170deg, #08091e 0%, #0f1030 100%)",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "24px 20px",
      maxWidth: 430, margin: "0 auto",
    }}>
      {/* Progress dots */}
      <div style={{ display: "flex", gap: 6, marginBottom: 32 }}>
        {[0, 1, 2, 3].map((i) => (
          <div key={i} style={{
            width: i === slide ? 18 : 6, height: 6, borderRadius: 3,
            background: i <= slide ? "#818cf8" : "rgba(255,255,255,0.12)",
            transition: "all 0.3s",
          }} />
        ))}
      </div>

      {/* Slide 0 — Name */}
      {slide === 0 && (
        <div className="page-enter" style={{ width: "100%", display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontSize: 24, fontWeight: 900, color: "white", textAlign: "center", marginBottom: 8 }}>
            👋 سلام! اسمت چیه؟
          </div>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="مثلاً علی یا سارا..."
            autoFocus
            onKeyDown={(e) => e.key === "Enter" && canNext && handleNext()}
            style={{
              width: "100%", padding: "14px 16px",
              borderRadius: 16, fontSize: 16, fontWeight: 700,
              background: "rgba(255,255,255,0.06)",
              border: "1.5px solid rgba(129,140,248,0.3)",
              color: "white", fontFamily: "inherit",
              outline: "none", textAlign: "right",
            }}
          />
        </div>
      )}

      {/* Slide 1 — City */}
      {slide === 1 && (
        <div className="page-enter" style={{ width: "100%", display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontSize: 22, fontWeight: 900, color: "white", textAlign: "center", marginBottom: 8 }}>
            🏙️ کجا زندگی می‌کنی؟
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>
            {CITIES.map((c) => (
              <button key={c} onClick={() => setCity(c)} style={chipStyle(city === c)}>
                {c}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Slide 2 — Job */}
      {slide === 2 && (
        <div className="page-enter" style={{ width: "100%", display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontSize: 22, fontWeight: 900, color: "white", textAlign: "center", marginBottom: 8 }}>
            💼 اولین شغلت چیه؟
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>
            {JOBS.map((j) => (
              <button key={j} onClick={() => setJob(j)} style={chipStyle(job === j)}>
                {j}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Slide 3 — Goal */}
      {slide === 3 && (
        <div className="page-enter" style={{ width: "100%", display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontSize: 22, fontWeight: 900, color: "white", textAlign: "center", marginBottom: 8 }}>
            🎯 هدفت توی زندگی چیه؟
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {GOALS.map((g) => (
              <button
                key={g.id}
                onClick={() => handleGoal(g.id)}
                style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "14px 18px", borderRadius: 16,
                  border: "1px solid rgba(255,255,255,0.1)",
                  background: "rgba(255,255,255,0.04)",
                  cursor: "pointer", fontFamily: "inherit",
                  transition: "all 0.15s",
                }}
              >
                <span style={{ fontSize: 22 }}>{g.emoji}</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: "rgba(255,255,255,0.8)" }}>{g.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Buttons */}
      <div style={{ width: "100%", marginTop: 28, display: "flex", flexDirection: "column", gap: 10 }}>
        {slide < 3 && (
          <button
            onClick={handleNext}
            disabled={!canNext}
            style={{
              width: "100%", padding: "14px",
              borderRadius: 16, fontSize: 15, fontWeight: 900,
              background: canNext ? "rgba(99,102,241,0.8)" : "rgba(255,255,255,0.06)",
              color: canNext ? "white" : "rgba(255,255,255,0.25)",
              border: "none", cursor: canNext ? "pointer" : "default",
              fontFamily: "inherit", transition: "all 0.2s",
            }}
          >
            بعدی ←
          </button>
        )}
        <button
          onClick={skip}
          style={{
            background: "none", border: "none",
            color: "rgba(255,255,255,0.2)", fontSize: 11, fontWeight: 600,
            cursor: "pointer", fontFamily: "inherit", padding: "8px",
          }}
        >
          رد کردن آموزش
        </button>
      </div>
    </div>
  );
}
