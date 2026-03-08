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

export default function BankPage() {
  const bank = useGameStore((s) => s.bank);
  const player = useGameStore((s) => s.player);
  const depositToSavings = useGameStore((s) => s.depositToSavings);
  const withdrawFromSavings = useGameStore((s) => s.withdrawFromSavings);
  const takeLoan = useGameStore((s) => s.takeLoan);
  const payLoanInstallment = useGameStore((s) => s.payLoanInstallment);

  const [sheetMode, setSheetMode] = useState<SheetMode>(null);
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState<{ text: string; ok: boolean } | null>(null);

  const dailyInterest = Math.round(bank.savings * (bank.savingsInterestRate / 100));
  const monthlyEstimate = dailyInterest * 30;

  function handleTransfer() {
    const val = parseInt(amount.replace(/[^\d]/g, ""), 10);
    if (!val || val <= 0) { setMessage({ text: "مبلغ نامعتبر", ok: false }); return; }

    const result = sheetMode === "deposit"
      ? depositToSavings(val)
      : withdrawFromSavings(val);

    if (result.success) {
      setMessage({ text: sheetMode === "deposit" ? "سپرده‌گذاری موفق!" : "برداشت موفق!", ok: true });
      setAmount("");
      setTimeout(() => { setSheetMode(null); setMessage(null); }, 1200);
    } else {
      setMessage({ text: result.reason!, ok: false });
    }
  }

  function handleTakeLoan(typeId: string) {
    const result = takeLoan(typeId);
    if (result.success) {
      setMessage({ text: "وام دریافت شد!", ok: true });
      setTimeout(() => { setSheetMode(null); setMessage(null); }, 1200);
    } else {
      setMessage({ text: result.reason!, ok: false });
      setTimeout(() => setMessage(null), 2000);
    }
  }

  function handlePayInstallment(loanId: string) {
    const result = payLoanInstallment(loanId);
    if (result.success) {
      setMessage({ text: "قسط پرداخت شد!", ok: true });
      setTimeout(() => setMessage(null), 1500);
    } else {
      setMessage({ text: result.reason!, ok: false });
      setTimeout(() => setMessage(null), 2000);
    }
  }

  const quickAmounts = [1_000_000, 5_000_000, 10_000_000];
  const maxTransfer = sheetMode === "deposit" ? bank.checking : bank.savings;

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
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
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
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: "#0f172a", display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 20 }}>🏦</span> {bank.name}
            </div>
            <div style={{ fontSize: 11, color: "#64748b" }}>خدمات بانکی</div>
          </div>
        </div>

        {/* Total Assets */}
        <div style={{
          borderRadius: 24, padding: "22px 16px", marginBottom: 14,
          background: "linear-gradient(145deg, #0F2340, #1B3A5C 60%, #263E66)",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 8px 32px rgba(10,22,40,0.3), inset 0 1px 0 rgba(255,255,255,0.06)",
          textAlign: "center", position: "relative", overflow: "hidden",
        }}>
          <div style={{ position: "relative" }}>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 6 }}>مجموع دارایی</div>
            <div style={{
              fontSize: 32, fontWeight: 900, color: "#4ade80",
              textShadow: "0 0 20px rgba(74,222,128,0.3)",
              marginBottom: 6,
            }}>
              {formatMoney(bank.checking + bank.savings)}
            </div>
            <div style={{
              fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.45)",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            }}>
              <span>
                <span style={{ color: "#4ade80" }}>📈</span> سود روزانه: <span style={{ color: "#4ade80" }}>+{formatMoney(dailyInterest)}</span>
              </span>
              <span style={{ color: "rgba(255,255,255,0.2)" }}>|</span>
              <span>
                ماهانه: <span style={{ color: "#4ade80" }}>~{formatMoney(monthlyEstimate)}</span>
              </span>
            </div>
            {bank.totalInterestEarned > 0 && (
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", marginTop: 4 }}>
                مجموع سود دریافتی: {formatMoney(bank.totalInterestEarned)}
              </div>
            )}
          </div>
        </div>

        {/* Accounts */}
        <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
          {[
            { label: "💳 حساب جاری", value: bank.checking, sub: "بدون سود", glow: "rgba(96,165,250,0.2)" },
            { label: "💰 پس‌انداز", value: bank.savings, sub: `سود ${toPersian(bank.savingsInterestRate)}٪ روزانه`, glow: "rgba(74,222,128,0.2)" },
          ].map((acc) => (
            <div key={acc.label} style={{
              flex: 1, padding: "14px 12px", borderRadius: 20,
              background: "white",
              border: "1px solid rgba(0,0,0,0.04)",
              boxShadow: `0 4px 16px ${acc.glow}, 0 1px 3px rgba(0,0,0,0.04)`,
            }}>
              <div style={{ fontSize: 12, color: "#64748b", marginBottom: 6 }}>{acc.label}</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: "#0f172a", marginBottom: 3 }}>
                {formatMoney(acc.value)}
              </div>
              <div style={{ fontSize: 10, color: "#94a3b8" }}>{acc.sub}</div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
          <button onClick={() => { setSheetMode("deposit"); setAmount(""); setMessage(null); }} className="game-btn" style={{
            flex: 1, justifyContent: "center",
            background: "linear-gradient(180deg, #22c55e, #16a34a)",
            borderBottomColor: "#15803d",
            boxShadow: "0 4px 14px rgba(34,197,94,0.35)",
          }}>
            📥 سپرده‌گذاری
          </button>
          <button onClick={() => { setSheetMode("withdraw"); setAmount(""); setMessage(null); }} className="game-btn" style={{
            flex: 1, justifyContent: "center",
            background: "linear-gradient(180deg, #8b5cf6, #7c3aed)",
            borderBottomColor: "#6d28d9",
            boxShadow: "0 4px 14px rgba(139,92,246,0.35)",
          }}>
            📤 برداشت
          </button>
          <button onClick={() => { setSheetMode("loan"); setMessage(null); }} className="game-btn" style={{
            flex: 1, justifyContent: "center",
            background: "linear-gradient(180deg, #3b82f6, #2563eb)",
            borderBottomColor: "#1d4ed8",
            boxShadow: "0 4px 14px rgba(59,130,246,0.35)",
          }}>
            🏛️ وام
          </button>
        </div>

        {/* Active Loans */}
        {bank.loans.length > 0 && (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12, padding: "0 2px" }}>
              <span style={{ fontSize: 16 }}>📋</span>
              <span style={{ fontSize: 15, fontWeight: 800, color: "#1e293b" }}>وام‌های فعال ({toPersian(bank.loans.length)})</span>
            </div>

            {bank.loans.map((loan, idx) => {
              const paidCount = (loan.totalInstallments ?? 1) - (loan.remainingInstallments ?? 0);
              const progress = (paidCount / (loan.totalInstallments ?? 1)) * 100;
              return (
                <div key={loan.id ?? idx} className="activity-card activity-card--work" style={{ marginBottom: 10 }}>
                  <div style={{ padding: "16px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                      <div style={{ fontSize: 15, fontWeight: 700, color: "#0f172a" }}>{loan.typeName}</div>
                      <div style={{ display: "flex", gap: 6 }}>
                        {loan.latePayments > 0 && (
                          <span style={{
                            fontSize: 10, fontWeight: 700, padding: "3px 10px",
                            background: "#fef2f2", color: "#dc2626",
                            border: "1px solid #fecaca", borderRadius: "var(--r-full)",
                          }}>{toPersian(loan.latePayments)} تاخیر</span>
                        )}
                        <span style={{
                          fontSize: 10, fontWeight: 700, padding: "3px 10px",
                          background: "#fefce8", color: "#a16207",
                          border: "1px solid #fde68a", borderRadius: "var(--r-full)",
                        }}>فعال</span>
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: 14, marginBottom: 12 }}>
                      <div>
                        <div style={{ fontSize: 10, color: "#94a3b8", marginBottom: 3 }}>مبلغ وام</div>
                        <div style={{ fontSize: 14, fontWeight: 800, color: "#0f172a" }}>{formatMoney(loan.originalAmount)}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 10, color: "#94a3b8", marginBottom: 3 }}>قسط ماهانه</div>
                        <div style={{ fontSize: 14, fontWeight: 800, color: "#ef4444" }}>{formatMoney(loan.monthlyPayment)}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 10, color: "#94a3b8", marginBottom: 3 }}>مانده قسط</div>
                        <div style={{ fontSize: 14, fontWeight: 800, color: "#0f172a" }}>{toPersian(loan.remainingInstallments)} ماه</div>
                      </div>
                    </div>

                    <div style={{
                      background: "#f1f5f9", borderRadius: "var(--r-full)",
                      height: 6, overflow: "hidden", marginBottom: 8,
                    }}>
                      <div style={{
                        width: `${progress}%`, height: "100%",
                        borderRadius: "var(--r-full)",
                        background: "linear-gradient(90deg, #22c55e, #4ade80)",
                        boxShadow: "0 0 6px rgba(34,197,94,0.4)",
                      }} />
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ fontSize: 10, color: "#94a3b8" }}>
                        {toPersian(paidCount)} از {toPersian(loan.totalInstallments)} قسط پرداخت شده
                      </div>
                      <button
                        onClick={() => handlePayInstallment(loan.id)}
                        className="game-btn btn-bounce"
                        style={{
                          padding: "6px 16px", fontSize: 11,
                          background: "linear-gradient(180deg, #22c55e, #16a34a)",
                          borderBottomColor: "#15803d",
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

        {/* Savings protection info */}
        <div style={{
          padding: "14px 16px", borderRadius: 20, marginBottom: 14,
          background: "linear-gradient(135deg, #ecfdf5, #d1fae5)",
          border: "1.5px solid #a7f3d0",
        }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: "#065f46", marginBottom: 4, display: "flex", alignItems: "center", gap: 4 }}>
            🛡️ محافظت پس‌انداز
          </div>
          <div style={{ fontSize: 11, color: "#047857", lineHeight: 1.6 }}>
            پولی که در پس‌انداز قرار بدی از دزدی و کارت‌های منفی روزانه محافظت می‌شه!
            هر چقدر پس‌اندازت بیشتر باشه، ضرر کارت‌های منفی ۷۰٪ کمتر می‌شه.
          </div>
        </div>

        {/* Sponsor banner */}
        <div style={{
          padding: "14px 16px", borderRadius: 20,
          background: "linear-gradient(135deg, #fffbeb, #fef3c7)",
          border: "1.5px solid #fde68a",
          boxShadow: "0 4px 16px rgba(212,168,67,0.15)",
        }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: "#92400e", marginBottom: 4, display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ filter: "drop-shadow(0 0 4px rgba(212,168,67,0.5))" }}>✦</span>
            پیشنهاد ویژه بانک ملت
          </div>
          <div style={{ fontSize: 11, color: "#b45309", lineHeight: 1.6 }}>
            با بانک ملت، بالاترین سود پس‌انداز بازار رو داری. پس‌انداز بیشتر = درآمد غیرفعال بیشتر
          </div>
        </div>
      </div>

      {/* Bottom Sheet: Deposit / Withdraw */}
      {(sheetMode === "deposit" || sheetMode === "withdraw") && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 100,
          background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)",
          display: "flex", alignItems: "flex-end",
        }} onClick={() => setSheetMode(null)}>
          <div style={{
            width: "100%", borderRadius: "24px 24px 0 0",
            background: "white", padding: "24px 20px 32px",
            boxShadow: "0 -8px 32px rgba(0,0,0,0.15)",
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{ fontSize: 16, fontWeight: 800, color: "#0f172a", marginBottom: 16, textAlign: "center" }}>
              {sheetMode === "deposit" ? "📥 سپرده‌گذاری" : "📤 برداشت از پس‌انداز"}
            </div>
            <div style={{ fontSize: 11, color: "#64748b", marginBottom: 8 }}>
              موجودی {sheetMode === "deposit" ? "جاری" : "پس‌انداز"}: {formatMoney(maxTransfer)}
            </div>

            <input
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value.replace(/[^\d]/g, ""))}
              placeholder="مبلغ (تومان)"
              style={{
                width: "100%", padding: "12px 16px", borderRadius: 14,
                border: "2px solid #e2e8f0", fontSize: 16, fontWeight: 700,
                fontFamily: "inherit", marginBottom: 10, textAlign: "center",
                outline: "none",
              }}
            />

            <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
              {quickAmounts.map((q) => (
                <button key={q} onClick={() => setAmount(String(q))} style={{
                  flex: 1, padding: "8px 0", borderRadius: 10,
                  border: "1.5px solid #e2e8f0", background: "#f8fafc",
                  fontSize: 11, fontWeight: 700, color: "#475569",
                  cursor: "pointer", fontFamily: "inherit",
                }}>{formatMoney(q)}</button>
              ))}
              <button onClick={() => setAmount(String(maxTransfer))} style={{
                flex: 1, padding: "8px 0", borderRadius: 10,
                border: "1.5px solid #dbeafe", background: "#eff6ff",
                fontSize: 11, fontWeight: 700, color: "#2563eb",
                cursor: "pointer", fontFamily: "inherit",
              }}>همه</button>
            </div>

            {message && (
              <div style={{
                padding: "8px 14px", borderRadius: 10, marginBottom: 12, textAlign: "center",
                fontSize: 12, fontWeight: 700,
                background: message.ok ? "#dcfce7" : "#fef2f2",
                color: message.ok ? "#166534" : "#991b1b",
              }}>{message.text}</div>
            )}

            <button onClick={handleTransfer} className="game-btn btn-bounce" style={{
              width: "100%", justifyContent: "center",
              background: sheetMode === "deposit"
                ? "linear-gradient(180deg, #22c55e, #16a34a)"
                : "linear-gradient(180deg, #8b5cf6, #7c3aed)",
              borderBottomColor: sheetMode === "deposit" ? "#15803d" : "#6d28d9",
            }}>
              {sheetMode === "deposit" ? "سپرده‌گذاری" : "برداشت"} ✓
            </button>
          </div>
        </div>
      )}

      {/* Bottom Sheet: Loan */}
      {sheetMode === "loan" && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 100,
          background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)",
          display: "flex", alignItems: "flex-end",
        }} onClick={() => setSheetMode(null)}>
          <div style={{
            width: "100%", borderRadius: "24px 24px 0 0",
            background: "white", padding: "24px 20px 32px",
            boxShadow: "0 -8px 32px rgba(0,0,0,0.15)",
            maxHeight: "70dvh", overflowY: "auto",
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{ fontSize: 16, fontWeight: 800, color: "#0f172a", marginBottom: 16, textAlign: "center" }}>
              🏛️ درخواست وام
            </div>
            <div style={{ fontSize: 11, color: "#94a3b8", textAlign: "center", marginBottom: 14 }}>
              وام‌های فعال: {toPersian(bank.loans.length)}/۳
            </div>

            {message && (
              <div style={{
                padding: "8px 14px", borderRadius: 10, marginBottom: 12, textAlign: "center",
                fontSize: 12, fontWeight: 700,
                background: message.ok ? "#dcfce7" : "#fef2f2",
                color: message.ok ? "#166534" : "#991b1b",
              }}>{message.text}</div>
            )}

            {LOAN_TYPES.map((lt) => {
              const meetsLevel = player.level >= lt.requiresLevel;
              const meetsSavings = bank.savings >= lt.requiresSavings;
              const canApply = meetsLevel && meetsSavings && bank.loans.length < 3;
              return (
                <div key={lt.id} style={{
                  padding: "14px", borderRadius: 18, marginBottom: 10,
                  background: canApply ? "white" : "#f8fafc",
                  border: `1.5px solid ${canApply ? "#e2e8f0" : "#f1f5f9"}`,
                  opacity: canApply ? 1 : 0.6,
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a" }}>
                      {lt.emoji} {lt.name}
                    </div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: "#D4A843" }}>
                      {formatMoney(lt.maxAmount)}
                    </div>
                  </div>
                  <div style={{ fontSize: 11, color: "#64748b", marginBottom: 8 }}>{lt.description}</div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
                    <span style={{
                      fontSize: 10, fontWeight: 700, padding: "3px 8px",
                      borderRadius: "var(--r-full)",
                      background: "#fefce8", color: "#a16207",
                    }}>سود {toPersian(lt.interestRate)}٪ ماهانه</span>
                    <span style={{
                      fontSize: 10, fontWeight: 700, padding: "3px 8px",
                      borderRadius: "var(--r-full)",
                      background: "#f0f9ff", color: "#0369a1",
                    }}>{toPersian(lt.termMonths)} قسط</span>
                    {lt.requiresLevel > 1 && (
                      <span style={{
                        fontSize: 10, fontWeight: 700, padding: "3px 8px",
                        borderRadius: "var(--r-full)",
                        background: meetsLevel ? "#dcfce7" : "#fef2f2",
                        color: meetsLevel ? "#166534" : "#991b1b",
                      }}>سطح {toPersian(lt.requiresLevel)}+</span>
                    )}
                    {lt.requiresSavings > 0 && (
                      <span style={{
                        fontSize: 10, fontWeight: 700, padding: "3px 8px",
                        borderRadius: "var(--r-full)",
                        background: meetsSavings ? "#dcfce7" : "#fef2f2",
                        color: meetsSavings ? "#166534" : "#991b1b",
                      }}>پس‌انداز {formatMoney(lt.requiresSavings)}+</span>
                    )}
                  </div>
                  <button
                    onClick={() => canApply && handleTakeLoan(lt.id)}
                    disabled={!canApply}
                    className={canApply ? "game-btn btn-bounce" : "game-btn"}
                    style={{
                      width: "100%", justifyContent: "center",
                      background: canApply
                        ? "linear-gradient(180deg, #3b82f6, #2563eb)"
                        : "#e2e8f0",
                      borderBottomColor: canApply ? "#1d4ed8" : "#cbd5e1",
                      color: canApply ? "white" : "#94a3b8",
                      cursor: canApply ? "pointer" : "default",
                    }}
                  >
                    {canApply ? "درخواست وام" : "شرایط کافی نیست"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
