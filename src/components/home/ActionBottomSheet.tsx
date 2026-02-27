"use client";
import { useState, useEffect } from "react";
import { ACTION_CATEGORIES, WAVE_ACTION_MODIFIERS } from "@/data/actionTemplates";
import type { ActionOption, ActionEffect } from "@/data/actionTemplates";
import { useGameStore } from "@/stores/gameStore";
import type { ActionResult } from "@/stores/gameStore";
import { toPersian, formatMoney } from "@/data/mock";

type Phase = "choosing" | "executing" | "result";

interface Props {
  categoryId: string | null;
  onClose: () => void;
  onDone?: (categoryId: string) => void;
}

// ─── Stat display helpers ────────────────────────
const STAT_META: Record<string, { emoji: string; label: string; color: string }> = {
  energy: { emoji: "⚡", label: "انرژی", color: "#facc15" },
  happiness: { emoji: "😊", label: "خوشحالی", color: "#4ade80" },
  health: { emoji: "❤️", label: "سلامت", color: "#f87171" },
  hunger: { emoji: "🍔", label: "سیری", color: "#fb923c" },
  xp: { emoji: "✨", label: "تجربه", color: "#818cf8" },
  stars: { emoji: "⭐", label: "ستاره", color: "#fbbf24" },
  money: { emoji: "💰", label: "تومن", color: "#4ade80" },
  security: { emoji: "🛡️", label: "امنیت", color: "#60a5fa" },
};

// Tier colors: easy=green, medium=blue, hard=orange
const TIER_COLORS = [
  { border: "rgba(34,197,94,0.25)", glow: "rgba(34,197,94,0.08)", accent: "#22c55e", glowStrong: "rgba(34,197,94,0.35)" },
  { border: "rgba(59,130,246,0.25)", glow: "rgba(59,130,246,0.08)", accent: "#3b82f6", glowStrong: "rgba(59,130,246,0.35)" },
  { border: "rgba(249,115,22,0.25)", glow: "rgba(249,115,22,0.08)", accent: "#f97316", glowStrong: "rgba(249,115,22,0.35)" },
];

export default function ActionBottomSheet({ categoryId, onClose, onDone }: Props) {
  const [phase, setPhase] = useState<Phase>("choosing");
  const [result, setResult] = useState<ActionResult | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [shakeConfirm, setShakeConfirm] = useState(false);
  const executeAction = useGameStore((s) => s.executeAction);
  const wavePhase = useGameStore((s) => s.wave.currentPhase);

  // Reset state when category changes
  useEffect(() => {
    if (categoryId) {
      setPhase("choosing");
      setResult(null);
      setSelectedIndex(null);
      setShakeConfirm(false);
    }
  }, [categoryId]);

  if (!categoryId) return null;

  const category = ACTION_CATEGORIES.find((c) => c.id === categoryId);
  if (!category) return null;

  const waveMod = WAVE_ACTION_MODIFIERS[wavePhase];
  const catMod = waveMod.categoryModifiers[categoryId];

  const handleConfirm = () => {
    if (selectedIndex === null) return;

    const option = category.options[selectedIndex];
    const cm = catMod?.costMult ?? 1;
    const energyCost = option.costs.energy ? Math.round(option.costs.energy * cm) : 0;
    const moneyCost = option.costs.money ? Math.round(option.costs.money * cm) : 0;
    const state = useGameStore.getState();

    if (state.player.energy < energyCost || state.bank.checking < moneyCost) {
      setShakeConfirm(true);
      setTimeout(() => setShakeConfirm(false), 500);
      return;
    }

    setPhase("executing");

    setTimeout(() => {
      const actionResult = executeAction(categoryId, selectedIndex);
      setResult(actionResult);
      setPhase("result");
      if (actionResult.success && onDone) {
        onDone(categoryId);
      }
    }, 800);
  };

  const handleClose = () => {
    setPhase("choosing");
    setResult(null);
    setSelectedIndex(null);
    onClose();
  };

  return (
    <div className="anim-backdrop-in" style={{
      position: "fixed", inset: 0,
      background: "rgba(0,0,0,0.55)",
      backdropFilter: "blur(8px)",
      WebkitBackdropFilter: "blur(8px)",
      zIndex: 200,
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-end",
    }} onClick={(e) => {
      if (e.target === e.currentTarget && phase === "choosing") handleClose();
    }}>
      {/* Bottom Sheet */}
      <div className="anim-sheet-up" style={{
        background: "linear-gradient(180deg, #1a1a2e 0%, #0a0e27 100%)",
        borderRadius: "28px 28px 0 0",
        padding: "16px 16px 32px",
        maxHeight: "70dvh",
        overflowY: "auto",
        border: "1px solid rgba(255,255,255,0.08)",
        borderBottom: "none",
        boxShadow: "0 -8px 40px rgba(0,0,0,0.5)",
      }}>
        {/* Drag handle */}
        <div style={{
          width: 36, height: 4, borderRadius: 2,
          background: "rgba(255,255,255,0.15)",
          margin: "0 auto 14px",
        }} />

        {phase === "choosing" && (
          <ChoosingPhase
            category={category}
            catMod={catMod}
            waveLabel={waveMod.label}
            waveEmoji={useGameStore.getState().wave.phaseEmoji}
            selectedIndex={selectedIndex}
            onSelect={setSelectedIndex}
            onConfirm={handleConfirm}
            shakeConfirm={shakeConfirm}
          />
        )}

        {phase === "executing" && (
          <ExecutingPhase
            category={category}
            option={selectedIndex !== null ? category.options[selectedIndex] : undefined}
          />
        )}

        {phase === "result" && result && (
          <ResultPhase result={result} onClose={handleClose} />
        )}
      </div>
    </div>
  );
}

