// ─── Housing, Vehicle & Weekly Bills System ───────────

// ─── Housing Tiers ────────────────────────────────────

export interface HousingTier {
  id: string;
  name: string;
  emoji: string;
  location: string;        // محله
  area: number;            // متراژ (m²)
  monthlyRent: number;     // اجاره ماهانه (0 = ملکی)
  purchasePrice: number;   // قیمت خرید (0 = فقط اجاره)
  resaleValue: number;
  happinessBonus: number;
  energyBonus: number;
  requiredLevel: number;
  bills: {
    electricity: number;   // برق هفتگی
    gas: number;           // گاز هفتگی
    water: number;         // آب هفتگی
    internet: number;      // اینترنت هفتگی
    maintenance: number;   // شارژ ساختمان هفتگی
  };
}

export const HOUSING_TIERS: HousingTier[] = [
  {
    id: "studio",
    name: "سوئیت کوچک",
    emoji: "🏠",
    location: "حومه شهر",
    area: 35,
    monthlyRent: 8_000_000,
    purchasePrice: 0,
    resaleValue: 0,
    happinessBonus: 5,
    energyBonus: 50,
    requiredLevel: 1,
    bills: {
      electricity: 200_000,
      gas: 150_000,
      water: 80_000,
      internet: 250_000,
      maintenance: 100_000,
    },
  },
  {
    id: "apartment_basic",
    name: "آپارتمان معمولی",
    emoji: "🏢",
    location: "شرق تهران",
    area: 65,
    monthlyRent: 15_000_000,
    purchasePrice: 3_000_000_000,
    resaleValue: 2_700_000_000,
    happinessBonus: 15,
    energyBonus: 60,
    requiredLevel: 3,
    bills: {
      electricity: 350_000,
      gas: 250_000,
      water: 120_000,
      internet: 350_000,
      maintenance: 300_000,
    },
  },
  {
    id: "apartment_mid",
    name: "آپارتمان نوساز",
    emoji: "🏙️",
    location: "غرب تهران",
    area: 90,
    monthlyRent: 25_000_000,
    purchasePrice: 6_000_000_000,
    resaleValue: 5_400_000_000,
    happinessBonus: 25,
    energyBonus: 70,
    requiredLevel: 5,
    bills: {
      electricity: 500_000,
      gas: 350_000,
      water: 150_000,
      internet: 500_000,
      maintenance: 600_000,
    },
  },
  {
    id: "penthouse",
    name: "پنت‌هاوس",
    emoji: "🌇",
    location: "شمال تهران",
    area: 150,
    monthlyRent: 50_000_000,
    purchasePrice: 15_000_000_000,
    resaleValue: 13_500_000_000,
    happinessBonus: 40,
    energyBonus: 85,
    requiredLevel: 8,
    bills: {
      electricity: 800_000,
      gas: 500_000,
      water: 200_000,
      internet: 700_000,
      maintenance: 1_500_000,
    },
  },
  {
    id: "villa",
    name: "ویلا",
    emoji: "🏡",
    location: "لواسان",
    area: 250,
    monthlyRent: 0,
    purchasePrice: 30_000_000_000,
    resaleValue: 27_000_000_000,
    happinessBonus: 50,
    energyBonus: 95,
    requiredLevel: 10,
    bills: {
      electricity: 1_200_000,
      gas: 800_000,
      water: 300_000,
      internet: 700_000,
      maintenance: 2_000_000,
    },
  },
];

// ─── Vehicle Tiers ────────────────────────────────────

export interface VehicleTier {
  id: string;
  name: string;
  emoji: string;
  purchasePrice: number;
  resaleValue: number;
  weeklyFuelCost: number;     // هزینه بنزین هفتگی
  weeklyInsurance: number;    // بیمه هفتگی
  happinessBonus: number;
  requiredLevel: number;
}

export const VEHICLE_TIERS: VehicleTier[] = [
  {
    id: "none",
    name: "بدون خودرو",
    emoji: "🚶",
    purchasePrice: 0,
    resaleValue: 0,
    weeklyFuelCost: 0,
    weeklyInsurance: 0,
    happinessBonus: 0,
    requiredLevel: 1,
  },
  {
    id: "pride",
    name: "پراید",
    emoji: "🚗",
    purchasePrice: 400_000_000,
    resaleValue: 300_000_000,
    weeklyFuelCost: 300_000,
    weeklyInsurance: 150_000,
    happinessBonus: 5,
    requiredLevel: 2,
  },
  {
    id: "peugeot",
    name: "پژو ۲۰۶",
    emoji: "🚙",
    purchasePrice: 800_000_000,
    resaleValue: 650_000_000,
    weeklyFuelCost: 400_000,
    weeklyInsurance: 250_000,
    happinessBonus: 10,
    requiredLevel: 4,
  },
  {
    id: "samand",
    name: "سمند",
    emoji: "🚘",
    purchasePrice: 600_000_000,
    resaleValue: 450_000_000,
    weeklyFuelCost: 350_000,
    weeklyInsurance: 200_000,
    happinessBonus: 8,
    requiredLevel: 3,
  },
  {
    id: "suv",
    name: "هایما S7",
    emoji: "🏎️",
    purchasePrice: 2_000_000_000,
    resaleValue: 1_700_000_000,
    weeklyFuelCost: 600_000,
    weeklyInsurance: 400_000,
    happinessBonus: 20,
    requiredLevel: 6,
  },
  {
    id: "luxury",
    name: "بنز C200",
    emoji: "✨",
    purchasePrice: 8_000_000_000,
    resaleValue: 7_000_000_000,
    weeklyFuelCost: 1_000_000,
    weeklyInsurance: 800_000,
    happinessBonus: 35,
    requiredLevel: 9,
  },
];

