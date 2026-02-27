"use client";
import { useState } from "react";
import BottomNav from "@/components/layout/BottomNav";
import TopBar from "@/components/layout/TopBar";
import { cityEvents, cityPlayers, formatMoney } from "@/data/mock";

const cityTabs = ["رویدادها", "بازار", "رنکینگ"];

export default function CityPage() {
  const [tab, setTab] = useState(0);

  return (
    <div style={{ minHeight: "100dvh", background: "var(--bg)" }}>
      <TopBar />

      <div style={{ padding: "16px 16px 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800 }}>🌆 شهر تهران</div>
            <div style={{ fontSize: 12, color: "var(--text-muted)" }}>۷۴۸ / ۱۰۰۰ بازیکن فعال</div>
          </div>
          <div style={{
            width: 10, height: 10, borderRadius: "50%",
            background: "#22c55e", boxShadow: "0 0 0 3px rgba(34,197,94,.25)",
          }} />
        </div>

        {/* Tabs */}
        <div style={{
          display: "flex", background: "var(--surface)", borderRadius: "var(--r-lg)",
          padding: 4, marginBottom: 16, border: "1px solid var(--border)", gap: 4,
        }}>
          {cityTabs.map((t, i) => (
            <button key={t} onClick={() => setTab(i)} style={{
              flex: 1, padding: "8px 0", border: "none", cursor: "pointer",
              borderRadius: "var(--r-md)", fontSize: 12, fontWeight: 600, fontFamily: "inherit",
              background: tab === i ? "var(--primary)" : "transparent",
              color: tab === i ? "white" : "var(--text-muted)",
              transition: "all .15s",
            }}>{t}</button>
          ))}
        </div>
      </div>

      <div className="safe-bottom" style={{ padding: "0 16px" }}>
        {tab === 0 && <EventsTab />}
        {tab === 1 && <MarketTab />}
        {tab === 2 && <RankingTab />}
      </div>
      <BottomNav />
    </div>
  );
}

function EventsTab() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-muted)", marginBottom: 2 }}>📢 رویدادهای فعال</div>
      {cityEvents.map((ev) => (
        <div key={ev.id} className="card" style={{
          padding: "14px 16px",
          background: ev.type === "economic" ? "#fff7ed" : "#f0fdf4",
          border: ev.type === "economic" ? "1px solid #fed7aa" : "1px solid #bbf7d0",
        }}>
          <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
            <div style={{ fontSize: 28, lineHeight: 1 }}>{ev.emoji}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 3 }}>{ev.title}</div>
              <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 6 }}>{ev.desc}</div>
              <div style={{ fontSize: 11, color: "var(--text-subtle)" }}>{ev.time}</div>
            </div>
            <button className="btn btn-sm btn-ghost">جزئیات</button>
          </div>
        </div>
      ))}

      {/* Opportunities */}
      <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-muted)", marginTop: 6, marginBottom: 4 }}>🔥 فرصت‌های امروز</div>
      {[
        { emoji: "👔", title: "کارمند می‌خوام", sub: "شرکت دیجی‌کد | Lv.6+ | ۵۵M", btn: "درخواست" },
        { emoji: "🤝", title: "شریک تجاری می‌خوام", sub: "سرمایه ۲۰۰M | فروشگاه آنلاین", btn: "جزئیات" },
        { emoji: "📦", title: "خرید عمده آیفون", sub: "بازرگانی نوری | ۱۵ دستگاه", btn: "مذاکره" },
      ].map((op) => (
        <div key={op.title} className="card" style={{ padding: "12px 14px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 24 }}>{op.emoji}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700 }}>{op.title}</div>
              <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{op.sub}</div>
            </div>
            <button className="btn btn-sm btn-primary">{op.btn}</button>
          </div>
        </div>
      ))}
    </div>
  );
}

function MarketTab() {
  const sectors = [
    { name: "IT / برنامه‌نویسی", pct: 38, status: "اشباع", color: "#ef4444" },
    { name: "فروش / بازرگانی", pct: 21, status: "متعادل", color: "#22c55e" },
    { name: "آموزش", pct: 12, status: "متعادل", color: "#22c55e" },
    { name: "رستوران / غذا", pct: 6, status: "فرصت", color: "#f97316" },
    { name: "سلامت", pct: 9, status: "نیاز", color: "#3b82f6" },
    { name: "سایر", pct: 14, status: "متعادل", color: "#6b7280" },
  ];
  return (
    <div>
      <div className="card" style={{ padding: "14px 16px", marginBottom: 14 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-muted)", marginBottom: 12 }}>📊 توزیع مشاغل شهر</div>
        {sectors.map((s) => (
          <div key={s.name} style={{ marginBottom: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
              <span style={{ fontSize: 12, fontWeight: 600 }}>{s.name}</span>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{
                  fontSize: 10, fontWeight: 700, padding: "1px 7px",
                  background: s.color + "20", color: s.color,
                  borderRadius: "var(--r-full)",
                }}>{s.status}</span>
                <span style={{ fontSize: 12, fontWeight: 700, minWidth: 28, textAlign: "left" }}>{s.pct}٪</span>
              </div>
            </div>
            <div style={{ background: "var(--surface-2)", borderRadius: "var(--r-full)", height: 6, border: "1px solid var(--border)" }}>
              <div style={{ width: `${s.pct}%`, height: "100%", borderRadius: "var(--r-full)", background: s.color }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RankingTab() {
  return (
    <div className="card" style={{ padding: "14px 16px" }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-muted)", marginBottom: 12 }}>🏆 ثروتمندترین‌های شهر</div>
      {cityPlayers.map((p) => (
        <div key={p.rank} style={{
          display: "flex", alignItems: "center", gap: 12,
          padding: "10px 0",
          borderBottom: "1px solid var(--border)",
          background: p.isMe ? "rgba(27,58,92,.04)" : "transparent",
          borderRadius: p.isMe ? "var(--r-md)" : 0,
          paddingRight: p.isMe ? 10 : 0, paddingLeft: p.isMe ? 10 : 0,
          margin: p.isMe ? "0 -10px" : 0,
        }}>
          <div style={{
            width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
            background: p.rank <= 3 ? "var(--accent)" : "var(--surface-2)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: p.rank <= 3 ? 14 : 12, fontWeight: 700,
            color: p.rank <= 3 ? "white" : "var(--text-muted)",
          }}>
            {p.rank <= 3 ? p.badge : p.rank}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: p.isMe ? 800 : 600, color: p.isMe ? "var(--primary)" : "var(--text)" }}>
              {p.name} {p.isMe ? "(من)" : ""}
            </div>
            <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{p.title}</div>
          </div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "var(--accent-dark)" }}>
            {formatMoney(p.netWorth)}
          </div>
        </div>
      ))}
    </div>
  );
}
