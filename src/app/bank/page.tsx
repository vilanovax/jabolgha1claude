"use client";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import TopHeader from "@/components/layout/TopHeader";
import BottomNav from "@/components/layout/BottomNav";
import { bank, formatMoney } from "@/data/mock";

export default function BankPage() {
  const monthlyInterest = Math.round(bank.savings * (bank.savingsRate / 100));

  return (
    <div className="game-bg" style={{ minHeight: "100dvh" }}>
      <TopHeader />

      <div className="page-enter" style={{
        paddingTop: "calc(var(--header-h) + 8px)",
        paddingBottom: "calc(var(--nav-h) + 16px)",
        paddingLeft: 14, paddingRight: 14,
        position: "relative", zIndex: 2,
      }}>
        {/* Sub-page header */}
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
          <span style={{
            fontSize: 10, fontWeight: 800, padding: "3px 10px",
            background: "linear-gradient(135deg, #D4A843, #F0C966)",
            color: "white", borderRadius: "var(--r-full)",
            boxShadow: "0 2px 8px rgba(212,168,67,0.3)",
            textShadow: "0 1px 2px rgba(0,0,0,0.2)",
          }}>✦ اسپانسر</span>
        </div>

        {/* Total Assets - Dark panel */}
        <div style={{
          borderRadius: 24, padding: "22px 16px", marginBottom: 14,
          background: "linear-gradient(145deg, #0F2340, #1B3A5C 60%, #263E66)",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 8px 32px rgba(10,22,40,0.3), inset 0 1px 0 rgba(255,255,255,0.06)",
          textAlign: "center", position: "relative", overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", inset: 0, opacity: 0.06,
            backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(255,255,255,0.03) 20px, rgba(255,255,255,0.03) 40px)`,
            pointerEvents: "none",
          }} />
          <div style={{
            position: "absolute", top: -30, left: "50%", transform: "translateX(-50%)",
            width: 120, height: 120, borderRadius: "50%",
            background: "rgba(74,222,128,0.06)", filter: "blur(40px)",
            pointerEvents: "none",
          }} />

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
              display: "flex", alignItems: "center", justifyContent: "center", gap: 4,
            }}>
              <span style={{ color: "#4ade80" }}>📈</span>
              سود این ماه: <span style={{ color: "#4ade80" }}>+{formatMoney(monthlyInterest)}</span>
            </div>
          </div>
        </div>

        {/* Accounts */}
        <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
          {[
            { label: "💳 حساب جاری", value: bank.checking, sub: "بدون سود", glow: "rgba(96,165,250,0.2)" },
            { label: "💰 پس‌انداز", value: bank.savings, sub: `سود ${bank.savingsRate}٪ ماهانه`, glow: "rgba(74,222,128,0.2)" },
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

        {/* Loans */}
        <div style={{
          display: "flex", alignItems: "center", gap: 6,
          marginBottom: 12, padding: "0 2px",
        }}>
          <span style={{ fontSize: 16 }}>📋</span>
          <span style={{ fontSize: 15, fontWeight: 800, color: "#1e293b" }}>وام‌های فعال</span>
        </div>

        {bank.loans.map((loan, i) => (
          <div key={i} className="activity-card activity-card--work">
            <div style={{ padding: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#0f172a" }}>{loan.type}</div>
                <span style={{
                  fontSize: 10, fontWeight: 700, padding: "3px 10px",
                  background: "#fefce8", color: "#a16207",
                  border: "1px solid #fde68a", borderRadius: "var(--r-full)",
                }}>فعال</span>
              </div>

              <div style={{ display: "flex", gap: 14, marginBottom: 12 }}>
                <div>
                  <div style={{ fontSize: 10, color: "#94a3b8", marginBottom: 3 }}>مبلغ وام</div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: "#0f172a" }}>{formatMoney(loan.amount)}</div>
                </div>
                <div>
                  <div style={{ fontSize: 10, color: "#94a3b8", marginBottom: 3 }}>قسط ماهانه</div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: "#ef4444" }}>{formatMoney(loan.monthlyPayment)}</div>
                </div>
                <div>
                  <div style={{ fontSize: 10, color: "#94a3b8", marginBottom: 3 }}>مانده قسط</div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: "#0f172a" }}>{loan.remaining} ماه</div>
                </div>
              </div>

              <div style={{
                background: "#f1f5f9", borderRadius: "var(--r-full)",
                height: 6, overflow: "hidden",
              }}>
                <div style={{
                  width: `${100 - (loan.remaining / 24) * 100}%`, height: "100%",
                  borderRadius: "var(--r-full)",
                  background: "linear-gradient(90deg, #22c55e, #4ade80)",
                  boxShadow: "0 0 6px rgba(34,197,94,0.4)",
                }} />
              </div>
              <div style={{ fontSize: 10, color: "#94a3b8", marginTop: 6 }}>
                {24 - loan.remaining} از ۲۴ قسط پرداخت شده
              </div>
            </div>
          </div>
        ))}

        {/* Actions */}
        <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
          <button className="game-btn" style={{
            flex: 1, justifyContent: "center",
            background: "linear-gradient(180deg, #3b82f6, #2563eb)",
            borderBottomColor: "#1d4ed8",
            boxShadow: "0 4px 14px rgba(59,130,246,0.35)",
          }}>
            + درخواست وام
          </button>
          <button className="game-btn" style={{
            flex: 1, justifyContent: "center",
            background: "linear-gradient(180deg, #8b5cf6, #7c3aed)",
            borderBottomColor: "#6d28d9",
            boxShadow: "0 4px 14px rgba(139,92,246,0.35)",
          }}>
            انتقال وجه
          </button>
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

      <BottomNav />
    </div>
  );
}
