"use client";
import { useState, useEffect, useRef } from "react";
import { useGameStore } from "@/stores/gameStore";
import { FOOD_CATALOG, FRIDGE_TIERS, FOOD_CATEGORIES } from "@/data/fridgeData";
import type { FoodItem, FridgeSlot } from "@/data/fridgeData";
import { BRAND_MODIFIERS } from "@/data/brandModifiers";
import { FOOD_COMBOS } from "@/data/foodCombos";
import { formatMoney, toPersian } from "@/data/mock";
import TopHeader from "@/components/layout/TopHeader";
import BottomNav from "@/components/layout/BottomNav";

// ─── Types ────────────────────────────────────────────────────────────────────
type FridgeTab = "fridge" | "shop" | "upgrade";

// ─── Freshness helpers ────────────────────────────────────────────────────────
function getFreshness(slot: FridgeSlot, food: FoodItem, day: number): number {
  if (slot.spoiled) return 0;
  const remaining = slot.expiresOnDay - day;
  return Math.max(0, Math.min(1, remaining / food.baseShelfLife));
}

function freshnessColor(freshness: number, spoiled: boolean): string {
  if (spoiled || freshness <= 0) return "#ef4444";
  if (freshness < 0.25) return "#f97316";
  if (freshness < 0.5)  return "#f59e0b";
  return "#4ade80";
}

function freshnessLabel(daysLeft: number, spoiled: boolean): string {
  if (spoiled || daysLeft <= 0) return "فاسد شده";
  if (daysLeft === 1)           return "آخرین روز!";
  return `${toPersian(daysLeft)} روز`;
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function SectionLabel({ icon, label }: { icon: string; label: string }) {
  return (
    <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.35)", marginBottom: 6, letterSpacing: 0.5 }}>
      {icon} {label}
    </div>
  );
}

function QualityBadge({ quality }: { quality: "economy" | "standard" | "premium" }) {
  const map = {
    economy:  { label: "اکونومی",  color: "#94a3b8" },
    standard: { label: "استاندارد", color: "rgba(255,255,255,0.3)" },
    premium:  { label: "✦ ممتاز",  color: "#D4A843" },
  };
  const cfg = map[quality];
  if (quality === "standard") return null;
  return (
    <span style={{
      fontSize: 8, fontWeight: 700, padding: "1px 5px", borderRadius: 5,
      background: `${cfg.color}22`, color: cfg.color,
      border: `1px solid ${cfg.color}44`,
    }}>{cfg.label}</span>
  );
}

