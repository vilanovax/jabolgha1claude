"use client";
import { useGameTick } from "@/hooks/useGameTick";

export default function GameTickProvider({ children }: { children: React.ReactNode }) {
  useGameTick(10_000);
  return <>{children}</>;
}
