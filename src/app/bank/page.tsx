"use client";
import { useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import TopHeader from "@/components/layout/TopHeader";
import BottomNav from "@/components/layout/BottomNav";
import { formatMoney, toPersian } from "@/data/mock";
import { LOAN_TYPES } from "@/data/loanTypes";
import { useGameStore } from "@/stores/gameStore";

type SheetMode = null | "deposit" | "withdraw" | "loan";

// ─── 7-day sparkline ────────────────────────────────────────────────────────────
function Sparkline({ values, color }: { values: number[]; color: string }) {
  if (values.length < 2) return null;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const W = 130, H = 36;
  const pts = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * W;
      const y = H - ((v - min) / range) * (H - 6) - 3;
      return `${x},${y}`;
    })
    .join(" ");
  return (
    <svg width={W} height={H} style={{ overflow: "visible", display: "block" }}>
      <polyline
        points={pts}
        fill="none"
        stroke={color}
        strokeWidth={2.5}
        strokeLinejoin="round"
        strokeLinecap="round"
        opacity={0.7}
      />
      {/* End dot */}
      {(() => {
        const last = values[values.length - 1];
        const x = W;
        const y = H - ((last - min) / range) * (H - 6) - 3;
        return <circle cx={x} cy={y} r={3.5} fill={color} opacity={0.9} />;
      })()}
    </svg>
  );
}

