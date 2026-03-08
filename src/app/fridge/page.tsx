"use client";
import { useState, useEffect, useRef } from "react";
import { useGameStore } from "@/stores/gameStore";
import { FOOD_CATALOG, FRIDGE_TIERS, FOOD_CATEGORIES } from "@/data/fridgeData";
import { formatMoney, toPersian } from "@/data/mock";
import { PageShell, TabBar, Toast, ChipFilter, ItemCard, BalanceBar, StatBar } from "@/components/ui";
import {
  colors, font, sp, radius,
  cardStyle, tierChipStyle, statChipStyle,
  actionBtnStyle, emptyStateStyle, bannerStyle,
} from "@/theme/tokens";

type FridgeTab = "fridge" | "shop" | "upgrade";
const TABS: { key: FridgeTab; label: string }[] = [
  { key: "fridge", label: "❄️ یخچال" },
  { key: "shop", label: "🛒 سوپرمارکت" },
  { key: "upgrade", label: "⬆️ ارتقا" },
];

export default function FridgePage() {
  const [tab, setTab] = useState<FridgeTab>("fridge");
  const [catFilter, setCatFilter] = useState("all");
  const [toast, setToast] = useState<string | null>(null);
  const [expiredBanner, setExpiredBanner] = useState<string[] | null>(null);
  const hasCleared = useRef(false);

  const player = useGameStore((s) => s.player);
  const fridge = useGameStore((s) => s.fridge);
  const buyFood = useGameStore((s) => s.buyFood);
  const eatFood = useGameStore((s) => s.eatFood);
  const trashFood = useGameStore((s) => s.trashFood);
  const upgradeFridge = useGameStore((s) => s.upgradeFridge);
  const clearExpiredItems = useGameStore((s) => s.clearExpiredItems);
  const checking = useGameStore((s) => s.bank.checking);

  useEffect(() => {
    if (hasCleared.current) return;
    hasCleared.current = true;
    const { expiredNames } = clearExpiredItems();
    if (expiredNames.length > 0) setExpiredBanner(expiredNames);
  }, [clearExpiredItems]);

  const currentTier = FRIDGE_TIERS.find((t) => t.id === fridge.tierId)!;

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  }

  function handleBuy(foodId: string) {
    const r = buyFood(foodId);
    showToast(r.success ? "اضافه شد به یخچال! ❄️" : r.reason!);
  }

  function handleEat(index: number) {
    const r = eatFood(index);
    if (!r.success) showToast(r.reason!);
    else {
      const e = r.effects!;
      showToast(`⚡+${e.energy} 😊+${e.happiness} ❤️+${e.health}`);
    }
  }

  function handleUpgrade(tierId: string) {
    const r = upgradeFridge(tierId);
    showToast(r.success ? "یخچال ارتقا یافت! 🎉" : r.reason!);
  }

  const fridgeItems = fridge.items.map((slot, index) => {
    const food = FOOD_CATALOG.find((f) => f.id === slot.foodId)!;
    return { slot, food, index, daysLeft: slot.expiresOnDay - player.dayInGame };
  });

  const shopItems = catFilter === "all"
    ? FOOD_CATALOG
    : FOOD_CATALOG.filter((f) => f.category === catFilter);

  return (
    <PageShell
      title="یخچال"
      titleEmoji={currentTier.emoji}
      subtitle={`${currentTier.name} · ${toPersian(fridge.items.length)}/${toPersian(currentTier.slots)} جا${currentTier.shelfLifeBonus > 0 ? ` · عمر +${toPersian(currentTier.shelfLifeBonus)} روز` : ""}`}
    >
      {/* Stats */}
      <StatBar stats={[
        { label: "انرژی", value: player.energy, emoji: "⚡", color: colors.success, warnBelow: 40 },
        { label: "خوشحالی", value: player.happiness, emoji: "😊", color: colors.purple, warnBelow: 40 },
        { label: "سلامت", value: player.health ?? 80, emoji: "❤️", color: "#f43f5e", warnBelow: 40 },
      ]} />

      {/* Tabs */}
      <TabBar tabs={TABS} active={tab} onChange={setTab} color={colors.success} />

      {/* Expired banner */}
      {expiredBanner && expiredBanner.length > 0 && (
        <div style={{ ...bannerStyle(colors.danger), marginBottom: sp.lg }}>
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            marginBottom: sp.sm,
          }}>
            <span style={{ fontSize: font.base, fontWeight: font.heavy, color: colors.dangerMuted }}>
              🗑️ غذاهای منقضی دور ریخته شدند
            </span>
            <button onClick={() => setExpiredBanner(null)} style={{
              background: "none", border: "none", color: colors.textSubtle,
              fontSize: 16, cursor: "pointer", padding: "0 4px",
            }}>✕</button>
          </div>
          <div style={{ display: "flex", gap: sp.sm, flexWrap: "wrap" }}>
            {expiredBanner.map((name, i) => (
              <span key={i} style={tierChipStyle(colors.dangerMuted)}>{name}</span>
            ))}
          </div>
          <div style={{ fontSize: font.xs, color: colors.textSubtle, marginTop: sp.sm }}>
            😊 -{toPersian(expiredBanner.length * 2)} خوشحالی
          </div>
        </div>
      )}

      {/* ─── Fridge Tab ─── */}
      {tab === "fridge" && (
        <div style={{ display: "flex", flexDirection: "column", gap: sp.md }}>
          {fridgeItems.length === 0 && (
            <div style={emptyStateStyle}>یخچال خالیه! از سوپرمارکت خرید کن 🛒</div>
          )}
          {fridgeItems.map(({ food, index, daysLeft }) => {
            const expiryColor = daysLeft <= 1 ? colors.warning : colors.successMuted;
            return (
              <ItemCard
                key={`${food.id}-${index}`}
                emoji={food.emoji}
                name={food.name}
                isSponsored={food.isSponsored}
                brand={food.brand}
                details={<>
                  <span style={statChipStyle(expiryColor)}>
                    {toPersian(daysLeft)} روز مونده
                  </span>
                  <span style={{ fontSize: font.xs, fontWeight: font.medium, color: colors.textSubtle }}>
                    ⚡+{toPersian(food.effects.energy)} 😊+{toPersian(food.effects.happiness)} ❤️+{toPersian(food.effects.health)}
                  </span>
                </>}
                action={
                  <div style={{ display: "flex", gap: sp.sm }}>
                    <button onClick={() => handleEat(index)} style={actionBtnStyle(true, colors.success)}>
                      بخور
                    </button>
                    <button onClick={() => trashFood(index)} style={actionBtnStyle(true, colors.danger)}>
                      🗑️
                    </button>
                  </div>
                }
              />
            );
          })}

          {/* Empty slots */}
          {Array.from({ length: currentTier.slots - fridge.items.length }).map((_, i) => (
            <div key={`empty-${i}`} style={{
              padding: `${sp["2xl"]}px ${sp.xl}px`,
              borderRadius: radius["2xl"],
              border: `1.5px dashed ${colors.textDim}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              color: colors.textDim, fontSize: font.md, fontWeight: font.medium,
            }}>
              جای خالی
            </div>
          ))}
        </div>
      )}

      {/* ─── Shop Tab ─── */}
      {tab === "shop" && (
        <>
          <ChipFilter
            chips={FOOD_CATEGORIES}
            active={catFilter}
            onChange={setCatFilter}
            color={colors.success}
          />
          <BalanceBar amount={checking} />
          <div style={{ display: "flex", flexDirection: "column", gap: sp.md }}>
            {shopItems.map((food) => {
              const canAfford = checking >= food.price;
              const fridgeFull = fridge.items.length >= currentTier.slots;
              const enabled = canAfford && !fridgeFull;
              const totalShelfLife = food.baseShelfLife + currentTier.shelfLifeBonus;

              return (
                <ItemCard
                  key={food.id}
                  emoji={food.emoji}
                  name={food.name}
                  isSponsored={food.isSponsored}
                  brand={food.brand}
                  sponsoredIconBg
                  details={<>
                    <span style={{ fontSize: font.sm, fontWeight: font.bold, color: colors.warningMuted }}>
                      {formatMoney(food.price)} تومن
                    </span>
                    <span style={{ fontSize: font.xs, fontWeight: font.medium, color: colors.textSubtle }}>
                      عمر: {toPersian(totalShelfLife)} روز
                      {currentTier.shelfLifeBonus > 0 && (
                        <span style={{ color: colors.successMuted }}> (+{toPersian(currentTier.shelfLifeBonus)})</span>
                      )}
                    </span>
                    <span style={{ fontSize: font.xs, fontWeight: font.medium, color: colors.textSubtle }}>
                      ⚡+{toPersian(food.effects.energy)} 😊+{toPersian(food.effects.happiness)} ❤️+{toPersian(food.effects.health)}
                    </span>
                  </>}
                  action={
                    <button
                      onClick={() => handleBuy(food.id)}
                      disabled={!enabled}
                      style={actionBtnStyle(enabled, colors.success)}
                    >
                      {fridgeFull ? "پره" : !canAfford ? "💰" : "بخر"}
                    </button>
                  }
                />
              );
            })}
          </div>
        </>
      )}

      {/* ─── Upgrade Tab ─── */}
      {tab === "upgrade" && (
        <div style={{ display: "flex", flexDirection: "column", gap: sp.sm + 4 }}>
          {FRIDGE_TIERS.map((tier) => {
            const isCurrent = tier.id === fridge.tierId;
            const isDowngrade = tier.slots <= currentTier.slots && !isCurrent;
            const canLevel = player.level >= tier.requiredLevel;
            const netCost = tier.price - currentTier.resaleValue;
            const canAfford = checking >= netCost;

            return (
              <div key={tier.id} style={{
                padding: sp["2xl"],
                borderRadius: radius["3xl"],
                background: isCurrent
                  ? `linear-gradient(135deg, ${colors.success}1A, ${colors.success}0A)`
                  : colors.cardBg,
                border: isCurrent
                  ? `1.5px solid ${colors.success}4D`
                  : `1px solid ${colors.cardBorder}`,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: sp.sm + 4, marginBottom: sp.sm + 4 }}>
                  <span style={{ fontSize: 28 }}>{tier.emoji}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: sp.sm }}>
                      <span style={{ fontSize: font.xl, fontWeight: font.heavy, color: colors.textPrimary }}>
                        {tier.name}
                      </span>
                      {isCurrent && (
                        <span style={{
                          fontSize: font["2xs"], fontWeight: font.heavy, padding: "2px 8px",
                          background: `${colors.success}33`, color: colors.successMuted,
                          borderRadius: radius.pill, border: `1px solid ${colors.success}4D`,
                        }}>فعلی</span>
                      )}
                      {tier.isSponsored && (
                        <span style={{
                          fontSize: font["2xs"], fontWeight: font.heavy, padding: "1px 6px",
                          background: colors.sponsoredBadgeBg, color: "white", borderRadius: radius.pill,
                        }}>✦ {tier.brand}</span>
                      )}
                    </div>
                    <div style={{ fontSize: font.sm, color: colors.textMuted, marginTop: 2 }}>
                      {tier.description}
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", gap: sp.sm, marginBottom: sp.sm + 4, flexWrap: "wrap" }}>
                  <span style={tierChipStyle(colors.infoMuted)}>📦 {toPersian(tier.slots)} جا</span>
                  <span style={tierChipStyle(tier.shelfLifeBonus > 0 ? colors.successMuted : colors.textSubtle)}>
                    🕐 عمر +{toPersian(tier.shelfLifeBonus)} روز
                  </span>
                  {!canLevel && (
                    <span style={tierChipStyle(colors.dangerMuted)}>🔒 سطح {toPersian(tier.requiredLevel)}</span>
                  )}
                </div>

                {!isCurrent && !isDowngrade && (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div>
                      <div style={{ fontSize: font.sm, color: colors.textSubtle, marginBottom: 2 }}>
                        هزینه ارتقا (با فروش فعلی)
                      </div>
                      <div style={{ fontSize: font.lg, fontWeight: font.heavy, color: colors.warningMuted }}>
                        {formatMoney(netCost)} تومن
                      </div>
                    </div>
                    <button
                      onClick={() => handleUpgrade(tier.id)}
                      disabled={!canLevel || !canAfford}
                      style={actionBtnStyle(canLevel && canAfford, "#6366f1")}
                    >
                      {!canLevel ? "🔒" : !canAfford ? "💰" : "ارتقا"}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <Toast message={toast} />
    </PageShell>
  );
}