// ─── Phase: Choosing ─────────────────────────

function ChoosingPhase({ category, catMod, waveLabel, waveEmoji, selectedIndex, onSelect, onConfirm, shakeConfirm }: {
  category: (typeof ACTION_CATEGORIES)[0];
  catMod?: { effectMult?: number; costMult?: number };
  waveLabel: string;
  waveEmoji: string;
  selectedIndex: number | null;
  onSelect: (index: number) => void;
  onConfirm: () => void;
  shakeConfirm: boolean;
}) {
  const player = useGameStore((s) => s.player);
  const bank = useGameStore((s) => s.bank);

  const selectedOption = selectedIndex !== null ? category.options[selectedIndex] : null;
  const cm = catMod?.costMult ?? 1;
  const em = catMod?.effectMult ?? 1;

  // Compute affordability for confirm button
  const canAfford = selectedOption ? (
    player.energy >= (selectedOption.costs.energy ? Math.round(selectedOption.costs.energy * cm) : 0) &&
    bank.checking >= (selectedOption.costs.money ? Math.round(selectedOption.costs.money * cm) : 0)
  ) : true;

  // Smart suggestion
  const suggestion = getSuggestion(player, category);

  return (
    <>
      {/* Header with category + current stats */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        marginBottom: 12,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 28 }}>{category.emoji}</span>
          <div>
            <div style={{ fontSize: 15, fontWeight: 900, color: "white" }}>
              {category.name}
            </div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>
              {category.description}
            </div>
          </div>
        </div>

        {/* Wave modifier badge */}
        {catMod && (
          <div style={{
            display: "flex", alignItems: "center", gap: 3,
            fontSize: 8, fontWeight: 700,
            padding: "3px 8px", borderRadius: 8,
            background: "rgba(99,102,241,0.12)",
            color: "#818cf8",
            border: "1px solid rgba(99,102,241,0.2)",
          }}>
            {waveEmoji} {waveLabel}
          </div>
        )}
      </div>

      {/* Current Stats Bar */}
      <div style={{
        display: "flex", gap: 6, marginBottom: 14,
        padding: "8px 10px", borderRadius: 14,
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.06)",
      }}>
        <StatMini emoji="⚡" value={player.energy} max={100} color="#facc15" label="انرژی" />
        <StatMini emoji="😊" value={player.happiness} max={100} color="#4ade80" label="روحیه" />
        <StatMini emoji="🍔" value={player.hunger} max={100} color="#fb923c" label="سیری" />
        <StatMini emoji="💰" value={bank.checking} isMoney color="#4ade80" label="موجودی" />
      </div>

      {/* Options */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {category.options.map((opt, i) => (
          <OptionCard
            key={opt.id}
            option={opt}
            index={i}
            isSelected={selectedIndex === i}
            playerEnergy={player.energy}
            playerMoney={bank.checking}
            costMult={catMod?.costMult}
            effectMult={catMod?.effectMult}
            onSelect={() => onSelect(i)}
          />
        ))}
      </div>

      {/* Preview Bar */}
      {selectedOption && (
        <PreviewBar
          option={selectedOption}
          player={player}
          bankChecking={bank.checking}
          costMult={cm}
          effectMult={em}
        />
      )}

      {/* Smart Suggestion */}
      {suggestion && selectedIndex === null && (
        <div style={{
          marginTop: 12,
          padding: "8px 12px", borderRadius: 12,
          background: "rgba(99,102,241,0.06)",
          border: "1px solid rgba(99,102,241,0.12)",
          fontSize: 10, fontWeight: 600,
          color: "rgba(255,255,255,0.5)",
          textAlign: "center",
        }}>
          💡 {suggestion}
        </div>
      )}

      {/* Confirm Button */}
      {selectedOption && (
        <button
          onClick={onConfirm}
          className={shakeConfirm ? "anim-confirm-shake" : "anim-confirm-bounce"}
          style={{
            width: "100%",
            marginTop: 14,
            padding: "14px 0",
            borderRadius: 18,
            border: canAfford
              ? `1.5px solid ${TIER_COLORS[selectedIndex!].border}`
              : "1.5px solid rgba(255,255,255,0.08)",
            background: canAfford
              ? `linear-gradient(135deg, ${TIER_COLORS[selectedIndex!].glow}, rgba(255,255,255,0.04))`
              : "rgba(255,255,255,0.03)",
            color: canAfford ? "white" : "rgba(255,255,255,0.3)",
            fontSize: 14,
            fontWeight: 900,
            fontFamily: "inherit",
            cursor: canAfford ? "pointer" : "not-allowed",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
          }}
        >
          {canAfford ? (
            <>
              <span>{selectedOption.emoji}</span>
              انجام بده!
            </>
          ) : (
            <>😤 منابع کافی نیست</>
          )}
        </button>
      )}
    </>
  );
}