export default function BankPage() {
  const bank   = useGameStore((s) => s.bank);
  const player = useGameStore((s) => s.player);
  const depositToSavings    = useGameStore((s) => s.depositToSavings);
  const withdrawFromSavings = useGameStore((s) => s.withdrawFromSavings);
  const takeLoan            = useGameStore((s) => s.takeLoan);
  const payLoanInstallment  = useGameStore((s) => s.payLoanInstallment);

  const [sheetMode, setSheetMode] = useState<SheetMode>(null);
  const [amount, setAmount]       = useState("");
  const [message, setMessage]     = useState<{ text: string; ok: boolean } | null>(null);

  // — safe values (guard against stale persisted state) —
  const rate     = bank.savingsInterestRate ?? 0.08;
  const savings  = bank.savings  ?? 0;
  const checking = bank.checking ?? 0;
  const total    = checking + savings;

  const dailyInterest   = Math.round(savings * (rate / 100));
  const monthlyEstimate = dailyInterest * 30;

  // Simulated 7-day asset sparkline (project backwards from today)
  const sparkValues = Array.from({ length: 7 }, (_, i) => total - dailyInterest * (6 - i));

  function handleTransfer() {
    const val = parseInt(amount.replace(/[^\d]/g, ""), 10);
    if (!val || val <= 0) { setMessage({ text: "مبلغ نامعتبر", ok: false }); return; }
    const result = sheetMode === "deposit" ? depositToSavings(val) : withdrawFromSavings(val);
    if (result.success) {
      setMessage({ text: sheetMode === "deposit" ? "سپرده‌گذاری موفق! ✅" : "برداشت موفق! ✅", ok: true });
      setAmount("");
      setTimeout(() => { setSheetMode(null); setMessage(null); }, 1200);
    } else {
      setMessage({ text: result.reason!, ok: false });
    }
  }

  function handleTakeLoan(typeId: string) {
    const result = takeLoan(typeId);
    if (result.success) {
      setMessage({ text: "وام دریافت شد! ✅", ok: true });
      setTimeout(() => { setSheetMode(null); setMessage(null); }, 1200);
    } else {
      setMessage({ text: result.reason!, ok: false });
      setTimeout(() => setMessage(null), 2500);
    }
  }

  function handlePayInstallment(loanId: string) {
    const result = payLoanInstallment(loanId);
    if (result.success) {
      setMessage({ text: "قسط پرداخت شد! ✅", ok: true });
      setTimeout(() => setMessage(null), 1500);
    } else {
      setMessage({ text: result.reason!, ok: false });
      setTimeout(() => setMessage(null), 2500);
    }
  }

  const quickAmounts = [1_000_000, 5_000_000, 10_000_000];
  const maxTransfer  = sheetMode === "deposit" ? checking : savings;

  return (
    <div className="scene-bg" style={{ minHeight: "100dvh" }}>
      <TopHeader />

      <div className="page-enter" style={{
        paddingTop: "calc(var(--header-h) + 8px)",
        paddingBottom: "calc(var(--nav-h) + 16px)",
        paddingLeft: 14, paddingRight: 14,
        position: "relative", zIndex: 2,
      }}>

        {/* ── Page Header ── */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <div style={{
              width: 38, height: 38, borderRadius: 14,
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <ChevronRight size={18} color="rgba(255,255,255,0.8)" />
            </div>
          </Link>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 17, fontWeight: 900, color: "white", display: "flex", alignItems: "center", gap: 6 }}>
              <span>🏦</span> {bank.name}
            </div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>مرکز رشد مالی</div>
          </div>
          {bank.totalInterestEarned > 0 && (
            <div style={{
              fontSize: 10, fontWeight: 700, padding: "4px 10px", borderRadius: 10,
              background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.18)",
              color: "#4ade80",
            }}>
              مجموع سود: {formatMoney(bank.totalInterestEarned)}
            </div>
          )}
        </div>

        {/* ── Total Assets Hero Card ── */}
        <div style={{
          borderRadius: 24, padding: "20px 18px 18px", marginBottom: 12,
          background: "linear-gradient(145deg, #0F2340, #1B3A5C 60%, #263E66)",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 8px 32px rgba(10,22,40,0.4), inset 0 1px 0 rgba(255,255,255,0.06)",
          position: "relative", overflow: "hidden",
        }}>
          {/* Sparkline watermark */}
          <div style={{ position: "absolute", bottom: 14, left: 14, opacity: 0.18, pointerEvents: "none" }}>
            <Sparkline values={sparkValues} color="#4ade80" />
          </div>

          <div style={{ position: "relative" }}>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 4 }}>مجموع دارایی</div>
            <div style={{
              fontSize: 34, fontWeight: 900, color: "#4ade80",
              textShadow: "0 0 24px rgba(74,222,128,0.35)", marginBottom: 14,
            }}>
              {formatMoney(total)}
            </div>

            {/* Breakdown: checking + savings */}
            <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
              <div style={{
                flex: 1, padding: "9px 12px", borderRadius: 14,
                background: "rgba(96,165,250,0.1)", border: "1px solid rgba(96,165,250,0.18)",
              }}>
                <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", marginBottom: 3 }}>💳 حساب جاری</div>
                <div style={{ fontSize: 14, fontWeight: 800, color: "#60a5fa" }}>{formatMoney(checking)}</div>
                <div style={{ fontSize: 9, color: "rgba(255,255,255,0.25)", marginTop: 1 }}>بدون سود</div>
              </div>
              <div style={{
                flex: 1, padding: "9px 12px", borderRadius: 14,
                background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.15)",
              }}>
                <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", marginBottom: 3 }}>💰 پس‌انداز</div>
                <div style={{ fontSize: 14, fontWeight: 800, color: "#4ade80" }}>{formatMoney(savings)}</div>
                <div style={{ fontSize: 9, color: "rgba(74,222,128,0.55)", marginTop: 1 }}>سود {toPersian(rate)}٪ روزانه</div>
              </div>
            </div>

            {/* Today's profit row */}
            <div style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "10px 14px", borderRadius: 14,
              background: "rgba(74,222,128,0.07)", border: "1px solid rgba(74,222,128,0.12)",
            }}>
              <div>
                <div style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", marginBottom: 2 }}>📈 سود امروز</div>
                <div style={{ fontSize: 18, fontWeight: 900, color: "#4ade80" }}>
                  +{formatMoney(dailyInterest)}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", marginBottom: 2 }}>📅 تخمین ماهانه</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "rgba(74,222,128,0.7)" }}>
                  ~{formatMoney(monthlyEstimate)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Action Buttons — Primary / Secondary / Tertiary ── */}
        <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
          {/* Primary: Deposit */}
          <button
            onClick={() => { setSheetMode("deposit"); setAmount(""); setMessage(null); }}
            style={{
              flex: 2, padding: "14px 0", borderRadius: 18, border: "none",
              background: "linear-gradient(180deg, #22c55e, #16a34a)",
              color: "white", fontSize: 13, fontWeight: 900,
              fontFamily: "inherit", cursor: "pointer",
              boxShadow: "0 4px 14px rgba(34,197,94,0.35)",
            }}
          >
            📥 سپرده‌گذاری
          </button>
          {/* Secondary: Withdraw */}
          <button
            onClick={() => { setSheetMode("withdraw"); setAmount(""); setMessage(null); }}
            style={{
              flex: 1, padding: "14px 0", borderRadius: 18,
              background: "rgba(139,92,246,0.12)", border: "1px solid rgba(139,92,246,0.28)",
              color: "#a78bfa", fontSize: 13, fontWeight: 800,
              fontFamily: "inherit", cursor: "pointer",
            }}
          >
            📤 برداشت
          </button>
          {/* Tertiary: Loan */}
          <button
            onClick={() => { setSheetMode("loan"); setMessage(null); }}
            style={{
              flex: 1, padding: "14px 0", borderRadius: 18,
              background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.2)",
              color: "#60a5fa", fontSize: 13, fontWeight: 800,
              fontFamily: "inherit", cursor: "pointer",
            }}
          >
            🏛️ وام
          </button>
        </div>

        {/* ── Active Loans ── */}
        {bank.loans.length > 0 && (
          <>
            <div style={{
              fontSize: 11, fontWeight: 800, color: "rgba(255,255,255,0.4)",
              display: "flex", alignItems: "center", gap: 6, marginBottom: 10,
            }}>
              <span>📋</span> وام‌های فعال ({toPersian(bank.loans.length)})
            </div>

            {bank.loans.map((loan, idx) => {
              const total   = loan.totalInstallments   ?? (loan.remainingInstallments ?? 1);
              const paid    = total - (loan.remainingInstallments ?? 0);
              const progress = total > 0 ? (paid / total) * 100 : 0;
              return (
                <div key={loan.id ?? idx} style={{
                  borderRadius: 20, marginBottom: 10,
                  background: "rgba(255,255,255,0.03)",
                  border: loan.latePayments > 0
                    ? "1px solid rgba(239,68,68,0.22)"
                    : "1px solid rgba(255,255,255,0.07)",
                }}>
                  <div style={{ padding: "14px 16px" }}>
                    {/* Header */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                      <div style={{ fontSize: 13, fontWeight: 900, color: "white" }}>{loan.typeName}</div>
                      <div style={{ display: "flex", gap: 6 }}>
                        {loan.latePayments > 0 && (
                          <span style={{
                            fontSize: 9, fontWeight: 700, padding: "2px 8px", borderRadius: 8,
                            background: "rgba(239,68,68,0.1)", color: "#f87171",
                            border: "1px solid rgba(239,68,68,0.2)",
                          }}>{toPersian(loan.latePayments)} تأخیر ⚠️</span>
                        )}
                        <span style={{
                          fontSize: 9, fontWeight: 700, padding: "2px 8px", borderRadius: 8,
                          background: "rgba(250,204,21,0.08)", color: "#fbbf24",
                          border: "1px solid rgba(250,204,21,0.18)",
                        }}>فعال</span>
                      </div>
                    </div>

                    {/* Stats */}
                    <div style={{ display: "flex", gap: 0, marginBottom: 12 }}>
                      {[
                        { label: "مبلغ وام", value: formatMoney(loan.originalAmount ?? 0), color: "rgba(255,255,255,0.65)" },
                        { label: "قسط ماهانه", value: formatMoney(loan.monthlyPayment ?? 0), color: "#f87171" },
                        { label: "باقیمانده", value: `${toPersian(loan.remainingInstallments ?? 0)} ماه`, color: "#fbbf24" },
                      ].map((s, i, arr) => (
                        <div key={s.label} style={{
                          flex: 1, textAlign: "center",
                          borderLeft: i < arr.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none",
                        }}>
                          <div style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", marginBottom: 3 }}>{s.label}</div>
                          <div style={{ fontSize: 13, fontWeight: 800, color: s.color }}>{s.value}</div>
                        </div>
                      ))}
                    </div>

                    {/* Progress bar */}
                    <div style={{
                      background: "rgba(255,255,255,0.06)", borderRadius: 4,
                      height: 6, overflow: "hidden", marginBottom: 8,
                    }}>
                      <div style={{
                        width: `${progress}%`, height: "100%", borderRadius: 4,
                        background: "linear-gradient(90deg, #22c55e, #4ade80)",
                        boxShadow: "0 0 6px rgba(34,197,94,0.4)",
                        transition: "width 0.4s ease",
                      }} />
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)" }}>
                        {toPersian(paid)} از {toPersian(total)} قسط پرداخت شده
                      </div>
                      <button
                        onClick={() => handlePayInstallment(loan.id)}
                        style={{
                          padding: "6px 14px", borderRadius: 10, border: "none",
                          background: "linear-gradient(180deg, #22c55e, #16a34a)",
                          color: "white", fontSize: 11, fontWeight: 800,
                          fontFamily: "inherit", cursor: "pointer",
                          boxShadow: "0 2px 8px rgba(34,197,94,0.3)",
                        }}
                      >
                        پرداخت قسط 💸
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </>
        )}

        {/* ── Loan pay message ── */}
        {message && !sheetMode && (
          <div style={{
            padding: "10px 14px", borderRadius: 14, marginBottom: 12, textAlign: "center",
            fontSize: 12, fontWeight: 700,
            background: message.ok ? "rgba(34,197,94,0.08)" : "rgba(239,68,68,0.08)",
            color: message.ok ? "#4ade80" : "#f87171",
            border: `1px solid ${message.ok ? "rgba(74,222,128,0.18)" : "rgba(239,68,68,0.18)"}`,
          }}>{message.text}</div>
        )}

        {/* ── Info Cards ── */}
        <div style={{
          padding: "12px 14px", borderRadius: 18, marginBottom: 10,
          background: "rgba(74,222,128,0.04)", border: "1px solid rgba(74,222,128,0.13)",
        }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: "#4ade80", marginBottom: 4 }}>🛡️ محافظت پس‌انداز</div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", lineHeight: 1.6 }}>
            پس‌انداز در برابر کارت‌های منفی محافظت می‌شه — هر چقدر بیشتر، ضرر ۷۰٪ کمتر.
          </div>
        </div>

        <div style={{
          padding: "12px 14px", borderRadius: 18,
          background: "rgba(212,168,67,0.05)", border: "1px solid rgba(212,168,67,0.16)",
        }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: "#D4A843", marginBottom: 4 }}>✦ پیشنهاد ویژه بانک ملت</div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", lineHeight: 1.6 }}>
            بیشترین سود پس‌انداز بازار — پس‌انداز بیشتر = درآمد غیرفعال بیشتر.
          </div>
        </div>
      </div>

      {/* ══ Bottom Sheet: Deposit / Withdraw ══ */}
      {(sheetMode === "deposit" || sheetMode === "withdraw") && (
        <div
          className="anim-backdrop-in"
          style={{
            position: "fixed", inset: 0, zIndex: 100,
            background: "rgba(0,0,0,0.65)", backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            display: "flex", alignItems: "flex-end",
          }}
          onClick={() => setSheetMode(null)}
        >
          <div
            className="anim-sheet-up"
            style={{
              width: "100%", borderRadius: "28px 28px 0 0",
              background: "linear-gradient(180deg, #141428 0%, #0a0e20 100%)",
              padding: "0 20px 36px",
              boxShadow: "0 -8px 40px rgba(0,0,0,0.6), 0 -2px 0 rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)", borderBottom: "none",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Handle */}
            <div style={{ display: "flex", justifyContent: "center", padding: "14px 0" }}>
              <div style={{ width: 36, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.15)" }} />
            </div>

            <div style={{ fontSize: 16, fontWeight: 900, color: "white", marginBottom: 4, textAlign: "center" }}>
              {sheetMode === "deposit" ? "📥 سپرده‌گذاری" : "📤 برداشت از پس‌انداز"}
            </div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginBottom: 16, textAlign: "center" }}>
              موجودی {sheetMode === "deposit" ? "جاری" : "پس‌انداز"}: {formatMoney(maxTransfer)}
            </div>

            <input
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value.replace(/[^\d]/g, ""))}
              placeholder="مبلغ (تومان)"
              style={{
                width: "100%", padding: "13px 16px", borderRadius: 16,
                background: "rgba(255,255,255,0.06)", border: "1.5px solid rgba(255,255,255,0.12)",
                color: "white", fontSize: 16, fontWeight: 700,
                fontFamily: "inherit", marginBottom: 10, textAlign: "center",
                outline: "none",
              }}
            />

            <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
              {quickAmounts.map((q) => (
                <button key={q} onClick={() => setAmount(String(q))} style={{
                  flex: 1, padding: "8px 0", borderRadius: 10,
                  border: "1px solid rgba(255,255,255,0.09)",
                  background: "rgba(255,255,255,0.04)",
                  fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.55)",
                  cursor: "pointer", fontFamily: "inherit",
                }}>{formatMoney(q)}</button>
              ))}
              <button onClick={() => setAmount(String(maxTransfer))} style={{
                flex: 1, padding: "8px 0", borderRadius: 10,
                border: "1px solid rgba(96,165,250,0.22)",
                background: "rgba(96,165,250,0.08)",
                fontSize: 10, fontWeight: 700, color: "#60a5fa",
                cursor: "pointer", fontFamily: "inherit",
              }}>همه</button>
            </div>

            {message && (
              <div style={{
                padding: "8px 14px", borderRadius: 12, marginBottom: 12, textAlign: "center",
                fontSize: 12, fontWeight: 700,
                background: message.ok ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
                color: message.ok ? "#4ade80" : "#f87171",
                border: `1px solid ${message.ok ? "rgba(74,222,128,0.2)" : "rgba(239,68,68,0.2)"}`,
              }}>{message.text}</div>
            )}

            <button onClick={handleTransfer} style={{
              width: "100%", padding: "15px 0", borderRadius: 20, border: "none",
              background: sheetMode === "deposit"
                ? "linear-gradient(180deg, #22c55e, #16a34a)"
                : "linear-gradient(135deg, #8b5cf6, #7c3aed)",
              color: "white", fontSize: 15, fontWeight: 900,
              fontFamily: "inherit", cursor: "pointer",
              boxShadow: sheetMode === "deposit"
                ? "0 4px 14px rgba(34,197,94,0.3)"
                : "0 4px 14px rgba(139,92,246,0.3)",
            }}>
              {sheetMode === "deposit" ? "سپرده‌گذاری" : "برداشت"} ✓
            </button>
          </div>
        </div>
      )}

      {/* ══ Bottom Sheet: Loan ══ */}
      {sheetMode === "loan" && (
        <div
          className="anim-backdrop-in"
          style={{
            position: "fixed", inset: 0, zIndex: 100,
            background: "rgba(0,0,0,0.65)", backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            display: "flex", alignItems: "flex-end",
          }}
          onClick={() => setSheetMode(null)}
        >
          <div
            className="anim-sheet-up"
            style={{
              width: "100%", borderRadius: "28px 28px 0 0",
              background: "linear-gradient(180deg, #141428 0%, #0a0e20 100%)",
              padding: "0 0 36px",
              boxShadow: "0 -8px 40px rgba(0,0,0,0.6), 0 -2px 0 rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)", borderBottom: "none",
              maxHeight: "78dvh", overflowY: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ padding: "0 20px" }}>
              <div style={{ display: "flex", justifyContent: "center", padding: "14px 0" }}>
                <div style={{ width: 36, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.15)" }} />
              </div>
              <div style={{ fontSize: 16, fontWeight: 900, color: "white", marginBottom: 4, textAlign: "center" }}>
                🏛️ درخواست وام
              </div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", textAlign: "center", marginBottom: 14 }}>
                وام‌های فعال: {toPersian(bank.loans.length)} / ۳
              </div>

              {message && (
                <div style={{
                  padding: "8px 14px", borderRadius: 12, marginBottom: 12, textAlign: "center",
                  fontSize: 12, fontWeight: 700,
                  background: message.ok ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
                  color: message.ok ? "#4ade80" : "#f87171",
                  border: `1px solid ${message.ok ? "rgba(74,222,128,0.2)" : "rgba(239,68,68,0.2)"}`,
                }}>{message.text}</div>
              )}
            </div>

            <div style={{ padding: "0 16px" }}>
              {LOAN_TYPES.map((lt) => {
                const meetsLevel   = player.level >= lt.requiresLevel;
                const meetsSavings = bank.savings >= lt.requiresSavings;
                const canApply     = meetsLevel && meetsSavings && bank.loans.length < 3;
                return (
                  <div key={lt.id} style={{
                    padding: "14px", borderRadius: 20, marginBottom: 10,
                    background: canApply ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.02)",
                    border: `1px solid ${canApply ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.04)"}`,
                    opacity: canApply ? 1 : 0.5,
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                      <div style={{ fontSize: 14, fontWeight: 900, color: "white" }}>
                        {lt.emoji} {lt.name}
                      </div>
                      <div style={{ fontSize: 16, fontWeight: 900, color: "#D4A843" }}>
                        {formatMoney(lt.maxAmount)}
                      </div>
                    </div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 8, lineHeight: 1.5 }}>
                      {lt.description}
                    </div>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
                      <Chip label={`سود ${toPersian(lt.interestRate)}٪/ماه`} color="#fbbf24" />
                      <Chip label={`${toPersian(lt.termMonths)} قسط`} color="#60a5fa" />
                      {lt.requiresLevel > 1 && (
                        <Chip
                          label={`سطح ${toPersian(lt.requiresLevel)}+`}
                          color={meetsLevel ? "#4ade80" : "#f87171"}
                        />
                      )}
                      {lt.requiresSavings > 0 && (
                        <Chip
                          label={`پس‌انداز ${formatMoney(lt.requiresSavings)}+`}
                          color={meetsSavings ? "#4ade80" : "#f87171"}
                        />
                      )}
                    </div>
                    <button
                      onClick={() => canApply && handleTakeLoan(lt.id)}
                      disabled={!canApply}
                      style={{
                        width: "100%", padding: "11px 0", borderRadius: 14, border: "none",
                        background: canApply
                          ? "linear-gradient(180deg, #3b82f6, #2563eb)"
                          : "rgba(255,255,255,0.05)",
                        color: canApply ? "white" : "rgba(255,255,255,0.25)",
                        fontSize: 12, fontWeight: 800,
                        fontFamily: "inherit",
                        cursor: canApply ? "pointer" : "default",
                        boxShadow: canApply ? "0 4px 14px rgba(59,130,246,0.3)" : "none",
                      }}
                    >
                      {canApply ? "درخواست وام" : "شرایط کافی نیست"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}

function Chip({ label, color }: { label: string; color: string }) {
  return (
    <span style={{
      fontSize: 10, fontWeight: 700, padding: "3px 9px", borderRadius: 8,
      background: `${color}12`, color,
      border: `1px solid ${color}22`,
    }}>{label}</span>
  );
}
