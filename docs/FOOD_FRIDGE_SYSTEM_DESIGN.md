# سیستم غذا و یخچال — جابغا

> آخرین بروزرسانی: مارچ ۲۰۲۶
> وضعیت: ✅ پیاده‌سازی کامل — شامل hunger، combo، brand modifier، spoilage، delivery

---

## ۱. ساختار داده

### `FoodItem` — `src/data/fridgeData.ts`

```ts
interface FoodItem {
  id: string;
  name: string;
  emoji: string;
  category: "dairy" | "protein" | "grain" | "fruit" | "snack" | "drink";
  categoryLabel: string;
  baseShelfLife: number;       // روزهای ماندگاری در یخچال ساده (بدون بونوس)
  price: number;
  quality: FoodQuality;        // "economy" | "standard" | "premium"
  effects: {
    energy: number;
    happiness: number;
    health: number;
  };
  spoiledPenalty?: {           // اثر منفی اگر فاسد خورده شود
    energy: number;
    health: number;
    happiness: number;
  };
  isSponsored: boolean;
  brand?: string;              // کلید lookup در BRAND_MODIFIERS
  brandEmoji?: string;
}

type FoodQuality = "economy" | "standard" | "premium";
```

**کیفیت غذا — نمایش در UI:**
| کیفیت | رنگ badge | مثال |
|-------|-----------|------|
| economy | خاکستری | تخم‌مرغ کارخانه، دوغ، چیپس |
| standard | (بدون badge) | مرغ، ماست، برنج |
| premium | طلایی ✦ | کباب، ماهی، پنیر کاله |

---

### `FridgeSlot` — `src/data/fridgeData.ts`

```ts
interface FridgeSlot {
  foodId: string;
  addedOnDay: number;
  expiresOnDay: number;
  spoiled?: boolean;    // true = فاسد شده؛ قابل خوردن با جریمه یا دور ریختن
}
```

**محاسبه `expiresOnDay` هنگام خرید:**
```
expiresOnDay = addedOnDay
             + food.baseShelfLife
             + tier.shelfLifeBonus
             + (tier.smartFeatures includes "shelf_life_boost" ? 1 : 0)
             + (BRAND_MODIFIERS[brand]?.shelfLifeBonus ?? 0)
```

---

### `FridgeTier` — `src/data/fridgeData.ts`

```ts
interface FridgeTier {
  id: string;
  name: string;
  emoji: string;
  slots: number;
  shelfLifeBonus: number;
  price: number;
  resaleValue: number;
  requiredLevel: number;
  description: string;
  smartFeatures?: SmartFeature[];
  isSponsored?: boolean;
  brand?: string;
}

type SmartFeature =
  | "expiry_sort"        // مرتب‌سازی خودکار بر اساس انقضا در UI
  | "expiry_warning"     // بنر هشدار وقتی آیتم ≤۱ روز مانده
  | "grocery_suggest"    // پیشنهاد خرید بر اساس موجودی
  | "shelf_life_boost"   // +۱ روز اضافه روی همه آیتم‌ها
  | "waste_reduction";   // جریمه waste/spoil نصف می‌شود
```

**جدول تایرها:**

| ID | نام | جا | shelf+ | قیمت | SmartFeatures |
|----|-----|-----|--------|------|---------------|
| basic | یخچال ساده ❄️ | 4 | 0 | رایگان | — |
| medium | یخچال خانوادگی 🧊 | 8 | +1 | 5M | expiry_sort |
| premium | یخچال ساید 🏔️ | 12 | +2 | 15M | sort · warning |
| smart | یخچال هوشمند 🤖 | 16 | +3 | 35M | sort · warning · suggest |
| lg ✦ | یخچال LG | 18 | +3 | 42M | sort · warning · suggest |
| samsung ✦ | یخچال سامسونگ | 20 | +4 | 50M | sort · warning · suggest · boost |
| bosch ✦ | یخچال بوش | 24 | +5 | 65M | همه ۵ feature |

---

## ۲. سیستم Brand Modifiers — `src/data/brandModifiers.ts`

