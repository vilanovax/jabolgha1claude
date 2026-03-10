"use client";
import { useState, useEffect } from "react";
import { useGameStore } from "@/stores/gameStore";
import {
  HOUSING_TIERS, VEHICLE_TIERS, MOBILE_PLANS,
  calculateWeeklyBills, BILL_LABELS,
} from "@/data/livingCosts";
import { formatMoney, toPersian } from "@/data/mock";
import BottomNav from "@/components/layout/BottomNav";

type Tab = "bills" | "housing" | "vehicle" | "mobile";

// ─── Tab config ───────────────────────────────────────────────────────────────
const TABS: { key: Tab; label: string; emoji: string }[] = [
  { key: "bills",   label: "قبوض",   emoji: "📋" },
  { key: "housing", label: "مسکن",   emoji: "🏠" },
  { key: "vehicle", label: "خودرو",  emoji: "🚗" },
  { key: "mobile",  label: "موبایل", emoji: "📱" },
];

export default function LivingPage() {
  const [mounted, setMounted] = useState(false);
  const [tab, setTab] = useState<Tab>("bills");
  const [toast, setToast] = useState<string | null>(null);
  useEffect(() => { setMounted(true); }, []);

  const player           = useGameStore((s) => s.player);
  const living           = useGameStore((s) => s.living);
  const checking         = useGameStore((s) => s.bank.checking);
  const upgradeHousing   = useGameStore((s) => s.upgradeHousing);
  const upgradeVehicle   = useGameStore((s) => s.upgradeVehicle);
  const changeMobilePlan = useGameStore((s) => s.changeMobilePlan);

  const currentHousing = HOUSING_TIERS.find((h) => h.id === living.housingId)!;
  const currentVehicle = VEHICLE_TIERS.find((v) => v.id === living.vehicleId)!;
  const currentMobile  = MOBILE_PLANS.find((m) => m.id === living.mobilePlanId)!;
  const { total, breakdown } = calculateWeeklyBills(
    living.housingId, living.vehicleId, living.mobilePlanId, living.isOwned,
  );
  const daysUntilBill = Math.max(0, 7 - (player.dayInGame - living.lastBillDay));

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  }

  if (!mounted) return null;

  return (
    <div className="scene-bg" style={{ minHeight: "100dvh" }}>

      {/* ── Fixed header ── */}
      <div style={{
        position: "fixed", top: 0, left: "50%", transform: "translateX(-50%)",
        width: "100%", maxWidth: 430, zIndex: 50,
        padding: "10px 14px 0",
        pointerEvents: "none",
      }}>
        <div style={{
          borderRadius: 22, padding: "11px 14px",
          background: "rgba(6,9,28,0.80)",
          backdropFilter: "blur(28px)", WebkitBackdropFilter: "blur(28px)",
          border: "1px solid rgba(255,255,255,0.07)",
          boxShadow: "0 6px 32px rgba(0,0,0,0.5)",
          display: "flex", alignItems: "center", gap: 10,
          pointerEvents: "auto",
        }}>
          <span style={{ fontSize: 18 }}>🏠</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 900, color: "white" }}>هزینه‌های زندگی</div>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", marginTop: 1 }}>
              قبوض · مسکن · خودرو · موبایل
            </div>
          </div>
          {/* Bill countdown pill */}
          <div style={{
            padding: "4px 10px", borderRadius: 10,
            background: daysUntilBill <= 2
              ? "rgba(248,113,113,0.12)"
              : "rgba(255,255,255,0.05)",
            border: `1px solid ${daysUntilBill <= 2 ? "rgba(248,113,113,0.25)" : "rgba(255,255,255,0.08)"}`,
          }}>
            <div style={{
              fontSize: 9, fontWeight: 800,
              color: daysUntilBill <= 2 ? "#f87171" : "rgba(255,255,255,0.4)",
            }}>
              {toPersian(daysUntilBill)} روز تا قبض
            </div>
          </div>
        </div>
      </div>

      <div className="page-enter" style={{
        paddingTop: 90, paddingBottom: "calc(var(--nav-h) + 24px)",
        paddingLeft: 14, paddingRight: 14,
        display: "flex", flexDirection: "column", gap: 12,
      }}>

        {/* ── Current status hero card ── */}
        <div style={{
          borderRadius: 20,
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.07)",
          overflow: "hidden",
        }}>
          <div style={{
            padding: "12px 14px 10px",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
            display: "flex", alignItems: "center", gap: 8,
          }}>
            <span style={{ fontSize: 11, fontWeight: 900, color: "white", flex: 1 }}>وضعیت فعلی</span>
            <span style={{
              fontSize: 9, fontWeight: 800,
              color: "#f87171",
              background: "rgba(248,113,113,0.08)",
              border: "1px solid rgba(248,113,113,0.18)",
              borderRadius: 8, padding: "2px 8px",
            }}>
              {formatMoney(total)} / هفته
            </span>
          </div>
          <div style={{
            padding: "12px 14px",
            display: "flex", gap: 8,
          }}>
            {[
              { emoji: currentHousing.emoji, label: currentHousing.name, sub: living.isOwned ? "ملکی" : "اجاره‌ای" },
              { emoji: currentVehicle.emoji, label: currentVehicle.name, sub: currentVehicle.id === "none" ? "پیاده" : "دارم" },
              { emoji: currentMobile.emoji,  label: currentMobile.name,  sub: `${toPersian(currentMobile.dataGB)} گیگ` },
            ].map((item, i) => (
              <div key={i} style={{
                flex: 1, display: "flex", flexDirection: "column", alignItems: "center",
                gap: 4, padding: "10px 6px", borderRadius: 14,
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}>
                <span style={{ fontSize: 22 }}>{item.emoji}</span>
                <span style={{
                  fontSize: 8, fontWeight: 800, color: "white",
                  textAlign: "center", lineHeight: 1.3,
                  maxWidth: 80, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", width: "100%",
                }}>
                  {item.label}
                </span>
                <span style={{ fontSize: 8, fontWeight: 600, color: "rgba(255,255,255,0.3)" }}>
                  {item.sub}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Tabs ── */}
        <div style={{
          display: "flex", padding: 3,
          background: "rgba(255,255,255,0.03)",
          borderRadius: 16, border: "1px solid rgba(255,255,255,0.06)",
        }}>
          {TABS.map((t) => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{
              flex: 1, padding: "8px 0", border: "none", cursor: "pointer",
              borderRadius: 13, fontFamily: "inherit", transition: "all .2s",
              fontSize: 10, fontWeight: 800,
              background: tab === t.key ? "rgba(99,102,241,0.85)" : "transparent",
              color: tab === t.key ? "white" : "rgba(255,255,255,0.35)",
              boxShadow: tab === t.key ? "0 4px 14px rgba(99,102,241,0.3)" : "none",
            }}>
              {t.emoji} {t.label}
            </button>
          ))}
        </div>

        {/* ─── Bills Tab ─── */}
        {tab === "bills" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {breakdown.map((bill) => (
              <div key={bill.key} style={{
                padding: "12px 14px", borderRadius: 16,
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)",
                display: "flex", alignItems: "center", gap: 10,
              }}>
                <span style={{ fontSize: 20 }}>{bill.emoji}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.75)", flex: 1 }}>
                  {bill.label}
                </span>
                <span style={{ fontSize: 12, fontWeight: 900, color: "#f87171" }}>
                  {formatMoney(bill.amount)}
                </span>
              </div>
            ))}

            {/* Total row */}
            <div style={{
              padding: "14px 16px", borderRadius: 16,
              background: "rgba(248,113,113,0.06)",
              border: "1px solid rgba(248,113,113,0.15)",
              display: "flex", alignItems: "center", justifyContent: "space-between",
            }}>
              <span style={{ fontSize: 13, fontWeight: 900, color: "white" }}>جمع هفتگی</span>
              <span style={{ fontSize: 15, fontWeight: 900, color: "#f87171" }}>
                {formatMoney(total)}
              </span>
            </div>

            <div style={{
              fontSize: 9, fontWeight: 600, color: "rgba(255,255,255,0.25)",
              textAlign: "center", padding: "6px 0",
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
              const canLevel  = player.level >= tier.requiredLevel;
              const weeklyBills = Object.values(tier.bills).reduce((a, b) => a + b, 0);
              const weeklyRent  = tier.monthlyRent > 0 ? Math.round(tier.monthlyRent / 4) : 0;
              const netBuy = tier.purchasePrice - (living.isOwned ? currentHousing.resaleValue : 0);
              const canAffordBuy = checking >= netBuy;

              return (
                <div key={tier.id} style={{
                  borderRadius: 20, overflow: "hidden",
                  background: isCurrent ? "rgba(99,102,241,0.06)" : "rgba(255,255,255,0.03)",
                  border: isCurrent
                    ? "1.5px solid rgba(99,102,241,0.25)"
                    : "1px solid rgba(255,255,255,0.07)",
                }}>
                  {/* Card header */}
                  <div style={{ padding: "14px 14px 10px", display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 28 }}>{tier.emoji}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                        <span style={{ fontSize: 13, fontWeight: 900, color: "white" }}>{tier.name}</span>
                        {isCurrent && (
                          <span style={{
                            fontSize: 8, fontWeight: 800, padding: "2px 8px",
                            background: "rgba(99,102,241,0.18)", color: "#818cf8",
                            borderRadius: 20, border: "1px solid rgba(99,102,241,0.25)",
                          }}>
                            {living.isOwned ? "✅ ملکی" : "🔑 اجاره‌ای"}
                          </span>
                        )}
                        {!canLevel && (
                          <span style={{
                            fontSize: 8, fontWeight: 700, padding: "2px 6px",
                            background: "rgba(239,68,68,0.1)", color: "#f87171",
                            borderRadius: 20,
                          }}>
                            🔒 سطح {toPersian(tier.requiredLevel)}
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>
                        {tier.location} · {toPersian(tier.area)} متر
                      </div>
                    </div>
                  </div>

                  {/* Stats chips */}
                  <div style={{
                    display: "flex", gap: 5, padding: "0 14px 12px", flexWrap: "wrap",
                  }}>
                    <span style={{
                      fontSize: 9, fontWeight: 700, padding: "3px 8px", borderRadius: 8,
                      background: "rgba(74,222,128,0.1)", color: "#4ade80",
                    }}>😊 +{toPersian(tier.happinessBonus)}</span>
                    <span style={{
                      fontSize: 9, fontWeight: 700, padding: "3px 8px", borderRadius: 8,
                      background: "rgba(96,165,250,0.1)", color: "#60a5fa",
                    }}>⚡ +{toPersian(tier.energyBonus)}</span>
                    <span style={{
                      fontSize: 9, fontWeight: 700, padding: "3px 8px", borderRadius: 8,
                      background: "rgba(248,113,113,0.08)", color: "#f87171",
                    }}>📋 {formatMoney(weeklyBills + weeklyRent)}/هفته</span>
                  </div>

                  {/* Actions */}
                  {!isCurrent && canLevel && (
                    <div style={{
                      display: "flex", gap: 8, padding: "0 14px 14px",
                    }}>
                      {tier.monthlyRent > 0 && (
                        <button onClick={() => {
                          const r = upgradeHousing(tier.id, false);
                          showToast(r.success ? `🔑 اجاره ${tier.name} تنظیم شد` : (r.reason ?? "خطا"));
                        }} style={{
                          flex: 1, padding: "9px 0", borderRadius: 14,
                          border: "1px solid rgba(99,102,241,0.3)",
                          background: "rgba(99,102,241,0.12)",
                          color: "#a5b4fc", fontSize: 10, fontWeight: 800,
                          cursor: "pointer", fontFamily: "inherit",
                        }}>
                          اجاره · {formatMoney(tier.monthlyRent)}/م
                        </button>
                      )}
                      {tier.purchasePrice > 0 && (
                        <button onClick={() => {
                          const r = upgradeHousing(tier.id, true);
                          showToast(r.success ? `🎉 ${tier.name} خریداری شد!` : (r.reason ?? "خطا"));
                        }} style={{
                          flex: 1, padding: "9px 0", borderRadius: 14,
                          border: canAffordBuy ? "1px solid rgba(74,222,128,0.3)" : "1px solid rgba(255,255,255,0.06)",
                          background: canAffordBuy ? "rgba(74,222,128,0.1)" : "rgba(255,255,255,0.03)",
                          color: canAffordBuy ? "#4ade80" : "rgba(255,255,255,0.2)",
                          fontSize: 10, fontWeight: 800,
                          cursor: canAffordBuy ? "pointer" : "default",
                          fontFamily: "inherit",
                          opacity: canAffordBuy ? 1 : 0.7,
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
              const canLevel  = player.level >= tier.requiredLevel;
              const netCost   = tier.purchasePrice - currentVehicle.resaleValue;
              const canAfford = checking >= netCost || netCost <= 0;
              const weeklyCost = tier.weeklyFuelCost + tier.weeklyInsurance;

              return (
                <div key={tier.id} style={{
                  borderRadius: 20, overflow: "hidden",
                  background: isCurrent ? "rgba(99,102,241,0.06)" : "rgba(255,255,255,0.03)",
                  border: isCurrent
                    ? "1.5px solid rgba(99,102,241,0.25)"
                    : "1px solid rgba(255,255,255,0.07)",
                }}>
                  <div style={{ padding: "14px 14px 10px", display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 28 }}>{tier.emoji}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ fontSize: 13, fontWeight: 900, color: "white" }}>{tier.name}</span>
                        {isCurrent && (
                          <span style={{
                            fontSize: 8, fontWeight: 800, padding: "2px 8px",
                            background: "rgba(99,102,241,0.18)", color: "#818cf8",
                            borderRadius: 20, border: "1px solid rgba(99,102,241,0.25)",
                          }}>فعلی</span>
                        )}
                        {!canLevel && (
                          <span style={{
                            fontSize: 8, fontWeight: 700, padding: "2px 6px",
                            background: "rgba(239,68,68,0.1)", color: "#f87171",
                            borderRadius: 20,
                          }}>🔒 سطح {toPersian(tier.requiredLevel)}</span>
                        )}
                      </div>
                      {tier.id !== "none" && (
                        <div style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>
                          ارزش فروش: {formatMoney(tier.resaleValue)}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Stats chips */}
                  <div style={{ display: "flex", gap: 5, padding: "0 14px 12px", flexWrap: "wrap" }}>
                    {tier.happinessBonus > 0 && (
                      <span style={{
                        fontSize: 9, fontWeight: 700, padding: "3px 8px", borderRadius: 8,
                        background: "rgba(74,222,128,0.1)", color: "#4ade80",
                      }}>😊 +{toPersian(tier.happinessBonus)}</span>
                    )}
                    {weeklyCost > 0 && (
                      <span style={{
                        fontSize: 9, fontWeight: 700, padding: "3px 8px", borderRadius: 8,
                        background: "rgba(248,113,113,0.08)", color: "#f87171",
                      }}>⛽+🛡️ {formatMoney(weeklyCost)}/هفته</span>
                    )}
                    {tier.purchasePrice > 0 && (
                      <span style={{
                        fontSize: 9, fontWeight: 700, padding: "3px 8px", borderRadius: 8,
                        background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.35)",
                      }}>💰 {formatMoney(tier.purchasePrice)}</span>
                    )}
                  </div>

                  {!isCurrent && canLevel && (
                    <div style={{ padding: "0 14px 14px" }}>
                      <button
                        onClick={() => {
                          const r = upgradeVehicle(tier.id);
                          showToast(r.success ? `🎉 ${tier.name} خریداری شد!` : (r.reason ?? "خطا"));
                        }}
                        disabled={!canAfford}
                        style={{
                          width: "100%", padding: "9px 0", borderRadius: 14,
                          border: canAfford ? "1px solid rgba(99,102,241,0.3)" : "1px solid rgba(255,255,255,0.06)",
                          background: canAfford ? "rgba(99,102,241,0.12)" : "rgba(255,255,255,0.03)",
                          color: canAfford ? "#a5b4fc" : "rgba(255,255,255,0.2)",
                          fontSize: 10, fontWeight: 800,
                          cursor: canAfford ? "pointer" : "default",
                          fontFamily: "inherit",
                        }}
                      >
                        {netCost > 0
                          ? `خرید · هزینه خالص: ${formatMoney(netCost)}`
                          : tier.id === "none"
                            ? `فروش خودرو · دریافت ${formatMoney(Math.abs(netCost))}`
                            : `تعویض · ${formatMoney(tier.purchasePrice)}`}
                      </button>
                    </div>
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
                  padding: "14px", borderRadius: 20,
                  background: isCurrent ? "rgba(99,102,241,0.06)" : "rgba(255,255,255,0.03)",
                  border: isCurrent
                    ? "1.5px solid rgba(99,102,241,0.25)"
                    : "1px solid rgba(255,255,255,0.07)",
                  display: "flex", alignItems: "center", gap: 12,
                }}>
                  <span style={{ fontSize: 26 }}>{plan.emoji}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ fontSize: 12, fontWeight: 900, color: "white" }}>{plan.name}</span>
                      {isCurrent && (
                        <span style={{
                          fontSize: 8, fontWeight: 800, padding: "2px 8px",
                          background: "rgba(99,102,241,0.18)", color: "#818cf8",
                          borderRadius: 20, border: "1px solid rgba(99,102,241,0.25)",
                        }}>فعلی</span>
                      )}
                    </div>
                    <div style={{ display: "flex", gap: 6, marginTop: 5 }}>
                      <span style={{
                        fontSize: 9, fontWeight: 700, padding: "2px 7px", borderRadius: 7,
                        background: "rgba(96,165,250,0.1)", color: "#60a5fa",
                      }}>📶 {toPersian(plan.dataGB)} گیگ</span>
                      <span style={{
                        fontSize: 9, fontWeight: 700, padding: "2px 7px", borderRadius: 7,
                        background: "rgba(248,113,113,0.08)", color: "#f87171",
                      }}>{formatMoney(plan.weeklyCost)}/هفته</span>
                      {plan.happinessBonus > 0 && (
                        <span style={{
                          fontSize: 9, fontWeight: 700, padding: "2px 7px", borderRadius: 7,
                          background: "rgba(74,222,128,0.1)", color: "#4ade80",
                        }}>😊 +{toPersian(plan.happinessBonus)}</span>
                      )}
                    </div>
                  </div>
                  {!isCurrent && (
                    <button onClick={() => {
                      const r = changeMobilePlan(plan.id);
                      showToast(r.success ? `📱 پلن ${plan.name} فعال شد!` : (r.reason ?? "خطا"));
                    }} style={{
                      padding: "8px 16px", borderRadius: 12,
                      border: "1px solid rgba(99,102,241,0.3)",
                      background: "rgba(99,102,241,0.12)",
                      color: "#a5b4fc", fontSize: 10, fontWeight: 800,
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

      {/* ── Toast ── */}
      {toast && (
        <div style={{
          position: "fixed", bottom: 90, left: "50%", transform: "translateX(-50%)",
          padding: "10px 20px", borderRadius: 16,
          background: "rgba(6,9,28,0.92)",
          border: "1px solid rgba(255,255,255,0.1)",
          color: "white", fontSize: 12, fontWeight: 700,
          zIndex: 300, whiteSpace: "nowrap",
          backdropFilter: "blur(16px)",
        }}>
          {toast}
        </div>
      )}

      <BottomNav />
    </div>
  );
}
