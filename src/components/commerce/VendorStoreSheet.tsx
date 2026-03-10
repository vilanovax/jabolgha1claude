"use client";
import { useState, useEffect } from "react";
import { colors, font, sp, radius } from "@/theme/tokens";
import type { VendorId } from "@/data/vendors";
import { VENDORS } from "@/data/vendors";
import { getPurchasablesForVendor } from "@/data/purchasables";
import type { PurchasableCategory } from "@/data/purchasables";
import { getPurchaseQuote } from "@/game/purchase/purchaseEngine";
import { useGameStore } from "@/stores/gameStore";
import { toPersian } from "@/data/mock";
import CommerceItemCard from "./CommerceItemCard";

interface VendorStoreSheetProps {
  vendorId: VendorId;
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORY_LABELS: Record<string, { label: string; emoji: string }> = {
  all:         { label: "همه", emoji: "🏪" },
  room:        { label: "اتاق", emoji: "🛋️" },
  electronics: { label: "الکترونیک", emoji: "📱" },
  appliance:   { label: "لوازم", emoji: "🧊" },
  furniture:   { label: "مبلمان", emoji: "🛏" },
  food:        { label: "غذا", emoji: "🍽️" },
  vehicle:     { label: "خودرو", emoji: "🚗" },
};

export default function VendorStoreSheet({ vendorId, isOpen, onClose }: VendorStoreSheetProps) {
  const [mounted, setMounted] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("all");
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

  const vendor = VENDORS[vendorId];
  const allItems = getPurchasablesForVendor(vendorId);

  // Extract available categories
  const usedCategories = Array.from(new Set(allItems.map((i) => i.category)));
  const categories = ["all", ...usedCategories];

  const filtered = activeCategory === "all"
    ? allItems
    : allItems.filter((i) => i.category === activeCategory);

  const ownedIds = [...inventory.map((id) => `market_${id}`), ...roomItems.map((id) => `room_${id}`)];
  const pendingIds = pendingDeliveries.map((d) => d.purchasableId);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }

  function handleBuy(purchasableId: string) {
    const result = purchaseItem(purchasableId, vendorId);
    if (!result.success) {
      showToast(result.reason ?? "خرید انجام نشد");
    } else if (result.deliveryDay != null) {
      showToast(`📦 سفارش ثبت شد — تحویل روز ${toPersian(result.deliveryDay)}`);
    } else {
      showToast("✓ خرید موفق!");
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
          background: "linear-gradient(180deg, #0f1229 0%, #0a0e1f 100%)",
          borderRadius: "24px 24px 0 0",
          border: "1px solid rgba(255,255,255,0.08)",
          borderBottom: "none",
          maxHeight: "85dvh",
          display: "flex",
          flexDirection: "column",
          direction: "rtl",
        }}
      >
        {/* Handle */}
        <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 0" }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.15)" }} />
        </div>

        {/* Header */}
        <div style={{
          padding: `${sp.lg}px ${sp.xl}px ${sp.md}px`,
          display: "flex", alignItems: "center", gap: sp.md,
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}>
          <span style={{ fontSize: 28 }}>{vendor.emoji}</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: font.xl, fontWeight: 800, color: "white" }}>{vendor.nameFa}</div>
            <div style={{ fontSize: font.xs, color: colors.textMuted }}>{vendor.descriptionFa}</div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: radius.lg,
              color: colors.textSecondary,
              fontSize: font.base,
              padding: "4px 10px",
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            ✕
          </button>
        </div>

        {/* Delivery info banner */}
        {vendor.deliveryDays != null && vendor.deliveryDays > 0 && (
          <div style={{
            margin: `${sp.md}px ${sp.xl}px 0`,
            padding: "8px 12px",
            borderRadius: radius.lg,
            background: "rgba(245,158,11,0.08)",
            border: "1px solid rgba(245,158,11,0.2)",
            fontSize: font.xs,
            fontWeight: 700,
            color: "#f59e0b",
          }}>
            📦 تحویل {toPersian(vendor.deliveryDays)} روزه — بدون هزینه انرژی
          </div>
        )}

        {/* Energy cost banner */}
        {vendor.channelType === "physical" && vendor.energyCostToVisit && (
          <div style={{
            margin: `${sp.md}px ${sp.xl}px 0`,
            padding: "8px 12px",
            borderRadius: radius.lg,
            background: "rgba(250,204,21,0.08)",
            border: "1px solid rgba(250,204,21,0.2)",
            fontSize: font.xs,
            fontWeight: 700,
            color: "#facc15",
          }}>
            ⚡ {toPersian(vendor.energyCostToVisit)} انرژی برای رفت‌وآمد — تحویل فوری
          </div>
        )}

        {/* Category filters */}
        <div style={{
          display: "flex", gap: sp.sm,
          padding: `${sp.md}px ${sp.xl}px`,
          overflowX: "auto",
        }}>
          {categories.map((cat) => {
            const info = CATEGORY_LABELS[cat] ?? { label: cat, emoji: "📦" };
            const active = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  flexShrink: 0,
                  padding: "4px 12px",
                  borderRadius: radius.lg,
                  border: `1px solid ${active ? vendor.accentColor + "60" : "rgba(255,255,255,0.1)"}`,
                  background: active ? `${vendor.accentColor}18` : "transparent",
                  color: active ? vendor.accentColor : colors.textSecondary,
                  fontSize: font.xs,
                  fontWeight: 700,
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                {info.emoji} {info.label}
              </button>
            );
          })}
        </div>

        {/* Item list */}
        <div style={{
          flex: 1, overflowY: "auto",
          padding: `0 ${sp.xl}px ${sp.xl}px`,
          display: "flex", flexDirection: "column", gap: sp.md,
        }}>
          {!mounted ? (
            <div style={{ textAlign: "center", padding: sp.xl, color: colors.textMuted }}>
              در حال بارگذاری...
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: sp.xl, color: colors.textMuted }}>
              محصولی در این دسته‌بندی نیست
            </div>
          ) : filtered.map((item) => {
            const context = {
              playerLevel: level,
              playerMoney: money,
              playerEnergy: energy,
              ownedItemIds: ownedIds,
              currentDay: dayInGame,
            };
            const quote = getPurchaseQuote(item, vendorId, context);
            const isOwned = ownedIds.includes(item.id) && item.sourceSystem !== "food";
            const isLocked = (item.requiredLevel ?? 0) > level;
            const canAfford = money >= quote.finalPrice;
            const hasEnergy = energy >= (quote.energyCost ?? 0);
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
                accentColor={vendor.accentColor}
              />
            );
          })}
        </div>

        {/* Toast */}
        {toast && (
          <div style={{
            position: "absolute", bottom: 80, left: "50%", transform: "translateX(-50%)",
            background: "rgba(15,18,41,0.95)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: radius.xl,
            padding: "10px 20px",
            fontSize: font.sm,
            fontWeight: 700,
            color: "white",
            whiteSpace: "nowrap",
            zIndex: 10,
          }}>
            {toast}
          </div>
        )}
      </div>
    </div>
  );
}
