"use client";
import { goldenMembership, toPersian, formatMoney } from "@/data/mock";

export default function GoldenMembershipCard() {
  const gm = goldenMembership;

  if (gm.active) {
    const remainPct = Math.round((gm.remainingDays / gm.durationDays) * 100);
    return (
      <div className="anim-claim-pulse" style={{
        borderRadius: 20,
        padding: "16px",
        marginBottom: 14,
        background: "linear-gradient(145deg, #422006 0%, #78350f 50%, #451a03 100%)",
        border: "1.5px solid rgba(250,204,21,0.4)",
        boxShadow: "0 0 24px rgba(250,204,21,0.15), 0 6px 24px rgba(10,22,40,0.4)",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          marginBottom: 10,
        }}>
          <div style={{
            fontSize: 13, fontWeight: 800, color: "#facc15",
            display: "flex", alignItems: "center", gap: 6,
          }}>
            <span style={{ fontSize: 16 }}>👑</span>
            عضویت طلایی
          </div>
          <span style={{
            fontSize: 9, fontWeight: 800, color: "#000",
            background: "linear-gradient(135deg, #facc15, #f59e0b)",
            borderRadius: 10, padding: "2px 8px",
          }}>
            ✦ فعال
          </span>
        </div>
        <div style={{
          fontSize: 11, fontWeight: 600, color: "rgba(250,204,21,0.6)",
          marginBottom: 8,
        }}>
          {toPersian(gm.remainingDays)} روز باقی‌مانده
        </div>
        <div style={{
          height: 4, borderRadius: 2,
          background: "rgba(255,255,255,0.1)",
          overflow: "hidden",
        }}>
          <div style={{
            width: `${remainPct}%`,
            height: "100%", borderRadius: 2,
            background: "linear-gradient(90deg, #facc15, #f59e0b)",
          }} />
        </div>
      </div>
    );
  }

  return (
    <div style={{
      borderRadius: 20,
      padding: "16px",
      marginBottom: 14,
      background: "linear-gradient(145deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
      border: "1px solid rgba(250,204,21,0.15)",
      boxShadow: "0 6px 24px rgba(10,22,40,0.35)",
    }}>
      {/* Header */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        marginBottom: 12,
      }}>
        <div style={{
          fontSize: 13, fontWeight: 800, color: "rgba(255,255,255,0.5)",
          display: "flex", alignItems: "center", gap: 6,
        }}>
          <span style={{ fontSize: 16 }}>👑</span>
          عضویت طلایی بازار
        </div>
        <span style={{
          fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.3)",
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 10, padding: "2px 8px",
        }}>
          غیرفعال
        </span>
      </div>

      {/* Benefits */}
      <div style={{ marginBottom: 14 }}>
        {gm.benefits.map((b, i) => (
          <div key={i} style={{
            fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.45)",
            marginBottom: 6, display: "flex", alignItems: "center", gap: 6,
          }}>
            <span style={{ color: "#facc15", fontSize: 10 }}>✓</span>
            {b}
          </div>
        ))}
      </div>

      {/* Activate button */}
      <button className="btn-bounce" style={{
        width: "100%", padding: "10px 0",
        borderRadius: 14,
        border: "1px solid rgba(250,204,21,0.3)",
        background: "linear-gradient(180deg, rgba(250,204,21,0.15), rgba(245,158,11,0.1))",
        color: "#facc15",
        fontSize: 12, fontWeight: 800,
        fontFamily: "inherit", cursor: "pointer",
        transition: "all 0.2s ease",
      }}>
        🔓 فعال‌سازی: {formatMoney(gm.price)} / {toPersian(gm.durationDays)} روز
      </button>
    </div>
  );
}
