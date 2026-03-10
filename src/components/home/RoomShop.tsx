"use client";
import { useState } from "react";
import { useGameStore } from "@/stores/gameStore";
import { ROOM_ITEMS, ROOM_TIERS, getRoomTier, type RoomItemCategory, type RoomItemEffects } from "@/data/roomItems";
import { formatMoney, toPersian } from "@/data/mock";

const CATEGORY_LABELS: Record<RoomItemCategory, string> = {
  work:      "💼 کار",
  study:     "📚 مطالعه",
  energy:    "⚡ انرژی",
  lifestyle: "🛋️ سبک زندگی",
  decor:     "🎨 دکور",
};

// ─── Effect summary line ───────────────────────────────────────────────────────
function EffectTags({ effects }: { effects: RoomItemEffects }) {
  const tags: { label: string; color: string }[] = [];
  if (effects.workIncomeMultiplier) {
    const pct = Math.round((effects.workIncomeMultiplier - 1) * 100);
    tags.push({ label: `+${toPersian(pct)}٪ درآمد کاری`, color: "#4ade80" });
  }
  if (effects.learningSpeedMultiplier) {
    const pct = Math.round((effects.learningSpeedMultiplier - 1) * 100);
    tags.push({ label: `+${toPersian(pct)}٪ سرعت یادگیری`, color: "#60a5fa" });
  }
  if (effects.dailyEnergyBonus) {
    tags.push({ label: `+${toPersian(effects.dailyEnergyBonus)} انرژی/روز`, color: "#fb923c" });
  }
  if (effects.dailyHappinessBonus) {
    tags.push({ label: `+${toPersian(effects.dailyHappinessBonus)} شادی/روز`, color: "#f472b6" });
  }
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 5 }}>
      {tags.map((t) => (
        <span
          key={t.label}
          style={{
            fontSize: 9, fontWeight: 700,
            padding: "2px 7px", borderRadius: 8,
            background: `${t.color}18`,
            color: t.color,
            border: `1px solid ${t.color}30`,
          }}
        >
          {t.label}
        </span>
      ))}
    </div>
  );
}