// ─── Mobile Plan Tiers ────────────────────────────────

export interface MobilePlan {
  id: string;
  name: string;
  emoji: string;
  weeklyCost: number;
  dataGB: number;
  happinessBonus: number;
}

export const MOBILE_PLANS: MobilePlan[] = [
  { id: "basic", name: "ایرانسل ساده", emoji: "📱", weeklyCost: 50_000, dataGB: 2, happinessBonus: 0 },
  { id: "mid", name: "همراه اول ۲۰ گیگ", emoji: "📶", weeklyCost: 200_000, dataGB: 20, happinessBonus: 3 },
  { id: "premium", name: "رایتل نامحدود", emoji: "🌐", weeklyCost: 500_000, dataGB: 100, happinessBonus: 6 },
];

// ─── Bill Type Labels ─────────────────────────────────

export const BILL_LABELS: Record<string, { label: string; emoji: string }> = {
  electricity: { label: "برق", emoji: "💡" },
  gas: { label: "گاز", emoji: "🔥" },
  water: { label: "آب", emoji: "💧" },
  internet: { label: "اینترنت", emoji: "🌐" },
  maintenance: { label: "شارژ ساختمان", emoji: "🏢" },
  mobile: { label: "موبایل", emoji: "📱" },
  fuel: { label: "بنزین", emoji: "⛽" },
  insurance: { label: "بیمه خودرو", emoji: "🛡️" },
  rent: { label: "اجاره", emoji: "🏠" },
};

// ─── Helper: Calculate weekly bills ───────────────────

export interface WeeklyBillBreakdown {
  key: string;
  label: string;
  emoji: string;
  amount: number;
}

export interface BillInflationMultipliers {
  rent: number;        // from city economy.rentMultiplier
  utilities: number;   // from city economy.costOfLivingMultiplier
  transport: number;   // from city economy.transportMultiplier
}

export function calculateWeeklyBills(
  housingId: string,
  vehicleId: string,
  mobilePlanId: string,
  isOwned: boolean,
  inflation: BillInflationMultipliers = { rent: 1, utilities: 1, transport: 1 },
): { total: number; breakdown: WeeklyBillBreakdown[] } {
  const house = HOUSING_TIERS.find((h) => h.id === housingId);
  const vehicle = VEHICLE_TIERS.find((v) => v.id === vehicleId);
  const mobile = MOBILE_PLANS.find((m) => m.id === mobilePlanId);

  const breakdown: WeeklyBillBreakdown[] = [];

  if (house) {
    // Rent (weekly = monthly / 4) — scaled by city rent multiplier
    if (!isOwned && house.monthlyRent > 0) {
      breakdown.push({
        key: "rent",
        ...BILL_LABELS.rent,
        amount: Math.round((house.monthlyRent / 4) * inflation.rent),
      });
    }
    // Utility bills — scaled by cost-of-living multiplier
    for (const [key, amount] of Object.entries(house.bills)) {
      const info = BILL_LABELS[key];
      if (info) {
        breakdown.push({ key, ...info, amount: Math.round((amount as number) * inflation.utilities) });
      }
    }
  }

  if (vehicle && vehicle.id !== "none") {
    breakdown.push({
      key: "fuel",
      ...BILL_LABELS.fuel,
      amount: Math.round(vehicle.weeklyFuelCost * inflation.transport),
    });
    breakdown.push({
      key: "insurance",
      ...BILL_LABELS.insurance,
      amount: Math.round(vehicle.weeklyInsurance * inflation.transport),
    });
  }

  if (mobile) {
    breakdown.push({
      key: "mobile",
      ...BILL_LABELS.mobile,
      amount: mobile.weeklyCost,  // mobile plans don't inflate (fixed contracts)
    });
  }

  const total = breakdown.reduce((sum, b) => sum + b.amount, 0);
  return { total, breakdown };
}
