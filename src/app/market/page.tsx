"use client";
import { useState, useMemo } from "react";
import { useGameStore } from "@/stores/gameStore";
import { MARKET_ITEMS } from "@/data/marketplaceData";
import type { MarketItem } from "@/data/marketplaceData";
import { formatMoney, toPersian } from "@/data/mock";
import { Toast } from "@/components/ui";
import TopHeader from "@/components/layout/TopHeader";
import BottomNav from "@/components/layout/BottomNav";

type BazaarTab = "all" | "energy" | "happy" | "fridge" | "bazaar";

// ─── Helpers ───────────────────────────────────────────────────────────────────

/** Deterministic urgency badge from item id */
function getUrgency(id: string): { label: string; color: string } | null {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (Math.imul(31, h) + id.charCodeAt(i)) | 0;
  const n = Math.abs(h) % 6;
  if (n === 0) return { label: "🔥 آخرین موجودی", color: "#f97316" };
  if (n === 1) return { label: "⏳ ۳ عدد مانده", color: "#fbbf24" };
  if (n === 2) return { label: "⚡ پرفروش", color: "#60a5fa" };
  return null;
}

/** Compact effect summary for a market item */
function effectLabel(item: MarketItem): string {
  if (item.fridgeSpec) return `❄️ ${toPersian(item.fridgeSpec.slots)} جا`;
  const b = item.passiveBonus;
  if (!b) return "";
  const parts: string[] = [];
  if (b.energy)    parts.push(`⚡+${toPersian(b.energy)}`);
  if (b.happiness) parts.push(`😊+${toPersian(b.happiness)}`);
  if (b.health)    parts.push(`❤️+${toPersian(b.health)}`);
  return parts.join("  ");
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function MarketPage() {
  const [tab, setTab]               = useState<BazaarTab>("all");
  const [selectedItem, setSelected] = useState<MarketItem | null>(null);
  const [toast, setToast]           = useState<string | null>(null);

  const player         = useGameStore((s) => s.player);
  const checking       = useGameStore((s) => s.bank.checking);
  const inventory      = useGameStore((s) => s.inventory);
  const marketListings = useGameStore((s) => s.marketListings);
  const fridgeTierId   = useGameStore((s) => s.fridge.tierId);
  const buyFromMarket  = useGameStore((s) => s.buyFromMarket);
  const buyFromListing = useGameStore((s) => s.buyFromListing);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  }

  function handleBuy(itemId: string) {
    const r = buyFromMarket(itemId);
    showToast(r.success ? "خریداری شد! 🎉" : r.reason!);
    if (r.success) setSelected(null);
  }

  function handleBuyListing(listingId: string) {
    const r = buyFromListing(listingId);
    showToast(r.success ? "از بازار خریداری شد! 🎉" : r.reason!);
  }

  // Priced items filtered by tab
  const gridItems = useMemo(() => {
    const base = MARKET_ITEMS.filter((m) => m.price > 0);
    if (tab === "energy") return base.filter((m) => m.passiveBonus?.energy);
    if (tab === "happy")  return base.filter((m) => m.passiveBonus?.happiness);
    if (tab === "fridge") return base.filter((m) => !!m.fridgeSpec);
    return base;
  }, [tab]);

  // Deal of the day: 2 sponsored items
  const deals = useMemo(
    () => MARKET_ITEMS.filter((m) => m.isSponsored && m.price > 0).slice(0, 2),
    []
  );

  const TABS: { key: BazaarTab; label: string }[] = [
    { key: "all",    label: "همه" },
    { key: "energy", label: "⚡ انرژی" },
    { key: "happy",  label: "😊 شادی" },
    { key: "fridge", label: "❄️ یخچال" },
    { key: "bazaar", label: "🏪 بازار آزاد" },
  ];

  return (
    <div className="scene-bg" style={{ minHeight: "100dvh" }}>
      <TopHeader />

      <div className="page-enter" style={{
        paddingTop: "calc(var(--header-h) + 8px)",
        paddingBottom: "calc(var(--nav-h) + 16px)",
        paddingLeft: 14, paddingRight: 14,
        position: "relative", zIndex: 2,
      }}>

        {/* ── Header ── */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 18, fontWeight: 900, color: "white", display: "flex", alignItems: "center", gap: 7 }}>
              <span>🏪</span> جمعه‌بازار
            </div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>بهترین معاملات امروز</div>
          </div>
          {/* Compact balance pill */}
          <div style={{
            display: "flex", gap: 12, padding: "8px 14px", borderRadius: 16,
            background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
          }}>
            <StatPill icon="💰" value={formatMoney(checking)} color="#4ade80" />
            <div style={{ width: 1, background: "rgba(255,255,255,0.08)" }} />
            <StatPill icon="⚡" value={toPersian(player.energy)} color="#facc15" />
          </div>
        </div>

        {/* ── Category Tabs ── */}
        <div style={{
          display: "flex", gap: 6, marginBottom: 14,
          overflowX: "auto", paddingBottom: 2,
          scrollbarWidth: "none",
        }}>
          {TABS.map((t) => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{
              flexShrink: 0, padding: "8px 14px", borderRadius: 12, border: "none",
              background: tab === t.key
                ? t.key === "bazaar"
                  ? "linear-gradient(135deg, #f59e0b, #d97706)"
                  : "linear-gradient(135deg, #22c55e, #16a34a)"
                : "rgba(255,255,255,0.05)",
              color: tab === t.key ? "white" : "rgba(255,255,255,0.5)",
              fontSize: 12, fontWeight: 800, fontFamily: "inherit", cursor: "pointer",
              boxShadow: tab === t.key
                ? `0 4px 12px ${t.key === "bazaar" ? "rgba(245,158,11,0.3)" : "rgba(34,197,94,0.28)"}`
                : "none",
              transition: "all 0.18s",
            }}>{t.label}</button>
          ))}
        </div>

        {/* ══ BUY / FILTER TABS ══ */}
        {tab !== "bazaar" && (
          <>
            {/* ── Deal of the Day ── */}
            {tab === "all" && (
              <div style={{ marginBottom: 14 }}>
                <SectionLabel icon="🔥" label="پیشنهاد ویژه امروز" />
                <div style={{ display: "flex", gap: 8 }}>
                  {deals.map((item) => {
                    const owned = inventory.includes(item.id);
                    const canAfford = checking >= item.price;
                    // Pseudo-random 20–44% discount display
                    let h = 0;
                    for (let i = 0; i < item.id.length; i++) h = (Math.imul(31, h) + item.id.charCodeAt(i)) | 0;
                    const discount = 20 + (Math.abs(h) % 25);
                    const fx = effectLabel(item);
                    return (
                      <button key={item.id} onClick={() => setSelected(item)} style={{
                        flex: 1, padding: "12px 12px 10px", borderRadius: 20,
                        background: "linear-gradient(145deg, rgba(212,168,67,0.14), rgba(212,168,67,0.04))",
                        border: "1px solid rgba(212,168,67,0.28)",
                        cursor: "pointer", textAlign: "right", fontFamily: "inherit",
                        position: "relative", overflow: "hidden",
                      }}>
                        {/* Discount badge */}
                        <span style={{
                          position: "absolute", top: 8, left: 8,
                          fontSize: 9, fontWeight: 900, padding: "2px 6px", borderRadius: 7,
                          background: "#ef4444", color: "white",
                        }}>-{toPersian(discount)}٪</span>

                        <div style={{ fontSize: 30, marginBottom: 6 }}>{item.emoji}</div>
                        <div style={{ fontSize: 12, fontWeight: 900, color: "white", marginBottom: 3, lineHeight: 1.3 }}>
                          {item.name}
                        </div>
                        {fx && (
                          <div style={{ fontSize: 10, color: "#fbbf24", fontWeight: 700, marginBottom: 8 }}>{fx} روزانه</div>
                        )}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span style={{ fontSize: 11, fontWeight: 800, color: "#D4A843" }}>{formatMoney(item.price)}</span>
                          <span style={{
                            fontSize: 10, fontWeight: 900, padding: "3px 9px", borderRadius: 9,
                            background: owned ? "rgba(74,222,128,0.15)" : canAfford ? "rgba(34,197,94,0.8)" : "rgba(255,255,255,0.07)",
                            color: owned ? "#4ade80" : canAfford ? "white" : "rgba(255,255,255,0.3)",
                          }}>
                            {owned ? "داری ✓" : canAfford ? "بخر" : "💰"}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── 2-Column Item Grid ── */}
            <SectionLabel icon="🛒" label={tab === "all" ? "همه محصولات" : "محصولات فیلتر شده"} />
            {gridItems.length === 0 && (
              <div style={{ textAlign: "center", padding: "40px 0", color: "rgba(255,255,255,0.25)", fontSize: 13 }}>
                آیتمی در این دسته نیست 🤷
              </div>
            )}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {gridItems.map((item) => {
                const owned = inventory.includes(item.id);
                const isCurrentFridge = item.upgradeLink?.system === "fridge" && item.upgradeLink.tierId === fridgeTierId;
                const canAfford = checking >= item.price;
                const canLevel  = player.level >= item.requiredLevel;
                const alreadyHave = owned || isCurrentFridge;
                const urgency = getUrgency(item.id);
                const fx = effectLabel(item);

                return (
                  <button
                    key={item.id}
                    onClick={() => setSelected(item)}
                    style={{
                      padding: "12px 10px", borderRadius: 18,
                      background: alreadyHave
                        ? "rgba(74,222,128,0.05)"
                        : item.isSponsored
                          ? "linear-gradient(145deg, rgba(212,168,67,0.09), rgba(255,255,255,0.03))"
                          : "rgba(255,255,255,0.04)",
                      border: `1px solid ${alreadyHave
                        ? "rgba(74,222,128,0.2)"
                        : item.isSponsored
                          ? "rgba(212,168,67,0.22)"
                          : "rgba(255,255,255,0.07)"}`,
                      cursor: "pointer", textAlign: "right", fontFamily: "inherit",
                      opacity: !canLevel ? 0.5 : 1,
                      position: "relative",
                      minHeight: 105,
                      display: "flex", flexDirection: "column", justifyContent: "space-between",
                    }}
                  >
                    {/* Urgency badge — top-left */}
                    {urgency && !alreadyHave && (
                      <span style={{
                        position: "absolute", top: 6, left: 5,
                        fontSize: 8, fontWeight: 800, padding: "1px 5px", borderRadius: 6,
                        background: `${urgency.color}20`, color: urgency.color,
                        border: `1px solid ${urgency.color}30`,
                      }}>{urgency.label}</span>
                    )}
                    {/* Sponsored star — top-right */}
                    {item.isSponsored && (
                      <span style={{
                        position: "absolute", top: 6, right: 6,
                        fontSize: 9, fontWeight: 900,
                        background: "linear-gradient(135deg, #D4A843, #F0C966)",
                        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                      }}>✦</span>
                    )}

                    {/* Top: emoji + name + effect */}
                    <div>
                      <div style={{ fontSize: 28, marginBottom: 5, marginTop: item.isSponsored ? 10 : 0 }}>{item.emoji}</div>
                      <div style={{
                        fontSize: 11, fontWeight: 800,
                        color: alreadyHave ? "#4ade80" : "rgba(255,255,255,0.88)",
                        lineHeight: 1.3, marginBottom: 3,
                        overflow: "hidden",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                      } as React.CSSProperties}>{item.name}</div>
                      {fx && (
                        <div style={{ fontSize: 9, fontWeight: 700, color: "#4ade80" }}>{fx}</div>
                      )}
                    </div>

                    {/* Bottom: price + action */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 7 }}>
                      <span style={{
                        fontSize: 10, fontWeight: 800,
                        color: canAfford ? "#fbbf24" : "rgba(255,255,255,0.3)",
                      }}>{formatMoney(item.price)}</span>
                      <span style={{
                        fontSize: 10, fontWeight: 900, padding: "3px 9px", borderRadius: 9,
                        background: alreadyHave
                          ? "rgba(74,222,128,0.14)"
                          : canAfford && canLevel
                            ? "rgba(34,197,94,0.16)"
                            : "rgba(255,255,255,0.04)",
                        color: alreadyHave
                          ? "#4ade80"
                          : canAfford && canLevel
                            ? "#4ade80"
                            : "rgba(255,255,255,0.25)",
                        border: `1px solid ${alreadyHave
                          ? "rgba(74,222,128,0.22)"
                          : canAfford && canLevel
                            ? "rgba(74,222,128,0.18)"
                            : "rgba(255,255,255,0.06)"}`,
                      }}>
                        {alreadyHave ? "✓" : !canLevel ? `🔒${toPersian(item.requiredLevel)}` : "بخر"}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </>
        )}

        {/* ══ FREE MARKET / BAZAAR TAB ══ */}
        {tab === "bazaar" && (
          <>
            <div style={{
              padding: "11px 14px", borderRadius: 18, marginBottom: 12,
              background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.15)",
            }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: "#fbbf24", marginBottom: 2 }}>🏪 آگهی‌های بازار آزاد</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>
                هر روز آگهی‌ها تازه می‌شن · اجناس دست دوم با قیمت پایین‌تر
              </div>
            </div>

            {marketListings.length === 0 && (
              <div style={{ textAlign: "center", padding: "40px 0", color: "rgba(255,255,255,0.25)", fontSize: 13 }}>
                فعلاً آگهی نیست! فردا دوباره سر بزن 📋
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {marketListings.map((listing) => {
                const item = MARKET_ITEMS.find((m) => m.id === listing.itemId);
                if (!item) return null;
                const canAfford = checking >= listing.askingPrice;
                const owned = inventory.includes(listing.itemId);
                const isCurrentFridge = item.upgradeLink?.system === "fridge" && item.upgradeLink.tierId === fridgeTierId;
                const discount = Math.round((1 - listing.askingPrice / item.price) * 100);
                const enabled = canAfford && !owned && !isCurrentFridge;
                return (
                  <div key={listing.id} style={{
                    display: "flex", alignItems: "center", gap: 12,
                    padding: "11px 14px", borderRadius: 18,
                    background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
                  }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: 14, flexShrink: 0,
                      background: "rgba(255,255,255,0.05)",
                      display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24,
                    }}>{item.emoji}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 800, color: "white", marginBottom: 2 }}>{item.name}</div>
                      <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)" }}>
                        {listing.sellerEmoji} {listing.sellerName} · {listing.condition === "used" ? "دست دوم" : "نو"}
                      </div>
                    </div>
                    <div style={{ flexShrink: 0, textAlign: "right" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 5, justifyContent: "flex-end", marginBottom: 5 }}>
                        <span style={{
                          fontSize: 9, fontWeight: 900, padding: "1px 6px", borderRadius: 7,
                          background: "rgba(34,197,94,0.15)", color: "#4ade80",
                        }}>-{toPersian(discount)}٪</span>
                        <span style={{ fontSize: 12, fontWeight: 800, color: "#fbbf24" }}>
                          {formatMoney(listing.askingPrice)}
                        </span>
                      </div>
                      <button
                        onClick={() => enabled && handleBuyListing(listing.id)}
                        disabled={!enabled}
                        style={{
                          padding: "5px 14px", borderRadius: 10, border: "none",
                          background: enabled
                            ? "linear-gradient(135deg, #22c55e, #16a34a)"
                            : "rgba(255,255,255,0.05)",
                          color: enabled ? "white" : "rgba(255,255,255,0.25)",
                          fontSize: 11, fontWeight: 800, fontFamily: "inherit",
                          cursor: enabled ? "pointer" : "default",
                          boxShadow: enabled ? "0 2px 8px rgba(34,197,94,0.25)" : "none",
                        }}
                      >
                        {owned || isCurrentFridge ? "✓ داری" : !canAfford ? "💰" : "بخر"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* ══ Detail Bottom Sheet ══ */}
      {selectedItem && (
        <DetailSheet
          item={selectedItem}
          canAfford={checking >= selectedItem.price}
          canLevel={player.level >= selectedItem.requiredLevel}
          owned={inventory.includes(selectedItem.id)}
          isCurrentFridge={
            selectedItem.upgradeLink?.system === "fridge" &&
            selectedItem.upgradeLink.tierId === fridgeTierId
          }
          onBuy={() => handleBuy(selectedItem.id)}
          onClose={() => setSelected(null)}
        />
      )}

      <Toast message={toast} />
      <BottomNav />
    </div>
  );
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function StatPill({ icon, value, color }: { icon: string; value: string; color: string }) {
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", marginBottom: 1 }}>{icon}</div>
      <div style={{ fontSize: 12, fontWeight: 800, color }}>{value}</div>
    </div>
  );
}

function SectionLabel({ icon, label }: { icon: string; label: string }) {
  return (
    <div style={{
      fontSize: 11, fontWeight: 800, color: "rgba(255,255,255,0.4)",
      display: "flex", alignItems: "center", gap: 6, marginBottom: 8,
    }}>
      <span>{icon}</span> {label}
    </div>
  );
}

function DetailSheet({
  item, canAfford, canLevel, owned, isCurrentFridge, onBuy, onClose,
}: {
  item: MarketItem;
  canAfford: boolean;
  canLevel: boolean;
  owned: boolean;
  isCurrentFridge: boolean;
  onBuy: () => void;
  onClose: () => void;
}) {
  const alreadyHave = owned || isCurrentFridge;
  const canBuy = canAfford && canLevel && !alreadyHave;
  const fx = effectLabel(item);

  return (
    <div
      className="anim-backdrop-in"
      style={{
        position: "fixed", inset: 0, zIndex: 200,
        background: "rgba(0,0,0,0.65)", backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        display: "flex", alignItems: "flex-end",
      }}
      onClick={onClose}
    >
      <div
        className="anim-sheet-up"
        style={{
          width: "100%", borderRadius: "28px 28px 0 0",
          background: "linear-gradient(180deg, #141428 0%, #0a0e20 100%)",
          padding: "0 20px 40px",
          boxShadow: "0 -8px 40px rgba(0,0,0,0.6), 0 -2px 0 rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.08)", borderBottom: "none",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle */}
        <div style={{ display: "flex", justifyContent: "center", padding: "14px 0" }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.15)" }} />
        </div>

        {/* Item header row */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
          <div style={{
            width: 64, height: 64, borderRadius: 22, flexShrink: 0,
            background: item.isSponsored
              ? "linear-gradient(135deg, rgba(212,168,67,0.15), rgba(212,168,67,0.05))"
              : "rgba(255,255,255,0.06)",
            border: `1px solid ${item.isSponsored ? "rgba(212,168,67,0.3)" : "rgba(255,255,255,0.08)"}`,
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 34,
          }}>{item.emoji}</div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 4, flexWrap: "wrap" }}>
              <span style={{ fontSize: 17, fontWeight: 900, color: "white" }}>{item.name}</span>
              {item.isSponsored && item.brand && (
                <span style={{
                  fontSize: 9, fontWeight: 800, padding: "2px 7px", borderRadius: 8,
                  background: "linear-gradient(135deg, #D4A843, #F0C966)", color: "white",
                }}>✦ {item.brand}</span>
              )}
            </div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{item.categoryLabel}</div>
          </div>
        </div>

        {/* Description */}
        <div style={{
          padding: "10px 14px", borderRadius: 14, marginBottom: 14,
          background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
          fontSize: 12, color: "rgba(255,255,255,0.6)", lineHeight: 1.7,
        }}>{item.description}</div>

        {/* Passive bonuses */}
        {(item.passiveBonus || item.fridgeSpec) && (
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.35)", marginBottom: 8 }}>
              تأثیر روزانه
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {item.passiveBonus?.energy && (
                <BonusPill emoji="⚡" value={`+${toPersian(item.passiveBonus.energy)}`} label="انرژی" color="#facc15" />
              )}
              {item.passiveBonus?.happiness && (
                <BonusPill emoji="😊" value={`+${toPersian(item.passiveBonus.happiness)}`} label="شادی" color="#c084fc" />
              )}
              {item.passiveBonus?.health && (
                <BonusPill emoji="❤️" value={`+${toPersian(item.passiveBonus.health)}`} label="سلامت" color="#f87171" />
              )}
              {item.fridgeSpec && (
                <BonusPill emoji="📦" value={toPersian(item.fridgeSpec.slots) + " جا"} label="ظرفیت" color="#60a5fa" />
              )}
              {item.fridgeSpec && item.fridgeSpec.shelfLifeBonus > 0 && (
                <BonusPill emoji="🕐" value={`+${toPersian(item.fridgeSpec.shelfLifeBonus)} روز`} label="ماندگاری" color="#4ade80" />
              )}
            </div>
          </div>
        )}

        {/* Level gate */}
        {item.requiredLevel > 1 && (
          <div style={{
            padding: "8px 14px", borderRadius: 12, marginBottom: 14,
            background: canLevel ? "rgba(74,222,128,0.05)" : "rgba(239,68,68,0.07)",
            border: `1px solid ${canLevel ? "rgba(74,222,128,0.15)" : "rgba(239,68,68,0.18)"}`,
            fontSize: 11, fontWeight: 700,
            color: canLevel ? "#4ade80" : "#f87171",
          }}>
            {canLevel ? "✅" : "🔒"} نیاز به سطح {toPersian(item.requiredLevel)}
          </div>
        )}

        {/* Price + CTA */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", marginBottom: 2 }}>قیمت</div>
            <div style={{ fontSize: 22, fontWeight: 900, color: canAfford ? "#fbbf24" : "#f87171" }}>
              {formatMoney(item.price)}
            </div>
          </div>
          <button
            onClick={() => canBuy && onBuy()}
            disabled={!canBuy}
            style={{
              padding: "14px 28px", borderRadius: 20, border: "none",
              background: alreadyHave
                ? "rgba(74,222,128,0.1)"
                : canBuy
                  ? item.isSponsored
                    ? "linear-gradient(135deg, #D4A843, #F0C966)"
                    : "linear-gradient(180deg, #22c55e, #16a34a)"
                  : "rgba(255,255,255,0.06)",
              color: alreadyHave ? "#4ade80" : canBuy ? "white" : "rgba(255,255,255,0.25)",
              fontSize: 15, fontWeight: 900, fontFamily: "inherit",
              cursor: canBuy ? "pointer" : "default",
              boxShadow: canBuy
                ? item.isSponsored
                  ? "0 4px 14px rgba(212,168,67,0.35)"
                  : "0 4px 14px rgba(34,197,94,0.3)"
                : "none",
            }}
          >
            {alreadyHave ? "✓ داری" : !canLevel ? "🔒 سطح لازم" : !canAfford ? "💰 بودجه کمه" : "بخر!"}
          </button>
        </div>
      </div>
    </div>
  );
}

function BonusPill({ emoji, value, label, color }: {
  emoji: string; value: string; label: string; color: string;
}) {
  return (
    <div style={{
      padding: "8px 14px", borderRadius: 14,
      background: `${color}10`, border: `1px solid ${color}1E`,
      display: "flex", flexDirection: "column", alignItems: "center", gap: 2, minWidth: 56,
    }}>
      <span style={{ fontSize: 16 }}>{emoji}</span>
      <span style={{ fontSize: 13, fontWeight: 900, color }}>{value}</span>
      <span style={{ fontSize: 9, color: "rgba(255,255,255,0.35)" }}>{label}</span>
    </div>
  );
}
