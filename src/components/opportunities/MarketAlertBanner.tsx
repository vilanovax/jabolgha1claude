"use client";
import { colors, font, sp, radius } from "@/theme/tokens";

interface WaveAlert {
  emoji: string;
  text: string;
}

const WAVE_ALERTS: Record<string, WaveAlert> = {
  startup_wave: {
    emoji: "🚀",
    text: "موج استارتاپی در جریان است — فرصت‌های سرمایه‌گذاری بیشتر شده‌اند",
  },
  it_growth: {
    emoji: "💻",
    text: "بازار فناوری داغ شده — پروژه‌های فریلنس فنی بیشتر شدند",
  },
  saturation: {
    emoji: "📦",
    text: "بازار اشباع شده — دارایی‌های ارزان‌قیمت پیدا می‌شوند",
  },
  mini_recession: {
    emoji: "💰",
    text: "فشار تورمی بالاست — طلا و دارایی‌های امن بیشتر شده‌اند",
  },
  recovery: {
    emoji: "📈",
    text: "اقتصاد در حال بهبودی — فرصت‌های متنوع‌تر شدند",
  },
};

interface MarketAlertBannerProps {
  wavePhase: string;
}

export default function MarketAlertBanner({ wavePhase }: MarketAlertBannerProps) {
  const alert = WAVE_ALERTS[wavePhase];
  if (!alert) return null;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: sp.md,
        padding: `${sp.lg}px ${sp.xl}px`,
        borderRadius: radius.xl,
        background: "rgba(251,146,60,0.1)",
        border: "1px solid rgba(251,146,60,0.2)",
        direction: "rtl",
      }}
    >
      <span style={{ fontSize: font["4xl"], flexShrink: 0 }}>{alert.emoji}</span>
      <span
        style={{
          fontSize: font.base,
          fontWeight: 600,
          color: "#fb923c",
          lineHeight: 1.5,
        }}
      >
        {alert.text}
      </span>
    </div>
  );
}