// ─── Current Stats Mini Display ─────────────────

function StatMini({ emoji, value, max, color, label, isMoney }: {
  emoji: string;
  value: number;
  max?: number;
  color: string;
  label: string;
  isMoney?: boolean;
}) {
  return (
    <div style={{
      flex: 1, display: "flex", flexDirection: "column",
      alignItems: "center", gap: 2,
    }}>
      <span style={{ fontSize: 12 }}>{emoji}</span>
      <span style={{
        fontSize: 9, fontWeight: 800, color,
      }}>
        {isMoney ? formatMoney(value) : toPersian(value)}
        {max ? `/${toPersian(max)}` : ""}
      </span>
      {max && (
        <div style={{
          width: "100%", height: 3, borderRadius: 2,
          background: "rgba(255,255,255,0.06)",
          overflow: "hidden",
        }}>
          <div style={{
            width: `${Math.min(100, (value / max) * 100)}%`,
            height: "100%", borderRadius: 2,
            background: color,
            transition: "width 0.3s ease",
          }} />
        </div>
      )}
    </div>
  );
}

// ─── Option Card ────────────────────────────────

function OptionCard({ option, index, isSelected, playerEnergy, playerMoney, costMult, effectMult, onSelect }: {
  option: ActionOption;
  index: number;
  isSelected: boolean;
  playerEnergy: number;
  playerMoney: number;
  costMult?: number;
  effectMult?: number;
  onSelect: () => void;
}) {
  const cm = costMult ?? 1;
  const energyCost = option.costs.energy ? Math.round(option.costs.energy * cm) : 0;
  const moneyCost = option.costs.money ? Math.round(option.costs.money * cm) : 0;
  const canAfford = playerEnergy >= energyCost && playerMoney >= moneyCost;

  const tier = TIER_COLORS[index];

  return (
    <button
      onClick={onSelect}
      className={isSelected ? "anim-card-glow" : ""}
      style={{
        "--glow": tier.glowStrong,
        width: "100%",
        padding: "12px 14px",
        borderRadius: 18,
        background: isSelected
          ? `linear-gradient(145deg, ${tier.glow}, rgba(255,255,255,0.05))`
          : `linear-gradient(145deg, ${tier.glow}, rgba(255,255,255,0.02))`,
        border: isSelected
          ? `1.5px solid ${tier.accent}`
          : `1px solid ${canAfford ? tier.border : "rgba(255,255,255,0.06)"}`,
        cursor: "pointer",
        opacity: canAfford ? 1 : 0.45,
        textAlign: "right",
        fontFamily: "inherit",
        transform: isSelected ? "scale(1.03)" : "scale(1)",
        transition: "transform 0.2s ease, border-color 0.2s ease, background 0.2s ease",
        position: "relative",
        overflow: "hidden",
      } as React.CSSProperties}
    >
      {/* Selected indicator shine */}
      {isSelected && (
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0,
          height: 2,
          background: `linear-gradient(90deg, transparent, ${tier.accent}, transparent)`,
          opacity: 0.6,
        }} />
      )}

      {/* Name row */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        marginBottom: 6,
      }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 6,
        }}>
          <span style={{ fontSize: 18 }}>{option.emoji}</span>
          <span style={{
            fontSize: 12, fontWeight: 800,
            color: isSelected ? "white" : "rgba(255,255,255,0.85)",
          }}>
            {option.name}
          </span>
        </div>
        <span style={{
          fontSize: 8, fontWeight: 600, color: "rgba(255,255,255,0.3)",
        }}>
          ⏱ {toPersian(option.costs.time)} دقیقه
        </span>
      </div>

      {/* Costs + Effects inline */}
      <div style={{
        display: "flex", gap: 5, flexWrap: "wrap",
      }}>
        {energyCost > 0 && (
          <Chip
            text={`⚡ -${toPersian(energyCost)}`}
            bg="rgba(239,68,68,0.1)" color="#f87171" border="rgba(239,68,68,0.15)"
          />
        )}
        {moneyCost > 0 && (
          <Chip
            text={`💰 -${formatMoney(moneyCost)}`}
            bg="rgba(239,68,68,0.1)" color="#f87171" border="rgba(239,68,68,0.15)"
          />
        )}
        {option.effects.map((eff, j) => {
          const eM = effectMult ?? 1;
          const val = Math.round(eff.value * eM);
          const label = eff.label.replace(/[+\-][\d۰-۹,.]+/, (m) => {
            const sign = m.startsWith("-") ? "-" : "+";
            if (eff.key === "money") return `${sign}${formatMoney(Math.abs(val))}`;
            return `${sign}${toPersian(Math.abs(val))}`;
          });
          return (
            <Chip
              key={j}
              text={label}
              bg="rgba(74,222,128,0.1)" color="#4ade80" border="rgba(74,222,128,0.15)"
            />
          );
        })}
      </div>

      {/* Risk warning */}
      {option.risk && (
        <div style={{
          marginTop: 5,
          fontSize: 8, fontWeight: 700,
          color: "#fbbf24",
          display: "flex", alignItems: "center", gap: 3,
        }}>
          ⚠️ {toPersian(Math.round(option.risk.chance * 100))}٪ احتمال: {option.risk.label}
        </div>
      )}
    </button>
  );
}