```ts
interface BrandModifier {
  shelfLifeBonus?: number;           // روز اضافه به expiresOnDay
  effectBonus?: {                    // اضافه به اثرات هنگام خوردن
    energy?: number;
    happiness?: number;
    health?: number;
  };
  priceDiscount?: number;            // 0.95 = ۵٪ تخفیف سوپرمارکت
  deliveryDiscount?: number;         // 0.85 = ۱۵٪ تخفیف delivery
  comboBonus?: number;               // ضریب روی bonus کومبو
  tagFa?: string;                    // متن توضیح در UI
}

const BRAND_MODIFIERS: Record<string, BrandModifier> = {
  "کاله":    { shelfLifeBonus: 1, effectBonus: { health: 2 }, comboBonus: 1.1 },
  "رامک":    { shelfLifeBonus: 1, effectBonus: { energy: 2 } },
  "پاک":     { effectBonus: { happiness: 3 }, priceDiscount: 0.95 },
  "حریری":   { shelfLifeBonus: 5 },
  "اسنپ‌فود": { deliveryDiscount: 0.85 },
  "دیجیکالا": { priceDiscount: 0.92 },
};
```

**اعمال در store:**
- `buyFood()` → `finalPrice = price × brandMod.priceDiscount`
- `buyFood()` → `expiresOnDay += brandMod.shelfLifeBonus`
- `eatFood()` → `effects += brandMod.effectBonus`
- `eatFood()` → `comboBonus *= brandMod.comboBonus`

---

## ۳. سیستم Combo — `src/data/foodCombos.ts`

```ts
interface FoodCombo {
  id: string;
  labelFa: string;
  descFa: string;
  emoji: string;
  requiredItems: string[];   // foodId[] — همه باید در یک session خورده شوند
  bonus: {
    energy?: number;
    happiness?: number;
    health?: number;
  };
}
```

**۹ کومبو فعال:**

| کومبو | آیتم‌ها | bonus |
|-------|---------|-------|
| مرغ و برنج 🍗🍚 | chicken + rice | ⚡+10 ❤️+5 |
| تخم‌مرغ و نان 🍳🍞 | egg_local + bread_sangak | ⚡+8 😊+3 |
| ماهی و سالاد 🐟🥗 | fish + salad | ❤️+12 😊+5 |
| پنیر کاله و نان 🧀🍞 | cheese_kaleh + bread_sangak | ⚡+5 😊+8 |
| ماست و میوه 🫙🍎 | yogurt_kaleh + apple | ❤️+6 😊+4 |
| برنج و سالاد 🍚🥗 | rice + salad | ⚡+5 ❤️+8 |
| قهوه و شکلات ☕🍫 | coffee + chocolate | ⚡+12 😊+6 |
| شیر و بیسکویت 🥛🍪 | milk_ramak + cookie_hariri | 😊+8 ⚡+3 |
| تخم‌مرغ ارزان + نان تست 🥚🍞 | egg_factory + bread_toast | ⚡+5 😊+2 |

**الگوریتم تشخیص:**
```ts
function detectCombo(newlyEatenId: string, mealHistory: string[]): FoodCombo | null {
  const allEaten = [...mealHistory, newlyEatenId];
  for (const combo of FOOD_COMBOS) {
    if (combo.requiredItems.every(id => allEaten.includes(id))) return combo;
  }
  return null;
}
```

`mealHistory` = `player.currentMealHistory` — در `startNextDay` reset می‌شود.

---

## ۴. سیستم Hunger (گرسنگی روزانه)

### state روی `player`:
```ts
mealsToday: {
  breakfast: boolean;
  lunch: boolean;
  dinner: boolean;
  snackCount: number;   // max 3
}
currentMealHistory: string[];  // foodIds خورده‌شده — برای combo detection
```

### ردیابی وعده در `eatFood()`:
```
اول خوردن → breakfast = true
دوم خوردن → lunch = true
سوم خوردن → dinner = true
بعدی‌ها   → snackCount++ (max 3)
```

### جریمه در `startNextDay()`:
```
mealsEaten = breakfast + lunch + dinner + min(snackCount, 2)

mealsEaten = 0  → energy -25، health -8
mealsEaten = 1  → energy -12، health -3
mealsEaten = 2  → energy -5
mealsEaten ≥ 3  → health +2 (بونوس)

سپس: mealsToday reset + currentMealHistory = []
```

### نمایش در UI:
```
وعده‌های امروز: ☀️✓  🌤️✓  🌙·
(سه آیکون در hero card یخچال + هوم اسکرین)
```

---

## ۵. الگوریتم Spoilage (فساد غذا)

### وضعیت‌های freshness:

