# Jabolgha — سیستم اقتصاد زندگی (Commerce System)

> آخرین بروزرسانی: مارچ ۲۰۲۶
> هدف: یکپارچه‌سازی همه خریدها در یک مدل واحد با دو کانال آنلاین و فیزیکی

---

## چرا این سیستم؟

قبل از این سیستم، هر بخش خرید مستقل بود:
- `buyFood()` در gameStore
- `buyFromMarket()` در gameStore
- `buyRoomItem()` در gameStore

این سیستم همه را در یک مدل واحد با منطق vendor مشترک یکپارچه می‌کند.

---

## معماری ۳ لایه

```
Data Layer
  vendors.ts       ← ۴ vendor با قیمت‌گذاری و تحویل
  purchasables.ts  ← مدل یکپارچه + adapter از سیستم‌های قدیمی

Engine Layer
  purchaseEngine.ts ← منطق pure — quote + validation

Store Layer
  gameStore.ts     ← purchaseItem() + pendingDeliveries
```

---

## لایه ۱ — Vendorها (`src/data/vendors.ts`)

### تعریف Vendor

```typescript
interface VendorDefinition {
  id: VendorId;
  nameFa: string;
  descriptionFa: string;
  emoji: string;
  channelType: "online" | "physical";
  deliveryDays?: number;        // آنلاین: تأخیر تحویل
  energyCostToVisit?: number;   // فیزیکی: هزینه انرژی
  priceMultiplier: number;      // ضریب قیمت
  accentColor: string;
  categories: string[];
}
```

### ۴ Vendor فعال

| VendorId | نام | نوع | قیمت | تأخیر | انرژی |
|---------|-----|-----|------|-------|-------|
| `online_store` | دیجی‌مال | آنلاین | ×1.05 | ۲ روز | 0 |
| `food_delivery` | سفارش غذا | آنلاین | ×1.20 | همان روز | 0 |
| `jomeh_bazaar` | جمعه‌بازار | فیزیکی | ×0.80 | فوری | 15 |
| `ride_service` | تاکسی | آنلاین | ×1.00 | فوری | 0 |

### تصمیم اقتصادی — آنلاین vs جمعه‌بازار

```
آیتم با قیمت base 5,000,000 ت:

online_store  → 5,250,000 ت + ۲ روز انتظار
jomeh_bazaar  → 4,000,000 ت + ۱۵ انرژی فوری

صرفه‌جویی: 1,250,000 ت
هزینه: ۱۵ انرژی
```

---

## لایه ۲ — Purchasables (`src/data/purchasables.ts`)

### مدل یکپارچه

```typescript
interface PurchasableItem {
  id: string;                     // "room_ergonomic_chair", "food_pizza", "market_fridge"
  nameFa: string;
  descriptionFa: string;
  emoji: string;
  category: PurchasableCategory;
  basePrice: number;
  requiredLevel?: number;
  effects: UnifiedEffects;        // همه اثرات در یک interface
  sourceSystem: "room" | "market" | "food" | "transport";
  availableAt: VendorId[];        // کدام vendorها این آیتم را دارند
  isSponsored?: boolean;
}

interface UnifiedEffects {
  // فوری (غذا)
  energy?: number;
  happiness?: number;
  health?: number;
  // روزانه (اتاق)
  workIncomeMultiplier?: number;
  learningSpeedMultiplier?: number;
  dailyEnergyBonus?: number;
  dailyHappinessBonus?: number;
  // دارایی
  resaleValue?: number;
}
```

### Adapterها

```typescript
mapRoomItemsToPurchasables()     → id: "room_{itemId}"
mapMarketItemsToPurchasables()   → id: "market_{itemId}"
mapFoodCatalogToPurchasables()   → id: "food_{foodId}"

getAllPurchasables()              → همه (lazy-cached)
getPurchasablesForVendor(vendorId) → فیلتر بر اساس availableAt
findPurchasable(id)              → جستجو
```

---

## لایه ۳ — Purchase Engine (`src/game/purchase/purchaseEngine.ts`)

### محاسبه Quote

```typescript
function getPurchaseQuote(
  item: PurchasableItem,
  vendorId: VendorId,
  context: PurchaseContext,    // { playerLevel, playerMoney, playerEnergy, ownedItemIds, currentDay }
): PurchaseQuote {
  finalPrice = Math.round(item.basePrice × vendor.priceMultiplier)
  energyCost = vendor.channelType === "physical" ? vendor.energyCostToVisit : 0
  deliveryDays = vendor.deliveryDays ?? 0
  deliveryDay = deliveryDays > 0 ? currentDay + deliveryDays : null
  isImmediate = deliveryDays === 0
}
```

### اعتبارسنجی

```typescript
function validatePurchase(item, quote, context): ValidationResult {
  // ۱. از قبل خریداری شده (برای non-food)
  // ۲. level requirement
  // ۳. موجودی کافی
  // ۴. انرژی کافی برای vendor فیزیکی
  // ۵. vendor این آیتم را دارد
}
```

