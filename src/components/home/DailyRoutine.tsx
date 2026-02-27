"use client";
import { useGameStore } from "@/stores/gameStore";
import { ACTION_CATEGORIES } from "@/data/actionTemplates";
import { toPersian } from "@/data/mock";

const TIME_SLOTS = [
  { key: "morning" as const, emoji: "🌅", label: "صبح" },
  { key: "noon" as const, emoji: "☀️", label: "ظهر" },
  { key: "evening" as const, emoji: "🌇", label: "عصر" },
  { key: "night" as const, emoji: "🌙", label: "شب" },
];

const PHASE_ORDER: Record<string, number> = {
  morning: 0,
  noon: 1,
  evening: 2,
  night: 3,
};

interface Props {
  onOpenAction: (categoryId: string) => void;
  onOpenSlotPicker: (slot: "morning" | "noon" | "evening" | "night") => void;
}

export default function DailyRoutine({ onOpenAction, onOpenSlotPicker }: Props) {
  const routine = useGameStore((s) => s.routine);
  const routineStreak = useGameStore((s) => s.routineStreak);
  const routineCompletedToday = useGameStore((s) => s.routineCompletedToday);
  const completeRoutineSlot = useGameStore((s) => s.completeRoutineSlot);
  const getPhase = useGameStore((s) => s.getPhase);
  const isEndOfDay = useGameStore((s) => s.isEndOfDay);

  const currentPhase = getPhase();
  const currentPhaseOrder = PHASE_ORDER[currentPhase];
  const completedCount = routineCompletedToday.length;
  const allDone = completedCount === 4;

  return (
    <div style={{ padding: "0 8px", marginBottom: 14 }}>
      {/* Header */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        marginBottom: 10, padding: "0 4px",
      }}>
        <div style={{
          fontSize: 13, fontWeight: 800, color: "white",
          display: "flex", alignItems: "center", gap: 6,
        }}>
          <span style={{ fontSize: 15 }}>📅</span>
          برنامه امروز
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {routineStreak > 0 && (
            <span style={{
              fontSize: 9, fontWeight: 700,
              padding: "2px 8px", borderRadius: 8,
              background: "rgba(249,115,22,0.12)",
              color: "#fb923c",
              border: "1px solid rgba(249,115,22,0.2)",
            }}>
              🔥 {toPersian(routineStreak)} روز متوالی
            </span>
          )}
          {allDone && (
            <span style={{
              fontSize: 9, fontWeight: 700,
              padding: "2px 8px", borderRadius: 8,
              background: "rgba(74,222,128,0.12)",
              color: "#4ade80",
              border: "1px solid rgba(74,222,128,0.2)",
            }}>
              ✅ کامل!
            </span>
          )}
        </div>
      </div>

      {/* 4 time slot cards */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: 8,
      }}>
        {TIME_SLOTS.map((slot) => {
          const assignedId = routine[slot.key];
          const category = assignedId
            ? ACTION_CATEGORIES.find((c) => c.id === assignedId)
            : null;
          const isCompleted = routineCompletedToday.includes(slot.key);

          const slotOrder = PHASE_ORDER[slot.key];
          const isCurrent = slot.key === currentPhase && !isEndOfDay;
          const isPast = slotOrder < currentPhaseOrder || isEndOfDay;
          const isDisabled = isCompleted || (isPast && !isCompleted);

          const handleTap = () => {
            if (isDisabled) return;
            if (!assignedId) {
              onOpenSlotPicker(slot.key);
            } else {
              onOpenAction(assignedId);
              completeRoutineSlot(slot.key);
            }
          };

          return (
            <div
              key={slot.key}
              onClick={handleTap}
              className={isCurrent && !isCompleted ? "anim-phase-pulse" : ""}
              style={{
                cursor: isDisabled ? "default" : "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 3,
                padding: "12px 4px 10px",
                borderRadius: 16,
                background: isCompleted
                  ? "rgba(74,222,128,0.06)"
                  : isCurrent
                    ? "rgba(99,102,241,0.08)"
                    : "rgba(255,255,255,0.04)",
                border: isCompleted
                  ? "1px solid rgba(74,222,128,0.15)"
                  : isCurrent
                    ? "1.5px solid rgba(99,102,241,0.3)"
                    : assignedId
                      ? "1px solid rgba(255,255,255,0.08)"
                      : "1px dashed rgba(255,255,255,0.1)",
                opacity: isPast && !isCompleted ? 0.35 : isCompleted ? 0.6 : 1,
                transition: "all 0.2s ease",
              }}
            >
              {/* Time emoji */}
              <span style={{ fontSize: 16 }}>{slot.emoji}</span>

              {/* Time label */}
              <span style={{
                fontSize: 9, fontWeight: 700,
                color: isCurrent
                  ? "#818cf8"
                  : "rgba(255,255,255,0.4)",
              }}>
                {slot.label}
              </span>

              {/* Action icon or empty */}
              {category ? (
                <span style={{ fontSize: 18, marginTop: 2 }}>
                  {category.emoji}
                </span>
              ) : (
                <span style={{
                  fontSize: 16, marginTop: 2,
                  color: "rgba(255,255,255,0.15)",
                }}>
                  +
                </span>
              )}

              {/* Status */}
              <span style={{
                fontSize: 7, fontWeight: 600,
                color: isCompleted
                  ? "#4ade80"
                  : isPast && !isCompleted
                    ? "#f87171"
                    : isCurrent
                      ? "#818cf8"
                      : category
                        ? "rgba(255,255,255,0.3)"
                        : "rgba(255,255,255,0.15)",
              }}>
                {isCompleted ? "✅" : isPast && !isCompleted ? "—" : isCurrent ? "الان" : category ? category.name : "انتخاب"}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
