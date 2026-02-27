"use client";
import BottomNav from "@/components/layout/BottomNav";
import TopBar from "@/components/layout/TopBar";
import { player, badges, job, housing, bank, formatMoney } from "@/data/mock";

export default function ProfilePage() {
  const earnedBadges = badges.filter((b) => b.earned);
  const lockedBadges = badges.filter((b) => !b.earned);

  return (
    <div style={{ minHeight: "100dvh", background: "var(--bg)" }}>
      <TopBar />
      <div className="safe-bottom" style={{ padding: "16px 16px 0" }}>

        {/* Profile hero */}
        <div className="card" style={{
          padding: "20px 16px", marginBottom: 16,
          background: "linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%)",
          border: "none", textAlign: "center",
        }}>
          <div style={{ fontSize: 52, marginBottom: 6, lineHeight: 1 }}>{player.avatar}</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: "white", marginBottom: 3 }}>{player.name}</div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,.65)", marginBottom: 10 }}>
            {job.title} · {player.city}
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: 8 }}>
            <span style={{
              fontSize: 13, fontWeight: 700, padding: "4px 14px",
              background: "rgba(212,168,67,.25)", color: "var(--accent-light)",
              border: "1px solid rgba(212,168,67,.4)", borderRadius: "var(--r-full)",
            }}>Lv.{player.level} · {player.scenario}</span>
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
          {[
            { label: "دارایی", value: formatMoney(bank.checking + bank.savings), emoji: "💰" },
            { label: "مهارت", value: "Lv.8", emoji: "🧠" },
            { label: "تجربه", value: `${player.xp} XP`, emoji: "⭐" },
          ].map((s) => (
            <div key={s.label} className="card" style={{
              flex: 1, padding: "12px 10px", textAlign: "center",
            }}>
              <div style={{ fontSize: 18, marginBottom: 4 }}>{s.emoji}</div>
              <div style={{ fontSize: 14, fontWeight: 800, color: "var(--text)", marginBottom: 2 }}>{s.value}</div>
              <div style={{ fontSize: 10, color: "var(--text-subtle)" }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Current status */}
        <div className="card" style={{ padding: "14px 16px", marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-muted)", marginBottom: 12 }}>📋 وضعیت فعلی</div>
          {[
            { emoji: "💼", label: "شغل", value: `${job.title} · ${job.company}`, color: "#f0fdf4", border: "#bbf7d0", text: "#166534" },
            { emoji: "🏠", label: "مسکن", value: `${housing.type} · ${formatMoney(housing.monthlyRent)}/ماه`, color: "#fff7ed", border: "#fed7aa", text: "#92400e" },
            { emoji: "🏦", label: "بانک", value: `${bank.name} · سود ${bank.savingsRate}٪`, color: "#eff6ff", border: "#bfdbfe", text: "#1e40af" },
          ].map((item) => (
            <div key={item.label} style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "9px 12px", borderRadius: "var(--r-md)",
              background: item.color, border: `1px solid ${item.border}`,
              marginBottom: 8,
            }}>
              <span style={{ fontSize: 18 }}>{item.emoji}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, color: item.text, fontWeight: 600 }}>{item.label}</div>
                <div style={{ fontSize: 12, color: item.text, opacity: .8 }}>{item.value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Badges earned */}
        <div className="card" style={{ padding: "14px 16px", marginBottom: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-muted)", marginBottom: 12 }}>
            🏅 بج‌های من ({earnedBadges.length}/{badges.length})
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
            {badges.map((b) => (
              <div key={b.id} style={{
                textAlign: "center", padding: "10px 8px",
                borderRadius: "var(--r-md)",
                background: b.earned ? "var(--surface-2)" : "#f8fafc",
                border: `1px solid ${b.earned ? "var(--border)" : "#e2e8f0"}`,
                opacity: b.earned ? 1 : 0.4,
              }}>
                <div style={{ fontSize: 28, marginBottom: 4, lineHeight: 1, filter: b.earned ? "none" : "grayscale(1)" }}>
                  {b.emoji}
                </div>
                <div style={{ fontSize: 11, fontWeight: 600, color: b.earned ? "var(--text)" : "var(--text-subtle)" }}>
                  {b.name}
                </div>
                <div style={{ fontSize: 10, color: "var(--text-subtle)", marginTop: 2 }}>{b.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: 10, marginBottom: 8 }}>
          <button className="btn btn-ghost" style={{ flex: 1, justifyContent: "center" }}>✏️ ویرایش پروفایل</button>
          <button className="btn btn-accent" style={{ flex: 1, justifyContent: "center" }}>🛍️ فروشگاه آیتم</button>
        </div>

      </div>
      <BottomNav />
    </div>
  );
}
