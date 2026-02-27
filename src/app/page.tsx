"use client";
import Link from "next/link";
import TopBar from "@/components/layout/TopBar";
import BottomNav from "@/components/layout/BottomNav";
import { player, housing, job, activeCourse, formatMoney } from "@/data/mock";

const roomItems = [
  {
    id: "fridge", href: "/fridge",
    innerEmoji: "🍳", label: "آشپزخونه", sublabel: "یخچال",
    alert: player.energy < 40, alertText: "گرسنه‌ای!",
    statusBar: { value: 55, color: "#f97316", label: "سیری" },
    bg: "#fff7ed", border: "#fed7aa",
  },
  {
    id: "desk", href: "/jobs",
    innerEmoji: "💼", label: "میز کار", sublabel: "۳ آگهی مناسب",
    alert: false, badge: "3",
    statusBar: { value: 100, color: "#22c55e", label: "آگهی" },
    bg: "#f0fdf4", border: "#bbf7d0",
  },
  {
    id: "shelf", href: "/skills",
    innerEmoji: "📚", label: "قفسه کتاب", sublabel: `روز ${activeCourse.currentDay}/${activeCourse.totalDays}`,
    alert: false,
    statusBar: {
      value: Math.round((activeCourse.currentDay / activeCourse.totalDays) * 100),
      color: "var(--primary)", label: "دوره",
    },
    bg: "#eff6ff", border: "#bfdbfe",
  },
  {
    id: "phone", href: "/bank",
    innerEmoji: "🏦", label: "موبایل", sublabel: `بانک · ${formatMoney(player.money + player.savings)}`,
    alert: false, statusBar: null,
    bg: "#fdf4ff", border: "#e9d5ff",
  },
  {
    id: "sofa", href: "#",
    innerEmoji: "😌", label: "مبل", sublabel: "استراحت",
    alert: false,
    statusBar: { value: player.happiness, color: "#a855f7", label: "خوشحالی" },
    bg: "#f5f3ff", border: "#ddd6fe",
  },
  {
    id: "bed", href: "#",
    innerEmoji: "💤", label: "تخت", sublabel: "خواب / انرژی",
    alert: player.energy < 30, alertText: "خسته‌ای!",
    statusBar: {
      value: player.energy,
      color: player.energy > 60 ? "#22c55e" : player.energy > 30 ? "#f97316" : "#ef4444",
      label: "انرژی",
    },
    bg: "#f0f9ff", border: "#bae6fd",
  },
];

export default function RoomPage() {
  const hour = new Date().getHours();
  const timeOfDay = hour < 6 ? "شب" : hour < 12 ? "صبح" : hour < 18 ? "ظهر" : "شب";

  return (
    <div style={{ minHeight: "100dvh", background: "var(--bg)" }}>
      <TopBar />
      <div className="safe-bottom" style={{ padding: "16px 16px 0" }}>

        {/* Player card */}
        <div className="card" style={{
          padding: "16px",
          marginBottom: 16,
          background: "linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%)",
          border: "none",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,.65)", marginBottom: 3 }}>
                ☀️ {timeOfDay} · روز {player.dayInGame}ام
              </div>
              <div style={{ fontSize: 18, fontWeight: 800, color: "white" }}>
                سلام {player.name.split(" ")[0]}! 👋
              </div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,.65)", marginTop: 3 }}>
                {job.title} · {job.company}
              </div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 38, lineHeight: 1 }}>{player.avatar}</div>
              <div style={{
                fontSize: 11, fontWeight: 700, color: "var(--accent-light)",
                background: "rgba(212,168,67,.25)", borderRadius: "var(--r-full)",
                padding: "2px 9px", marginTop: 5,
              }}>Lv.{player.level}</div>
            </div>
          </div>
          {/* XP */}
          <div style={{ marginTop: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
              <span style={{ fontSize: 10, color: "rgba(255,255,255,.55)" }}>تجربه کاری</span>
              <span style={{ fontSize: 10, color: "rgba(255,255,255,.55)" }}>
                {player.xp.toLocaleString()} / {player.xpNext.toLocaleString()} XP
              </span>
            </div>
            <div style={{ background: "rgba(255,255,255,.15)", borderRadius: "var(--r-full)", height: 5 }}>
              <div style={{
                width: `${(player.xp / player.xpNext) * 100}%`, height: "100%",
                borderRadius: "var(--r-full)", background: "var(--accent-light)", transition: "width .5s",
              }} />
            </div>
          </div>
        </div>

        {/* Alert banner */}
        {player.energy < 40 && (
          <div className="card" style={{
            padding: "12px 14px", marginBottom: 16,
            background: "#fff7ed", border: "1px solid #fed7aa",
            display: "flex", alignItems: "center", gap: 10,
          }}>
            <span style={{ fontSize: 22 }}>⚠️</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#92400e" }}>گرسنه‌ای!</div>
              <div style={{ fontSize: 11, color: "#b45309" }}>یه چیزی بخور تا انرژی بگیری</div>
            </div>
            <Link href="/fridge">
              <button className="btn btn-sm" style={{ background: "#f97316", color: "white" }}>بریم</button>
            </Link>
          </div>
        )}

        {/* Room grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
          {roomItems.map((item) => (
            <Link key={item.id} href={item.href} style={{ textDecoration: "none" }}>
              <div className="card card-press" style={{
                padding: "14px 14px 12px",
                background: item.bg, border: `1px solid ${item.border}`,
                position: "relative", minHeight: 110,
              }}>
                {item.alert && (
                  <div style={{
                    position: "absolute", top: 9, left: 9,
                    width: 9, height: 9, borderRadius: "50%",
                    background: "#ef4444", boxShadow: "0 0 0 2px white",
                  }} />
                )}
                {item.badge && (
                  <div style={{
                    position: "absolute", top: 8, left: 8,
                    background: "#ef4444", color: "white",
                    borderRadius: "var(--r-full)", fontSize: 10,
                    fontWeight: 700, padding: "1px 6px",
                  }}>{item.badge}</div>
                )}
                <div style={{ fontSize: 30, marginBottom: 6, lineHeight: 1 }}>{item.innerEmoji}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", marginBottom: 2 }}>{item.label}</div>
                <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: item.statusBar ? 10 : 0 }}>{item.sublabel}</div>
                {item.statusBar && (
                  <div>
                    <div style={{ fontSize: 10, color: "var(--text-subtle)", marginBottom: 4 }}>{item.statusBar.label}</div>
                    <div style={{ background: "rgba(0,0,0,.08)", borderRadius: "var(--r-full)", height: 5 }}>
                      <div style={{
                        width: `${item.statusBar.value}%`, height: "100%",
                        borderRadius: "var(--r-full)", background: item.statusBar.color, transition: "width .5s",
                      }} />
                    </div>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>

        {/* Housing strip */}
        <div className="card" style={{ padding: "13px 16px", display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 26 }}>🏠</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600 }}>{housing.type}</div>
            <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
              اجاره {formatMoney(housing.monthlyRent)} · سررسید {housing.nextRentDue} روز دیگه
            </div>
          </div>
          <span style={{
            fontSize: 11, fontWeight: 600, padding: "3px 10px",
            background: "#fef3c7", color: "#92400e", borderRadius: "var(--r-full)",
          }}>اجاره‌نشین</span>
        </div>

      </div>
      <BottomNav />
    </div>
  );
}