// ─── Preview Bar ────────────────────────────────

function PreviewBar({ option, player, bankChecking, costMult, effectMult }: {
  option: ActionOption;
  player: Record<string, unknown>;
  bankChecking: number;
  costMult: number;
  effectMult: number;
}) {
  // Collect all stat changes: costs (negative) + effects (positive)
  const changes: { key: string; before: number; after: number }[] = [];

  if (option.costs.energy && typeof player.energy === "number") {
    const cost = Math.round(option.costs.energy * costMult);
    changes.push({
      key: "energy",
      before: player.energy,
      after: Math.max(0, player.energy - cost),
    });
  }

  if (option.costs.money) {
    const cost = Math.round(option.costs.money * costMult);
    changes.push({
      key: "money",
      before: bankChecking,
      after: Math.max(0, bankChecking - cost),
    });
  }

  for (const eff of option.effects) {
    const val = Math.round(eff.value * effectMult);
    if (eff.key === "money") {
      // Merge with existing money change if present
      const existing = changes.find((c) => c.key === "money");
      if (existing) {
        existing.after = Math.max(0, existing.after + val);
      } else {
        changes.push({ key: "money", before: bankChecking, after: Math.max(0, bankChecking + val) });
      }
    } else if (eff.key in player && typeof player[eff.key] === "number") {
      const existing = changes.find((c) => c.key === eff.key);
      if (existing) {
        existing.after = Math.max(0, existing.after + val);
      } else {
        changes.push({
          key: eff.key,
          before: player[eff.key] as number,
          after: Math.max(0, (player[eff.key] as number) + val),
        });
      }
    }
  }

  if (changes.length === 0) return null;

  return (
    <div className="anim-preview-in" style={{
      marginTop: 10,
      padding: "10px 12px",
      borderRadius: 14,
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(255,255,255,0.08)",
    }}>
      <div style={{
        fontSize: 9, fontWeight: 700,
        color: "rgba(255,255,255,0.4)",
        marginBottom: 8, textAlign: "center",
      }}>
        📊 بعد از انجام:
      </div>
      <div style={{
        display: "flex", gap: 6, flexWrap: "wrap",
        justifyContent: "center",
      }}>
        {changes.map((ch) => {
          const meta = STAT_META[ch.key];
          if (!meta) return null;
          const isDown = ch.after < ch.before;
          return (
            <div key={ch.key} style={{
              display: "flex", alignItems: "center", gap: 3,
              padding: "3px 8px", borderRadius: 8,
              background: isDown ? "rgba(239,68,68,0.06)" : "rgba(74,222,128,0.06)",
              border: `1px solid ${isDown ? "rgba(239,68,68,0.12)" : "rgba(74,222,128,0.12)"}`,
            }}>
              <span style={{ fontSize: 10 }}>{meta.emoji}</span>
              <span style={{
                fontSize: 9, fontWeight: 700,
                color: "rgba(255,255,255,0.5)",
              }}>
                {ch.key === "money"
                  ? formatMoney(ch.before)
                  : toPersian(ch.before)}
              </span>
              <span style={{
                fontSize: 9, color: "rgba(255,255,255,0.25)",
              }}>→</span>
              <span style={{
                fontSize: 9, fontWeight: 800,
                color: isDown ? "#f87171" : "#4ade80",
              }}>
                {ch.key === "money"
                  ? formatMoney(ch.after)
                  : toPersian(ch.after)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Smart Suggestion Logic ─────────────────────

function getSuggestion(
  player: { energy: number; happiness: number; hunger: number },
  category: (typeof ACTION_CATEGORIES)[0],
): string | null {
  if (category.id === "exercise") {
    if (player.energy < 30) return "با توجه به انرژی پایین، پیاده‌روی ساده پیشنهاد می‌شود";
    if (player.energy > 70) return "انرژی بالاست! می‌تونی تمرین سنگین بزنی 💪";
  }
  if (category.id === "eat") {
    if (player.hunger < 30) return "خیلی گرسنه‌ای! صبحانه کامل بخور 🍽️";
  }
  if (category.id === "sleep") {
    if (player.energy < 20) return "خیلی خسته‌ای! خواب کامل لازمه 😴";
    if (player.energy > 60) return "هنوز انرژی داری، یه چرت کوتاه کافیه";
  }
  if (category.id === "work") {
    if (player.energy < 30) return "انرژی کمه، شیفت نیمه‌وقت بهتره ⚡";
    if (player.happiness < 30) return "روحیه‌ات پایینه، مراقب فرسودگی باش ⚠️";
  }
  if (category.id === "study") {
    if (player.energy < 25) return "انرژی کمه، مرور سریع پیشنهاد می‌شه 📖";
  }
  if (category.id === "invest") {
    return "سرمایه‌گذاری ریسک داره! با احتیاط انتخاب کن 📊";
  }
  return null;
}

// ─── Chip Component ─────────────────────────────

function Chip({ text, bg, color, border }: {
  text: string; bg: string; color: string; border: string;
}) {
  return (
    <span style={{
      fontSize: 8, fontWeight: 700,
      padding: "2px 7px", borderRadius: 8,
      background: bg, color, border: `1px solid ${border}`,
    }}>
      {text}
    </span>
  );
}

// ─── Phase: Executing ────────────────────────

function ExecutingPhase({ category, option }: {
  category: (typeof ACTION_CATEGORIES)[0];
  option?: ActionOption;
}) {
  return (
    <div style={{ textAlign: "center", padding: "30px 0" }}>
      <div className="anim-breathe" style={{
        fontSize: 56, marginBottom: 16,
      }}>
        {option?.emoji ?? category.emoji}
      </div>
      <div style={{
        fontSize: 15, fontWeight: 800, color: "white", marginBottom: 4,
      }}>
        {option ? option.name : category.name}
      </div>
      <div style={{
        fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 16,
      }}>
        در حال انجام...
      </div>
      {/* Loading bar */}
      <div style={{
        height: 6, borderRadius: 3,
        background: "rgba(255,255,255,0.08)",
        overflow: "hidden",
        margin: "0 40px",
        position: "relative",
      }}>
        <div className="anim-loading-bar" style={{
          width: "40%", height: "100%",
          borderRadius: 3,
          background: "linear-gradient(90deg, rgba(255,255,255,0.05), #818cf8, rgba(255,255,255,0.05))",
        }} />
      </div>
    </div>
  );
}

// ─── Phase: Result ───────────────────────────

function ResultPhase({ result, onClose }: {
  result: ActionResult;
  onClose: () => void;
}) {
  if (!result.success) {
    return (
      <div style={{ textAlign: "center", padding: "24px 0" }}>
        <div className="anim-reward-pop" style={{
          fontSize: 56, marginBottom: 12,
        }}>😬</div>
        <div style={{
          fontSize: 16, fontWeight: 900, color: "white", marginBottom: 8,
        }}>
          نمیشه!
        </div>
        <div style={{
          fontSize: 12, fontWeight: 600, color: "#f87171",
          padding: "10px 16px", borderRadius: 14,
          background: "rgba(239,68,68,0.08)",
          border: "1px solid rgba(239,68,68,0.15)",
          marginBottom: 20,
        }}>
          {result.insufficientReason}
        </div>
        <button onClick={onClose} style={{
          width: "100%", padding: "12px 0", borderRadius: 16,
          border: "1px solid rgba(255,255,255,0.1)",
          background: "rgba(255,255,255,0.06)",
          color: "rgba(255,255,255,0.6)",
          fontSize: 13, fontWeight: 700,
          fontFamily: "inherit", cursor: "pointer",
        }}>
          باشه 😤
        </button>
      </div>
    );
  }

  return (
    <div style={{ textAlign: "center", padding: "24px 0" }}>
      {/* Risk triggered */}
      {result.riskTriggered ? (
        <>
          <div className="anim-reward-pop" style={{
            fontSize: 56, marginBottom: 12,
          }}>😱</div>
          <div style={{
            fontSize: 16, fontWeight: 900, color: "#fbbf24", marginBottom: 4,
          }}>
            انجام شد اما...
          </div>
          <div style={{
            fontSize: 12, fontWeight: 700, color: "#f87171",
            padding: "8px 14px", borderRadius: 12,
            background: "rgba(239,68,68,0.08)",
            border: "1px solid rgba(239,68,68,0.15)",
            marginBottom: 16,
          }}>
            {result.riskTriggered.label}
          </div>
        </>
      ) : (
        <>
          <div className="anim-reward-pop" style={{
            fontSize: 56, marginBottom: 12,
          }}>✅</div>
          <div style={{
            fontSize: 16, fontWeight: 900, color: "white", marginBottom: 16,
          }}>
            انجام شد!
          </div>
        </>
      )}

      {/* Effect chips */}
      <div style={{
        display: "flex", gap: 8, justifyContent: "center",
        flexWrap: "wrap", marginBottom: 20,
      }}>
        {result.effects.map((eff, i) => (
          <div key={i} className="anim-reward-float" style={{
            fontSize: 11, fontWeight: 700,
            padding: "6px 14px", borderRadius: 14,
            background: "rgba(74,222,128,0.1)",
            color: "#4ade80",
            border: "1px solid rgba(74,222,128,0.2)",
            animationDelay: `${i * 0.1}s`,
          }}>
            {eff.label}
          </div>
        ))}
      </div>

      <button onClick={onClose} style={{
        width: "100%", padding: "12px 0", borderRadius: 16,
        border: "1px solid rgba(34,197,94,0.2)",
        background: "linear-gradient(135deg, rgba(34,197,94,0.15), rgba(34,197,94,0.08))",
        color: "#4ade80",
        fontSize: 13, fontWeight: 800,
        fontFamily: "inherit", cursor: "pointer",
      }}>
        عالیه! ✓
      </button>
    </div>
  );
}
