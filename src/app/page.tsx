"use client";
import { useState } from "react";
import StatusBar from "@/components/home/StatusBar";
import PlayerHeader from "@/components/home/PlayerHeader";
import SuggestedActionCard from "@/components/home/SuggestedActionCard";
import RoomGrid from "@/components/home/RoomGrid";
import QuickDock from "@/components/home/QuickDock";
import BottomNav from "@/components/layout/BottomNav";

export default function HomePage() {
  const [done, setDone] = useState<string[]>([]);

  const handleDone = (id: string) => {
    setDone((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  return (
    <div className="game-bg" style={{ minHeight: "100dvh" }}>
      {/* Scrollable content — no fixed header on home */}
      <div className="page-enter" style={{
        paddingTop: 14,
        paddingBottom: "calc(var(--nav-h) + 16px)",
        paddingLeft: 14,
        paddingRight: 14,
        position: "relative",
        zIndex: 2,
      }}>
        <StatusBar />
        <PlayerHeader doneCount={done.length} />
        <SuggestedActionCard done={done} onDone={handleDone} />
        <RoomGrid done={done} />
        <QuickDock />
      </div>

      <BottomNav />
    </div>
  );
}
