"use client";

export default function LockedEpisodeTeaser() {
  return (
    <div style={{
      textAlign: "center",
      padding: "28px 16px",
      borderRadius: 22,
      background: "linear-gradient(145deg, rgba(255,255,255,0.02), rgba(168,85,247,0.03))",
      border: "1px solid rgba(168,85,247,0.1)",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Lock glow */}
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        width: 120, height: 120, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(168,85,247,0.06) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div className="anim-breathe" style={{
        fontSize: 40, marginBottom: 10,
        filter: "drop-shadow(0 0 12px rgba(168,85,247,0.2))",
      }}>
        🔒
      </div>

      <div style={{
        fontSize: 15, fontWeight: 800, color: "rgba(255,255,255,0.45)",
        marginBottom: 6,
      }}>
        اپیزود بعدی قفله...
      </div>

      <div style={{
        fontSize: 11, color: "rgba(255,255,255,0.2)", lineHeight: 1.6,
        maxWidth: 240, margin: "0 auto",
      }}>
        ماموریت فعلی رو تموم کن تا اپیزود جدید باز بشه
      </div>

      {/* Decorative dots */}
      <div style={{
        display: "flex", justifyContent: "center", gap: 6,
        marginTop: 16,
      }}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{
            width: 5, height: 5, borderRadius: "50%",
            background: "rgba(168,85,247,0.15)",
            animation: `sparkle ${2 + i * 0.5}s ease-in-out ${i * 0.3}s infinite`,
          }} />
        ))}
      </div>
    </div>
  );
}
