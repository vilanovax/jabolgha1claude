"use client";
import { useCityStore } from "@/game/city/city-store";
import { CITY_WAVES } from "@/game/city/seed-waves";
import { toPersian } from "@/data/mock";

const severityStyle = {
  minor:  { bg: "rgba(96,165,250,0.1)",  color: "#60a5fa",  border: "rgba(96,165,250,0.2)",  label: "خبر" },
  major:  { bg: "rgba(251,191,36,0.1)",  color: "#fbbf24",  border: "rgba(251,191,36,0.2)",  label: "مهم" },
  crisis: { bg: "rgba(248,113,113,0.1)", color: "#f87171",  border: "rgba(248,113,113,0.2)", label: "بحران" },
};

export default function CityEventsList() {
  const activeEvents = useCityStore((s) => s.activeEvents);
  const currentWaveId = useCityStore((s) => s.currentWaveId);
  const waveRemainingDays = useCityStore((s) => s.waveRemainingDays);
  const wave = CITY_WAVES[currentWaveId];

  return (
    <div>
      {/* Active Wave Card */}
      <div className="anim-breathe" style={{
        borderRadius: 18,
        padding: "14px 16px",
        marginBottom: 12,
        background: "linear-gradient(135deg, rgba(99,102,241,0.12), rgba(67,56,202,0.06))",
        border: "1px solid rgba(99,102,241,0.2)",
        boxShadow: "0 0 16px rgba(99,102,241,0.06)",
      }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 8, marginBottom: 6,
        }}>
          <span style={{ fontSize: 22 }}>{wave.emoji}</span>
          <div>
            <div style={{ fontSize: 13, fontWeight: 800, color: "white" }}>
              {wave.nameFa}
            </div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.45)" }}>
              {wave.descriptionFa}
            </div>
          </div>
          <div style={{
            marginRight: "auto",
            fontSize: 9, fontWeight: 700,
            color: "#818cf8",
            background: "rgba(99,102,241,0.15)",
            border: "1px solid rgba(99,102,241,0.25)",
            borderRadius: 8, padding: "2px 7px",
          }}>
            ⏳ {toPersian(waveRemainingDays)} روز
          </div>
        </div>

        <div style={{
          display: "flex", gap: 6, flexWrap: "wrap",
        }}>
          <span style={{
            fontSize: 9, fontWeight: 600, padding: "2px 7px",
            borderRadius: 8, color: "#fbbf24",
            background: "rgba(251,191,36,0.1)",
            border: "1px solid rgba(251,191,36,0.2)",
          }}>
            سرمایه ×{toPersian(wave.investmentBonus.toFixed(1))}
          </span>
          {wave.globalInflationDelta > 0 && (
            <span style={{
              fontSize: 9, fontWeight: 600, padding: "2px 7px",
              borderRadius: 8, color: "#f87171",
              background: "rgba(248,113,113,0.1)",
              border: "1px solid rgba(248,113,113,0.2)",
            }}>
              تورم +{toPersian(wave.globalInflationDelta.toFixed(1))}٪/روز
            </span>
          )}
        </div>
      </div>

      {/* Active City Events */}
      {activeEvents.length > 0 && (
        <>
          <div style={{
            fontSize: 11, fontWeight: 800, color: "rgba(255,255,255,0.5)",
            marginBottom: 8, display: "flex", alignItems: "center", gap: 6,
          }}>
            <span>⚡</span> رویدادهای فعال شهر
          </div>
          {activeEvents.map((ev) => {
            const style = severityStyle[ev.severity];
            return (
              <div key={ev.id} style={{
                padding: "12px 14px",
                background: style.bg,
                border: `1px solid ${style.border}`,
                borderRadius: 16,
                marginBottom: 8,
              }}>
                <div style={{
                  display: "flex", alignItems: "center", gap: 8, marginBottom: 4,
                }}>
                  <span style={{ fontSize: 20 }}>{ev.emoji}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 800, color: "white" }}>
                      {ev.titleFa}
                    </div>
                    <div style={{ fontSize: 10, color: "rgba(255,255,255,0.45)" }}>
                      {ev.descriptionFa}
                    </div>
                  </div>
                  <div style={{
                    fontSize: 8, fontWeight: 700, padding: "2px 7px",
                    borderRadius: 6, background: style.bg,
                    color: style.color, border: `1px solid ${style.border}`,
                    whiteSpace: "nowrap",
                  }}>
                    {style.label}
                  </div>
                </div>

                <div style={{
                  display: "flex", gap: 6, flexWrap: "wrap",
                }}>
                  {ev.salaryImpact !== 0 && (
                    <span style={{
                      fontSize: 9, fontWeight: 600,
                      color: ev.salaryImpact > 0 ? "#4ade80" : "#f87171",
                    }}>
                      حقوق {ev.salaryImpact > 0 ? "+" : ""}{toPersian((ev.salaryImpact * 100).toFixed(0))}٪
                    </span>
                  )}
                  {ev.investmentImpact !== 0 && (
                    <span style={{
                      fontSize: 9, fontWeight: 600,
                      color: ev.investmentImpact > 0 ? "#fbbf24" : "#f87171",
                    }}>
                      سرمایه {ev.investmentImpact > 0 ? "+" : ""}{toPersian((ev.investmentImpact * 100).toFixed(0))}٪
                    </span>
                  )}
                  <span style={{
                    fontSize: 9, color: "rgba(255,255,255,0.3)",
                    marginRight: "auto",
                  }}>
                    ⏳ {toPersian(ev.remainingDays)} روز
                  </span>
                </div>
              </div>
            );
          })}
        </>
      )}

      {activeEvents.length === 0 && (
        <div style={{
          textAlign: "center", padding: "20px",
          color: "rgba(255,255,255,0.25)", fontSize: 11,
          background: "rgba(255,255,255,0.02)",
          borderRadius: 14, border: "1px solid rgba(255,255,255,0.04)",
        }}>
          <div style={{ fontSize: 28, marginBottom: 6 }}>🔍</div>
          هیچ رویداد فعالی وجود نداره
        </div>
      )}
    </div>
  );
}
