"use client";
import { useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import TopHeader from "@/components/layout/TopHeader";
import BottomNav from "@/components/layout/BottomNav";
import { useGameStore } from "@/stores/gameStore";
import {
  HOUSING_TIERS, VEHICLE_TIERS, MOBILE_PLANS,
  calculateWeeklyBills, BILL_LABELS,
} from "@/data/livingCosts";
import { formatMoney, toPersian } from "@/data/mock";

type Tab = "bills" | "housing" | "vehicle" | "mobile";

export default function LivingPage() {
  const [tab, setTab] = useState<Tab>("bills");
  const [toast, setToast] = useState<string | null>(null);

  const player = useGameStore((s) => s.player);
  const living = useGameStore((s) => s.living);
  const checking = useGameStore((s) => s.bank.checking);
  const upgradeHousing = useGameStore((s) => s.upgradeHousing);
  const upgradeVehicle = useGameStore((s) => s.upgradeVehicle);
  const changeMobilePlan = useGameStore((s) => s.changeMobilePlan);

  const currentHousing = HOUSING_TIERS.find((h) => h.id === living.housingId)!;
  const currentVehicle = VEHICLE_TIERS.find((v) => v.id === living.vehicleId)!;
  const currentMobile = MOBILE_PLANS.find((m) => m.id === living.mobilePlanId)!;
  const { total, breakdown } = calculateWeeklyBills(
    living.housingId, living.vehicleId, living.mobilePlanId, living.isOwned,
  );
  const daysUntilBill = 7 - (player.dayInGame - living.lastBillDay);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  }

  return (
    <div className="game-bg" style={{ minHeight: "100dvh" }}>
      <TopHeader />

      <div className="page-enter" style={{
        paddingTop: "calc(var(--header-h) + 8px)",
        paddingBottom: "calc(var(--nav-h) + 16px)",
        paddingLeft: 14, paddingRight: 14,
        position: "relative", zIndex: 2,
      }}>
        {/* Header */}
        <div style={{
          display: "flex", alignItems: "center", gap: 12,
          marginBottom: 14,
        }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <div style={{
              width: 38, height: 38, borderRadius: 14,
              background: "linear-gradient(145deg, #0F2340, #1B3A5C)",
              display: "flex", alignItems: "center", justifyContent: "center",
              border: "1px solid rgba(255,255,255,0.1)",
              boxShadow: "0 4px 14px rgba(10,22,40,0.4)",
            }}>
              <ChevronRight size={18} color="rgba(255,255,255,0.8)" />
            </div>
          </Link>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: "white", display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 20 }}>🏠</span> هزینه‌های زندگی
            </div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>
              قبوض · مسکن · خودرو · موبایل
            </div>
          </div>
        </div>

        {/* Weekly total banner */}
        <div style={{
          padding: "14px 16px", marginBottom: 14, borderRadius: 18,
          background: "linear-gradient(135deg, rgba(239,68,68,0.1), rgba(239,68,68,0.04))",
          border: "1px solid rgba(239,68,68,0.15)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.4)", marginBottom: 3 }}>
              هزینه هفتگی کل
            </div>
            <div style={{ fontSize: 18, fontWeight: 900, color: "#f87171" }}>
              {formatMoney(total)} تومن
            </div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 22, marginBottom: 2 }}>📅</div>
            <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.4)" }}>
              {toPersian(Math.max(0, daysUntilBill))} روز تا قبض
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{
          display: "flex", padding: 3, marginBottom: 14,
          background: "rgba(255,255,255,0.04)",
          borderRadius: 16, border: "1px solid rgba(255,255,255,0.06)",
          overflowX: "auto",
        }}>
          {([
            { key: "bills" as const, label: "📋 قبوض" },
            { key: "housing" as const, label: "🏠 مسکن" },
            { key: "vehicle" as const, label: "🚗 خودرو" },
            { key: "mobile" as const, label: "📱 موبایل" },
          ]).map((t) => (
            <button key={t.key} onClick={() => setTab(t.key)}
              style={{
                flex: 1, padding: "9px 0", border: "none", cursor: "pointer",
                borderRadius: 13, fontSize: 11, fontWeight: 700,
                fontFamily: "inherit", transition: "all .2s", whiteSpace: "nowrap",
                background: tab === t.key
                  ? "linear-gradient(180deg, #6366f1, #4f46e5)"
                  : "transparent",
                color: tab === t.key ? "white" : "rgba(255,255,255,0.4)",
                boxShadow: tab === t.key ? "0 4px 14px rgba(99,102,241,0.35)" : "none",
              }}
            >{t.label}</button>
          ))}
        </div>

        {/* ─── Bills Tab ─── */}
        {tab === "bills" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {breakdown.map((bill) => (
              <div key={bill.key} style={{
                padding: "12px 14px", borderRadius: 16,
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.06)",
                display: "flex", alignItems: "center", justifyContent: "space-between",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 20 }}>{bill.emoji}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "white" }}>{bill.label}</span>
                </div>
                <span style={{ fontSize: 12, fontWeight: 800, color: "#f87171" }}>
                  {formatMoney(bill.amount)} تومن
                </span>
              </div>
            ))}

            {/* Summary */}
            <div style={{
              padding: "14px", borderRadius: 16,
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.08)",
              display: "flex", alignItems: "center", justifyContent: "space-between",
            }}>
              <span style={{ fontSize: 13, fontWeight: 800, color: "white" }}>جمع هفتگی</span>
              <span style={{ fontSize: 14, fontWeight: 900, color: "#f87171" }}>
                {formatMoney(total)} تومن
              </span>
            </div>

            <div style={{
              padding: "10px 14px", borderRadius: 14,
              background: "rgba(255,255,255,0.03)",
              textAlign: "center", fontSize: 10, fontWeight: 600,
              color: "rgba(255,255,255,0.3)",
            }}>
              💡 با تغییر مسکن، خودرو یا پلن موبایل هزینه‌ها تغییر می‌کنن
            </div>
          </div>
        )}

        {/* ─── Housing Tab ─── */}
        {tab === "housing" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {HOUSING_TIERS.map((tier) => {
              const isCurrent = tier.id === living.housingId;
              const canLevel = player.level >= tier.requiredLevel;
              const weeklyBills = Object.values(tier.bills).reduce((a, b) => a + b, 0);
              const weeklyRent = tier.monthlyRent > 0 ? Math.round(tier.monthlyRent / 4) : 0;

              return (
                <div key={tier.id} style={{
                  padding: "16px", borderRadius: 20,
                  background: isCurrent
                    ? "linear-gradient(135deg, rgba(99,102,241,0.1), rgba(99,102,241,0.04))"
                    : "rgba(255,255,255,0.04)",
                  border: isCurrent
                    ? "1.5px solid rgba(99,102,241,0.3)"
                    : "1px solid rgba(255,255,255,0.06)",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                    <span style={{ fontSize: 28 }}>{tier.emoji}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ fontSize: 14, fontWeight: 800, color: "white" }}>{tier.name}</span>
                        {isCurrent && (
                          <span style={{
                            fontSize: 8, fontWeight: 800, padding: "2px 8px",
                            background: "rgba(99,102,241,0.2)", color: "#818cf8",
                            borderRadius: 20, border: "1px solid rgba(99,102,241,0.3)",
                          }}>{living.isOwned ? "ملکی" : "اجاره‌ای"}</span>
                        )}
                        {!canLevel && (
                          <span style={{
                            fontSize: 8, fontWeight: 700, padding: "2px 6px",
                            background: "rgba(239,68,68,0.12)", color: "#f87171",
                            borderRadius: 20,
                          }}>🔒 سطح {toPersian(tier.requiredLevel)}</span>
                        )}
                      </div>
                      <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>
                        {tier.location} · {toPersian(tier.area)} متر
                      </div>
                    </div>
                  </div>

                  {/* Specs */}
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
                    <span style={{
                      fontSize: 9, fontWeight: 700, padding: "3px 8px", borderRadius: 8,
                      background: "rgba(34,197,94,0.12)", color: "#4ade80",
                    }}>😊 +{toPersian(tier.happinessBonus)}</span>
                    <span style={{
                      fontSize: 9, fontWeight: 700, padding: "3px 8px", borderRadius: 8,
                      background: "rgba(59,130,246,0.12)", color: "#60a5fa",
                    }}>⚡ +{toPersian(tier.energyBonus)}</span>
                    <span style={{
                      fontSize: 9, fontWeight: 700, padding: "3px 8px", borderRadius: 8,
                      background: "rgba(239,68,68,0.12)", color: "#f87171",
                    }}>📋 {formatMoney(weeklyBills + weeklyRent)}/هفته</span>
                  </div>

                  {/* Actions */}
                  {!isCurrent && canLevel && (
                    <div style={{ display: "flex", gap: 8 }}>
                      {/* Rent option */}
                      {tier.monthlyRent > 0 && (
                        <button onClick={() => {
                          const r = upgradeHousing(tier.id, false);
                          showToast(r.success ? `اجاره ${tier.name} تنظیم شد!` : r.reason!);
                        }} style={{
                          flex: 1, padding: "8px 0", borderRadius: 14,
                          border: "1px solid rgba(99,102,241,0.3)",
                          background: "linear-gradient(135deg, rgba(99,102,241,0.15), rgba(99,102,241,0.08))",
                          color: "white", fontSize: 11, fontWeight: 800,
                          cursor: "pointer", fontFamily: "inherit",
                        }}>
                          اجاره · {formatMoney(tier.monthlyRent)}/ماه
                        </button>
                      )}
                      {/* Buy option */}
                      {tier.purchasePrice > 0 && (
                        <button onClick={() => {
                          const r = upgradeHousing(tier.id, true);
                          showToast(r.success ? `${tier.name} خریداری شد! 🎉` : r.reason!);
                        }} style={{
                          flex: 1, padding: "8px 0", borderRadius: 14,
                          border: "1px solid rgba(34,197,94,0.3)",
                          background: "linear-gradient(135deg, rgba(34,197,94,0.15), rgba(34,197,94,0.08))",
                          color: "#4ade80", fontSize: 11, fontWeight: 800,
                          cursor: checking >= (tier.purchasePrice - (living.isOwned ? currentHousing.resaleValue : 0)) ? "pointer" : "default",
                          fontFamily: "inherit",
                          opacity: checking >= (tier.purchasePrice - (living.isOwned ? currentHousing.resaleValue : 0)) ? 1 : 0.5,
                        }}>
                          خرید · {formatMoney(tier.purchasePrice)}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ─── Vehicle Tab ─── */}
        {tab === "vehicle" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {VEHICLE_TIERS.map((tier) => {
              const isCurrent = tier.id === living.vehicleId;
              const canLevel = player.level >= tier.requiredLevel;
              const netCost = tier.purchasePrice - currentVehicle.resaleValue;
              const canAfford = checking >= netCost || netCost <= 0;
              const weeklyCost = tier.weeklyFuelCost + tier.weeklyInsurance;

              return (
                <div key={tier.id} style={{
                  padding: "16px", borderRadius: 20,
                  background: isCurrent
                    ? "linear-gradient(135deg, rgba(99,102,241,0.1), rgba(99,102,241,0.04))"
                    : "rgba(255,255,255,0.04)",
                  border: isCurrent
                    ? "1.5px solid rgba(99,102,241,0.3)"
                    : "1px solid rgba(255,255,255,0.06)",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                    <span style={{ fontSize: 28 }}>{tier.emoji}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ fontSize: 14, fontWeight: 800, color: "white" }}>{tier.name}</span>
                        {isCurrent && (
                          <span style={{
                            fontSize: 8, fontWeight: 800, padding: "2px 8px",
                            background: "rgba(99,102,241,0.2)", color: "#818cf8",
                            borderRadius: 20, border: "1px solid rgba(99,102,241,0.3)",
                          }}>فعلی</span>
                        )}
                        {!canLevel && (
                          <span style={{
                            fontSize: 8, fontWeight: 700, padding: "2px 6px",
                            background: "rgba(239,68,68,0.12)", color: "#f87171",
                            borderRadius: 20,
                          }}>🔒 سطح {toPersian(tier.requiredLevel)}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Specs */}
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
                    {tier.happinessBonus > 0 && (
                      <span style={{
                        fontSize: 9, fontWeight: 700, padding: "3px 8px", borderRadius: 8,
                        background: "rgba(34,197,94,0.12)", color: "#4ade80",
                      }}>😊 +{toPersian(tier.happinessBonus)}</span>
                    )}
                    {weeklyCost > 0 && (
                      <span style={{
                        fontSize: 9, fontWeight: 700, padding: "3px 8px", borderRadius: 8,
                        background: "rgba(239,68,68,0.12)", color: "#f87171",
                      }}>⛽🛡️ {formatMoney(weeklyCost)}/هفته</span>
                    )}
                    {tier.purchasePrice > 0 && (
                      <span style={{
                        fontSize: 9, fontWeight: 700, padding: "3px 8px", borderRadius: 8,
                        background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.3)",
                      }}>💰 {formatMoney(tier.purchasePrice)}</span>
                    )}
                  </div>

                  {/* Action */}
                  {!isCurrent && canLevel && (
                    <button
                      onClick={() => {
                        const r = upgradeVehicle(tier.id);
                        showToast(r.success ? `${tier.name} خریداری شد! 🎉` : r.reason!);
                      }}
                      disabled={!canAfford}
                      style={{
                        width: "100%", padding: "9px 0", borderRadius: 14,
                        border: canAfford ? "1px solid rgba(99,102,241,0.3)" : "1px solid rgba(255,255,255,0.06)",
                        background: canAfford
                          ? "linear-gradient(135deg, rgba(99,102,241,0.15), rgba(99,102,241,0.08))"
                          : "rgba(255,255,255,0.03)",
                        color: canAfford ? "white" : "rgba(255,255,255,0.2)",
                        fontSize: 11, fontWeight: 800,
                        cursor: canAfford ? "pointer" : "default",
                        fontFamily: "inherit",
                      }}
                    >
                      {netCost > 0
                        ? `خرید · هزینه خالص: ${formatMoney(netCost)} تومن`
                        : tier.id === "none"
                          ? `فروش خودرو · دریافت ${formatMoney(Math.abs(netCost))} تومن`
                          : `تعویض · ${formatMoney(tier.purchasePrice)}`}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ─── Mobile Tab ─── */}
        {tab === "mobile" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {MOBILE_PLANS.map((plan) => {
              const isCurrent = plan.id === living.mobilePlanId;

              return (
                <div key={plan.id} style={{
                  padding: "16px", borderRadius: 20,
                  background: isCurrent
                    ? "linear-gradient(135deg, rgba(99,102,241,0.1), rgba(99,102,241,0.04))"
                    : "rgba(255,255,255,0.04)",
                  border: isCurrent
                    ? "1.5px solid rgba(99,102,241,0.3)"
                    : "1px solid rgba(255,255,255,0.06)",
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 24 }}>{plan.emoji}</span>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ fontSize: 13, fontWeight: 800, color: "white" }}>{plan.name}</span>
                        {isCurrent && (
                          <span style={{
                            fontSize: 8, fontWeight: 800, padding: "2px 8px",
                            background: "rgba(99,102,241,0.2)", color: "#818cf8",
                            borderRadius: 20,
                          }}>فعلی</span>
                        )}
                      </div>
                      <div style={{ display: "flex", gap: 6, marginTop: 3 }}>
                        <span style={{
                          fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 6,
                          background: "rgba(59,130,246,0.12)", color: "#60a5fa",
                        }}>📶 {toPersian(plan.dataGB)} GB</span>
                        <span style={{
                          fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 6,
                          background: "rgba(239,68,68,0.12)", color: "#f87171",
                        }}>{formatMoney(plan.weeklyCost)}/هفته</span>
                      </div>
                    </div>
                  </div>

                  {!isCurrent && (
                    <button onClick={() => {
                      const r = changeMobilePlan(plan.id);
                      showToast(r.success ? `پلن ${plan.name} فعال شد!` : r.reason!);
                    }} style={{
                      padding: "7px 16px", borderRadius: 12,
                      border: "1px solid rgba(99,102,241,0.3)",
                      background: "linear-gradient(135deg, rgba(99,102,241,0.15), rgba(99,102,241,0.08))",
                      color: "white", fontSize: 11, fontWeight: 800,
                      cursor: "pointer", fontFamily: "inherit",
                    }}>
                      انتخاب
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div style={{
          position: "fixed", bottom: 80, left: "50%", transform: "translateX(-50%)",
          padding: "10px 20px", borderRadius: 16,
          background: "rgba(0,0,0,0.85)",
          border: "1px solid rgba(255,255,255,0.1)",
          color: "white", fontSize: 12, fontWeight: 700,
          zIndex: 300, whiteSpace: "nowrap",
          backdropFilter: "blur(10px)",
        }}>
          {toast}
        </div>
      )}

      <BottomNav />
    </div>
  );
}
