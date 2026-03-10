"use client";
import { colors, font, sp, radius } from "@/theme/tokens";
import type { PurchasableItem } from "@/data/purchasables";
import type { PurchaseQuote } from "@/game/purchase/purchaseEngine";
import { formatMoney, toPersian } from "@/data/mock";

interface CommerceItemCardProps {
  item: PurchasableItem;
  quote: PurchaseQuote;
  isOwned: boolean;
  isLocked: boolean;
  lockReason?: string;
  canAfford: boolean;
  hasEnergy: boolean;
  isPending: boolean;    // in delivery queue
  onBuy: () => void;
  accentColor: string;
}

function EffectBadge({ label, color }: { label: string; color: string }) {
  return (
    <span style={{
      fontSize: font.xs,
      fontWeight: 700,
      color,
      background: `${color}18`,
      border: `1px solid ${color}30`,
      borderRadius: radius.md,
      padding: "1px 6px",
    }}>
      {label}
    </span>
  );
}

function getEffectBadges(item: PurchasableItem, accentColor: string) {
  const badges: { label: string; color: string }[] = [];
  const e = item.effects;

  if (e.workIncomeMultiplier && e.workIncomeMultiplier > 1) {
    badges.push({ label: `+${Math.round((e.workIncomeMultiplier - 1) * 100)}٪ درآمد`, color: colors.success });
  }
  if (e.learningSpeedMultiplier && e.learningSpeedMultiplier > 1) {
    badges.push({ label: `+${Math.round((e.learningSpeedMultiplier - 1) * 100)}٪ یادگیری`, color: colors.info });
  }
  if (e.dailyEnergyBonus && e.dailyEnergyBonus > 0) {
    badges.push({ label: `+${toPersian(e.dailyEnergyBonus)} انرژی/روز`, color: "#22d3ee" });
  }
  if (e.dailyHappinessBonus && e.dailyHappinessBonus > 0) {
    badges.push({ label: `+${toPersian(e.dailyHappinessBonus)} شادی/روز`, color: colors.purple });
  }
  if (e.energy && e.energy > 0) {
    badges.push({ label: `⚡ +${toPersian(e.energy)}`, color: "#facc15" });
  }
  if (e.happiness && e.happiness > 0) {
    badges.push({ label: `😊 +${toPersian(e.happiness)}`, color: colors.purple });
  }
  if (e.health && e.health > 0) {
    badges.push({ label: `❤️ +${toPersian(e.health)}`, color: colors.danger });
  }
  if (e.resaleValue) {
    badges.push({ label: `فروش: ${formatMoney(e.resaleValue)}`, color: colors.textMuted });
  }

  return badges.length > 0 ? badges : [{ label: "مفید", color: accentColor }];
}

export default function CommerceItemCard({
  item,
  quote,
  isOwned,
  isLocked,
  lockReason,
  canAfford,
  hasEnergy,
  isPending,
  onBuy,
  accentColor,
}: CommerceItemCardProps) {
  const badges = getEffectBadges(item, accentColor);

  const btnDisabled = isOwned || isLocked || !canAfford || !hasEnergy || isPending;

  let btnLabel = "خرید";
  let btnColor = accentColor;
  if (isOwned) { btnLabel = "✓ خریداری شده"; btnColor = colors.success; }
  else if (isPending) { btnLabel = "📦 در راه است"; btnColor = "#f59e0b"; }
  else if (isLocked) { btnLabel = `🔒 ${lockReason ?? "قفل"}`; btnColor = colors.textMuted; }
  else if (!canAfford) { btnLabel = "پول کافی نیست"; btnColor = colors.danger; }
  else if (!hasEnergy) { btnLabel = "انرژی کم"; btnColor = colors.warning; }

  return (
    <div style={{
      padding: `${sp.lg}px`,
      borderRadius: radius.xl,
      background: colors.cardBg,
      border: `1px solid ${isOwned ? colors.success + "30" : colors.cardBorder}`,
      borderRight: `3px solid ${isOwned ? colors.success : accentColor}`,
      display: "flex",
      flexDirection: "column",
      gap: sp.sm,
      opacity: isLocked ? 0.6 : 1,
    }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: sp.md }}>
        <span style={{ fontSize: font["2xl"], flexShrink: 0 }}>{item.emoji}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: font.base,
            fontWeight: 800,
            color: "white",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}>
            {item.nameFa}
          </div>
          <div style={{
            fontSize: font.xs,
            color: colors.textMuted,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}>
            {item.descriptionFa}
          </div>
        </div>
        {item.isSponsored && (
          <span style={{
            fontSize: "9px",
            fontWeight: 800,
            color: "#D4A843",
            background: "rgba(212,168,67,0.1)",
            border: "1px solid rgba(212,168,67,0.2)",
            borderRadius: radius.md,
            padding: "1px 5px",
            flexShrink: 0,
          }}>
            ⭐ اسپانسر
          </span>
        )}
      </div>

      {/* Effect badges */}
      <div style={{ display: "flex", gap: sp.xs, flexWrap: "wrap" }}>
        {badges.map((b, i) => <EffectBadge key={i} label={b.label} color={b.color} />)}
      </div>

      {/* Price row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <span style={{ fontSize: font.lg, fontWeight: 800, color: accentColor }}>
            {formatMoney(quote.finalPrice)}
          </span>
          {quote.priceMultiplier !== 1.0 && (
            <span style={{ fontSize: font.xs, color: colors.textMuted }}>
              {quote.priceMultiplier < 1
                ? `${Math.round((1 - quote.priceMultiplier) * 100)}٪ ارزان‌تر`
                : `${Math.round((quote.priceMultiplier - 1) * 100)}٪ گران‌تر`}
            </span>
          )}
          {quote.energyCost > 0 && (
            <span style={{ fontSize: font.xs, color: "#facc15" }}>
              ⚡ {toPersian(quote.energyCost)} انرژی
            </span>
          )}
          {quote.deliveryDays > 0 && !isPending && (
            <span style={{ fontSize: font.xs, color: "#94a3b8" }}>
              📦 تحویل {toPersian(quote.deliveryDays)} روزه
            </span>
          )}
        </div>

        <button
          onClick={onBuy}
          disabled={btnDisabled}
          style={{
            padding: "8px 16px",
            borderRadius: radius.lg,
            border: `1px solid ${btnColor}50`,
            background: btnDisabled ? "rgba(255,255,255,0.04)" : `${btnColor}20`,
            color: btnDisabled ? colors.textMuted : btnColor,
            fontSize: font.sm,
            fontWeight: 800,
            cursor: btnDisabled ? "not-allowed" : "pointer",
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
