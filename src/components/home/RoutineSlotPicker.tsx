"use client";
import { ACTION_CATEGORIES } from "@/data/actionTemplates";
import { useGameStore } from "@/stores/gameStore";
import type { RoutineState } from "@/stores/gameStore";

interface Props {
  slot: keyof RoutineState | null;
  onClose: () => void;
}

const SLOT_LABELS: Record<string, string> = {
  morning: "صبح 🌅",
  noon: "ظهر ☀️",
  evening: "عصر 🌇",
  night: "شب 🌙",
};

export default function RoutineSlotPicker({ slot, onClose }: Props) {
  const setRoutineSlot = useGameStore((s) => s.setRoutineSlot);
  const routine = useGameStore((s) => s.routine);

  if (!slot) return null;

  const currentAssigned = routine[slot];

  const handleSelect = (categoryId: string) => {
    setRoutineSlot(slot, categoryId);
    onClose();
  };

  const handleClear = () => {
    setRoutineSlot(slot, null);
    onClose();
  };

  return (
    <div className="anim-backdrop-in" style={{
      position: "fixed", inset: 0,
      background: "rgba(0,0,0,0.5)",
      backdropFilter: "blur(6px)",
      WebkitBackdropFilter: "blur(6px)",
      zIndex: 200,
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-end",
    }} onClick={(e) => {
      if (e.target === e.currentTarget) onClose();
    }}>
      <div className="anim-sheet-up" style={{
        background: "linear-gradient(180deg, #1a1a2e 0%, #0a0e27 100%)",
        borderRadius: "28px 28px 0 0",
        padding: "20px 16px 32px",
        border: "1px solid rgba(255,255,255,0.08)",
        borderBottom: "none",
        boxShadow: "0 -8px 40px rgba(0,0,0,0.5)",
      }}>
        {/* Drag handle */}
        <div style={{
          width: 36, height: 4, borderRadius: 2,
          background: "rgba(255,255,255,0.15)",
          margin: "0 auto 16px",
        }} />

        {/* Header */}
        <div style={{
          fontSize: 14, fontWeight: 800, color: "white",
          textAlign: "center", marginBottom: 16,
        }}>
          انتخاب اکشن برای {SLOT_LABELS[slot]}
        </div>

        {/* Action grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 10,
          marginBottom: 16,
        }}>
          {ACTION_CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              onClick={() => handleSelect(cat.id)}
              style={{
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 4,
                padding: "12px 4px",
                borderRadius: 16,
                background: currentAssigned === cat.id
                  ? "rgba(250,204,21,0.08)"
                  : "rgba(255,255,255,0.04)",
                border: currentAssigned === cat.id
                  ? "1px solid rgba(250,204,21,0.2)"
                  : "1px solid rgba(255,255,255,0.06)",
                transition: "all 0.15s ease",
              }}
            >
              <span style={{ fontSize: 24 }}>{cat.emoji}</span>
              <span style={{
                fontSize: 9, fontWeight: 700,
                color: currentAssigned === cat.id
                  ? "#facc15"
                  : "rgba(255,255,255,0.5)",
              }}>
                {cat.name}
              </span>
            </div>
          ))}
        </div>

        {/* Clear button */}
        {currentAssigned && (
          <button onClick={handleClear} style={{
            width: "100%", padding: "10px 0", borderRadius: 14,
            border: "1px solid rgba(239,68,68,0.15)",
            background: "rgba(239,68,68,0.06)",
            color: "#f87171",
            fontSize: 12, fontWeight: 700,
            fontFamily: "inherit", cursor: "pointer",
          }}>
            حذف از برنامه
          </button>
        )}
      </div>
    </div>
  );
}
