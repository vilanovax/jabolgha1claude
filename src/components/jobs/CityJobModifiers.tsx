"use client";
import { useState, useEffect } from "react";
import { useCityStore } from "@/game/city/city-store";
import { getCityGameplayModifiers } from "@/game/integration/city-impact-resolver";
import { toPersian } from "@/data/mock";
import type { SectorId } from "@/game/city/types";

const SECTOR_LABELS: Record<SectorId, string> = {
  tech: "فناوری",
  finance: "مالی",
  construction: "ساخت‌وساز",
  retail: "خرده‌فروشی",
  services: "خدمات",
  manufacturing: "صنعت",
};

const SECTOR_EMOJIS: Record<SectorId, string> = {
  tech: "💻", finance: "🏦", construction: "🏗️",
  retail: "🛍️", services: "🔧", manufacturing: "🏭",
};

export default function CityJobModifiers() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const cityState = useCityStore((s) => ({
    sectors: s.sectors,
    currentWaveId: s.currentWaveId,
    activeEvents: s.activeEvents,
    economyHealth: s.economyHealth,
    inflationLevel: s.inflationLevel,
    waveRemainingDays: s.waveRemainingDays,
    lastUpdatedDay: s.lastUpdatedDay,
  }));

  if (!mounted) return null;

  // We need full city state for modifiers
  const fullCityState = useCityStore.getState();
  const modifiers = getCityGameplayModifiers(fullCityState);

  const sectorIds: SectorId[] = ["tech", "finance", "construction", "retail", "services", "manufacturing"];

  const impactSectors = sectorIds.filter((id) => {
    const hiring = modifiers.jobMarket.hiringChanceModifierBySector[id];
    const salary = modifiers.jobMarket.salaryMultiplierBySector[id];
    return Math.abs(hiring) > 0.03 || Math.abs(salary - 1) > 0.04;
  });

  if (impactSectors.length === 0) return null;

  return (
    <div style={{
      marginBottom: 14,
      padding: "12px 14px",
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(255,255,255,0.07)",
      borderRadius: 16,
    }}>
      <div style={{
        fontSize: 11, fontWeight: 800, color: "rgba(255,255,255,0.5)",
        marginBottom: 8, display: "flex", alignItems: "center", gap: 6,
      }}>
        🌆 اثر اقتصاد شهر روی فرصت‌های شغلی
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {impactSectors.map((id) => {
          const hiring = modifiers.jobMarket.hiringChanceModifierBySector[id];
          const salary = modifiers.jobMarket.salaryMultiplierBySector[id];
          const isPositive = hiring > 0 || salary > 1.04;

          return (
            <div key={id} style={{
              display: "flex", alignItems: "center", gap: 8,
            }}>
              <span style={{ fontSize: 14 }}>{SECTOR_EMOJIS[id]}</span>
              <span style={{
                fontSize: 11, color: "rgba(255,255,255,0.6)", flex: 1,
              }}>
                {SECTOR_LABELS[id]}
              </span>

              {Math.abs(hiring) > 0.03 && (
                <span style={{
                  fontSize: 9, fontWeight: 700,
                  color: hiring > 0 ? "#4ade80" : "#f87171",
                  background: hiring > 0 ? "rgba(74,222,128,0.1)" : "rgba(248,113,113,0.1)",
                  padding: "2px 6px", borderRadius: 6,
                }}>
                  استخدام {hiring > 0 ? "+" : ""}{toPersian(Math.round(hiring * 100))}٪
                </span>
              )}

              {Math.abs(salary - 1) > 0.04 && (
                <span style={{
                  fontSize: 9, fontWeight: 700,
                  color: salary > 1 ? "#4ade80" : "#f87171",
                  background: salary > 1 ? "rgba(74,222,128,0.1)" : "rgba(248,113,113,0.1)",
                  padding: "2px 6px", borderRadius: 6,
                }}>
                  حقوق ×{toPersian(salary.toFixed(2))}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
