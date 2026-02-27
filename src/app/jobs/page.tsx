"use client";
import { useState } from "react";
import TopHeader from "@/components/layout/TopHeader";
import BottomNav from "@/components/layout/BottomNav";
import { jobListings, getJobTypeColor, formatMoney } from "@/data/mock";

export default function JobsPage() {
  const [tab, setTab] = useState<"suitable" | "all">("suitable");
  const [applied, setApplied] = useState<number[]>([]);

  const suitable = jobListings.filter((j) => j.suitable);
  const items = tab === "suitable" ? suitable : jobListings;

  return (
    <div className="game-bg" style={{ minHeight: "100dvh" }}>
      <TopHeader />

      <div className="page-enter" style={{
        paddingTop: "calc(var(--header-h) + 8px)",
        paddingBottom: "calc(var(--nav-h) + 16px)",
        paddingLeft: 14, paddingRight: 14,
        position: "relative", zIndex: 2,
      }}>
        {/* Page title */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          marginBottom: 14,
        }}>
          <div style={{
            fontSize: 18, fontWeight: 800, color: "#0f172a",
            display: "flex", alignItems: "center", gap: 6,
          }}>
            <span style={{ fontSize: 20 }}>💼</span>
            بازار کار
          </div>
          <div style={{
            fontSize: 11, fontWeight: 700,
            padding: "4px 12px", borderRadius: "var(--r-full)",
            background: "linear-gradient(135deg, #dcfce7, #f0fdf4)",
            color: "#16a34a", border: "1px solid #bbf7d0",
            boxShadow: "0 2px 8px rgba(34,197,94,0.15)",
          }}>
            {suitable.length} آگهی مناسب
          </div>
        </div>

        {/* Tabs */}
        <div style={{
          display: "flex", padding: 4, marginBottom: 14,
          background: "linear-gradient(145deg, #0F2340, #1B3A5C)",
          borderRadius: 18, border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 4px 16px rgba(10,22,40,0.3)",
        }}>
          {[
            { key: "suitable", label: `🟢 مناسب (${suitable.length})` },
            { key: "all", label: `📋 همه (${jobListings.length})` },
          ].map((t) => (
            <button key={t.key} onClick={() => setTab(t.key as "suitable" | "all")}
              style={{
                flex: 1, padding: "10px 0", border: "none", cursor: "pointer",
                borderRadius: 14, fontSize: 13, fontWeight: 700,
                fontFamily: "inherit", transition: "all .2s",
                background: tab === t.key
                  ? "linear-gradient(180deg, #22c55e, #16a34a)"
                  : "transparent",
                color: tab === t.key ? "white" : "rgba(255,255,255,0.4)",
                boxShadow: tab === t.key ? "0 4px 14px rgba(34,197,94,0.35)" : "none",
                textShadow: tab === t.key ? "0 1px 2px rgba(0,0,0,0.15)" : "none",
              }}
            >{t.label}</button>
          ))}
        </div>

        {/* Job cards */}
        {items.map((job) => {
          const typeColor = getJobTypeColor(job.type);
          const isApplied = applied.includes(job.id);
          return (
            <div key={job.id} className={`activity-card ${isApplied ? "activity-card--done" : "activity-card--work"}`}>
              <div style={{ padding: "16px 16px 12px" }}>
                {/* Top row */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: "#0f172a", marginBottom: 5 }}>
                      {job.title}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                      <span style={{
                        fontSize: 10, fontWeight: 700, padding: "2px 8px",
                        background: typeColor.bg, color: typeColor.text,
                        borderRadius: "var(--r-full)",
                      }}>{job.type}</span>
                      <span style={{ fontSize: 11, color: "#64748b" }}>{job.company}</span>
                      {job.isRemote && (
                        <span style={{
                          fontSize: 10, fontWeight: 700, padding: "2px 8px",
                          background: "#dcfce7", color: "#166534",
                          borderRadius: "var(--r-full)",
                        }}>🏠 دورکاری</span>
                      )}
                    </div>
                  </div>
                  <div style={{ fontSize: 10, color: "#94a3b8", flexShrink: 0 }}>
                    {job.postedAgo === 0 ? "امروز" : `${job.postedAgo} روز پیش`}
                  </div>
                </div>

                {/* Salary */}
                <div style={{
                  fontSize: 16, fontWeight: 800, color: "#D4A843",
                  marginBottom: 10,
                  textShadow: "0 0 8px rgba(212,168,67,0.2)",
                }}>
                  💰 {formatMoney(job.salaryMin)}
                  {job.salaryMax !== job.salaryMin && ` - ${formatMoney(job.salaryMax)}`}
                  {(job as { commission?: boolean }).commission && " + کمیسیون"}
                </div>

                {/* Requirements */}
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
                  {job.requirements.map((req) => (
                    <span key={req.skill} className="badge-cost" style={{
                      background: "#f1f5f9", color: "#475569",
                      borderColor: "#e2e8f0",
                    }}>
                      {req.skill} Lv.{req.level}+
                    </span>
                  ))}
                </div>

                {/* Action */}
                {job.suitable ? (
                  <button
                    onClick={() => !isApplied && setApplied((p) => [...p, job.id])}
                    className={isApplied ? "game-btn game-btn-done" : "game-btn"}
                    style={{ width: "100%", justifyContent: "center" }}
                  >
                    {isApplied ? "✓ درخواست ارسال شد" : "درخواست بده"}
                  </button>
                ) : (
                  <div style={{
                    padding: "10px 14px", borderRadius: 14,
                    background: "linear-gradient(135deg, #fff7ed, #fef3c7)",
                    border: "1.5px solid #fed7aa",
                    fontSize: 12, color: "#92400e",
                    display: "flex", alignItems: "center", gap: 8,
                  }}>
                    <span>❌</span>
                    <span>نیاز داری: <strong>{(job as { missing?: string }).missing}</strong></span>
                    <button style={{
                      marginRight: "auto", background: "none", border: "none",
                      fontSize: 12, color: "#1d4ed8", fontWeight: 700,
                      cursor: "pointer", fontFamily: "inherit", padding: 0,
                    }}>یاد بگیر ←</button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <BottomNav />
    </div>
  );
}
