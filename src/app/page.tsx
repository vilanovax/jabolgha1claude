"use client";
import { useState } from "react";
import GameHUD from "@/components/home/GameHUD";
import CharacterStage from "@/components/home/CharacterStage";
import StoryBubble from "@/components/home/StoryBubble";
import HeroActionButton from "@/components/home/HeroActionButton";
import DailyRoutine from "@/components/home/DailyRoutine";
import RoomObjects from "@/components/home/RoomObjects";
import ActionBottomSheet from "@/components/home/ActionBottomSheet";
import RoutineSlotPicker from "@/components/home/RoutineSlotPicker";
import BottomNav from "@/components/layout/BottomNav";
import type { RoutineState } from "@/stores/gameStore";

export default function HomePage() {
  const [done, setDone] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [pickerSlot, setPickerSlot] = useState<keyof RoutineState | null>(null);

  const handleDone = (id: string) => {
    setDone((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  const handleOpenAction = (categoryId: string) => {
    setActiveCategory(categoryId);
  };

  return (
    <div className="scene-bg" style={{ minHeight: "100dvh" }}>
      {/* Floating HUD */}
      <GameHUD />

      {/* Floating particles (decorative) */}
      <div style={{
        position: "fixed",
        top: 0,
        left: "50%",
        transform: "translateX(-50%)",
        width: "100%",
        maxWidth: 430,
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
        overflow: "hidden",
      }}>
        {[
          { x: "15%", delay: "0s", size: 3, dur: "6s" },
          { x: "40%", delay: "2s", size: 2, dur: "8s" },
          { x: "70%", delay: "1s", size: 4, dur: "7s" },
          { x: "85%", delay: "3s", size: 2, dur: "9s" },
          { x: "55%", delay: "4s", size: 3, dur: "6.5s" },
        ].map((p, i) => (
          <div key={i} style={{
            position: "absolute",
            bottom: "20%",
            left: p.x,
            width: p.size,
            height: p.size,
            borderRadius: "50%",
            background: "rgba(99,102,241,0.4)",
            boxShadow: "0 0 6px rgba(99,102,241,0.3)",
            animation: `particle-drift ${p.dur} ease-in-out infinite`,
            animationDelay: p.delay,
          }} />
        ))}
      </div>

      {/* Main content */}
      <div className="page-enter" style={{
        paddingTop: 80,
        paddingBottom: "calc(var(--nav-h) + 16px)",
        paddingLeft: 12,
        paddingRight: 12,
        position: "relative",
        zIndex: 2,
      }}>
        <CharacterStage doneCount={done.length} />
        <StoryBubble />
        <HeroActionButton done={done} onOpenAction={handleOpenAction} />
        <DailyRoutine
          onOpenAction={handleOpenAction}
          onOpenSlotPicker={(slot) => setPickerSlot(slot)}
        />
        <RoomObjects done={done} onOpenAction={handleOpenAction} />
      </div>

      {/* Action Bottom Sheet */}
      <ActionBottomSheet
        categoryId={activeCategory}
        onClose={() => setActiveCategory(null)}
        onDone={handleDone}
      />

      {/* Routine Slot Picker */}
      <RoutineSlotPicker
        slot={pickerSlot}
        onClose={() => setPickerSlot(null)}
      />

      <BottomNav />
    </div>
  );
}
