"use client";
import { toPersian } from "@/data/mock";

interface Opportunity {
  id: number;
  emoji: string;
  title: string;
  sub: string;
  btn: string;
  totalSpots: number;
  remainingSpots: number;
  competitors: number;
}

export default function LimitedOpportunity({ opportunity }: { opportunity: Opportunity }) {
  const urgent = opportunity.remainingSpots <= 1;
  const spotsPct = Math.round((opportunity.remainingSpots / opportunity.totalSpots) * 100);

  return (
    <div style={{
      borderRadius: 20, overflow: "hidden",
      background: urgent
        ? "linear-gradient(135deg, rgba(239,68,68,0.06), rgba(249,115,22,0.03))"
        : "rgba(255,255,255,0.02)",
      border: urgent
        ? "1.5px solid rgba(239,68,68,0.15)"
        : "1px solid rgba(0,0,0,0.04)",
      marginBottom: 10,
      boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
    }}>
      <div style={{ padding: "14px 16px" }}>
        {/* Header row */}
        <div style={{
          display: "flex", gap: 12, alignItems: "center", marginBottom: 10,
        }}>
          <div style={{
            width: 46, height: 46, borderRadius: 14, flexShrink: 0,
            background: "linear-gradient(135deg, rgba(212,168,67,0.15), rgba(212,168,67,0.05))",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 22, border: "1px solid rgba(212,168,67,0.2)",
          }}>
            {opportunity.emoji}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{
              fontSize: 14, fontWeight: 700, color: "#0f172a", marginBottom: 3,
            }}>
              {opportunity.title}
            </div>
            <div style={{ fontSize: 12, color: "#64748b" }}>
              {opportunity.sub}
            </div>
          </div>
          <button className="game-btn btn-bounce" style={{
            fontSize: 11, padding: "7px 14px",
            background: urgent
              ? "linear-gradient(180deg, #ef4444, #dc2626)"
              : "linear-gradient(180deg, #22c55e, #16a34a)",
            borderBottomColor: urgent ? "#b91c1c" : "#15803d",
            boxShadow: urgent
              ? "0 4px 12px rgba(239,68,68,0.3)"
              : "0 4px 12px rgba(34,197,94,0.3)",
          }}>
            {opportunity.btn}
          </button>
        </div>

        {/* Spots indicator */}
        <div style={{
          padding: "8px 12px",
          background: "rgba(0,0,0,0.02)",
          borderRadius: 12,
          marginBottom: 10,
        }}>
          {/* Spots dots */}
          <div style={{
            display: "flex", alignItems: "center", gap: 6, marginBottom: 6,
          }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: urgent ? "#dc2626" : "#f97316" }}>
              {urgent ? "🔥" : "📌"} فقط {toPersian(opportunity.remainingSpots)} جای خالی از {toPersian(opportunity.totalSpots)}
            </span>
          </div>
          <div style={{ display: "flex", gap: 4 }}>
            {Array.from({ length: opportunity.totalSpots }).map((_, i) => {
              const filled = i >= opportunity.remainingSpots;
              return (
                <div key={i} style={{
                  width: 10, height: 10, borderRadius: "50%",
                  background: filled
                    ? "linear-gradient(135deg, #64748b, #94a3b8)"
                    : urgent
                      ? "linear-gradient(135deg, #ef4444, #f87171)"
                      : "linear-gradient(135deg, #22c55e, #4ade80)",
                  boxShadow: !filled && urgent
                    ? "0 0 6px rgba(239,68,68,0.4)"
                    : !filled ? "0 0 6px rgba(34,197,94,0.3)" : "none",
                  border: "1px solid rgba(255,255,255,0.3)",
                }} />
              );
            })}
          </div>
        </div>

        {/* Footer: competition */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <span style={{
            fontSize: 10, fontWeight: 700, padding: "3px 10px",
            borderRadius: 10,
            background: "rgba(249,115,22,0.08)", color: "#f97316",
            border: "1px solid rgba(249,115,22,0.15)",
          }}>
            👥 {toPersian(opportunity.competitors)} نفر درخواست داده‌اند
          </span>
          {urgent && (
            <span className="anim-breathe" style={{
              fontSize: 10, fontWeight: 800, padding: "3px 10px",
              borderRadius: 10,
              background: "rgba(239,68,68,0.1)", color: "#dc2626",
              border: "1px solid rgba(239,68,68,0.2)",
            }}>
              عجله کن!
            </span>
          )}
          <span style={{
            fontSize: 10, fontWeight: 600, color: "#94a3b8",
          }}>
            {toPersian(spotsPct)}٪ باقی‌مانده
          </span>
        </div>
      </div>
    </div>
  );
}
