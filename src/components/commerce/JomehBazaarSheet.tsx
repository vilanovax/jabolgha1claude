"use client";
import { useState, useEffect } from "react";
import { getPurchasablesForVendor } from "@/data/purchasables";
import { getPurchaseQuote } from "@/game/purchase/purchaseEngine";
import { useGameStore } from "@/stores/gameStore";
import { formatMoney, toPersian } from "@/data/mock";
import type { PurchasableItem } from "@/data/purchasables";
import type { PurchaseQuote } from "@/game/purchase/purchaseEngine";

const VENDOR_ID = "jomeh_bazaar" as const;
const ORANGE  = "#fb923c";
const AMBER   = "#f59e0b";
const ENERGY_COST = 15;

const CATEGORIES = [
  { key: "all",         label: "همه",        emoji: "🏪" },
  { key: "room",        label: "اتاق",        emoji: "🛋️" },
  { key: "electronics", label: "الکترونیک",   emoji: "📱" },
  { key: "appliance",   label: "لوازم",       emoji: "🧊" },
  { key: "food",        label: "غذا",         emoji: "🛒" },
];

// ─── Bazaar Item Card ─────────────────────────────────────────────────────────
function BazaarItemCard({
  item, quote, isOwned, isLocked, canAfford, hasEnergy, isPending, onBuy, featured,
}: {
  item: PurchasableItem;
  quote: PurchaseQuote;
  isOwned: boolean;
  isLocked: boolean;
  canAfford: boolean;
  hasEnergy: boolean;
  isPending: boolean;
  onBuy: () => void;
  featured?: boolean;
}) {
  const disabled = isOwned || isLocked || !canAfford || !hasEnergy || isPending;

  let btnLabel = "بخر!";
  let btnBg    = `${ORANGE}22`;
  let btnColor = ORANGE;

  if (isOwned)      { btnLabel = "✓ خریداری شده"; btnBg = "rgba(74,222,128,0.12)"; btnColor = "#4ade80"; }
  else if (isPending){ btnLabel = "📦 در راه است";  btnBg = `${AMBER}12`;           btnColor = AMBER; }
  else if (isLocked) { btnLabel = "🔒 قفل";         btnBg = "rgba(255,255,255,0.06)"; btnColor = "rgba(255,255,255,0.3)"; }
  else if (!canAfford){ btnLabel = "پول کم";         btnBg = "rgba(239,68,68,0.12)"; btnColor = "#f87171"; }
  else if (!hasEnergy){ btnLabel = "انرژی کم";       btnBg = `${AMBER}12`;           btnColor = AMBER; }

  // Effect summary line
  const effects: string[] = [];
  if (item.effects.workIncomeMultiplier && item.effects.workIncomeMultiplier > 1)
    effects.push(`+${Math.round((item.effects.workIncomeMultiplier - 1) * 100)}٪ درآمد`);
  if (item.effects.dailyEnergyBonus && item.effects.dailyEnergyBonus > 0)
    effects.push(`+${toPersian(item.effects.dailyEnergyBonus)} انرژی/روز`);
  if (item.effects.dailyHappinessBonus && item.effects.dailyHappinessBonus > 0)
    effects.push(`+${toPersian(item.effects.dailyHappinessBonus)} شادی/روز`);
  if (item.effects.energy && item.effects.energy > 0)
    effects.push(`⚡ +${toPersian(item.effects.energy)}`);
  if (item.effects.happiness && item.effects.happiness > 0)
    effects.push(`😊 +${toPersian(item.effects.happiness)}`);
  if (effects.length === 0) effects.push("مفید");

  return (
    <div style={{
      borderRadius: 20,
      padding: featured ? "16px 16px 14px" : "13px 14px 12px",
      background: featured
        ? "linear-gradient(135deg, rgba(251,146,60,0.10), rgba(245,158,11,0.06))"
        : isOwned
          ? "rgba(74,222,128,0.05)"
          : "rgba(255,255,255,0.03)",
      border: featured
        ? `1.5px solid ${ORANGE}35`
        : isOwned
          ? "1px solid rgba(74,222,128,0.15)"
          : "1px solid rgba(255,255,255,0.07)",
      borderRight: `3px solid ${isOwned ? "#4ade80" : featured ? ORANGE : AMBER}`,
      opacity: isLocked ? 0.55 : 1,
      position: "relative",
    }}>
      {featured && (
        <div style={{
          position: "absolute", top: 10, left: 10,
          fontSize: 9, fontWeight: 900,
          color: AMBER, background: `${AMBER}18`,
          border: `1px solid ${AMBER}30`,
          borderRadius: 8, padding: "2px 7px",
        }}>
          🔥 پیشنهاد امروز
        </div>
      )}

      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ fontSize: featured ? 32 : 26, flexShrink: 0 }}>{item.emoji}</span>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: featured ? 15 : 14, fontWeight: 800, color: "white",
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          }}>
            {item.nameFa}
          </div>
          <div style={{
            fontSize: 11, color: "rgba(255,255,255,0.38)",
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
            marginTop: 2,
          }}>
            {effects.join(" · ")}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 6 }}>
            <span style={{ fontSize: featured ? 16 : 15, fontWeight: 900, color: ORANGE }}>
              {formatMoney(quote.finalPrice)}
            </span>
            <span style={{
              fontSize: 9, fontWeight: 800, color: "#4ade80",
              background: "rgba(74,222,128,0.1)",
              border: "1px solid rgba(74,222,128,0.2)",
              borderRadius: 6, padding: "1px 5px",
            }}>
              ۲۰٪ ارزون‌تر
            </span>
            <span style={{ fontSize: 10, color: AMBER }}>
              · ⚡ {toPersian(ENERGY_COST)}
            </span>
          </div>
        </div>

        <button
          onClick={onBuy}
          disabled={disabled}
          style={{
            flexShrink: 0,
            padding: featured ? "10px 18px" : "8px 14px",
            borderRadius: 14,
            border: `1px solid ${btnColor}40`,
            background: disabled ? "rgba(255,255,255,0.04)" : btnBg,
            color: disabled ? "rgba(255,255,255,0.25)" : btnColor,
            fontSize: 13, fontWeight: 900,
            cursor: disabled ? "not-allowed" : "pointer",
            fontFamily: "inherit",
            whiteSpace: "nowrap",
            transition: "all 0.2s",
          }}
        >
          {btnLabel}
        </button>
      </div>
    </div>
  );
}

