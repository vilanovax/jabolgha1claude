"use client";
import { useState } from "react";
import { useGameStore } from "@/stores/gameStore";
import { MARKET_ITEMS, MARKET_CATEGORIES } from "@/data/marketplaceData";
import type { MarketCategory } from "@/data/marketplaceData";
import { formatMoney, toPersian } from "@/data/mock";
import { PageShell, TabBar, Toast, ChipFilter, ItemCard, BalanceBar } from "@/components/ui";
import {
  colors, font, sp, radius,
  cardStyle, tierChipStyle, statChipStyle,
  actionBtnStyle, emptyStateStyle, bannerStyle,
} from "@/theme/tokens";

type MarketTab = "buy" | "sell" | "bazaar";
const TABS: { key: MarketTab; label: string }[] = [
  { key: "buy", label: "🛒 خرید" },
  { key: "sell", label: "💰 فروش" },
  { key: "bazaar", label: "🏪 بازار آزاد" },
];

export default function MarketPage() {
  const [tab, setTab] = useState<MarketTab>("buy");
  const [catFilter, setCatFilter] = useState<MarketCategory | "all">("all");
  const [toast, setToast] = useState<string | null>(null);

  const player = useGameStore((s) => s.player);
  const checking = useGameStore((s) => s.bank.checking);
  const inventory = useGameStore((s) => s.inventory);
  const marketListings = useGameStore((s) => s.marketListings);
  const buyFromMarket = useGameStore((s) => s.buyFromMarket);
  const sellToSystem = useGameStore((s) => s.sellToSystem);
  const buyFromListing = useGameStore((s) => s.buyFromListing);
  const fridgeTierId = useGameStore((s) => s.fridge.tierId);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  }

  function handleBuy(itemId: string) {
    const r = buyFromMarket(itemId);
    showToast(r.success ? "خریداری شد! 🎉" : r.reason!);
  }

  function handleSell(itemId: string) {
    const item = MARKET_ITEMS.find((m) => m.id === itemId);
    const r = sellToSystem(itemId);
    showToast(r.success ? `فروخته شد! 💰 +${formatMoney(item?.resaleValue ?? 0)}` : r.reason!);
  }

  function handleBuyListing(listingId: string) {
    const r = buyFromListing(listingId);
    showToast(r.success ? "از بازار خریداری شد! 🎉" : r.reason!);
  }

  const buyItems = catFilter === "all"
    ? MARKET_ITEMS.filter((m) => m.price > 0)
    : MARKET_ITEMS.filter((m) => m.price > 0 && m.category === catFilter);

  const ownedItems = inventory
    .map((id) => MARKET_ITEMS.find((m) => m.id === id))
    .filter(Boolean) as typeof MARKET_ITEMS;

  return (
    <PageShell
      title="جمعه‌بازار"
      titleEmoji="🏪"
      subtitle="خرید و فروش همه‌چیز"
      headerRight={
        <div style={{
          ...cardStyle,
          padding: `${sp.sm}px ${sp.lg}px`,
        }}>
          <div style={{ fontSize: font["2xs"], fontWeight: font.medium, color: colors.textSubtle }}>💰 موجودی</div>
          <div style={{ fontSize: font.base, fontWeight: font.heavy, color: colors.successMuted }}>{formatMoney(checking)}</div>
        </div>
      }
    >
      <TabBar tabs={TABS} active={tab} onChange={setTab} color="#f59e0b" />

      {/* ─── Buy Tab ─── */}
      {tab === "buy" && (
        <>
          <ChipFilter
            chips={MARKET_CATEGORIES}
            active={catFilter}
            onChange={(k) => setCatFilter(k as MarketCategory | "all")}
            color="#f59e0b"
          />
          <div style={{ display: "flex", flexDirection: "column", gap: sp.md }}>
            {buyItems.map((item) => {
              const owned = inventory.includes(item.id);
              const isFridge = !!item.fridgeSpec;
              const isCurrentFridge = item.upgradeLink?.system === "fridge" && item.upgradeLink.tierId === fridgeTierId;
              const canAfford = checking >= item.price;
              const canLevel = player.level >= item.requiredLevel;
              const disabled = owned || isCurrentFridge || !canAfford || !canLevel;

              const badges = [];
              if (owned) badges.push({ label: "داری ✓", color: colors.successMuted, bg: `${colors.success}33` });
              if (isCurrentFridge) badges.push({ label: "فعلی", color: colors.successMuted, bg: `${colors.success}33` });

              return (
                <ItemCard
                  key={item.id}
                  emoji={item.emoji}
                  name={item.name}
                  isSponsored={item.isSponsored}
                  brand={item.brand}
                  badges={badges}
                  sponsoredIconBg
                  iconSize={48}
                  description={item.description}
                  details={<>
                    <span style={{ fontSize: font.md, fontWeight: font.heavy, color: colors.warningMuted }}>
                      {formatMoney(item.price)} تومن
                    </span>
                    {isFridge && item.fridgeSpec && (
                      <>
                        <span style={tierChipStyle(colors.infoMuted)}>📦 {toPersian(item.fridgeSpec.slots)} جا</span>
                        <span style={tierChipStyle(item.fridgeSpec.shelfLifeBonus > 0 ? colors.successMuted : colors.textSubtle)}>
                          🕐 +{toPersian(item.fridgeSpec.shelfLifeBonus)} روز
                        </span>
                      </>
                    )}
                    {item.passiveBonus && (
                      <span style={{ fontSize: font.xs, fontWeight: font.medium, color: colors.textSubtle }}>
                        {item.passiveBonus.energy ? `⚡+${toPersian(item.passiveBonus.energy)} ` : ""}
                        {item.passiveBonus.happiness ? `😊+${toPersian(item.passiveBonus.happiness)} ` : ""}
                        {item.passiveBonus.health ? `❤️+${toPersian(item.passiveBonus.health)}` : ""}
                        <span style={{ color: colors.textDim }}> روزانه</span>
                      </span>
                    )}
                    {!canLevel && (
                      <span style={tierChipStyle(colors.dangerMuted)}>🔒 سطح {toPersian(item.requiredLevel)}</span>
                    )}
                  </>}
                  action={
                    <button
                      onClick={() => handleBuy(item.id)}
                      disabled={disabled}
                      style={actionBtnStyle(!disabled, "#f59e0b")}
                    >
                      {owned || isCurrentFridge ? "✓" : !canLevel ? "🔒" : !canAfford ? "💰" : "بخر"}
                    </button>
                  }
                />
              );
            })}
          </div>
        </>
      )}

      {/* ─── Sell Tab ─── */}
      {tab === "sell" && (
        <div style={{ display: "flex", flexDirection: "column", gap: sp.md }}>
          {ownedItems.length === 0 && (
            <div style={emptyStateStyle}>چیزی برای فروش نداری! اول از تب خرید بخر 🛒</div>
          )}
          {ownedItems.map((item) => (
            <ItemCard
              key={item.id}
              emoji={item.emoji}
              name={item.name}
              isSponsored={item.isSponsored}
              brand={item.brand}
              details={<>
                <span style={{ fontSize: font.xs, color: colors.textSubtle }}>
                  قیمت خرید: {formatMoney(item.price)}
                </span>
                <span style={{ fontSize: font.md, fontWeight: font.heavy, color: colors.successMuted }}>
                  فروش: {formatMoney(item.resaleValue)} تومن
                </span>
              </>}
              action={
                <button onClick={() => handleSell(item.id)} style={actionBtnStyle(true, colors.danger)}>
                  بفروش
                </button>
              }
            />
          ))}
        </div>
      )}

      {/* ─── Bazaar Tab ─── */}
      {tab === "bazaar" && (
        <div style={{ display: "flex", flexDirection: "column", gap: sp.md }}>
          <div style={{ ...bannerStyle("#f59e0b"), marginBottom: sp.xs }}>
            <div style={{ fontSize: font.md, fontWeight: font.bold, color: colors.warningMuted }}>
              🏪 آگهی‌های بازار آزاد
            </div>
            <div style={{ fontSize: font.xs, color: colors.textSubtle, marginTop: 2 }}>
              هر روز آگهی‌ها تازه می‌شن · اجناس دست دوم با قیمت پایین‌تر
            </div>
          </div>

          {marketListings.length === 0 && (
            <div style={emptyStateStyle}>فعلاً آگهی نیست! فردا دوباره سر بزن 📋</div>
          )}

          {marketListings.map((listing) => {
            const item = MARKET_ITEMS.find((m) => m.id === listing.itemId);
            if (!item) return null;
            const canAfford = checking >= listing.askingPrice;
            const owned = inventory.includes(listing.itemId);
            const isCurrentFridge = item.upgradeLink?.system === "fridge" && item.upgradeLink.tierId === fridgeTierId;
            const discount = Math.round((1 - listing.askingPrice / item.price) * 100);
            const enabled = canAfford && !owned && !isCurrentFridge;

            return (
              <ItemCard
                key={listing.id}
                emoji={item.emoji}
                name={item.name}
                isSponsored={item.isSponsored}
                brand={item.brand}
                badges={[
                  { label: `-${toPersian(discount)}٪`, color: colors.successMuted, bg: `${colors.success}26` },
                ]}
                details={<>
                  <span style={{ fontSize: font.xs, color: colors.textSubtle }}>
                    {listing.sellerEmoji} {listing.sellerName}
                  </span>
                  <span style={tierChipStyle(listing.condition === "used" ? colors.warningMuted : colors.successMuted)}>
                    {listing.condition === "used" ? "دست دوم" : "نو"}
                  </span>
                  <span style={{
                    fontSize: font.sm, color: colors.textSubtle, textDecoration: "line-through",
                  }}>
                    {formatMoney(item.price)}
                  </span>
                  <span style={{ fontSize: font.base, fontWeight: font.heavy, color: colors.warningMuted }}>
                    {formatMoney(listing.askingPrice)} تومن
                  </span>
                </>}
                action={
                  <button
                    onClick={() => handleBuyListing(listing.id)}
                    disabled={!enabled}
                    style={actionBtnStyle(enabled, "#f59e0b")}
                  >
                    {owned || isCurrentFridge ? "✓" : !canAfford ? "💰" : "بخر"}
                  </button>
                }
              />
            );
          })}
        </div>
      )}

      <Toast message={toast} />
    </PageShell>
  );
}
