"use client";
import { useEffect, useState } from "react";
import { formatMoney, toPersian } from "@/data/mock";

export interface InterviewResult {
  accepted: boolean;
  xpGain?: number;
  moneyGain?: number;
  reputationGain?: number;
  rejectReason?: string;
  tip?: string;
}

interface Props {
  visible: boolean;
  phase: "loading" | "interview" | "result";
  result: InterviewResult | null;
  jobTitle: string;
  onClose: () => void;
}

const INTERVIEW_QUESTIONS = [
  "بزرگ‌ترین چالش حرفه‌ای شما چه بوده؟",
  "چرا می‌خواید برای ما کار کنید؟",
  "یک پروژه موفق توضیح بدید.",
  "در تیم چه نقشی معمولاً دارید؟",
  "هدف ۵ساله‌تون چیه؟",
];

export default function InterviewModal({ visible, phase, result, jobTitle, onClose }: Props) {
  const [dots, setDots]         = useState(".");
  const [qIndex, setQIndex]     = useState(0);
  const [answered, setAnswered] = useState(false);

  useEffect(() => {
    if (!visible) { setDots("."); setQIndex(0); setAnswered(false); return; }
    if (phase === "loading" || phase === "interview") {
      const id = setInterval(() => setDots((d) => d.length >= 3 ? "." : d + "."), 500);
      return () => clearInterval(id);
    }
  }, [visible, phase]);

  if (!visible) return null;

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 200,
      display: "flex", alignItems: "flex-end", justifyContent: "center",
      background: "rgba(0,0,0,0.65)", backdropFilter: "blur(6px)",
    }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        width: "100%", maxWidth: 480,
        background: "linear-gradient(180deg, #0f172a 0%, #1e293b 100%)",
        borderRadius: "24px 24px 0 0",
        border: "1px solid rgba(255,255,255,0.08)",
        borderBottom: "none",
        padding: "24px 20px 36px",
        animation: "slideUp 0.3s ease",
      }}>

        {/* ── Loading phase ── */}
        {phase === "loading" && (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>📋</div>
            <div style={{ fontSize: 15, fontWeight: 800, color: "white", marginBottom: 8 }}>
              در حال بررسی درخواست{dots}
            </div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>
              {jobTitle}
            </div>
            <div style={{
              marginTop: 24, height: 4, borderRadius: 2,
              background: "rgba(255,255,255,0.08)", overflow: "hidden",
            }}>
              <div style={{
                height: "100%", borderRadius: 2,
                background: "linear-gradient(90deg, #3b82f6, #60a5fa)",
                animation: "progressBar 3s ease forwards",
              }} />
            </div>
          </div>
        )}

        {/* ── Interview mini-event ── */}
        {phase === "interview" && (
          <div>
            <div style={{
              display: "flex", alignItems: "center", gap: 12, marginBottom: 20,
            }}>
              <div style={{
                width: 48, height: 48, borderRadius: "50%",
                background: "linear-gradient(135deg, #1e3a5f, #1e40af)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 22, border: "2px solid rgba(96,165,250,0.3)",
              }}>
                👔
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 800, color: "white" }}>مصاحبه‌گر</div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>{jobTitle}</div>
              </div>
            </div>

            <div style={{
              padding: "14px 16px", borderRadius: 16,
              background: "rgba(96,165,250,0.07)", border: "1px solid rgba(96,165,250,0.15)",
              marginBottom: 16,
            }}>
              <div style={{ fontSize: 13, color: "white", fontWeight: 600, lineHeight: 1.6 }}>
                {INTERVIEW_QUESTIONS[qIndex % INTERVIEW_QUESTIONS.length]}
              </div>
            </div>

            {!answered ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {["به خوبی پاسخ دادم ✓", "تقریباً پاسخ دادم ~", "پاسخ ندادم ✗"].map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => setAnswered(true)}
                    style={{
                      width: "100%", padding: "12px 16px", borderRadius: 14,
                      border: `1px solid ${i === 0 ? "rgba(74,222,128,0.2)" : i === 1 ? "rgba(251,191,36,0.2)" : "rgba(248,113,113,0.2)"}`,
                      background: i === 0 ? "rgba(74,222,128,0.07)" : i === 1 ? "rgba(251,191,36,0.07)" : "rgba(248,113,113,0.07)",
                      color: i === 0 ? "#4ade80" : i === 1 ? "#fbbf24" : "#f87171",
                      fontSize: 12, fontWeight: 700, textAlign: "right",
                      cursor: "pointer", fontFamily: "inherit",
                    }}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: "12px 0" }}>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 8 }}>
                  در حال ارزیابی پاسخ{dots}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Result phase ── */}
        {phase === "result" && result && (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 52, marginBottom: 12 }}>
              {result.accepted ? "🎉" : "😔"}
            </div>
            <div style={{
              fontSize: 18, fontWeight: 900,
              color: result.accepted ? "#4ade80" : "#f87171",
              marginBottom: 6,
            }}>
              {result.accepted ? "پذیرفته شدید!" : "رد شدید"}
            </div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 20 }}>
              {jobTitle}
            </div>

            {result.accepted ? (
              <div style={{
                display: "flex", gap: 8, justifyContent: "center", marginBottom: 24,
              }}>
                {result.xpGain && (
                  <div style={{
                    padding: "10px 16px", borderRadius: 14,
                    background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.2)",
                  }}>
                    <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", marginBottom: 3 }}>XP</div>
                    <div style={{ fontSize: 15, fontWeight: 800, color: "#4ade80" }}>
                      +{toPersian(result.xpGain)}
                    </div>
                  </div>
                )}
                {result.moneyGain && (
                  <div style={{
                    padding: "10px 16px", borderRadius: 14,
                    background: "rgba(212,168,67,0.1)", border: "1px solid rgba(212,168,67,0.2)",
                  }}>
                    <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", marginBottom: 3 }}>حقوق</div>
                    <div style={{ fontSize: 15, fontWeight: 800, color: "#D4A843" }}>
                      {formatMoney(result.moneyGain)}
                    </div>
                  </div>
                )}
                {result.reputationGain && (
                  <div style={{
                    padding: "10px 16px", borderRadius: 14,
                    background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.2)",
                  }}>
                    <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", marginBottom: 3 }}>اعتبار</div>
                    <div style={{ fontSize: 15, fontWeight: 800, color: "#fbbf24" }}>
                      +{toPersian(result.reputationGain)}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div style={{
                marginBottom: 24, padding: "14px 16px", borderRadius: 16,
                background: "rgba(248,113,113,0.07)", border: "1px solid rgba(248,113,113,0.15)",
              }}>
                <div style={{ fontSize: 11, color: "#f87171", marginBottom: result.tip ? 8 : 0 }}>
                  {result.rejectReason}
                </div>
                {result.tip && (
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", marginTop: 6 }}>
                    💡 {result.tip}
                  </div>
                )}
              </div>
            )}

            <button
              onClick={onClose}
              style={{
                width: "100%", padding: "13px 0", borderRadius: 16,
                border: "none", cursor: "pointer", fontFamily: "inherit",
                fontSize: 13, fontWeight: 800,
                background: result.accepted
                  ? "linear-gradient(135deg, #16a34a, #22c55e)"
                  : "rgba(255,255,255,0.08)",
                color: result.accepted ? "white" : "rgba(255,255,255,0.6)",
              }}
            >
              {result.accepted ? "به کارتان ادامه دهید 🚀" : "بستن"}
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to   { transform: translateY(0); }
        }
        @keyframes progressBar {
          from { width: 0%; }
          to   { width: 100%; }
        }
      `}</style>
    </div>
  );
}
