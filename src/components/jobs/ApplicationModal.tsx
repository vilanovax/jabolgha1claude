"use client";
import { toPersian, formatMoney } from "@/data/mock";

export interface ApplicationResult {
  accepted: boolean;
  xpGain?: number;
  moneyGain?: number;
  reputationGain?: number;
  rejectReason?: string;
}

interface Props {
  visible: boolean;
  phase: "loading" | "result";
  result: ApplicationResult | null;
  jobTitle: string;
  onClose: () => void;
}

export default function ApplicationModal({ visible, phase, result, jobTitle, onClose }: Props) {
  if (!visible) return null;

  return (
    <div style={{
      position: "fixed", inset: 0,
      background: "rgba(0,0,0,0.6)",
      backdropFilter: "blur(8px)",
      WebkitBackdropFilter: "blur(8px)",
      zIndex: 200,
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 24,
    }}>
      <div style={{
        background: "white",
        borderRadius: 28,
        padding: "28px 24px",
        width: "100%",
        maxWidth: 340,
        boxShadow: "0 25px 50px rgba(0,0,0,0.25)",
        textAlign: "center",
      }}>
        {phase === "loading" ? (
          <LoadingPhase jobTitle={jobTitle} />
        ) : result?.accepted ? (
          <AcceptedPhase result={result} jobTitle={jobTitle} onClose={onClose} />
        ) : (
          <RejectedPhase result={result} jobTitle={jobTitle} onClose={onClose} />
        )}
      </div>
    </div>
  );
}

function LoadingPhase({ jobTitle }: { jobTitle: string }) {
  return (
    <>
      <div className="anim-breathe" style={{
        fontSize: 48, marginBottom: 16,
      }}>📄</div>
      <div style={{
        fontSize: 15, fontWeight: 800, color: "#0f172a", marginBottom: 6,
      }}>در حال بررسی رزومه...</div>
      <div style={{
        fontSize: 12, color: "#94a3b8", marginBottom: 16,
      }}>{jobTitle}</div>
      {/* Loading bar */}
      <div style={{
        height: 6, borderRadius: 3,
        background: "#f1f5f9",
        overflow: "hidden",
        position: "relative",
      }}>
        <div className="anim-loading-bar" style={{
          width: "40%", height: "100%",
          borderRadius: 3,
          background: "linear-gradient(90deg, #e2e8f0, #3b82f6, #e2e8f0)",
        }} />
      </div>
    </>
  );
}

function AcceptedPhase({ result, jobTitle, onClose }: {
  result: ApplicationResult | null;
  jobTitle: string;
  onClose: () => void;
}) {
  return (
    <>
      <div className="anim-reward-pop" style={{
        fontSize: 56, marginBottom: 12,
      }}>🎉</div>
      <div style={{
        fontSize: 18, fontWeight: 900, color: "#0f172a", marginBottom: 4,
      }}>پذیرفته شدی!</div>
      <div style={{
        fontSize: 12, color: "#64748b", marginBottom: 20,
      }}>«{jobTitle}»</div>

      {/* Reward chips */}
      <div style={{
        display: "flex", gap: 8, justifyContent: "center",
        flexWrap: "wrap", marginBottom: 24,
      }}>
        {result?.xpGain && (
          <div className="anim-reward-float" style={{
            fontSize: 12, fontWeight: 700,
            padding: "6px 14px", borderRadius: 14,
            background: "rgba(168,85,247,0.1)",
            color: "#7c3aed",
            border: "1px solid rgba(168,85,247,0.2)",
          }}>
            +{toPersian(result.xpGain)} XP ✨
          </div>
        )}
        {result?.moneyGain && (
          <div className="anim-reward-float" style={{
            fontSize: 12, fontWeight: 700,
            padding: "6px 14px", borderRadius: 14,
            background: "rgba(74,222,128,0.1)",
            color: "#16a34a",
            border: "1px solid rgba(74,222,128,0.2)",
            animationDelay: "0.15s",
          }}>
            +{formatMoney(result.moneyGain)} 💰
          </div>
        )}
        {result?.reputationGain && (
          <div className="anim-reward-float" style={{
            fontSize: 12, fontWeight: 700,
            padding: "6px 14px", borderRadius: 14,
            background: "rgba(250,204,21,0.1)",
            color: "#a16207",
            border: "1px solid rgba(250,204,21,0.2)",
            animationDelay: "0.3s",
          }}>
            +{toPersian(result.reputationGain)} شهرت ⭐
          </div>
        )}
      </div>

      <button onClick={onClose} className="game-btn" style={{
        width: "100%", justifyContent: "center",
      }}>
        عالیه! ✓
      </button>
    </>
  );
}

function RejectedPhase({ result, jobTitle, onClose }: {
  result: ApplicationResult | null;
  jobTitle: string;
  onClose: () => void;
}) {
  return (
    <>
      <div className="anim-reward-pop" style={{
        fontSize: 56, marginBottom: 12,
      }}>😬</div>
      <div style={{
        fontSize: 18, fontWeight: 900, color: "#0f172a", marginBottom: 4,
      }}>متاسفانه رد شد</div>
      <div style={{
        fontSize: 12, color: "#64748b", marginBottom: 16,
      }}>«{jobTitle}»</div>

      <div style={{
        fontSize: 13, fontWeight: 600, color: "#ef4444",
        padding: "10px 16px", borderRadius: 14,
        background: "rgba(239,68,68,0.06)",
        border: "1px solid rgba(239,68,68,0.12)",
        marginBottom: 24, lineHeight: 1.6,
      }}>
        {result?.rejectReason || "مهارت‌های لازم رو نداری"}
      </div>

      <button onClick={onClose} className="game-btn game-btn-done" style={{
        width: "100%", justifyContent: "center",
      }}>
        باشه 😤
      </button>
    </>
  );
}
