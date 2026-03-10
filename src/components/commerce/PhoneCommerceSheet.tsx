"use client";
import { useState, useEffect } from "react";
import { colors, font, sp, radius } from "@/theme/tokens";
import { getPurchasablesForVendor } from "@/data/purchasables";
import { getPurchaseQuote } from "@/game/purchase/purchaseEngine";
import { useGameStore } from "@/stores/gameStore";
import { formatMoney, toPersian } from "@/data/mock";
import CommerceItemCard from "./CommerceItemCard";

type PhoneTab = "food" | "store" | "ride";

interface PhoneCommerceSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

const TABS: { key: PhoneTab; emoji: string; label: string; color: string }[] = [
  { key: "food",  emoji: "🍔", label: "سفارش غذا",  color: "#f97316" },
  { key: "store", emoji: "📦", label: "فروشگاه",     color: "#e11d48" },
  { key: "ride",  emoji: "🚕", label: "تاکسی",       color: "#06b6d4" },
];

export default function PhoneCommerceSheet({ isOpen, onClose }: PhoneCommerceSheetProps) {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<PhoneTab>("food");
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

  const foodItems = getPurchasablesForVendor("food_delivery");
  const storeItems = getPurchasablesForVendor("online_store");
  const ownedIds = [...inventory.map((id) => `market_${id}`), ...roomItems.map((id) => `room_${id}`)];
  const pendingIds = pendingDeliveries.map((d) => d.purchasableId);

  const activeColor = TABS.find((t) => t.key === activeTab)?.color ?? colors.info;

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }

  function handleBuyFood(purchasableId: string) {
    const result = purchaseItem(purchasableId, "food_delivery");
    if (!result.success) showToast(result.reason ?? "سفارش انجام نشد");
    else showToast("🍔 غذا سفارش داده شد!");
  }

  function handleBuyStore(purchasableId: string) {
    const result = purchaseItem(purchasableId, "online_store");
    if (!result.success) showToast(result.reason ?? "خرید انجام نشد");
    else if (result.deliveryDay) showToast(`📦 تحویل روز ${toPersian(result.deliveryDay)}`);
    else showToast("✓ خرید موفق!");
  }

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 100,
        background: "rgba(0,0,0,0.65)",
        display: "flex", alignItems: "flex-end",
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%", maxWidth: 430, margin: "0 auto",
          background: "linear-gradient(180deg, #101020 0%, #080812 100%)",
          borderRadius: "24px 24px 0 0",
          border: "1px solid rgba(255,255,255,0.08)",
          borderBottom: "none",
          maxHeight: "88dvh",
          display: "flex",
          flexDirection: "column",
          direction: "rtl",
          position: "relative",
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
          <span style={{ fontSize: 28 }}>📱</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: font.xl, fontWeight: 800, color: "white" }}>گوشی</div>
            <div style={{ fontSize: font.xs, color: colors.textMuted }}>
              سفارش آنلاین — بدون هزینه انرژی
            </div>
          </div>
          <div style={{ fontSize: font.sm, fontWeight: 700, color: colors.success }}>
            {formatMoney(money)}
          </div>
          <button
            onClick={onClose}
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: radius.lg,
              color: colors.textSecondary,
              fontSize: font.base, padding: "4px 10px",
              cursor: "pointer", fontFamily: "inherit",
            }}
          >
            ✕
          </button>
        </div>

        {/* Tab bar */}
        <div style={{
          display: "flex", gap: sp.sm,
          padding: `${sp.md}px ${sp.xl}px`,
          borderBottom: "1px solid rgba(255,255,255,0.05)",
        }}>
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                flex: 1,
                padding: "8px 4px",
                borderRadius: radius.lg,
                border: `1px solid ${activeTab === tab.key ? tab.color + "50" : "rgba(255,255,255,0.08)"}`,
                background: activeTab === tab.key ? `${tab.color}15` : "transparent",
                color: activeTab === tab.key ? tab.color : colors.textSecondary,
                fontSize: font.xs, fontWeight: 800,
                cursor: "pointer", fontFamily: "inherit",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 4,
                transition: "all 0.2s",
              }}
            >
              <span>{tab.emoji}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{
          flex: 1, overflowY: "auto",
          padding: `${sp.md}px ${sp.xl}px ${sp.xl}px`,
          display: "flex", flexDirection: "column", gap: sp.md,
        }}>
          {/* Food tab */}
          {activeTab === "food" && (
            <>
              <div style={{
                padding: "8px 12px",
                borderRadius: radius.lg,
                background: "rgba(249,115,22,0.08)",
                border: "1px solid rgba(249,115,22,0.2)",
                fontSize: font.xs, fontWeight: 700, color: "#f97316",
                marginBottom: sp.xs,
              }}>
                🛵 تحویل در همان روز · ۲۰٪ گران‌تر از بازار
              </div>
              {!mounted ? (
                <div style={{ textAlign: "center", color: colors.textMuted, padding: sp.xl }}>در حال بارگذاری...</div>
              ) : foodItems.length === 0 ? (
                <div style={{ textAlign: "center", color: colors.textMuted, padding: sp.xl }}>منوی غذا خالی است</div>
              ) : foodItems.map((item) => {
                const context = { playerLevel: level, playerMoney: money, playerEnergy: energy, ownedItemIds: ownedIds, currentDay: dayInGame };
                const quote = getPurchaseQuote(item, "food_delivery", context);
                return (
                  <CommerceItemCard
                    key={item.id}
                    item={item}
                    quote={quote}
                    isOwned={false}
                    isLocked={false}
                    canAfford={money >= quote.finalPrice}
                    hasEnergy={true}
                    isPending={false}
                    onBuy={() => handleBuyFood(item.id)}
                    accentColor="#f97316"
                  />
                );
              })}
            </>
          )}

          {/* Store tab */}
          {activeTab === "store" && (
            <>
              <div style={{
                padding: "8px 12px",
                borderRadius: radius.lg,
                background: "rgba(225,29,72,0.08)",
                border: "1px solid rgba(225,29,72,0.2)",
                fontSize: font.xs, fontWeight: 700, color: "#e11d48",
                marginBottom: sp.xs,
              }}>
                📦 تحویل ۲ روزه · بدون انرژی
              </div>
              {!mounted ? (
                <div style={{ textAlign: "center", color: colors.textMuted, padding: sp.xl }}>در حال بارگذاری...</div>
              ) : storeItems.length === 0 ? (
                <div style={{ textAlign: "center", color: colors.textMuted, padding: sp.xl }}>محصولی نیست</div>
              ) : storeItems.map((item) => {
                const context = { playerLevel: level, playerMoney: money, playerEnergy: energy, ownedItemIds: ownedIds, currentDay: dayInGame };
                const quote = getPurchaseQuote(item, "online_store", context);
                const isOwned = ownedIds.includes(item.id) && item.sourceSystem !== "food";
                const isLocked = (item.requiredLevel ?? 0) > level;
                const isPending = pendingIds.includes(item.id);
                return (
                  <CommerceItemCard
                    key={item.id}
                    item={item}
                    quote={quote}
                    isOwned={isOwned}
                    isLocked={isLocked}
                    lockReason={isLocked ? `نیاز به سطح ${toPersian(item.requiredLevel ?? 1)}` : undefined}
                    canAfford={money >= quote.finalPrice}
                    hasEnergy={true}
                    isPending={isPending}
                    onBuy={() => handleBuyStore(item.id)}
                    accentColor="#e11d48"
                  />
                );
              })}
            </>
          )}

          {/* Ride tab — placeholder */}
          {activeTab === "ride" && (
            <div style={{
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              gap: sp.lg, padding: "60px 0",
              textAlign: "center",
            }}>
              <span style={{ fontSize: 52 }}>🚕</span>
              <div style={{ fontSize: font.lg, fontWeight: 800, color: "#06b6d4" }}>سرویس تاکسی</div>
              <div style={{
                fontSize: font.sm, color: colors.textMuted, maxWidth: 240, lineHeight: 1.6,
              }}>
                به‌زودی — سرویس حمل‌ونقل برای رفت‌وآمد با صرفه‌جویی انرژی
              </div>
              <div style={{
                padding: "8px 18px",
                borderRadius: radius.xl,
                background: "rgba(6,182,212,0.08)",
                border: "1px solid rgba(6,182,212,0.2)",
                fontSize: font.xs, fontWeight: 700, color: "#06b6d4",
              }}>
                🔜 در نسخه بعدی
              </div>
            </div>
          )}
        </div>

        {/* Toast */}
        {toast && (
          <div style={{
            position: "absolute", bottom: 80, left: "50%", transform: "translateX(-50%)",
            background: "rgba(10,10,20,0.97)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: radius.xl,
            padding: "10px 20px",
            fontSize: font.sm, fontWeight: 700, color: "white",
            whiteSpace: "nowrap", zIndex: 10,
          }}>
            {toast}
          </div>
        )}
      </div>
    </div>
  );
}
