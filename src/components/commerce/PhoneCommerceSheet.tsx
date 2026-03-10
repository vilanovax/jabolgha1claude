"use client";
import { useState, useEffect } from "react";
import { getPurchasablesForVendor } from "@/data/purchasables";
import { getPurchaseQuote } from "@/game/purchase/purchaseEngine";
import { useGameStore } from "@/stores/gameStore";
import { formatMoney, toPersian } from "@/data/mock";
import type { PurchasableItem } from "@/data/purchasables";
import type { PurchaseQuote } from "@/game/purchase/purchaseEngine";
import CommerceItemCard from "./CommerceItemCard";

type PhoneTab = "food" | "store";

// ─── Tab definitions ──────────────────────────────────────────────────────────
const TABS = [
  { key: "food"  as PhoneTab, emoji: "🍔", label: "سفارش غذا", color: "#ef4444", bg: "rgba(239,68,68,0.10)"  },
  { key: "store" as PhoneTab, emoji: "📦", label: "فروشگاه",    color: "#60a5fa", bg: "rgba(96,165,250,0.10)" },
];

// ─── Food Item Card (optimized for immediate stat effects) ────────────────────
function FoodItemCard({
  item, quote, canAfford, onBuy,
}: {
  item: PurchasableItem;
  quote: PurchaseQuote;
  canAfford: boolean;
  onBuy: () => void;
}) {
  const e = item.effects;
  const statPills: { label: string; color: string; bg: string }[] = [];
  if (e.energy    && e.energy    > 0) statPills.push({ label: `⚡ +${toPersian(e.energy)}`,    color: "#facc15", bg: "rgba(250,204,21,0.12)"  });
  if (e.happiness && e.happiness > 0) statPills.push({ label: `😊 +${toPersian(e.happiness)}`, color: "#c084fc", bg: "rgba(192,132,252,0.12)"  });
  if (e.health    && e.health    > 0) statPills.push({ label: `❤️ +${toPersian(e.health)}`,    color: "#f43f5e", bg: "rgba(244,63,94,0.12)"    });

  return (
    <div style={{
      borderRadius: 18,
      padding: "14px 16px",
      background: "rgba(239,68,68,0.04)",
      border: "1px solid rgba(239,68,68,0.12)",
      borderRight: "3px solid #ef4444",
      display: "flex", alignItems: "center", gap: 12,
    }}>
      {/* Emoji */}
      <span style={{ fontSize: 34, flexShrink: 0 }}>{item.emoji}</span>

      {/* Info block */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 15, fontWeight: 800, color: "white",
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
        }}>
          {item.nameFa}
        </div>

        {/* Stat pills — big, colorful */}
        <div style={{ display: "flex", gap: 6, marginTop: 6, flexWrap: "wrap" }}>
          {statPills.map((p, i) => (
            <span key={i} style={{
              fontSize: 12, fontWeight: 900,
              color: p.color, background: p.bg,
              borderRadius: 10, padding: "3px 8px",
            }}>
              {p.label}
            </span>
          ))}
          {statPills.length === 0 && (
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>غذای معمولی</span>
          )}
        </div>

        <div style={{ fontSize: 14, fontWeight: 900, color: "#ef4444", marginTop: 6 }}>
          {formatMoney(quote.finalPrice)}
        </div>
      </div>

      {/* Buy button */}
      <button
        onClick={onBuy}
        disabled={!canAfford}
        style={{
          flexShrink: 0,
          padding: "10px 16px",
          borderRadius: 14,
          border: `1px solid ${canAfford ? "rgba(239,68,68,0.35)" : "rgba(255,255,255,0.08)"}`,
          background: canAfford ? "rgba(239,68,68,0.18)" : "rgba(255,255,255,0.04)",
          color: canAfford ? "#ef4444" : "rgba(255,255,255,0.25)",
          fontSize: 13, fontWeight: 900,
          cursor: canAfford ? "pointer" : "not-allowed",
          fontFamily: "inherit",
          whiteSpace: "nowrap",
          transition: "all 0.2s",
        }}
      >
        {canAfford ? "سفارش" : "پول کم"}
      </button>
    </div>
  );
}