// ─── JomehBazaarSheet ─────────────────────────────────────────────────────────
interface Props { isOpen: boolean; onClose: () => void; }

export default function JomehBazaarSheet({ isOpen, onClose }: Props) {
  const [mounted, setMounted] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
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

  const allItems  = getPurchasablesForVendor(VENDOR_ID);
  const ownedIds  = [...inventory.map((id) => `market_${id}`), ...roomItems.map((id) => `room_${id}`)];
  const pendingIds = pendingDeliveries.map((d) => d.purchasableId);
  const canVisit  = energy >= ENERGY_COST;

  const filtered = activeCategory === "all"
    ? allItems
    : allItems.filter((i) => i.category === activeCategory);

  // Pick a featured item: first non-owned, non-pending, non-food
  const featured = allItems.find(
    (i) => !ownedIds.includes(i.id) && !pendingIds.includes(i.id) && i.category !== "food",
  ) ?? null;

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }

  function handleBuy(purchasableId: string) {
    const result = purchaseItem(purchasableId, VENDOR_ID);
    if (!result.success) showToast(result.reason ?? "خرید انجام نشد");
    else showToast("✓ خرید موفق از جمعه‌بازار!");
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
          background: "linear-gradient(180deg, #1a0e05 0%, #0d0804 100%)",
          borderRadius: "24px 24px 0 0",
          border: "1px solid rgba(251,146,60,0.12)",
          borderBottom: "none",
          maxHeight: "88dvh",
          display: "flex", flexDirection: "column",
          direction: "rtl", position: "relative",
        }}
      >
        {/* Handle */}
        <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 0" }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: `${ORANGE}30` }} />
        </div>

        {/* Header */}
        <div style={{
          padding: "16px 20px 14px",
          display: "flex", alignItems: "center", gap: 12,
          borderBottom: "1px solid rgba(251,146,60,0.08)",
        }}>
          <span style={{ fontSize: 30 }}>🧺</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 18, fontWeight: 900, color: ORANGE }}>جمعه‌بازار</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 1 }}>
              بازار امروز داغه! — ارزون‌تر، فوری، با انرژی
            </div>
          </div>
          <div style={{ textAlign: "left" }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: "#4ade80" }}>{formatMoney(money)}</div>
            <div style={{
              fontSize: 10, fontWeight: 700,
              color: canVisit ? AMBER : "#f87171",
              marginTop: 1,
            }}>
              ⚡ {toPersian(energy)}/۱۰۰
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: `${ORANGE}10`, border: `1px solid ${ORANGE}25`,
              borderRadius: 12, color: ORANGE,
              fontSize: 14, padding: "4px 10px",
              cursor: "pointer", fontFamily: "inherit",
            }}
          >
            ✕
          </button>
        </div>

        {/* Info strip */}
        <div style={{
          display: "flex", gap: 6,
          padding: "10px 20px 0",
        }}>
          <div style={{
            flex: 1, padding: "7px 12px", borderRadius: 12,
            background: "rgba(74,222,128,0.08)",
            border: "1px solid rgba(74,222,128,0.18)",
            fontSize: 11, fontWeight: 700, color: "#4ade80",
            textAlign: "center",
          }}>
            💰 ۲۰٪ ارزون‌تر
          </div>
          <div style={{
            flex: 1, padding: "7px 12px", borderRadius: 12,
            background: "rgba(34,211,238,0.06)",
            border: "1px solid rgba(34,211,238,0.15)",
            fontSize: 11, fontWeight: 700, color: "#22d3ee",
            textAlign: "center",
          }}>
            ✈️ تحویل فوری
          </div>
          <div style={{
            flex: 1, padding: "7px 12px", borderRadius: 12,
            background: canVisit ? `${AMBER}10` : "rgba(239,68,68,0.08)",
            border: `1px solid ${canVisit ? `${AMBER}25` : "rgba(239,68,68,0.2)"}`,
            fontSize: 11, fontWeight: 700,
            color: canVisit ? AMBER : "#f87171",
            textAlign: "center",
          }}>
            ⚡ {toPersian(ENERGY_COST)} انرژی
          </div>
        </div>

        {/* Category chips */}
        <div style={{ display: "flex", gap: 6, padding: "10px 20px", overflowX: "auto" }}>
          {CATEGORIES.map((cat) => {
            const active = activeCategory === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                style={{
                  flexShrink: 0, padding: "5px 12px", borderRadius: 20,
                  border: `1px solid ${active ? ORANGE + "55" : "rgba(255,255,255,0.1)"}`,
                  background: active ? `${ORANGE}18` : "transparent",
                  color: active ? ORANGE : "rgba(255,255,255,0.4)",
                  fontSize: 12, fontWeight: 700,
                  cursor: "pointer", fontFamily: "inherit",
                  transition: "all 0.15s",
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
          padding: "0 20px 24px",
          display: "flex", flexDirection: "column", gap: 10,
        }}>
          {!mounted ? (
            <div style={{ textAlign: "center", padding: 40, color: "rgba(255,255,255,0.3)", fontSize: 13 }}>
              در حال بارگذاری...
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: 40, color: "rgba(255,255,255,0.3)", fontSize: 13 }}>
              محصولی در این دسته‌بندی نیست
            </div>
          ) : filtered.map((item, idx) => {
            const quote      = getPurchaseQuote(item, VENDOR_ID, context);
            const isOwned    = ownedIds.includes(item.id) && item.sourceSystem !== "food";
            const isLocked   = (item.requiredLevel ?? 0) > level;
            const canAfford  = money >= quote.finalPrice;
            const hasEnergy  = energy >= quote.energyCost;
            const isPending  = pendingIds.includes(item.id);
            const isFeatured = featured?.id === item.id && activeCategory === "all" && idx === 0;

            return (
              <BazaarItemCard
                key={item.id}
                item={item}
                quote={quote}
                isOwned={isOwned}
                isLocked={isLocked}
                canAfford={canAfford}
                hasEnergy={hasEnergy}
                isPending={isPending}
                onBuy={() => handleBuy(item.id)}
                featured={isFeatured}
              />
            );
          })}
        </div>

        {/* Toast */}
        {toast && (
          <div style={{
            position: "absolute", bottom: 80, left: "50%", transform: "translateX(-50%)",
            background: "rgba(26,14,5,0.97)",
            border: `1px solid ${ORANGE}30`,
            borderRadius: 16, padding: "10px 20px",
            fontSize: 13, fontWeight: 800, color: ORANGE,
            whiteSpace: "nowrap", zIndex: 10,
          }}>
            {toast}
          </div>
        )}
      </div>
    </div>
  );
}