function MealDots({ mealsToday }: { mealsToday: { breakfast: boolean; lunch: boolean; dinner: boolean; snackCount: number } }) {
  const meals = [
    { done: mealsToday.breakfast, emoji: "☀️", label: "صبحانه" },
    { done: mealsToday.lunch,     emoji: "🌤️", label: "ناهار"  },
    { done: mealsToday.dinner,    emoji: "🌙", label: "شام"    },
  ];
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      {meals.map((m, i) => (
        <div key={i} style={{
          display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
        }}>
          <span style={{ fontSize: 13, opacity: m.done ? 1 : 0.25 }}>{m.emoji}</span>
          {m.done && (
            <div style={{
              width: 4, height: 4, borderRadius: "50%", background: "#4ade80",
            }} />
          )}
        </div>
      ))}
      {mealsToday.snackCount > 0 && (
        <span style={{ fontSize: 9, color: "#fbbf24", fontWeight: 700 }}>
          +{toPersian(mealsToday.snackCount)} میان‌وعده
        </span>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function FridgePage() {
  const [tab, setTab]               = useState<FridgeTab>("fridge");
  const [catFilter, setCatFilter]   = useState("all");
  const [toast, setToast]           = useState<{ msg: string; color?: string } | null>(null);
  const [expiredBanner, setBanner]  = useState<string[] | null>(null);
  const [detailSheet, setDetail]    = useState<{ food: FoodItem; slot: FridgeSlot; index: number } | null>(null);
  const [shopSheet, setShop]        = useState<FoodItem | null>(null);
  const hasCleared = useRef(false);

  const player          = useGameStore((s) => s.player);
  const fridge          = useGameStore((s) => s.fridge);
  const checking        = useGameStore((s) => s.bank.checking);
  const buyFood         = useGameStore((s) => s.buyFood);
  const eatFood         = useGameStore((s) => s.eatFood);
  const trashFood       = useGameStore((s) => s.trashFood);
  const upgradeFridge   = useGameStore((s) => s.upgradeFridge);
  const clearExpired    = useGameStore((s) => s.clearExpiredItems);

  useEffect(() => {
    if (hasCleared.current) return;
    hasCleared.current = true;
    const { expiredNames } = clearExpired();
    if (expiredNames.length > 0) setBanner(expiredNames);
  }, [clearExpired]);

  const currentTier = FRIDGE_TIERS.find((t) => t.id === fridge.tierId)!;
  const hasSort     = currentTier.smartFeatures?.includes("expiry_sort");
  const hasWarning  = currentTier.smartFeatures?.includes("expiry_warning");
  const hasSuggest  = currentTier.smartFeatures?.includes("grocery_suggest");

  function showToast(msg: string, color = "#4ade80") {
    setToast({ msg, color });
    setTimeout(() => setToast(null), 2500);
  }

  // ── Fridge items, sorted by expiry if smart feature present ──
  const fridgeItems = fridge.items
    .map((slot, index) => {
      const food = FOOD_CATALOG.find((f) => f.id === slot.foodId)!;
      const daysLeft = slot.expiresOnDay - player.dayInGame;
      return { slot, food, index, daysLeft };
    })
    .sort((a, b) => hasSort ? a.daysLeft - b.daysLeft : 0);

  // ── Shop items ──
  const shopItems = catFilter === "all"
    ? FOOD_CATALOG
    : FOOD_CATALOG.filter((f) => f.category === catFilter);

  // ── Smart grocery suggestion ──
  const suggestedIds = hasSuggest
    ? FOOD_CATALOG.filter((f) => {
        const owned = fridge.items.some((s) => s.foodId === f.id);
        return !owned && f.price < 200_000;
      }).slice(0, 3).map((f) => f.id)
    : [];

  // ── Urgent expiry warning ──
  const urgentItem = hasWarning
    ? fridgeItems.find((i) => !i.slot.spoiled && i.daysLeft <= 1)
    : null;

  function handleEat(index: number) {
    const r = eatFood(index);
    if (!r.success) { showToast(r.reason!, "#ef4444"); return; }
    if (r.spoiled) {
      showToast(`غذای فاسد! ❤️${toPersian(r.effects!.health)} ⚡${toPersian(r.effects!.energy)}`, "#ef4444");
    } else {
      const e = r.effects!;
      let msg = `⚡+${toPersian(e.energy)} 😊+${toPersian(e.happiness)} ❤️+${toPersian(e.health)}`;
      if (r.combo) msg = `🎉 کومبو ${r.combo.labelFa}! ${msg}`;
      showToast(msg, r.combo ? "#f59e0b" : "#4ade80");
    }
    setDetail(null);
  }

  function handleTrash(index: number) {
    trashFood(index);
    showToast("دور انداخته شد 🗑️", "#94a3b8");
    setDetail(null);
  }

  function handleBuyGrocery(foodId: string) {
    const r = buyFood(foodId);
    showToast(r.success ? "به یخچال اضافه شد ❄️" : r.reason!, r.success ? "#4ade80" : "#ef4444");
    setShop(null);
  }

  function handleBuyDelivery(food: FoodItem) {
    // Delivery: immediate eat, no fridge slot needed
    const brandMod = BRAND_MODIFIERS[food.brand ?? ""];
    const deliveryMul = brandMod?.deliveryDiscount ?? 1.35;
    const price = Math.round(food.price * deliveryMul);
    if (checking < price) { showToast("موجودی کافی نیست 💰", "#ef4444"); return; }
    // Directly apply effects (bypass fridge)
    const efx = food.effects;
    // We can't call eatFood on delivery since it needs a slot — apply via buyFood + eatFood hack
    // Instead just apply effects client-side via store's bank deduction
    // Use a simpler approach: buyFood then immediately eatFood from last slot
    const buyResult = buyFood(food.id);
    if (!buyResult.success) { showToast(buyResult.reason!, "#ef4444"); return; }
    const lastIndex = fridge.items.length; // after buy, new item is at end
    handleEat(lastIndex);
    showToast(`🛵 تحویل فوری! ⚡+${toPersian(efx.energy)}`, "#a78bfa");
    setShop(null);
  }

  function handleUpgrade(tierId: string) {
    const r = upgradeFridge(tierId);
    showToast(r.success ? "یخچال ارتقا یافت 🎉" : r.reason!, r.success ? "#4ade80" : "#ef4444");
  }

  const TABS: { key: FridgeTab; label: string }[] = [
    { key: "fridge",  label: "❄️ یخچال" },
    { key: "shop",    label: "🛒 سوپرمارکت" },
    { key: "upgrade", label: "⬆️ ارتقا" },
  ];

  const mealsToday = player.mealsToday ?? { breakfast: false, lunch: false, dinner: false, snackCount: 0 };
  const mealsEaten = [mealsToday.breakfast, mealsToday.lunch, mealsToday.dinner].filter(Boolean).length;

  return (
    <div className="scene-bg" style={{ minHeight: "100dvh" }}>
      <TopHeader />

      <div className="page-enter" style={{
        paddingTop: "calc(var(--header-h) + 8px)",
        paddingBottom: "calc(var(--nav-h) + 16px)",
        paddingLeft: 14, paddingRight: 14,
        position: "relative", zIndex: 2,
      }}>

        {/* ── Hero card ── */}
        <div style={{
          borderRadius: 22, padding: "14px 16px", marginBottom: 14,
          background: "linear-gradient(145deg, #0F2340, #1B3A5C 60%, #263E66)",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 8px 32px rgba(10,22,40,0.35)",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 4 }}>❄️ {currentTier.name}</div>
              <div style={{ fontSize: 22, fontWeight: 900, color: "white", marginBottom: 4 }}>
                {toPersian(fridge.items.length)}/{toPersian(currentTier.slots)} جا
              </div>
              {currentTier.shelfLifeBonus > 0 && (
                <div style={{ fontSize: 10, color: "#4ade80", fontWeight: 700 }}>
                  عمر غذا +{toPersian(currentTier.shelfLifeBonus)} روز
                </div>
              )}
            </div>
            <div style={{ textAlign: "left" }}>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 6 }}>وعده‌های امروز</div>
              <MealDots mealsToday={mealsToday} />
              {mealsEaten === 0 && (
                <div style={{ fontSize: 9, color: "#f97316", fontWeight: 700, marginTop: 4 }}>
                  ⚠️ هنوز نخوردی!
                </div>
              )}
            </div>
          </div>

          {/* Capacity bar */}
          <div style={{
            marginTop: 12,
            background: "rgba(255,255,255,0.07)", borderRadius: 99, height: 5, overflow: "hidden",
          }}>
            <div style={{
              width: `${(fridge.items.length / currentTier.slots) * 100}%`,
              height: "100%", borderRadius: 99,
              background: fridge.items.length >= currentTier.slots
                ? "#ef4444"
                : fridge.items.length > currentTier.slots * 0.7
                  ? "#f59e0b"
                  : "#4ade80",
              transition: "width 0.4s ease",
            }} />
          </div>
        </div>

        {/* ── Smart warning banners ── */}
        {urgentItem && (
          <div style={{
            borderRadius: 14, padding: "10px 14px", marginBottom: 10,
            background: "rgba(249,115,22,0.1)", border: "1px solid rgba(249,115,22,0.25)",
            display: "flex", alignItems: "center", gap: 8,
          }}>
            <span style={{ fontSize: 16 }}>⏰</span>
            <span style={{ fontSize: 11, color: "#f97316", fontWeight: 700 }}>
              {urgentItem.food.name} فردا خراب می‌شه — همین الان بخور!
            </span>
          </div>
        )}

        {expiredBanner && expiredBanner.length > 0 && (
          <div style={{
            borderRadius: 14, padding: "10px 14px", marginBottom: 10,
            background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)",
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#f87171", marginBottom: 4 }}>
                🗑️ {toPersian(expiredBanner.length)} آیتم فاسد شده — بخور یا دور بینداز
              </div>
              <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                {expiredBanner.map((n, i) => (
                  <span key={i} style={{
                    fontSize: 9, padding: "2px 6px", borderRadius: 6,
                    background: "rgba(239,68,68,0.15)", color: "#f87171", fontWeight: 700,
                  }}>{n}</span>
                ))}
              </div>
            </div>
            <button onClick={() => setBanner(null)} style={{
              background: "none", border: "none", color: "rgba(255,255,255,0.3)",
              fontSize: 16, cursor: "pointer", padding: "0 4px", flexShrink: 0,
            }}>✕</button>
          </div>
        )}

        {/* ── Grocery suggestion (smart fridge) ── */}
        {suggestedIds.length > 0 && tab === "fridge" && (
          <div style={{
            borderRadius: 14, padding: "10px 14px", marginBottom: 10,
            background: "rgba(96,165,250,0.07)", border: "1px solid rgba(96,165,250,0.2)",
          }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#60a5fa", marginBottom: 6 }}>
              💡 یخچال هوشمند پیشنهاد می‌ده:
            </div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {suggestedIds.map((id) => {
                const f = FOOD_CATALOG.find((x) => x.id === id)!;
                return (
                  <button key={id} onClick={() => { setTab("shop"); setCatFilter(f.category); }}
                    style={{
                      fontSize: 10, fontWeight: 700, padding: "4px 8px", borderRadius: 8,
                      background: "rgba(96,165,250,0.12)", border: "1px solid rgba(96,165,250,0.25)",
                      color: "#93c5fd", cursor: "pointer", fontFamily: "inherit",
                    }}>
                    {f.emoji} {f.name}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Tab bar ── */}
        <div style={{
          display: "flex", padding: 3, marginBottom: 14,
          background: "rgba(255,255,255,0.04)",
          borderRadius: 16, border: "1px solid rgba(255,255,255,0.07)",
        }}>
          {TABS.map((t) => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{
              flex: 1, padding: "9px 0", border: "none", cursor: "pointer",
              borderRadius: 13, fontSize: 11, fontWeight: 700, fontFamily: "inherit",
              transition: "all .2s",
              background: tab === t.key
                ? "linear-gradient(180deg, #22c55e, #16a34a)"
                : "transparent",
              color: tab === t.key ? "white" : "rgba(255,255,255,0.4)",
              boxShadow: tab === t.key ? "0 4px 14px rgba(34,197,94,0.35)" : "none",
            }}>{t.label}</button>
          ))}
        </div>

        {/* ══════════════════════════════════════════════ */}
        {/* TAB: Fridge Inventory                         */}
        {/* ══════════════════════════════════════════════ */}
        {tab === "fridge" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {fridgeItems.length === 0 && (
              <div style={{
                textAlign: "center", padding: "40px 0",
                color: "rgba(255,255,255,0.2)", fontSize: 13, fontWeight: 700,
              }}>یخچال خالیه! 🛒</div>
            )}

            {fridgeItems.map(({ food, slot, index, daysLeft }) => {
              const freshness = getFreshness(slot, food, player.dayInGame);
              const fColor    = freshnessColor(freshness, !!slot.spoiled);
              const brandMod  = BRAND_MODIFIERS[food.brand ?? ""];

              return (
                <button key={`${food.id}-${index}`}
                  onClick={() => setDetail({ food, slot, index })}
                  style={{
                    borderRadius: 18, padding: "12px 14px",
                    background: slot.spoiled
                      ? "rgba(239,68,68,0.07)"
                      : "rgba(255,255,255,0.04)",
                    border: `1px solid ${slot.spoiled ? "rgba(239,68,68,0.2)" : "rgba(255,255,255,0.07)"}`,
                    cursor: "pointer", textAlign: "right", fontFamily: "inherit",
                    display: "flex", alignItems: "center", gap: 12,
                  }}>
                  {/* Emoji */}
                  <div style={{
                    width: 46, height: 46, borderRadius: 14, flexShrink: 0,
                    background: "rgba(255,255,255,0.06)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 24, position: "relative",
                  }}>
                    {food.emoji}
                    {slot.spoiled && (
                      <span style={{
                        position: "absolute", bottom: -2, right: -2, fontSize: 12,
                      }}>💀</span>
                    )}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 3 }}>
                      <span style={{
                        fontSize: 13, fontWeight: 800,
                        color: slot.spoiled ? "#f87171" : "white",
                        textDecoration: slot.spoiled ? "line-through" : "none",
                      }}>{food.name}</span>
                      <QualityBadge quality={food.quality} />
                      {food.isSponsored && (
                        <span style={{
                          fontSize: 8, fontWeight: 900, padding: "1px 5px", borderRadius: 5,
                          background: "linear-gradient(135deg, #D4A843, #F0C966)", color: "white",
                        }}>✦</span>
                      )}
                    </div>

                    {/* Freshness bar */}
                    <div style={{
                      background: "rgba(255,255,255,0.07)", borderRadius: 99, height: 4,
                      overflow: "hidden", marginBottom: 5,
                    }}>
                      <div style={{
                        width: `${freshness * 100}%`, height: "100%", borderRadius: 99,
                        background: fColor,
                        transition: "width 0.4s ease",
                      }} />
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 10, fontWeight: 700, color: fColor }}>
                        {freshnessLabel(daysLeft, !!slot.spoiled)}
                      </span>
                      <span style={{ fontSize: 9, color: "rgba(255,255,255,0.35)" }}>
                        ⚡+{toPersian(food.effects.energy + (brandMod?.effectBonus?.energy ?? 0))}
                        {" "}😊+{toPersian(food.effects.happiness + (brandMod?.effectBonus?.happiness ?? 0))}
                        {" "}❤️+{toPersian(food.effects.health + (brandMod?.effectBonus?.health ?? 0))}
                      </span>
                    </div>
                  </div>

                  <span style={{ fontSize: 12, color: "rgba(255,255,255,0.25)" }}>›</span>
                </button>
              );
            })}

            {/* Empty slots */}
            {Array.from({ length: Math.max(0, currentTier.slots - fridge.items.length) }).map((_, i) => (
              <div key={`empty-${i}`} style={{
                padding: "14px 16px", borderRadius: 18,
                border: "1.5px dashed rgba(255,255,255,0.07)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "rgba(255,255,255,0.12)", fontSize: 11, fontWeight: 600,
              }}>جای خالی</div>
            ))}
          </div>
        )}

        {/* ══════════════════════════════════════════════ */}
        {/* TAB: Shop                                     */}
        {/* ══════════════════════════════════════════════ */}
        {tab === "shop" && (
          <>
            {/* Balance */}
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              marginBottom: 10, padding: "8px 12px", borderRadius: 12,
              background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)",
            }}>
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", fontWeight: 700 }}>💰 موجودی</span>
              <span style={{ fontSize: 14, fontWeight: 900, color: "#fbbf24" }}>{formatMoney(checking)}</span>
            </div>

            {/* Category filter */}
            <div style={{ display: "flex", gap: 6, overflowX: "auto", marginBottom: 12, paddingBottom: 2 }}>
              {FOOD_CATEGORIES.map((c) => (
                <button key={c.key} onClick={() => setCatFilter(c.key)} style={{
                  flexShrink: 0, padding: "6px 11px", borderRadius: 10, cursor: "pointer",
                  fontFamily: "inherit", fontSize: 10, fontWeight: 700, border: "none",
                  background: catFilter === c.key ? "rgba(34,197,94,0.2)" : "rgba(255,255,255,0.04)",
                  color: catFilter === c.key ? "#4ade80" : "rgba(255,255,255,0.45)",
                  outline: catFilter === c.key ? "1px solid rgba(34,197,94,0.35)" : "1px solid rgba(255,255,255,0.07)",
                }}>{c.emoji} {c.label}</button>
              ))}
            </div>

            {/* Fridge full warning */}
            {fridge.items.filter(s => !s.spoiled).length >= currentTier.slots && (
              <div style={{
                borderRadius: 12, padding: "10px 14px", marginBottom: 10,
                background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)",
                fontSize: 11, fontWeight: 700, color: "#f87171",
              }}>⚠️ یخچال پره — آیتم‌های فاسد را دور بینداز یا ارتقا بده</div>
            )}

            {/* Items list */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {shopItems.map((food) => {
                const brandMod     = BRAND_MODIFIERS[food.brand ?? ""];
                const finalPrice   = Math.round(food.price * (brandMod?.priceDiscount ?? 1));
                const deliveryPrice= Math.round(food.price * (brandMod?.deliveryDiscount ?? 1.35));
                const canAfford    = checking >= finalPrice;
                const canDeliver   = checking >= deliveryPrice;
                const spoiledCount = fridge.items.filter(s => s.spoiled).length;
                const availSlots   = currentTier.slots - (fridge.items.length - spoiledCount);
                const fridgeFull   = availSlots <= 0;
                const totalShelf   = food.baseShelfLife
                  + currentTier.shelfLifeBonus
                  + (currentTier.smartFeatures?.includes("shelf_life_boost") ? 1 : 0)
                  + (brandMod?.shelfLifeBonus ?? 0);

                return (
                  <div key={food.id} style={{
                    borderRadius: 18, padding: "12px 14px",
                    background: food.quality === "premium"
                      ? "linear-gradient(135deg, rgba(212,168,67,0.07), rgba(212,168,67,0.03))"
                      : "rgba(255,255,255,0.04)",
                    border: `1px solid ${food.quality === "premium" ? "rgba(212,168,67,0.2)" : "rgba(255,255,255,0.07)"}`,
                    display: "flex", alignItems: "center", gap: 12,
                  }}>
                    <div style={{
                      width: 46, height: 46, borderRadius: 14, flexShrink: 0,
                      background: "rgba(255,255,255,0.06)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 24, position: "relative",
                    }}>
                      {food.emoji}
                      {food.isSponsored && (
                        <span style={{
                          position: "absolute", top: -3, right: -3, fontSize: 8, fontWeight: 900,
                          padding: "1px 4px", borderRadius: 5,
                          background: "linear-gradient(135deg, #D4A843, #F0C966)", color: "white",
                        }}>✦</span>
                      )}
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 3 }}>
                        <span style={{ fontSize: 13, fontWeight: 800, color: "white" }}>{food.name}</span>
                        <QualityBadge quality={food.quality} />
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                        <span style={{ fontSize: 11, fontWeight: 900, color: "#fbbf24" }}>{formatMoney(finalPrice)}</span>
                        {brandMod?.priceDiscount && brandMod.priceDiscount < 1 && (
                          <span style={{ fontSize: 9, color: "#4ade80", fontWeight: 700 }}>
                            -{toPersian(Math.round((1 - brandMod.priceDiscount) * 100))}٪
                          </span>
                        )}
                        <span style={{ fontSize: 9, color: "rgba(255,255,255,0.35)" }}>
                          عمر {toPersian(totalShelf)} روز
                        </span>
                      </div>
                      <div style={{ fontSize: 9, color: "rgba(255,255,255,0.35)" }}>
                        ⚡+{toPersian(food.effects.energy + (brandMod?.effectBonus?.energy ?? 0))}
                        {" "}😊+{toPersian(food.effects.happiness + (brandMod?.effectBonus?.happiness ?? 0))}
                        {" "}❤️+{toPersian(food.effects.health + (brandMod?.effectBonus?.health ?? 0))}
                        {brandMod?.tagFa && (
                          <span style={{ color: "#D4A843", marginRight: 4 }}>· {brandMod.tagFa}</span>
                        )}
                      </div>
                    </div>

                    {/* Buttons */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 5, flexShrink: 0 }}>
                      <button
                        onClick={() => handleBuyGrocery(food.id)}
                        disabled={!canAfford || fridgeFull}
                        style={{
                          padding: "6px 10px", borderRadius: 10, cursor: canAfford && !fridgeFull ? "pointer" : "default",
                          background: canAfford && !fridgeFull ? "rgba(34,197,94,0.2)" : "rgba(255,255,255,0.05)",
                          color: canAfford && !fridgeFull ? "#4ade80" : "rgba(255,255,255,0.2)",
                          fontSize: 10, fontWeight: 800, fontFamily: "inherit",
                          border: `1px solid ${canAfford && !fridgeFull ? "rgba(34,197,94,0.35)" : "rgba(255,255,255,0.07)"}`,
                        }}>
                        {fridgeFull ? "پره" : !canAfford ? "💰" : "🛒 بخر"}
                      </button>
                      <button
                        onClick={() => handleBuyDelivery(food)}
                        disabled={!canDeliver}
                        style={{
                          padding: "6px 10px", borderRadius: 10, cursor: canDeliver ? "pointer" : "default",
                          background: canDeliver ? "rgba(167,139,250,0.15)" : "rgba(255,255,255,0.05)",
                          color: canDeliver ? "#a78bfa" : "rgba(255,255,255,0.2)",
                          fontSize: 10, fontWeight: 800, fontFamily: "inherit",
                          border: `1px solid ${canDeliver ? "rgba(167,139,250,0.3)" : "rgba(255,255,255,0.07)"}`,
                        }}>
                        🛵 {formatMoney(deliveryPrice)}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Combos hint */}
            <div style={{
              marginTop: 16, borderRadius: 14, padding: "10px 14px",
              background: "rgba(251,191,36,0.07)", border: "1px solid rgba(251,191,36,0.15)",
            }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#fbbf24", marginBottom: 6 }}>🎉 کومبوهای فعال</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {FOOD_COMBOS.slice(0, 4).map((combo) => (
                  <div key={combo.id} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontSize: 13 }}>{combo.emoji}</span>
                    <span style={{ fontSize: 10, color: "rgba(255,255,255,0.5)" }}>{combo.labelFa}</span>
                    <span style={{ fontSize: 9, color: "#4ade80", fontWeight: 700, marginRight: "auto" }}>
                      {[combo.bonus.energy && `⚡+${toPersian(combo.bonus.energy)}`,
                        combo.bonus.happiness && `😊+${toPersian(combo.bonus.happiness)}`,
                        combo.bonus.health && `❤️+${toPersian(combo.bonus.health)}`].filter(Boolean).join(" ")}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ══════════════════════════════════════════════ */}
        {/* TAB: Upgrade                                  */}
        {/* ══════════════════════════════════════════════ */}
        {tab === "upgrade" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <SectionLabel icon="⬆️" label="مدل‌های یخچال" />
            {FRIDGE_TIERS.map((tier) => {
              const isCurrent    = tier.id === fridge.tierId;
              const isDowngrade  = tier.slots <= currentTier.slots && !isCurrent;
              const canLevel     = player.level >= tier.requiredLevel;
              const netCost      = tier.price - currentTier.resaleValue;
              const canAfford    = checking >= netCost;
              const featureLabels: Record<string, string> = {
                expiry_sort: "📋 مرتب‌سازی",
                expiry_warning: "⏰ هشدار انقضا",
                grocery_suggest: "💡 پیشنهاد خرید",
                shelf_life_boost: "🌡️ عمر +۱",
                waste_reduction: "♻️ کاهش جریمه",
              };

              return (
                <div key={tier.id} style={{
                  borderRadius: 20, padding: "14px 16px",
                  background: isCurrent
                    ? "linear-gradient(135deg, rgba(34,197,94,0.1), rgba(34,197,94,0.04))"
                    : tier.isSponsored
                      ? "linear-gradient(135deg, rgba(212,168,67,0.07), rgba(212,168,67,0.03))"
                      : "rgba(255,255,255,0.04)",
                  border: `1px solid ${isCurrent
                    ? "rgba(34,197,94,0.3)"
                    : tier.isSponsored ? "rgba(212,168,67,0.2)"
                    : "rgba(255,255,255,0.07)"}`,
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                    <span style={{ fontSize: 28 }}>{tier.emoji}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                        <span style={{ fontSize: 14, fontWeight: 800, color: "white" }}>{tier.name}</span>
                        {isCurrent && (
                          <span style={{
                            fontSize: 9, fontWeight: 800, padding: "2px 7px",
                            background: "rgba(34,197,94,0.2)", color: "#4ade80",
                            borderRadius: 99, border: "1px solid rgba(34,197,94,0.3)",
                          }}>فعلی</span>
                        )}
                        {tier.isSponsored && (
                          <span style={{
                            fontSize: 8, fontWeight: 900, padding: "1px 6px",
                            background: "linear-gradient(135deg, #D4A843, #F0C966)", color: "white", borderRadius: 99,
                          }}>✦ {tier.brand}</span>
                        )}
                      </div>
                      <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>{tier.description}</div>
                    </div>
                  </div>

                  {/* Stat chips */}
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
                    <span style={{
                      fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 8,
                      background: "rgba(96,165,250,0.12)", color: "#93c5fd",
                    }}>📦 {toPersian(tier.slots)} جا</span>
                    <span style={{
                      fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 8,
                      background: tier.shelfLifeBonus > 0 ? "rgba(74,222,128,0.12)" : "rgba(255,255,255,0.06)",
                      color: tier.shelfLifeBonus > 0 ? "#4ade80" : "rgba(255,255,255,0.3)",
                    }}>🕐 +{toPersian(tier.shelfLifeBonus)} روز</span>
                    {!canLevel && (
                      <span style={{
                        fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 8,
                        background: "rgba(239,68,68,0.12)", color: "#f87171",
                      }}>🔒 سطح {toPersian(tier.requiredLevel)}</span>
                    )}
                  </div>

                  {/* Smart features */}
                  {(tier.smartFeatures ?? []).length > 0 && (
                    <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 10 }}>
                      {(tier.smartFeatures ?? []).map((f) => (
                        <span key={f} style={{
                          fontSize: 9, fontWeight: 700, padding: "2px 7px", borderRadius: 7,
                          background: "rgba(167,139,250,0.12)", color: "#c4b5fd",
                          border: "1px solid rgba(167,139,250,0.2)",
                        }}>{featureLabels[f] ?? f}</span>
                      ))}
                    </div>
                  )}

                  {/* Upgrade button */}
                  {!isCurrent && !isDowngrade && (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div>
                        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", marginBottom: 2 }}>
                          هزینه خالص (با فروش فعلی)
                        </div>
                        <div style={{ fontSize: 15, fontWeight: 900, color: "#fbbf24" }}>
                          {formatMoney(netCost)}
                        </div>
                      </div>
                      <button
                        onClick={() => handleUpgrade(tier.id)}
                        disabled={!canLevel || !canAfford}
                        style={{
                          padding: "9px 18px", borderRadius: 12,
                          cursor: canLevel && canAfford ? "pointer" : "default",
                          background: canLevel && canAfford ? "rgba(99,102,241,0.25)" : "rgba(255,255,255,0.05)",
                          color: canLevel && canAfford ? "#a5b4fc" : "rgba(255,255,255,0.2)",
                          fontSize: 12, fontWeight: 800, fontFamily: "inherit",
                          border: `1px solid ${canLevel && canAfford ? "rgba(99,102,241,0.4)" : "rgba(255,255,255,0.07)"}`,
                        }}>
                        {!canLevel ? "🔒" : !canAfford ? "💰" : "ارتقا"}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ══ Food Detail Bottom Sheet ══ */}
      {detailSheet && (() => {
        const { food, slot, index } = detailSheet;
        const freshness = getFreshness(slot, food, player.dayInGame);
        const fColor    = freshnessColor(freshness, !!slot.spoiled);
        const daysLeft  = slot.expiresOnDay - player.dayInGame;
        const brandMod  = BRAND_MODIFIERS[food.brand ?? ""];
        return (
          <>
            <div onClick={() => setDetail(null)} style={{
              position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)",
              zIndex: 100, backdropFilter: "blur(4px)",
            }} />
            <div className="anim-sheet-up" style={{
              position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 101,
              background: "linear-gradient(180deg, #141428 0%, #0a0e20 100%)",
              borderRadius: "24px 24px 0 0",
              border: "1px solid rgba(255,255,255,0.07)",
              padding: "20px 20px 36px",
              maxHeight: "75vh", overflowY: "auto",
            }}>
              {/* Handle */}
              <div style={{ width: 40, height: 4, borderRadius: 99, background: "rgba(255,255,255,0.15)", margin: "0 auto 18px" }} />

              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
                <div style={{
                  width: 60, height: 60, borderRadius: 18, flexShrink: 0,
                  background: "rgba(255,255,255,0.07)",
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32,
                }}>
                  {food.emoji}
                  {slot.spoiled && <span style={{ position: "absolute", bottom: 0, right: 0, fontSize: 16 }}>💀</span>}
                </div>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                    <span style={{ fontSize: 18, fontWeight: 900, color: slot.spoiled ? "#f87171" : "white" }}>
                      {food.name}
                    </span>
                    <QualityBadge quality={food.quality} />
                  </div>
                  {food.isSponsored && food.brand && (
                    <span style={{
                      fontSize: 9, padding: "2px 7px", borderRadius: 7,
                      background: "linear-gradient(135deg, #D4A843, #F0C966)", color: "white", fontWeight: 900,
                    }}>✦ {food.brand}</span>
                  )}
                </div>
              </div>

              {/* Freshness */}
              <div style={{
                borderRadius: 14, padding: "12px 14px", marginBottom: 14,
                background: `${fColor}10`, border: `1px solid ${fColor}22`,
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: fColor }}>
                    {freshnessLabel(daysLeft, !!slot.spoiled)}
                  </span>
                  <span style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>
                    تا روز {toPersian(slot.expiresOnDay)}
                  </span>
                </div>
                <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 99, height: 6, overflow: "hidden" }}>
                  <div style={{
                    width: `${freshness * 100}%`, height: "100%", borderRadius: 99, background: fColor,
                  }} />
                </div>
              </div>

              {/* Effects */}
              <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
                {[
                  { emoji: "⚡", label: "انرژی",    val: food.effects.energy    + (brandMod?.effectBonus?.energy    ?? 0), color: "#fbbf24" },
                  { emoji: "😊", label: "خوشحالی",  val: food.effects.happiness + (brandMod?.effectBonus?.happiness ?? 0), color: "#a78bfa" },
                  { emoji: "❤️", label: "سلامت",    val: food.effects.health    + (brandMod?.effectBonus?.health    ?? 0), color: "#f43f5e" },
                ].map((stat) => (
                  <div key={stat.label} style={{
                    flex: 1, borderRadius: 12, padding: "8px 10px", textAlign: "center",
                    background: `${stat.color}10`, border: `1px solid ${stat.color}22`,
                  }}>
                    <div style={{ fontSize: 18 }}>{stat.emoji}</div>
                    <div style={{ fontSize: 13, fontWeight: 900, color: stat.color }}>
                      +{toPersian(stat.val)}
                    </div>
                    <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)" }}>{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Spoiled warning */}
              {slot.spoiled && (
                <div style={{
                  borderRadius: 12, padding: "10px 14px", marginBottom: 14,
                  background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)",
                }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#f87171", marginBottom: 4 }}>
                    ⚠️ این غذا فاسد شده
                  </div>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)" }}>
                    اگه بخوری: ❤️{toPersian(food.spoiledPenalty?.health ?? -12)}
                    {" "}⚡{toPersian(food.spoiledPenalty?.energy ?? -8)}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={() => handleEat(index)} style={{
                  flex: 2, padding: "13px 0", borderRadius: 14,
                  cursor: "pointer", fontFamily: "inherit", fontSize: 14, fontWeight: 800,
                  background: slot.spoiled
                    ? "rgba(239,68,68,0.2)"
                    : "linear-gradient(135deg, rgba(34,197,94,0.3), rgba(34,197,94,0.15))",
                  color: slot.spoiled ? "#f87171" : "#4ade80",
                  border: `1px solid ${slot.spoiled ? "rgba(239,68,68,0.35)" : "rgba(34,197,94,0.4)"}`,
                }}>
                  {slot.spoiled ? "⚠️ بخور (با ریسک)" : "🍽️ بخور"}
                </button>
                <button onClick={() => handleTrash(index)} style={{
                  flex: 1, padding: "13px 0", borderRadius: 14,
                  cursor: "pointer", fontFamily: "inherit", fontSize: 14, fontWeight: 800,
                  background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.4)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}>🗑️</button>
              </div>
            </div>
          </>
        );
      })()}

      {/* ══ Toast ══ */}
      {toast && (
        <div style={{
          position: "fixed", bottom: 90, left: "50%", transform: "translateX(-50%)",
          padding: "10px 20px", borderRadius: 20,
          background: "rgba(10,14,30,0.95)",
          border: `1px solid ${toast.color ?? "#4ade80"}44`,
          color: toast.color ?? "#4ade80",
          fontSize: 12, fontWeight: 800, zIndex: 300,
          whiteSpace: "nowrap", backdropFilter: "blur(10px)",
          boxShadow: `0 4px 20px ${toast.color ?? "#4ade80"}22`,
        }}>{toast.msg}</div>
      )}

      <BottomNav />
    </div>
  );
}