---

## لایه ۴ — اعمال در gameStore

### `purchaseItem(purchasableId, vendorId)`

```
اعتبارسنجی → quote → validation

اگر isImmediate:
  food → add to fridge
  room → roomItems.push(rawId)
  market → inventory.push(rawId)

اگر delivery:
  pendingDeliveries.push({ deliverOnDay: currentDay + deliveryDays, ... })

در هر دو حالت:
  bank.checking -= quote.finalPrice
  player.energy -= quote.energyCost (اگر فیزیکی)
```

### تحویل در `startNextDay()`

```
pendingDeliveries.filter(d => currentDay >= d.deliverOnDay)
  → room prefix: roomItems.push(rawId)
  → market prefix: inventory.push(rawId)
  → stillPending: سفارشات باقی‌مانده
```

---

## UI — کامپوننت‌ها

### `CommerceItemCard` — کارت مشترک

**State‌ها:**
| State | نمایش |
|-------|-------|
| owned | سبز + ✓ خریداری شده |
| isPending | 📦 در راه است |
| isLocked | 🔒 نیاز به سطح X |
| !canAfford | پول کافی نیست (disabled) |
| !hasEnergy | انرژی کم (disabled) |
| آماده | دکمه خرید فعال |

**Effect Badges:**
- +N٪ درآمد (سبز) — workIncomeMultiplier
- +N٪ یادگیری (آبی) — learningSpeedMultiplier
- +N انرژی/روز (آبی‌فیروزه‌ای)
- +N شادی/روز (بنفش)
- ⚡+N، 😊+N، ❤️+N — اثرات فوری غذا

---

### `PhoneCommerceSheet` — 📱 گوشی

**۳ تب:**
1. 🍔 سفارش غذا → vendor: `food_delivery` (+20٪، همان روز)
2. 📦 فروشگاه → vendor: `online_store` (+5٪، ۲ روز)
3. 🚕 تاکسی → placeholder ("به‌زودی")

**ورودی از home:** دکمه 📱 گوشی در بخش "🛒 خرید و سفارش" QuickLinks

---

### `JomehBazaarSheet` — 🧺 جمعه‌بازار

- تم سبز (`#a3e635`)
- نمایش انرژی فعلی + بار رفت
- نمایش صرفه‌جویی ۲۰٪
- دسته‌بندی: همه / اتاق / الکترونیک / لوازم / غذا
- vendor: `jomeh_bazaar`

---

### `VendorStoreSheet` — vendor عمومی

Sheet reusable برای هر `VendorId`. دریافت می‌کند:
- `vendorId` → همه تنظیمات از VENDORS[vendorId]
- `isOpen` / `onClose`
- category filter اتوماتیک از آیتم‌های vendor

---

## Game Economy HUD — Economy Row

سومین ردیف GameHUD که وضعیت اقتصادی را نمایش می‌دهد:

```
📈 +۳م/شیفت  ·  💸 -۶۵۰ت/روز  ·  📦 ۲  [😊 زندگی خوب]
```

### محاسبات:

```typescript
// درآمد per shift
baseIncome = job?.salary / 22 ?? WORK_INCOME_BASE.full_shift
incomePerShift = baseIncome × getRoomBuffs(roomItems).workIncomeMultiplier

// هزینه روزانه
dailyCost = calculateWeeklyBills(living.*).total / 7

// وضعیت زندگی
avg = (energy + happiness + health) / 3
avg >= 68 → 😊 زندگی خوب
avg >= 42 → 😐 متوسط
avg < 42  → 😵 اوضاع خراب
```

---

## یکپارچگی با سیستم‌های قدیمی

| سیستم قدیمی | جدید | رابطه |
|------------|------|-------|
| `buyFood(foodId)` | `purchaseItem("food_" + foodId, "food_delivery")` | جایگزین |
| `buyRoomItem(itemId)` | `purchaseItem("room_" + itemId, "online_store")` | جایگزین |
| `buyFromMarket(itemId)` | `purchaseItem("market_" + itemId, "jomeh_bazaar")` | جایگزین |

> **نکته:** توابع قدیمی هنوز در gameStore هستند و کار می‌کنند. سیستم جدید از بالا به پایین اضافه شده، نه جایگزین. هر دو می‌توانند همزمان استفاده شوند.

---

## نقشه آینده

| ویژگی | وضعیت |
|-------|--------|
| online_store + food_delivery | ✅ کامل |
| jomeh_bazaar | ✅ کامل |
| ride_service | 🔜 placeholder |
| اعلان رسیدن سفارش | 🔜 toast در startNextDay |
| تاریخچه خریدها | 🔜 |
| فروشگاه‌های اسپانسری با نام واقعی | 🔜 brand skin سیستم |
