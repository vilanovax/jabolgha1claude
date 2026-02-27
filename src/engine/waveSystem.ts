import type { WavePhase, WaveState } from "./types";

const PHASE_ORDER: WavePhase[] = [
  "startup_wave",
  "it_growth",
  "saturation",
  "mini_recession",
  "recovery",
];

const PHASE_CONFIG: Record<WavePhase, {
  name: string;
  emoji: string;
  description: string;
  durationTicks: number;
  effects: { text: string; positive: boolean }[];
}> = {
  startup_wave: {
    name: "موج استارتاپ",
    emoji: "🚀",
    description: "حقوق IT بالاست. استارتاپ‌ها استخدام می‌کنن.",
    durationTicks: 90,
    effects: [
      { text: "حقوق IT +۲۰٪", positive: true },
      { text: "رقابت استخدام بالا", positive: false },
      { text: "فرصت سرمایه‌گذاری", positive: true },
    ],
  },
  it_growth: {
    name: "رشد صنعت فناوری",
    emoji: "💻",
    description: "بخش IT در حال رشد سریع. تقاضا برای مهارت فنی بالاست.",
    durationTicks: 80,
    effects: [
      { text: "فرصت‌های شغلی IT زیاد", positive: true },
      { text: "نیاز به ارتقاء مهارت", positive: false },
      { text: "سرمایه‌گذاری فناوری سودده", positive: true },
    ],
  },
  saturation: {
    name: "اشباع بازار",
    emoji: "📊",
    description: "بازار IT اشباع شده. رقابت شدید و سودها کم شده.",
    durationTicks: 70,
    effects: [
      { text: "حقوق IT در حال کاهش", positive: false },
      { text: "فرصت در صنایع دیگه", positive: true },
      { text: "ریسک بیکاری بالا", positive: false },
    ],
  },
  mini_recession: {
    name: "رکود موقت",
    emoji: "📉",
    description: "اقتصاد شهر در رکود. صبر و مدیریت مالی کلیدی‌ه.",
    durationTicks: 60,
    effects: [
      { text: "حقوق‌ها کاهش یافت", positive: false },
      { text: "اخراج‌ها بیشتر شد", positive: false },
      { text: "قیمت سهام پایین (فرصت خرید)", positive: true },
    ],
  },
  recovery: {
    name: "بهبود اقتصادی",
    emoji: "🌱",
    description: "نشانه‌های بهبود دیده میشه. وقت سرمایه‌گذاری‌ه.",
    durationTicks: 75,
    effects: [
      { text: "بازار رو به بهبود", positive: true },
      { text: "فرصت‌های جدید در حال ظهور", positive: true },
      { text: "رقابت در حال افزایش", positive: false },
    ],
  },
};

export function createInitialWave(): WaveState {
  const phase: WavePhase = "startup_wave";
  const config = PHASE_CONFIG[phase];
  return {
    currentPhase: phase,
    phaseName: config.name,
    phaseEmoji: config.emoji,
    phaseDescription: config.description,
    effects: config.effects,
    ticksInPhase: 0,
    phaseDurationTicks: config.durationTicks,
    cycleCount: 0,
  };
}

export function checkWaveTransition(wave: WaveState): WaveState | null {
  if (wave.ticksInPhase < wave.phaseDurationTicks) return null;

  const currentIdx = PHASE_ORDER.indexOf(wave.currentPhase);
  const nextIdx = (currentIdx + 1) % PHASE_ORDER.length;
  const nextPhase = PHASE_ORDER[nextIdx];
  const config = PHASE_CONFIG[nextPhase];
  const newCycleCount = nextIdx === 0 ? wave.cycleCount + 1 : wave.cycleCount;

  return {
    currentPhase: nextPhase,
    phaseName: config.name,
    phaseEmoji: config.emoji,
    phaseDescription: config.description,
    effects: config.effects,
    ticksInPhase: 0,
    phaseDurationTicks: config.durationTicks,
    cycleCount: newCycleCount,
  };
}
