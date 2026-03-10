"use client";
import { useState, useEffect } from "react";
import TopHeader from "@/components/layout/TopHeader";
import BottomNav from "@/components/layout/BottomNav";
import MarketAlertBanner from "@/components/opportunities/MarketAlertBanner";
import FeaturedOpportunityCard from "@/components/opportunities/FeaturedOpportunityCard";
import OpportunityCard from "@/components/opportunities/OpportunityCard";
import OpportunityDetailsSheet from "@/components/opportunities/OpportunityDetailsSheet";
import ExpiringOpportunities from "@/components/opportunities/ExpiringOpportunities";
import OpportunityHistoryList from "@/components/opportunities/OpportunityHistoryList";
import { useOpportunityStore } from "@/game/opportunities/store";
import { useGameStore } from "@/stores/gameStore";
import type { Opportunity } from "@/game/opportunities/types";
import type { ResolveResult } from "@/game/opportunities/resolver";
import { toPersian } from "@/data/mock";
import { colors, font, sp, radius } from "@/theme/tokens";

function Badge({
  label,
  color,
  bg,
  border,
  glow,
}: {
  label: string;
  color: string;
  bg: string;
  border: string;
  glow?: boolean;
}) {
  return (
    <div
      style={{
        fontSize: 11,
        fontWeight: 700,
        color,
        background: bg,
        border: `1px solid ${border}`,
        borderRadius: 12,
        padding: "4px 10px",
        boxShadow: glow ? `0 0 8px ${border}` : "none",
      }}
    >
      {label}
    </div>
  );
}

function SectionHeader({
  emoji,
  title,
  color,
}: {
  emoji: string;
  title: string;
  color: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: sp.md,
        marginBottom: sp.lg,
      }}
    >
      <span style={{ fontSize: font["2xl"] }}>{emoji}</span>
      <span style={{ fontSize: font["2xl"], fontWeight: 800, color: "white" }}>
        {title}
      </span>
      <div
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: color,
          opacity: 0.7,
          boxShadow: `0 0 6px ${color}`,
        }}
      />
    </div>
  );
}

function ResultToast({
  result,
  onDismiss,
}: {
  result: ResolveResult;
  onDismiss: () => void;
}) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 2500);
    return () => clearTimeout(t);
  }, [onDismiss]);

  const money = result.appliedEffects.money;
  const isPositive = !money || money >= 0;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 90,
        left: 14,
        right: 14,
        zIndex: 300,
        padding: `${sp.lg}px ${sp.xl}px`,
        borderRadius: radius.xl,
        background: isPositive
          ? "linear-gradient(135deg, rgba(34,197,94,0.2), rgba(34,197,94,0.08))"
          : "linear-gradient(135deg, rgba(239,68,68,0.2), rgba(239,68,68,0.08))",
        border: `1px solid ${isPositive ? "rgba(34,197,94,0.35)" : "rgba(239,68,68,0.35)"}`,
        backdropFilter: "blur(12px)",
        direction: "rtl",
        boxShadow: isPositive
          ? "0 8px 32px rgba(34,197,94,0.2)"
          : "0 8px 32px rgba(239,68,68,0.2)",
      }}
    >
      <div
        style={{
          fontSize: font.xl,
          fontWeight: 800,
          color: "white",
          marginBottom: 4,
        }}
      >
        {isPositive ? "✅ فرصت قبول شد!" : "⚠️ نتیجه فرصت"}
      </div>
      <div
        style={{
          fontSize: font.lg,
          color: colors.textSecondary,
          lineHeight: 1.5,
        }}
      >
        {result.outcome.narrativeTextFa}
      </div>
    </div>
  );
}