// ─── RoomShop ─────────────────────────────────────────────────────────────────
interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function RoomShop({ isOpen, onClose }: Props) {
  const [activeCategory, setActiveCategory] = useState<RoomItemCategory | "all">("all");
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  const checking  = useGameStore((s) => s.bank.checking);
  const level     = useGameStore((s) => s.player.level);
  const roomItems = useGameStore((s) => s.roomItems ?? []);
  const buyRoomItem = useGameStore((s) => s.buyRoomItem);

  const tier = getRoomTier(roomItems.length);

  const showToast = (msg: string, ok: boolean) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 1800);
  };

  const handleBuy = (itemId: string) => {
    const result = buyRoomItem(itemId);
    if (result.success) {
      showToast("خریداری شد! ✅", true);
    } else {
      showToast(result.reason ?? "خطا", false);
    }
  };

  const categories: Array<RoomItemCategory | "all"> = ["all", "work", "study", "energy", "lifestyle", "decor"];
  const visibleItems = ROOM_ITEMS.filter(
    (item) => activeCategory === "all" || item.category === activeCategory
  );

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed", inset: 0,
          background: "rgba(0,0,0,0.6)",
          zIndex: 60,
        }}
      />

      {/* Sheet */}
      <div
        style={{
          position: "fixed", bottom: 0, left: "50%",
          transform: "translateX(-50%)",
          width: "100%", maxWidth: 430,
          background: "linear-gradient(180deg, #0f1330 0%, #0a0e27 100%)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "24px 24px 0 0",
          zIndex: 61,
          maxHeight: "85dvh",
          overflowY: "auto",
          paddingBottom: 24,
        }}
      >
        {/* Handle */}
        <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 0" }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.15)" }} />
        </div>

        {/* Header */}
        <div style={{ padding: "14px 20px 0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 17, fontWeight: 900, color: "white" }}>🏠 ارتقاء اتاق</div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 5 }}>
              <span style={{
                fontSize: 9, fontWeight: 800,
                padding: "2px 8px", borderRadius: 8,
                background: `${tier.color}18`,
                color: tier.color,
                border: `1px solid ${tier.color}30`,
              }}>
                {tier.nameFa}
              </span>
              <span style={{ fontSize: 9, color: "rgba(255,255,255,0.3)" }}>
                {toPersian(roomItems.length)} آیتم · موجودی {formatMoney(checking)}
              </span>
            </div>
            {/* Tier progress */}
            <TierProgressBar ownedCount={roomItems.length} />
          </div>
          <button
            onClick={onClose}
            style={{
              fontSize: 18, background: "transparent",
              border: "none", color: "rgba(255,255,255,0.4)",
              cursor: "pointer", padding: 4,
            }}
          >
            ✕
          </button>
        </div>

        {/* Category filter */}
        <div style={{ overflowX: "auto", padding: "12px 16px 0", display: "flex", gap: 6 }}>
          {categories.map((cat) => {
            const isActive = cat === activeCategory;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  flexShrink: 0,
                  fontSize: 10, fontWeight: 700,
                  padding: "5px 12px", borderRadius: 20,
                  background: isActive ? "rgba(99,102,241,0.2)" : "rgba(255,255,255,0.05)",
                  color: isActive ? "#818cf8" : "rgba(255,255,255,0.4)",
                  border: isActive ? "1px solid rgba(99,102,241,0.35)" : "1px solid rgba(255,255,255,0.06)",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  whiteSpace: "nowrap",
                  transition: "all 0.15s ease",
                }}
              >
                {cat === "all" ? "همه" : CATEGORY_LABELS[cat]}
              </button>
            );
          })}
        </div>

        {/* Items */}
        <div style={{ padding: "12px 16px 0", display: "flex", flexDirection: "column", gap: 8 }}>
          {visibleItems.map((item) => {
            const owned   = roomItems.includes(item.id);
            const locked  = !owned && !!item.unlockLevel && level < item.unlockLevel;
            const noMoney = !owned && !locked && checking < item.price;

            return (
              <div
                key={item.id}
                style={{
                  borderRadius: 16,
                  padding: "12px 14px",
                  background: owned
                    ? "rgba(74,222,128,0.05)"
                    : locked
                      ? "rgba(255,255,255,0.02)"
                      : "rgba(255,255,255,0.04)",
                  border: owned
                    ? "1px solid rgba(74,222,128,0.15)"
                    : locked
                      ? "1px solid rgba(255,255,255,0.04)"
                      : "1px solid rgba(255,255,255,0.07)",
                  opacity: locked ? 0.5 : 1,
                  display: "flex", alignItems: "center", gap: 12,
                }}
              >
                {/* Emoji */}
                <div style={{ fontSize: 30, flexShrink: 0, lineHeight: 1 }}>{item.emoji}</div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 2 }}>
                    <span style={{ fontSize: 13, fontWeight: 800, color: owned ? "#4ade80" : "white" }}>
                      {item.nameFa}
                    </span>
                    {owned && (
                      <span style={{ fontSize: 9, fontWeight: 700, color: "#4ade80" }}>✅ خریداری شده</span>
                    )}
                    {locked && (
                      <span style={{ fontSize: 9, fontWeight: 700, color: "#f87171" }}>
                        🔒 سطح {toPersian(item.unlockLevel!)}
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", marginBottom: 3 }}>
                    {item.descriptionFa}
                  </div>
                  <EffectTags effects={item.effects} />
                </div>

                {/* Price / Buy */}
                {!owned && (
                  <button
                    onClick={() => !locked && handleBuy(item.id)}
                    disabled={locked || noMoney}
                    style={{
                      flexShrink: 0,
                      fontSize: 10, fontWeight: 800,
                      padding: "6px 12px", borderRadius: 10,
                      background: locked || noMoney
                        ? "rgba(255,255,255,0.05)"
                        : "rgba(99,102,241,0.15)",
                      color: locked || noMoney
                        ? "rgba(255,255,255,0.25)"
                        : "#818cf8",
                      border: locked || noMoney
                        ? "1px solid rgba(255,255,255,0.06)"
                        : "1px solid rgba(99,102,241,0.3)",
                      cursor: locked || noMoney ? "not-allowed" : "pointer",
                      fontFamily: "inherit",
                      display: "flex", flexDirection: "column", alignItems: "center",
                    }}
                  >
                    <span style={{ fontSize: 8, color: "rgba(255,255,255,0.3)", fontWeight: 600 }}>قیمت</span>
                    <span>{formatMoney(item.price)}</span>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div
          style={{
            position: "fixed", bottom: "calc(85dvh + 12px)", left: "50%",
            transform: "translateX(-50%)",
            background: toast.ok ? "rgba(74,222,128,0.15)" : "rgba(239,68,68,0.15)",
            border: `1px solid ${toast.ok ? "rgba(74,222,128,0.3)" : "rgba(239,68,68,0.3)"}`,
            color: toast.ok ? "#4ade80" : "#f87171",
            padding: "8px 18px", borderRadius: 12,
            fontSize: 12, fontWeight: 700,
            zIndex: 70,
            whiteSpace: "nowrap",
          }}
        >
          {toast.msg}
        </div>
      )}
    </>
  );
}

// ─── Tier progress bar ────────────────────────────────────────────────────────
function TierProgressBar({ ownedCount }: { ownedCount: number }) {
  const currentTierIdx = ROOM_TIERS.findIndex((t) => {
    const next = ROOM_TIERS[ROOM_TIERS.indexOf(t) + 1];
    return !next || ownedCount < next.requiredItems;
  });
  const current = ROOM_TIERS[currentTierIdx];
  const next    = ROOM_TIERS[currentTierIdx + 1];
  if (!next) return null;

  const progress = (ownedCount - current.requiredItems) / (next.requiredItems - current.requiredItems);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 6 }}>
      <div style={{
        flex: 1, height: 3, borderRadius: 3,
        background: "rgba(255,255,255,0.07)", overflow: "hidden",
      }}>
        <div style={{
          width: `${Math.min(100, progress * 100)}%`, height: "100%",
          background: `linear-gradient(90deg, ${current.color}, ${next.color})`,
          borderRadius: 3, transition: "width 0.4s ease",
        }} />
      </div>
      <span style={{ fontSize: 8, color: "rgba(255,255,255,0.3)", whiteSpace: "nowrap" }}>
        {toPersian(next.requiredItems - ownedCount)} آیتم تا «{next.nameFa}»
      </span>
    </div>
  );
}
