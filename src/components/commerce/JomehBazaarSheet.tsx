"use client";
import { useState, useEffect } from "react";
import { colors, font, sp, radius } from "@/theme/tokens";
import { getPurchasablesForVendor } from "@/data/purchasables";
import { getPurchaseQuote } from "@/game/purchase/purchaseEngine";
import { useGameStore } from "@/stores/gameStore";
import { formatMoney, toPersian } from "@/data/mock";
import CommerceItemCard from "./CommerceItemCard";

const VENDOR_ID = "jomeh_bazaar" as const;
const ACCENT = "#a3e635";
const ENERGY_COST = 15;

const JOMEH_CATEGORIES = [
  { key: "all", label: "همه", emoji: "🏪" },
  { key: "room", label: "اتاق", emoji: "🛋️" },
  { key: "electronics", label: "الکترونیک", emoji: "📱" },
  { key: "appliance", label: "لوازم", emoji: "🧊" },
  { key: "food", label: "غذا", emoji: "🛒" },
];

interface JomehBazaarSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function JomehBazaarSheet({ isOpen, onClose }: JomehBazaarSheetProps) {
  const [mounted, setMounted] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => { setMounted(true); }, []);

  const level = useGameStore((s) => s.player.level);
  const money = useGameStore((s) => s.bank.checking);
  const energy = useGameStore((s) => s.player.energy);
  const dayInGame = useGameStore((s) => s.player.dayInGame);
  const inventory = useGameStore((s) => s.inventory ?? []);
  const roomItems = useGameStore((s) => s.roomItems ?? []);
  const pendingDeliveries = useGameStore((s) => s.pendingDeliveries ?? []);
  const purchaseItem = useGameStore((s) => s.purchaseItem);

  const allItems = getPurchasablesForVendor(VENDOR_ID);
  const filtered = activeCategory === "all"
    ? allItems
    : allItems.filter((i) => i.category === activeCategory);

  const ownedIds = [...inventory.map((id) => `market_${id}`), ...roomItems.map((id) => `room_${id}`)];
  const pendingIds = pendingDeliveries.map((d) => d.purchasableId);

  // Total energy needed if user visits bazaar today
  const canVisit = energy >= ENERGY_COST;

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }

  function handleBuy(purchasableId: string) {
    const result = purchaseItem(purchasableId, VENDOR_ID);
    if (!result.success) {
      showToast(result.reason ?? "خرید انجام نشد");
    } else {
      showToast("✓ خرید موفق از جمعه‌بازار!");
    }
  }

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 100,
        background: "rgba(0,0,0,0.6)",
        display: "flex", alignItems: "flex-end",
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%", maxWidth: 430, margin: "0 auto",
          background: "linear-gradient(180deg, #0e1a0e 0%, #080f08 100%)",
          borderRadius: "24px 24px 0 0",
          border: "1px solid rgba(163,230,53,0.12)",
          borderBottom: "none",
          maxHeight: "85dvh",
          display: "flex",
          flexDirection: "column",
          direction: "rtl",
          position: "relative",
        }}
      >
        {/* Handle */}
        <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 0" }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: "rgba(163,230,53,0.2)" }} />
        </div>

        {/* Header */}
        <div style={{
          padding: `${sp.lg}px ${sp.xl}px`,
          display: "flex", alignItems: "center", gap: sp.md,
          borderBottom: "1px solid rgba(163,230,53,0.08)",
        }}>
          <span style={{ fontSize: 32 }}>🧺</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: font.xl, fontWeight: 800, color: ACCENT }}>جمعه‌بازار</div>
            <div style={{ fontSize: font.xs, color: colors.textMuted }}>
              قیمت‌های پایین‌تر — تحویل فوری — هزینه انرژی
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "rgba(163,230,53,0.06)",
              border: "1px solid rgba(163,230,53,0.15)",
              borderRadius: radius.lg,
              color: ACCENT,
              fontSize: font.base,
              padding: "4px 10px",
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            ✕
          </button>
        </div>

        {/* Energy + savings info bar */}
        <div style={{
          display: "flex", gap: sp.sm, padding: `${sp.md}px ${sp.xl}px`,
          borderBottom: "1px solid rgba(255,255,255,0.04)",
        }}>
          <div style={{
            flex: 1, padding: "8px 12px",
            borderRadius: radius.lg,
            background: canVisit ? "rgba(163,230,53,0.08)" : "rgba(239,68,68,0.08)",
            border: `1px solid ${canVisit ? "rgba(163,230,53,0.2)" : "rgba(239,68,68,0.2)"}`,
            fontSize: font.xs, fontWeight: 700,
            color: canVisit ? ACCENT : colors.danger,
          }}>
            ⚡ انرژی: {toPersian(energy)}/۱۰۰
            {!canVisit && " — کم است"}
          </div>
          <div style={{
            padding: "8px 12px",
            borderRadius: radius.lg,
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            fontSize: font.xs, fontWeight: 700,
            color: colors.textSecondary,
          }}>
            💰 {formatMoney(money)}
          </div>
        </div>

        {/* "Why visit the bazaar" explainer */}
        <div style={{
          margin: `${sp.sm}px ${sp.xl}px 0`,
          padding: "8px 14px",
          borderRadius: radius.lg,
          background: "rgba(163,230,53,0.06)",
          border: "1px solid rgba(163,230,53,0.12)",
          fontSize: font.xs,
          color: "rgba(163,230,53,0.8)",
          fontWeight: 600,
        }}>
          ۲۰٪ ارزان‌تر از فروشگاه آنلاین · هر خرید {toPersian(ENERGY_COST)} انرژی می‌برد
        </div>

        {/* Category filters */}
        <div style={{
          display: "flex", gap: sp.sm,
          padding: `${sp.md}px ${sp.xl}px`,
          overflowX: "auto",
        }}>
          {JOMEH_CATEGORIES.map((cat) => {
            const active = activeCategory === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                style={{
                  flexShrink: 0,
                  padding: "4px 12px",
                  borderRadius: radius.lg,
                  border: `1px solid ${active ? ACCENT + "60" : "rgba(255,255,255,0.1)"}`,
                  background: active ? "rgba(163,230,53,0.12)" : "transparent",
                  color: active ? ACCENT : colors.textSecondary,
                  fontSize: font.xs,
                  fontWeight: 700,
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                {cat.emoji} {cat.label}
              </button>
            );
          })}
        </div>

        {/* Items */}
        <div style={{
          flex: 1, overflowY: "auto",
          padding: `0 ${sp.xl}px ${sp.xl}px`,
          display: "flex", flexDirection: "column", gap: sp.md,
        }}>
          {!mounted ? (
            <div style={{ textAlign: "center", padding: sp.xl, color: colors.textMuted }}>در حال بارگذاری...</div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: sp.xl, color: colors.textMuted }}>محصولی نیست</div>
          ) : filtered.map((item) => {
            const context = {
              playerLevel: level,
              playerMoney: money,
              playerEnergy: energy,
              ownedItemIds: ownedIds,
              currentDay: dayInGame,
            };
            const quote = getPurchaseQuote(item, VENDOR_ID, context);
            const isOwned = ownedIds.includes(item.id) && item.sourceSystem !== "food";
            const isLocked = (item.requiredLevel ?? 0) > level;
            const canAfford = money >= quote.finalPrice;
            const hasEnergy = energy >= quote.energyCost;
            const isPending = pendingIds.includes(item.id);

            return (
              <CommerceItemCard
                key={item.id}
                item={item}
                quote={quote}
                isOwned={isOwned}
                isLocked={isLocked}
                lockReason={isLocked ? `نیاز به سطح ${toPersian(item.requiredLevel ?? 1)}` : undefined}
                canAfford={canAfford}
                hasEnergy={hasEnergy}
                isPending={isPending}
                onBuy={() => handleBuy(item.id)}
                accentColor={ACCENT}
              />
            );
          })}
        </div>

        {/* Toast */}
        {toast && (
          <div style={{
            position: "absolute", bottom: 80, left: "50%", transform: "translateX(-50%)",
            background: "rgba(14,26,14,0.97)",
            border: "1px solid rgba(163,230,53,0.25)",
            borderRadius: radius.xl,
            padding: "10px 20px",
            fontSize: font.sm, fontWeight: 700, color: ACCENT,
            whiteSpace: "nowrap", zIndex: 10,
          }}>
            {toast}
          </div>
        )}
      </div>
    </div>
  );
}