// ─── PhoneCommerceSheet ───────────────────────────────────────────────────────
interface Props { isOpen: boolean; onClose: () => void; }

export default function PhoneCommerceSheet({ isOpen, onClose }: Props) {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<PhoneTab>("food");
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => { setMounted(true); }, []);

  const level    = useGameStore((s) => s.player.level);
  const money    = useGameStore((s) => s.bank.checking);
  const energy   = useGameStore((s) => s.player.energy);
  const dayInGame = useGameStore((s) => s.player.dayInGame);
  const inventory = useGameStore((s) => s.inventory ?? []);
  const roomItems = useGameStore((s) => s.roomItems ?? []);
  const pendingDeliveries = useGameStore((s) => s.pendingDeliveries ?? []);
  const purchaseItem = useGameStore((s) => s.purchaseItem);

  const foodItems  = getPurchasablesForVendor("food_delivery");
  const storeItems = getPurchasablesForVendor("online_store");
  const ownedIds   = [...inventory.map((id) => `market_${id}`), ...roomItems.map((id) => `room_${id}`)];
  const pendingIds = pendingDeliveries.map((d) => d.purchasableId);

  const activeTab_ = TABS.find((t) => t.key === activeTab)!;

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }

  function handleBuyFood(purchasableId: string) {
    const result = purchaseItem(purchasableId, "food_delivery");
    if (!result.success) showToast(result.reason ?? "سفارش انجام نشد");
    else showToast("🍔 غذا رسید! نوش جان");
  }

  function handleBuyStore(purchasableId: string) {
    const result = purchaseItem(purchasableId, "online_store");
    if (!result.success) showToast(result.reason ?? "خرید انجام نشد");
    else if (result.deliveryDay != null) showToast(`📦 سفارش ثبت شد — روز ${toPersian(result.deliveryDay)}`);
    else showToast("✓ خرید موفق!");
  }

  if (!isOpen) return null;

  const context = { playerLevel: level, playerMoney: money, playerEnergy: energy, ownedItemIds: ownedIds, currentDay: dayInGame };

  return (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(0,0,0,0.65)", display: "flex", alignItems: "flex-end" }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%", maxWidth: 430, margin: "0 auto",
          background: "linear-gradient(180deg, #0c0f1e 0%, #080a18 100%)",
          borderRadius: "24px 24px 0 0",
          border: `1px solid ${activeTab_.color}18`,
          borderBottom: "none",
          maxHeight: "88dvh",
          display: "flex", flexDirection: "column",
          direction: "rtl", position: "relative",
          transition: "border-color 0.3s",
        }}
      >
        {/* Handle */}
        <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 0" }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.12)" }} />
        </div>

        {/* Header */}
        <div style={{
          padding: "14px 20px 12px",
          display: "flex", alignItems: "center", gap: 12,
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}>
          <span style={{ fontSize: 28 }}>📱</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 18, fontWeight: 900, color: "white" }}>گوشی</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 1 }}>
              سفارش آنلاین · بدون هزینه انرژی
            </div>
          </div>
          <span style={{ fontSize: 13, fontWeight: 800, color: "#4ade80" }}>
            {formatMoney(money)}
          </span>
          <button
            onClick={onClose}
            style={{
              background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 12, color: "rgba(255,255,255,0.5)",
              fontSize: 14, padding: "4px 10px",
              cursor: "pointer", fontFamily: "inherit",
            }}
          >
            ✕
          </button>
        </div>

        {/* Tab bar */}
        <div style={{
          display: "flex", gap: 8,
          padding: "12px 20px",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
        }}>
          {TABS.map((tab) => {
            const active = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  flex: 1, padding: "10px 8px",
                  borderRadius: 14,
                  border: `1px solid ${active ? tab.color + "45" : "rgba(255,255,255,0.08)"}`,
                  background: active ? tab.bg : "transparent",
                  color: active ? tab.color : "rgba(255,255,255,0.35)",
                  fontSize: 13, fontWeight: 800,
                  cursor: "pointer", fontFamily: "inherit",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                  transition: "all 0.2s",
                }}
              >
                <span style={{ fontSize: 16 }}>{tab.emoji}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div style={{
          flex: 1, overflowY: "auto",
          padding: "12px 20px 24px",
          display: "flex", flexDirection: "column", gap: 10,
        }}>

          {/* ── Food tab ── */}
          {activeTab === "food" && (
            <>
              {/* Info banner */}
              <div style={{
                padding: "9px 14px", borderRadius: 14,
                background: "rgba(239,68,68,0.07)",
                border: "1px solid rgba(239,68,68,0.18)",
                fontSize: 12, fontWeight: 700, color: "#ef4444",
                display: "flex", alignItems: "center", gap: 6,
              }}>
                <span>🛵</span>
                <span>تحویل فوری — همان روز</span>
                <span style={{ marginRight: "auto", color: "rgba(255,255,255,0.25)", fontWeight: 600 }}>
                  بدون انرژی
                </span>
              </div>

              {!mounted ? (
                <div style={{ textAlign: "center", color: "rgba(255,255,255,0.25)", padding: "40px 0", fontSize: 13 }}>
                  در حال بارگذاری...
                </div>
              ) : foodItems.length === 0 ? (
                <div style={{ textAlign: "center", color: "rgba(255,255,255,0.25)", padding: "40px 0", fontSize: 13 }}>
                  منو خالیه
                </div>
              ) : foodItems.map((item) => {
                const quote = getPurchaseQuote(item, "food_delivery", context);
                return (
                  <FoodItemCard
                    key={item.id}
                    item={item}
                    quote={quote}
                    canAfford={money >= quote.finalPrice}
                    onBuy={() => handleBuyFood(item.id)}
                  />
                );
              })}
            </>
          )}

          {/* ── Online Store tab ── */}
          {activeTab === "store" && (
            <>
              {/* Info banner */}
              <div style={{
                padding: "9px 14px", borderRadius: 14,
                background: "rgba(96,165,250,0.07)",
                border: "1px solid rgba(96,165,250,0.18)",
                fontSize: 12, fontWeight: 700, color: "#60a5fa",
                display: "flex", alignItems: "center", gap: 6,
              }}>
                <span>📦</span>
                <span>تحویل ۲ روزه</span>
                <span style={{ marginRight: "auto", color: "rgba(255,255,255,0.25)", fontWeight: 600 }}>
                  بدون انرژی
                </span>
              </div>

              {!mounted ? (
                <div style={{ textAlign: "center", color: "rgba(255,255,255,0.25)", padding: "40px 0", fontSize: 13 }}>
                  در حال بارگذاری...
                </div>
              ) : storeItems.length === 0 ? (
                <div style={{ textAlign: "center", color: "rgba(255,255,255,0.25)", padding: "40px 0", fontSize: 13 }}>
                  محصولی نیست
                </div>
              ) : storeItems.map((item) => {
                const quote     = getPurchaseQuote(item, "online_store", context);
                const isOwned   = ownedIds.includes(item.id) && item.sourceSystem !== "food";
                const isLocked  = (item.requiredLevel ?? 0) > level;
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
                    accentColor="#60a5fa"
                  />
                );
              })}
            </>
          )}
        </div>

        {/* Toast */}
        {toast && (
          <div style={{
            position: "absolute", bottom: 80, left: "50%", transform: "translateX(-50%)",
            background: "rgba(8,10,24,0.97)",
            border: `1px solid ${activeTab_.color}30`,
            borderRadius: 16, padding: "10px 20px",
            fontSize: 13, fontWeight: 800, color: activeTab_.color,
            whiteSpace: "nowrap", zIndex: 10,
          }}>
            {toast}
          </div>
        )}
      </div>
    </div>
  );
}
