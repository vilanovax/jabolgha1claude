// ─── Leisure Activities (یه کاری کن) ─────────────────

export interface LeisureActivity {
  id: string;
  name: string;
  emoji: string;
  description: string;
  // What the player needs to have for this activity
  requires?: {
    inventoryAny?: string[];    // needs at least one of these inventory items
    hasFridgeFood?: boolean;    // needs food in fridge
  };
  effects: {
    energy?: number;
    happiness?: number;
    health?: number;
  };
  timeCost: number;   // minutes
}

// Items that can be suggested for purchase
export interface LeisureSuggestion {
  activityId: string;
  itemId: string;       // marketplace item to buy
  message: string;      // Persian suggestion text
}

export const LEISURE_ACTIVITIES: LeisureActivity[] = [
  // ── No requirement ──
  {
    id: "stretch",
    name: "کشش و نرمش",
    emoji: "🧘",
    description: "یه حرکات کششی ساده",
    effects: { energy: 5, happiness: 3, health: 3 },
    timeCost: 10,
  },
  {
    id: "daydream",
    name: "خیال‌پردازی",
    emoji: "💭",
    description: "یه کم به آینده فکر کن",
    effects: { happiness: 5 },
    timeCost: 15,
  },
  {
    id: "walk_around",
    name: "قدم زدن تو خونه",
    emoji: "🚶",
    description: "یه دوری توی خونه بزن",
    effects: { energy: 3, happiness: 2 },
    timeCost: 5,
  },

  // ── Needs phone ──
  {
    id: "social_media",
    name: "چک کردن اینستاگرام",
    emoji: "📲",
    description: "یه نگاهی به فید بنداز",
    requires: { inventoryAny: ["phone_basic", "phone_samsung", "phone_iphone"] },
    effects: { happiness: 6, energy: -3 },
    timeCost: 20,
  },
  {
    id: "listen_music",
    name: "گوش دادن موزیک",
    emoji: "🎵",
    description: "یه آهنگ خوب بذار",
    requires: { inventoryAny: ["phone_basic", "phone_samsung", "phone_iphone"] },
    effects: { happiness: 8, energy: 3 },
    timeCost: 15,
  },
  {
    id: "podcast",
    name: "گوش دادن پادکست",
    emoji: "🎙️",
    description: "یه پادکست جالب",
    requires: { inventoryAny: ["phone_basic", "phone_samsung", "phone_iphone"] },
    effects: { happiness: 5, energy: 2 },
    timeCost: 30,
  },

  // ── Needs TV/console ──
  {
    id: "watch_tv",
    name: "تماشای تلویزیون",
    emoji: "📺",
    description: "یه برنامه جالب ببین",
    requires: { inventoryAny: ["console_ps5", "laptop_basic", "laptop_macbook"] },
    effects: { happiness: 10, energy: 5 },
    timeCost: 30,
  },
  {
    id: "watch_series",
    name: "سریال دیدن",
    emoji: "🎬",
    description: "یه قسمت از سریالت ببین",
    requires: { inventoryAny: ["console_ps5", "laptop_basic", "laptop_macbook", "phone_samsung", "phone_iphone"] },
    effects: { happiness: 12, energy: 3 },
    timeCost: 45,
  },

  // ── Needs console ──
  {
    id: "play_game",
    name: "بازی کردن",
    emoji: "🎮",
    description: "یه دست بازی بزن",
    requires: { inventoryAny: ["console_ps5"] },
    effects: { happiness: 15, energy: -5 },
    timeCost: 60,
  },

  // ── Needs laptop ──
  {
    id: "browse_web",
    name: "گشت زدن اینترنت",
    emoji: "🌐",
    description: "یه سری به سایت‌ها بزن",
    requires: { inventoryAny: ["laptop_basic", "laptop_macbook"] },
    effects: { happiness: 4, energy: -2 },
    timeCost: 20,
  },
  {
    id: "watch_youtube",
    name: "یوتیوب دیدن",
    emoji: "▶️",
    description: "ویدیوهای جالب ببین",
    requires: { inventoryAny: ["laptop_basic", "laptop_macbook", "phone_samsung", "phone_iphone"] },
    effects: { happiness: 8, energy: 2 },
    timeCost: 25,
  },

  // ── Needs food in fridge ──
  {
    id: "eat_snack",
    name: "یه میون‌وعده بخور",
    emoji: "🍪",
    description: "یه چیزی از یخچال بردار",
    requires: { hasFridgeFood: true },
    effects: { happiness: 6, energy: 8 },
    timeCost: 5,
  },
  {
    id: "cook_meal",
    name: "یه غذا درست کن",
    emoji: "🍳",
    description: "با مواد یخچال آشپزی کن",
    requires: { hasFridgeFood: true },
    effects: { happiness: 10, energy: 15, health: 5 },
    timeCost: 40,
  },

  // ── Needs sofa/bed (furniture) ──
  {
    id: "couch_nap",
    name: "چرت روی مبل",
    emoji: "😴",
    description: "یه چرت کوتاه بزن",
    requires: { inventoryAny: ["sofa_basic", "sofa_luxury"] },
    effects: { energy: 15, happiness: 4 },
    timeCost: 20,
  },
  {
    id: "read_on_sofa",
    name: "مطالعه روی مبل",
    emoji: "📖",
    description: "یه کتاب بردار و بشین",
    requires: { inventoryAny: ["sofa_basic", "sofa_luxury"] },
    effects: { happiness: 7, energy: 2 },
    timeCost: 30,
  },
];

/** Get purchase suggestions for activities the player CAN'T do */
export function getLeisureSuggestions(inventory: string[]): LeisureSuggestion[] {
  const suggestions: LeisureSuggestion[] = [];
  const seen = new Set<string>();

  for (const activity of LEISURE_ACTIVITIES) {
    if (!activity.requires?.inventoryAny) continue;
    const hasAny = activity.requires.inventoryAny.some((id) => inventory.includes(id));
    if (hasAny) continue;

    // Suggest the cheapest item that unlocks this activity
    const cheapestItem = activity.requires.inventoryAny[0]; // first is cheapest
    if (seen.has(cheapestItem)) continue;
    seen.add(cheapestItem);

    suggestions.push({
      activityId: activity.id,
      itemId: cheapestItem,
      message: `برای «${activity.name}» نیاز به خرید داری`,
    });
  }

  return suggestions.slice(0, 3); // max 3 suggestions
}