```ts
function getFreshness(slot: FridgeSlot, food: FoodItem, day: number): number {
  if (slot.spoiled) return 0;
  return Math.max(0, Math.min(1, (slot.expiresOnDay - day) / food.baseShelfLife));
}

function freshnessColor(freshness: number, spoiled: boolean): string {
  if (spoiled || freshness <= 0) return "#ef4444"; // قرمز
  if (freshness < 0.25)          return "#f97316"; // نارنجی
  if (freshness < 0.5)           return "#f59e0b"; // زرد
  return "#4ade80";                                 // سبز
}
```

### چرخه spoilage:

```
روز خرید
  ↓  (addedOnDay + shelfLife + bonuses)
expiresOnDay رسید
  ↓  (startNextDay یا clearExpiredItems)
slot.spoiled = true   ← دیگر حذف نمی‌شود
  ↓  بازیکن انتخاب می‌کند:
  ├─ بخور ⚠️ → spoiledPenalty اعمال (health -12, energy -8, ...)
  └─ دور بینداز 🗑️ → حذف + happiness -2 (یا -1 با waste_reduction)
```

### `clearExpiredItems()`:
- آیتم‌های منقضی را **مارک spoiled** می‌کند (حذف نمی‌کند)
- اسامی را برای بنر UI برمی‌گرداند
- جریمه happiness اعمال می‌کند

### `startNextDay()`:
- همه اسلات‌هایی که `dayInGame > expiresOnDay` → `spoiled = true`
- فقط آیتم‌های **تازه فاسد‌شده** جریمه می‌خورند (نه قبلی‌ها)

---

## ۶. کانال‌های خرید

### سوپرمارکت 🛒 (grocery):
- قیمت پایه × brandMod.priceDiscount × cityFoodPriceMultiplier
- آیتم در یخچال ذخیره می‌شود
- نیاز به slot خالی دارد
- expiresOnDay کامل محاسبه می‌شود

### تحویل اسنپ‌فود 🛵 (delivery):
- قیمت × 1.35 (گران‌تر) + brandMod.deliveryDiscount
- فوری مصرف می‌شود — بدون slot در یخچال
- حتی اگر یخچال پر باشد قابل استفاده است
- expiresOnDay ندارد

```ts
// در فریج page — دکمه تحویل
[🛒 بخر]         ← به یخچال اضافه
[🛵 {قیمت}]      ← فوری مصرف (×1.35)
```

---

## ۷. Smart Fridge Features

| Feature | رفتار در UI | تایر اول |
|---------|------------|----------|
| `expiry_sort` | آیتم‌های نزدیک‌تر به انقضا ابتدا نمایش داده می‌شوند | medium |
| `expiry_warning` | بنر نارنجی: "X فردا خراب می‌شه — همین الان بخور!" | premium |
| `grocery_suggest` | بنر آبی: "یخچال هوشمند پیشنهاد می‌ده: ..." | smart |
| `shelf_life_boost` | +۱ روز به `expiresOnDay` همه آیتم‌ها در buyFood | samsung |
| `waste_reduction` | جریمه waste/spoil × 0.5 | bosch |

---

## ۸. جریان `eatFood()` کامل

```
eatFood(slotIndex)
  │
  ├─ slot.spoiled?
  │     ├─ بله → اعمال spoiledPenalty → حذف slot → return { spoiled: true }
  │
  ├─ محاسبه finalEffects:
  │     effects.energy    + brandMod.effectBonus.energy
  │     effects.happiness + brandMod.effectBonus.happiness
  │     effects.health    + brandMod.effectBonus.health
  │
  ├─ اعمال به player
  │
  ├─ track mealsToday:
  │     breakfast → lunch → dinner → snackCount++
  │
  ├─ detectCombo(food.id, currentMealHistory):
  │     اگر کومبو پیدا شد → bonus × brandMod.comboBonus → اعمال
  │
  ├─ currentMealHistory = [...history, food.id]
  │
  └─ return { effects, mealType, combo? }
```

---

## ۹. کاتالوگ غذا (۲۴ آیتم)

### لبنیات (Dairy)
| ID | نام | قیمت | عمر | کیفیت | برند |
|----|-----|------|-----|-------|------|
| egg_local | تخم‌مرغ محلی | 60K | 5 | standard | — |
| egg_factory | تخم‌مرغ کارخانه | 38K | 4 | economy | — |
| milk_ramak | شیر رامک | 80K | 3 | standard | رامک |
| cheese_kaleh | پنیر کاله | 150K | 7 | premium | کاله |
| yogurt_kaleh | ماست کاله | 70K | 4 | standard | کاله |