export default function OpportunitiesPage() {
  const [mounted, setMounted] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] =
    useState<Opportunity | null>(null);
  const [toastResult, setToastResult] = useState<ResolveResult | null>(null);

  useEffect(() => setMounted(true), []);

  const activeOpportunities = useOpportunityStore((s) => s.activeOpportunities);
  const resolvedOpportunities = useOpportunityStore((s) => s.resolvedOpportunities);
  const acceptOpportunity = useOpportunityStore((s) => s.acceptOpportunity);
  const rejectOpportunity = useOpportunityStore((s) => s.rejectOpportunity);
  const getVisible = useOpportunityStore((s) => s.getVisible);

  const player = useGameStore((s) => s.player);
  const wave = useGameStore((s) => s.wave);

  if (!mounted) return null;

  const currentDay = player.dayInGame;
  const wavePhase = wave.currentPhase;

  const visible = getVisible(currentDay);
  const featured = visible[0] ?? null;
  const others = visible.slice(1);

  const expiringCount = visible.filter(
    (o) => o.expiresAtDay - currentDay <= 1,
  ).length;

  const handleAccept = (id: string) => {
    const result = acceptOpportunity(id);
    setSelectedOpportunity(null);
    if (result) {
      setToastResult(result);
    }
  };

  const handleReject = (id: string) => {
    rejectOpportunity(id);
    setSelectedOpportunity(null);
  };

  return (
    <div className="scene-bg" style={{ minHeight: "100dvh" }}>
      <TopHeader />

      {/* Floating particles */}
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          style={{
            position: "fixed",
            width: 3,
            height: 3,
            borderRadius: "50%",
            background:
              i % 2 === 0
                ? "rgba(212,168,67,0.3)"
                : "rgba(59,130,246,0.3)",
            top: `${15 + i * 22}%`,
            right: `${8 + i * 23}%`,
            animation: `particle-drift ${5 + i * 2}s ease-in-out ${i * 1.5}s infinite`,
            pointerEvents: "none",
            zIndex: 0,
          }}
        />
      ))}

      <div
        className="page-enter"
        style={{
          paddingTop: "calc(var(--header-h) + 10px)",
          paddingBottom: "calc(var(--nav-h) + 16px)",
          paddingLeft: 14,
          paddingRight: 14,
          position: "relative",
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        {/* Page title row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            direction: "rtl",
          }}
        >
          <div
            style={{
              fontSize: 20,
              fontWeight: 900,
              color: "white",
              display: "flex",
              alignItems: "center",
              gap: 8,
              textShadow: "0 0 16px rgba(212,168,67,0.25)",
            }}
          >
            <span style={{ fontSize: 22 }}>💡</span>
            فرصت‌ها
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <Badge
              label={`${toPersian(visible.length)} فعال`}
              color="rgba(255,255,255,0.5)"
              bg="rgba(255,255,255,0.06)"
              border="rgba(255,255,255,0.1)"
            />
            {expiringCount > 0 && (
              <Badge
                label={`${toPersian(expiringCount)} در حال انقضا ⏰`}
                color={colors.danger}
                bg="rgba(239,68,68,0.1)"
                border="rgba(239,68,68,0.25)"
                glow
              />
            )}
          </div>
        </div>

        {/* Market alert banner */}
        <MarketAlertBanner wavePhase={wavePhase} />

        {/* Featured / Empty state */}
        {featured ? (
          <>
            <SectionHeader emoji="⭐" title="فرصت ویژه" color={colors.accent} />
            <FeaturedOpportunityCard
              opportunity={featured}
              currentDay={currentDay}
              onAccept={() => handleAccept(featured.id)}
              onReject={() => handleReject(featured.id)}
            />
          </>
        ) : (
          <div
            style={{
              textAlign: "center",
              padding: "48px 24px",
              borderRadius: radius["2xl"],
              background: colors.cardBg,
              border: `1px solid ${colors.cardBorder}`,
              direction: "rtl",
            }}
          >
            <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
            <div
              style={{
                fontSize: font["3xl"],
                fontWeight: 800,
                color: "white",
                marginBottom: 8,
              }}
            >
              هنوز فرصتی باز نشده
            </div>
            <div
              style={{
                fontSize: font.lg,
                color: colors.textMuted,
                lineHeight: 1.6,
              }}
            >
              فرصت‌ها هر چند روز یک‌بار ظاهر می‌شوند
            </div>
          </div>
        )}

        {/* Other opportunities */}
        {others.length > 0 && (
          <div>
            <SectionHeader
              emoji="📋"
              title="فرصت‌های دیگر"
              color={colors.info}
            />
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {others.map((opp) => (
                <OpportunityCard
                  key={opp.id}
                  opportunity={opp}
                  currentDay={currentDay}
                  onAccept={() => handleAccept(opp.id)}
                  onReject={() => handleReject(opp.id)}
                  onDetails={() => setSelectedOpportunity(opp)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Expiring soon */}
        {visible.some((o) => o.expiresAtDay - currentDay <= 1) && (
          <ExpiringOpportunities
            opportunities={activeOpportunities}
            currentDay={currentDay}
          />
        )}

        {/* History */}
        {resolvedOpportunities.length > 0 && (
          <OpportunityHistoryList
            resolvedOpportunities={resolvedOpportunities}
          />
        )}
      </div>

      {/* Details sheet */}
      <OpportunityDetailsSheet
        opportunity={selectedOpportunity}
        currentDay={currentDay}
        onAccept={() => {
          if (selectedOpportunity) handleAccept(selectedOpportunity.id);
        }}
        onClose={() => setSelectedOpportunity(null)}
      />

      {/* Toast */}
      {toastResult && (
        <ResultToast
          result={toastResult}
          onDismiss={() => setToastResult(null)}
        />
      )}

      <BottomNav />
    </div>
  );
}
