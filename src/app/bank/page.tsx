"use client";
import Link from "next/link";
import BottomNav from "@/components/layout/BottomNav";
import { bank, formatMoney } from "@/data/mock";

export default function BankPage() {
  const monthlyInterest = Math.round(bank.savings * (bank.savingsRate / 100));

  return (
    <div style={{ minHeight: "100dvh", background: "var(--bg)" }}>
      {/* Header */}
      <div style={{
        background: "var(--primary)", padding: "14px 16px",
        display: "flex", alignItems: "center", gap: 12,
      }}>
        <Link href="/" style={{ color: "white", fontSize: 22, textDecoration: "none", lineHeight: 1 }}>‹</Link>
        <div>
          <div style={{ fontSize: 17, fontWeight: 700, color: "white" }}>🏦 {bank.name}</div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,.6)" }}>خدمات بانکی</div>
        </div>
        <div style={{
          marginRight: "auto", fontSize: 11, fontWeight: 700,
          background: "rgba(212,168,67,.25)", color: "var(--accent-light)",
          border: "1px solid rgba(212,168,67,.4)",
          borderRadius: "var(--r-full)", padding: "3px 10px",
        }}>✦ اسپانسر</div>
      </div>

      <div className="safe-bottom" style={{ padding: 16 }}>

        {/* Total */}
        <div className="card" style={{
          padding: "18px 16px", marginBottom: 16,
          background: "linear-gradient(135deg, var(--primary), var(--primary-light))",
          border: "none", textAlign: "center",
        }}>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,.65)", marginBottom: 6 }}>مجموع دارایی</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: "white" }}>
            {formatMoney(bank.checking + bank.savings)}
          </div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,.6)", marginTop: 4 }}>
            سود این ماه: +{formatMoney(monthlyInterest)} 📈
          </div>
        </div>

        {/* Accounts */}
        <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
          {[
            { label: "💳 حساب جاری", value: bank.checking, sub: "بدون سود", bg: "#f8fafc" },
            { label: "💰 پس‌انداز", value: bank.savings, sub: `سود ${bank.savingsRate}٪ ماهانه`, bg: "#f0fdf4" },
          ].map((acc) => (
            <div key={acc.label} className="card" style={{ flex: 1, padding: "14px 12px", background: acc.bg }}>
              <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 6 }}>{acc.label}</div>
              <div style={{ fontSize: 17, fontWeight: 800, color: "var(--text)", marginBottom: 3 }}>
                {formatMoney(acc.value)}
              </div>
              <div style={{ fontSize: 10, color: "var(--text-subtle)" }}>{acc.sub}</div>
            </div>
          ))}
        </div>

        {/* Loans */}
        <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text-muted)", marginBottom: 10 }}>📋 وام‌های فعال</div>
        {bank.loans.map((loan, i) => (
          <div key={i} className="card" style={{ padding: "14px 16px", marginBottom: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <div style={{ fontSize: 14, fontWeight: 700 }}>{loan.type}</div>
              <span style={{
                fontSize: 11, fontWeight: 600, padding: "2px 8px",
                background: "#fef3c7", color: "#92400e", borderRadius: "var(--r-full)",
              }}>فعال</span>
            </div>
            <div style={{ display: "flex", gap: 16 }}>
              <div>
                <div style={{ fontSize: 10, color: "var(--text-subtle)", marginBottom: 2 }}>مبلغ وام</div>
                <div style={{ fontSize: 14, fontWeight: 700 }}>{formatMoney(loan.amount)}</div>
              </div>
              <div>
                <div style={{ fontSize: 10, color: "var(--text-subtle)", marginBottom: 2 }}>قسط ماهانه</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#ef4444" }}>{formatMoney(loan.monthlyPayment)}</div>
              </div>
              <div>
                <div style={{ fontSize: 10, color: "var(--text-subtle)", marginBottom: 2 }}>مانده قسط</div>
                <div style={{ fontSize: 14, fontWeight: 700 }}>{loan.remaining} ماه</div>
              </div>
            </div>
            {/* Progress */}
            <div style={{ marginTop: 10 }}>
              <div style={{ background: "var(--surface-2)", borderRadius: "var(--r-full)", height: 5, border: "1px solid var(--border)" }}>
                <div style={{
                  width: `${100 - (loan.remaining / 24) * 100}%`, height: "100%",
                  borderRadius: "var(--r-full)", background: "#22c55e",
                }} />
              </div>
              <div style={{ fontSize: 10, color: "var(--text-subtle)", marginTop: 4 }}>
                {24 - loan.remaining} از ۲۴ قسط پرداخت شده
              </div>
            </div>
          </div>
        ))}

        {/* Actions */}
        <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
          <button className="btn btn-primary" style={{ flex: 1, justifyContent: "center", padding: "12px 0" }}>
            + درخواست وام
          </button>
          <button className="btn btn-ghost" style={{ flex: 1, justifyContent: "center", padding: "12px 0" }}>
            انتقال وجه
          </button>
        </div>

        {/* Sponsor info */}
        <div style={{
          marginTop: 16, padding: "12px 14px",
          background: "linear-gradient(135deg, #fffbeb, #fef3c7)",
          borderRadius: "var(--r-lg)", border: "1px solid #fde68a",
        }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#92400e", marginBottom: 4 }}>
            ✦ پیشنهاد ویژه بانک ملت
          </div>
          <div style={{ fontSize: 11, color: "#b45309" }}>
            با بانک ملت، بالاترین سود پس‌انداز بازار رو داری. پس‌انداز بیشتر = درآمد غیرفعال بیشتر
          </div>
        </div>

      </div>
      <BottomNav />
    </div>
  );
}
