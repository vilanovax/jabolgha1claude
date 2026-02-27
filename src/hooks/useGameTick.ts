"use client";
import { useEffect, useRef } from "react";
import { useGameStore } from "@/stores/gameStore";

export function useGameTick(intervalMs = 10_000) {
  const tick = useGameStore((s) => s.tick);
  const isRunning = useGameStore((s) => s.isRunning);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!isRunning) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(() => {
      tick();
    }, intervalMs);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, intervalMs, tick]);
}