### پروتئین
| ID | نام | قیمت | عمر | کیفیت |
|----|-----|------|-----|-------|
| chicken | مرغ | 250K | 2 | standard |
| kebab | کباب کوبیده | 350K | 1 | premium |
| fish | ماهی قزل‌آلا | 400K | 2 | premium |
| sausage | سوسیس | 90K | 5 | economy |

### غلات
| ID | نام | قیمت | عمر | کیفیت |
|----|-----|------|-----|-------|
| bread_sangak | نان سنگک | 40K | 1 | standard |
| rice | برنج پخته | 100K | 2 | standard |
| bread_toast | نان تست | 25K | 4 | economy |

### میوه و سبزی
| ID | نام | قیمت | عمر | کیفیت |
|----|-----|------|-----|-------|
| salad | سالاد آماده | 120K | 2 | standard |
| apple | سیب | 50K | 6 | standard |
| banana | موز | 80K | 3 | standard |

### تنقلات (Snack)
| ID | نام | قیمت | عمر | برند |
|----|-----|------|-----|------|
| chocolate | شکلات | 60K | 30 | — |
| cookie_hariri | بیسکویت حریری | 45K | 20 | حریری |
| chips | چیپس | 35K | 25 | — |

### نوشیدنی
| ID | نام | قیمت | عمر | برند |
|----|-----|------|-----|------|
| juice_pak | آب میوه پاک | 90K | 5 | پاک |
| doogh | دوغ | 35K | 4 | — |
| coffee | قهوه فوری | 55K | 60 | — |

---

## ۱۰. UI — صفحه یخچال (`/fridge`)

### ساختار کلی:
```
Hero Card:
  └─ نام یخچال · X/Y جا · نوار ظرفیت
  └─ وعده‌های امروز: ☀️✓ 🌤️· 🌙·

Smart Banners (conditional):
  └─ ⏰ هشدار انقضا (expiry_warning)
  └─ 🗑️ آیتم‌های فاسد شده
  └─ 💡 پیشنهاد خرید (grocery_suggest)

Tab Bar: ❄️ یخچال | 🛒 سوپرمارکت | ⬆️ ارتقا

Tab یخچال:
  └─ کارت‌ها sort‌شده (expiry_sort)
  └─ نوار freshness رنگی (سبز/زرد/نارنجی/قرمز)
  └─ 💀 badge روی فاسد‌ها
  └─ bottom sheet با eat/trash

Tab سوپرمارکت:
  └─ فیلتر دسته
  └─ [🛒 بخر] + [🛵 قیمت delivery]
  └─ badge برند، quality، shelf life
  └─ بخش کومبوهای فعال

Tab ارتقا:
  └─ مقایسه تایرها با SmartFeature badges
```

### Bottom Sheet جزئیات غذا:
```
[emoji] [نام] [quality badge] [brand badge]
نوار freshness + روزهای باقی‌مانده
آمار: ⚡ · 😊 · ❤️ (با brand bonus)
⚠️ هشدار فاسد (اگه spoiled)
[🍽️ بخور]  [🗑️ دور بینداز]
```

---

## ۱۱. یکپارچگی با سایر سیستم‌ها

| یکپارچگی | نحوه |
|---------|------|
| City Economy | `buyFood` × `cityModifiers.foodPriceMultiplier` |
| Hunger → Energy | `startNextDay` جریمه energy/health |
| Combo → Stats | `eatFood` → `detectCombo()` → bonus immediate |
| Brand → Shelf | `buyFood` → `expiresOnDay += brandMod.shelfLifeBonus` |
| Brand → Effects | `eatFood` → `finalEffects += brandMod.effectBonus` |
| Smart Fridge | tier.smartFeatures → UI/behavior در page.tsx |
| Waste Reduction | tier.smartFeatures.includes("waste_reduction") → penalty × 0.5 |

---

## ۱۲. توسعه‌های آینده

| ایده | پیچیدگی | اولویت |
|------|---------|--------|
| Quantity خرید (خرید عمده) | کم | متوسط |
| Cooking Recipes | متوسط | متوسط |
| Delivery تأخیری (N روز) | متوسط | متوسط |
| Food notification در home screen | کم | بالا |
| Hunger bar بصری در HUD | کم | بالا |
| آیتم فاسد = penalty health passive | کم | متوسط |
