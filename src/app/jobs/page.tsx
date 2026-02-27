"use client";
import { useState } from "react";
import BottomNav from "@/components/layout/BottomNav";
import TopBar from "@/components/layout/TopBar";
import { jobListings, getJobTypeColor, formatMoney } from "@/data/mock";

export default function JobsPage() {
  const [tab, setTab] = useState<"suitable" | "all">("suitable");
  const [applied, setApplied] = useState<number[]>([]);

  const suitable = jobListings.filter((j) => j.suitable);
  const items = tab === "suitable" ? suitable : jobListings;

  return (
    <div style={{ minHeight: "100dvh", background: "var(--bg)" }}>
      <TopBar />

      {/* Page header */}
      <div style={{ padding: "16px 16px 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: "var(--text)" }}>💼 بازار کار</div>
            <div style={{ fontSize: 12, color: "var(--text-muted)" }}>آگهی‌های امروز</div>
          </div>
          <div style={{
            fontSize: 13, fontWeight: 700, padding: "5px 12px",
            background: "#f0fdf4", color: "#166534",
            borderRadius: "var(--r-full)", border: "1px solid #bbf7d0",
          }}>
            {suitable.length} آگهی مناسب
          </div>
        </div>

        {/* Tabs */}
        <div style={{
          display: "flex", background: "var(--surface)", borderRadius: "var(--r-lg)",
          padding: 4, marginBottom: 16, border: "1px solid var(--border)",
        }}>
          {[
            { key: "suitable", label: `🟢 مناسب (${suitable.length})` },
            { key: "all", label: `📋 همه (${jobListings.length})` },
          ].map((t) => (
            <button key={t.key} onClick={() => setTab(t.key as "suitable" | "all")}
              style={{
                flex: 1, padding: "9px 0", border: "none", cursor: "pointer",
                borderRadius: "var(--r-md)", fontSize: 13, fontWeight: 600, fontFamily: "inherit",
                background: tab === t.key ? "var(--primary)" : "transparent",
                color: tab === t.key ? "white" : "var(--text-muted)",
                transition: "all .15s",
              }}
            >{t.label}</button>
          ))}
        </div>
      </div>

      {/* Job list */}
      <div className="safe-bottom" style={{ padding: "0 16px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {items.map((job) => {
            const typeColor = getJobTypeColor(job.type);
            const isApplied = applied.includes(job.id);
            return (
              <div key={job.id} className="card" style={{ padding: "16px", overflow: "hidden" }}>
                {/* Top row */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text)", marginBottom: 4 }}>
                      {job.title}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                      <span style={{
                        fontSize: 11, fontWeight: 600, padding: "2px 8px",
                        background: typeColor.bg, color: typeColor.text,
                        borderRadius: "var(--r-full)",
                      }}>{job.type}</span>
                      <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{job.company}</span>
                      {job.isRemote && (
                        <span style={{
                          fontSize: 11, fontWeight: 600, padding: "2px 8px",
                          background: "#f0fdf4", color: "#166534", borderRadius: "var(--r-full)",
                        }}>🏠 دورکاری</span>
                      )}
                    </div>
                  </div>
                  <div style={{
                    fontSize: 11, color: "var(--text-subtle)", textAlign: "left",
                    flexShrink: 0, marginRight: 8,
                  }}>
                    {job.postedAgo === 0 ? "امروز" : `${job.postedAgo} روز پیش`}
                  </div>
                </div>

                {/* Salary */}
                <div style={{
                  fontSize: 16, fontWeight: 800, color: "var(--accent-dark)",
                  marginBottom: 10,
                }}>
                  💰 {formatMoney(job.salaryMin)}
                  {job.salaryMax !== job.salaryMin && ` - ${formatMoney(job.salaryMax)}`}
                  {(job as { commission?: boolean }).commission && " + کمیسیون"}
                </div>

                {/* Requirements */}
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
                  {job.requirements.map((req) => (
                    <span key={req.skill} style={{
                      fontSize: 11, fontWeight: 600, padding: "3px 10px",
                      background: "var(--surface-2)", color: "var(--text-muted)",
                      borderRadius: "var(--r-full)", border: "1px solid var(--border)",
                    }}>
                      {req.skill} Lv.{req.level}+
                    </span>
                  ))}
                </div>

                {/* Action */}
                {job.suitable ? (
                  <button
                    onClick={() => !isApplied && setApplied((p) => [...p, job.id])}
                    className="btn"
                    style={{
                      width: "100%", justifyContent: "center", padding: "11px 0",
                      background: isApplied ? "#f0fdf4" : "var(--primary)",
                      color: isApplied ? "#166534" : "white",
                      fontSize: 14,
                    }}
                  >
                    {isApplied ? "✓ درخواست ارسال شد" : "درخواست بده"}
                  </button>
                ) : (
                  <div style={{
                    padding: "10px 14px", borderRadius: "var(--r-md)",
                    background: "#fff7ed", border: "1px solid #fed7aa",
                    fontSize: 12, color: "#92400e",
                    display: "flex", alignItems: "center", gap: 8,
                  }}>
                    <span>❌</span>
                    <span>نیاز داری: <strong>{(job as { missing?: string }).missing}</strong></span>
                    <button style={{
                      marginRight: "auto", background: "none", border: "none",
                      fontSize: 12, color: "var(--primary)", fontWeight: 700,
                      cursor: "pointer", fontFamily: "inherit", padding: 0,
                    }}>یاد بگیر ←</button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
