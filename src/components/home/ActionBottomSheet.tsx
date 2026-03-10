"use client";
import { useState, useEffect } from "react";
import { ACTION_CATEGORIES, WAVE_ACTION_MODIFIERS } from "@/data/actionTemplates";
import type { ActionOption, SponsoredVariant } from "@/data/actionTemplates";
import { useGameStore } from "@/stores/gameStore";
import type { ActionResult } from "@/stores/gameStore";
import { toPersian, formatMoney } from "@/data/mock";

type Phase = "choosing" | "executing" | "result";

interface Props {
  categoryId: string | null;
  onClose: () => void;
  onDone?: (categoryId: string) => void;
}

// ─── Category accent colors ────────────────────────────────────────────────────
const CAT_COLORS: Record<string, { accent: string; glow: string; bg: string }> = {
  work:     { accent: "#D4A843", glow: "rgba(212,168,67,0.18)",  bg: "rgba(212,168,67,0.06)"  },
  exercise: { accent: "#4ade80", glow: "rgba(74,222,128,0.18)",  bg: "rgba(74,222,128,0.06)"  },
  study:    { accent: "#60a5fa", glow: "rgba(96,165,250,0.18)",  bg: "rgba(96,165,250,0.06)"  },
  library:  { accent: "#a78bfa", glow: "rgba(167,139,250,0.18)", bg: "rgba(167,139,250,0.06)" },
  rest:     { accent: "#c084fc", glow: "rgba(192,132,252,0.18)", bg: "rgba(192,132,252,0.06)" },
  invest:   { accent: "#34d399", glow: "rgba(52,211,153,0.18)",  bg: "rgba(52,211,153,0.06)"  },
};

// Difficulty: index 0=easy, 1=medium, 2=hard
const DIFF = [
  { label: "سبک",   color: "#4ade80", border: "rgba(74,222,128,0.25)",  glow: "rgba(74,222,128,0.10)"  },
  { label: "متوسط", color: "#60a5fa", border: "rgba(96,165,250,0.25)",  glow: "rgba(96,165,250,0.10)"  },
  { label: "سنگین", color: "#fb923c", border: "rgba(251,146,60,0.25)",   glow: "rgba(251,146,60,0.10)"  },
];

export default function ActionBottomSheet({ categoryId, onClose, onDone }: Props) {
  const [phase, setPhase] = useState<Phase>("choosing");
  const [result, setResult] = useState<ActionResult | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [shakeConfirm, setShakeConfirm] = useState(false);
  const [sponsoredMode, setSponsoredMode] = useState(false);
  const executeAction = useGameStore((s) => s.executeAction);
  const wavePhase = useGameStore((s) => s.wave.currentPhase);

  useEffect(() => {
    if (categoryId) {
      setPhase("choosing");
      setResult(null);
      setSelectedIndex(null);
      setShakeConfirm(false);
      setSponsoredMode(false);
    }
  }, [categoryId]);

  if (!categoryId) return null;

  const category = ACTION_CATEGORIES.find((c) => c.id === categoryId);
  if (!category) return null;

  const waveMod = WAVE_ACTION_MODIFIERS[wavePhase];
  const catMod = waveMod.categoryModifiers[categoryId];
  const catColor = CAT_COLORS[categoryId] ?? CAT_COLORS.work;

  const handleConfirm = () => {
    if (selectedIndex === null) return;
    const option = category.options[selectedIndex];
    const sponsored = sponsoredMode ? option.sponsoredVariant : undefined;
    const activeCosts = sponsored ? sponsored.costs : option.costs;
    const cm = catMod?.costMult ?? 1;
    const energyCost = activeCosts.energy ? Math.round(activeCosts.energy * cm) : 0;
    const moneyCost  = activeCosts.money  ? Math.round(activeCosts.money  * cm) : 0;
    const state = useGameStore.getState();

    if (state.player.energy < energyCost || state.bank.checking < moneyCost) {
      setShakeConfirm(true);
      setTimeout(() => setShakeConfirm(false), 500);
      return;
    }

    setPhase("executing");
    setTimeout(() => {
      const actionResult = executeAction(categoryId, selectedIndex, sponsoredMode);
      setResult(actionResult);
      setPhase("result");
      if (actionResult.success && onDone) onDone(categoryId);
    }, 900);
  };

  const handleClose = () => {
    setPhase("choosing");
    setResult(null);
    setSelectedIndex(null);
    setSponsoredMode(false);
    onClose();
  };

  return (
    <div
      className="anim-backdrop-in"
      style={{
        position: "fixed", inset: 0,
        background: "rgba(0,0,0,0.6)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        zIndex: 200,
        display: "flex", flexDirection: "column", justifyContent: "flex-end",
      }}
      onClick={(e) => { if (e.target === e.currentTarget && phase === "choosing") handleClose(); }}
    >
      <div
        className="anim-sheet-up"
        style={{
          background: "linear-gradient(180deg, #141428 0%, #0a0e20 100%)",
          borderRadius: "28px 28px 0 0",
          padding: "0 0 32px",
          maxHeight: "80dvh",
          overflowY: "auto",
          border: `1px solid ${catColor.accent}20`,
          borderBottom: "none",
          boxShadow: `0 -8px 40px rgba(0,0,0,0.6), 0 -2px 0 ${catColor.accent}30`,
        }}
      >
        {/* Colored drag handle */}
        <div style={{ display: "flex", justifyContent: "center", padding: "14px 0 0" }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: `${catColor.accent}40` }} />
        </div>

        {/* Category header */}
        <div style={{
          display: "flex", alignItems: "center", gap: 12,
          padding: "14px 20px 0",
        }}>
          <div style={{
            width: 48, height: 48, borderRadius: 16,
            background: catColor.bg,
            border: `1px solid ${catColor.accent}30`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 24, flexShrink: 0,
          }}>
            {category.emoji}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 18, fontWeight: 900, color: "white" }}>{category.name}</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 1 }}>{category.description}</div>
          </div>
          {catMod && (
            <div style={{
              fontSize: 9, fontWeight: 800,
              padding: "4px 9px", borderRadius: 10,
              background: `${catColor.accent}15`,
              color: catColor.accent,
              border: `1px solid ${catColor.accent}30`,
            }}>
              {waveMod.label}
            </div>
          )}
        </div>

        <div style={{ padding: "16px 20px 0" }}>
          {phase === "choosing" && (
            <ChoosingPhase
              category={category}
              catMod={catMod}
              catColor={catColor}
              selectedIndex={selectedIndex}
              onSelect={(i) => { setSelectedIndex(i); setSponsoredMode(false); }}
              onConfirm={handleConfirm}
              shakeConfirm={shakeConfirm}
              sponsoredMode={sponsoredMode}
              onSponsoredToggle={setSponsoredMode}
            />
          )}

          {phase === "executing" && (
            <ExecutingPhase
              category={category}
              option={selectedIndex !== null ? category.options[selectedIndex] : undefined}
              sponsoredVariant={sponsoredMode && selectedIndex !== null ? category.options[selectedIndex].sponsoredVariant : undefined}
              catColor={catColor}
            />
          )}

          {phase === "result" && result && (
            <ResultPhase result={result} catColor={catColor} onClose={handleClose} />
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Choosing Phase ────────────────────────────────────────────────────────────
function ChoosingPhase({
  category, catMod, catColor,
  selectedIndex, onSelect, onConfirm, shakeConfirm,
  sponsoredMode, onSponsoredToggle,
}: {
  category: (typeof ACTION_CATEGORIES)[0];
  catMod?: { effectMult?: number; costMult?: number };
  catColor: { accent: string; glow: string; bg: string };
  selectedIndex: number | null;
  onSelect: (i: number) => void;
  onConfirm: () => void;
  shakeConfirm: boolean;
  sponsoredMode: boolean;
  onSponsoredToggle: (v: boolean) => void;
}) {
  const player = useGameStore((s) => s.player);
  const bank   = useGameStore((s) => s.bank);

  const selectedOption = selectedIndex !== null ? category.options[selectedIndex] : null;
  const sponsored = sponsoredMode && selectedOption?.sponsoredVariant ? selectedOption.sponsoredVariant : null;
  const cm = catMod?.costMult ?? 1;
  const em = catMod?.effectMult ?? 1;

  const resolvedCosts = sponsored ? sponsored.costs : selectedOption?.costs;
  const canAfford = resolvedCosts
    ? player.energy >= (resolvedCosts.energy ? Math.round(resolvedCosts.energy * cm) : 0) &&
      bank.checking >= (resolvedCosts.money  ? Math.round(resolvedCosts.money  * cm) : 0)
    : true;

  return (
    <>
      {/* Stats bar — just relevant stats */}
      <div style={{
        display: "flex", gap: 6, marginBottom: 16,
        padding: "10px 12px", borderRadius: 16,
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.06)",
      }}>
        {[
          { emoji: "⚡", value: toPersian(player.energy), color: "#facc15", bar: player.energy / 100 },
          { emoji: "😊", value: toPersian(player.happiness), color: "#c084fc", bar: player.happiness / 100 },
          { emoji: "💰", value: formatMoney(bank.checking), color: "#4ade80", bar: null },
        ].map((s, i) => (
          <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
            <span style={{ fontSize: 14 }}>{s.emoji}</span>
            <span style={{ fontSize: 10, fontWeight: 800, color: s.color, fontVariantNumeric: "tabular-nums" }}>{s.value}</span>
            {s.bar !== null && (
              <div style={{ width: "100%", height: 3, borderRadius: 2, background: "rgba(255,255,255,0.07)", overflow: "hidden" }}>
                <div style={{ height: "100%", borderRadius: 2, width: `${Math.min(100, s.bar * 100)}%`, background: s.color }} />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Options */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
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
            sponsoredMode={selectedIndex === i && sponsoredMode}
            catAccent={catColor.accent}
          />
        ))}
      </div>

      {/* Sponsor Toggle */}
      {selectedOption?.sponsoredVariant && (
        <SponsorToggle
          sponsored={selectedOption.sponsoredVariant}
          active={sponsoredMode}
          onToggle={onSponsoredToggle}
        />
      )}

      {/* Before/After Preview */}
      {selectedOption && (
        <PreviewBar
          option={sponsored ? { ...selectedOption, costs: sponsored.costs, effects: sponsored.effects } : selectedOption}
          player={player}
          bankChecking={bank.checking}
          costMult={cm}
          effectMult={em}
        />
      )}

      {/* Confirm */}
      {selectedOption && (
        <button
          onClick={onConfirm}
          className={shakeConfirm ? "anim-confirm-shake" : "anim-confirm-bounce"}
          style={{
            width: "100%", marginTop: 14,
            padding: "15px 0", borderRadius: 20,
            border: canAfford
              ? `1.5px solid ${sponsoredMode ? "#D4A843" : catColor.accent}60`
              : "1.5px solid rgba(255,255,255,0.07)",
            background: canAfford
              ? sponsoredMode
                ? "linear-gradient(135deg, rgba(212,168,67,0.15), rgba(240,201,102,0.08))"
                : `${catColor.glow}`
              : "rgba(255,255,255,0.03)",
            color: canAfford ? "white" : "rgba(255,255,255,0.25)",
            fontSize: 15, fontWeight: 900,
            fontFamily: "inherit",
            cursor: canAfford ? "pointer" : "not-allowed",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          }}
        >
          {canAfford ? (
            <>
              <span style={{ fontSize: 20 }}>
                {sponsoredMode && sponsored ? sponsored.brandEmoji : selectedOption.emoji}
              </span>
              <span>
                {sponsoredMode && sponsored ? `${sponsored.brandName} · انجام بده!` : "انجام بده!"}
              </span>
            </>
          ) : (
            <span>😤 منابع کافی نیست</span>
          )}
        </button>
      )}
    </>
  );
}

// ─── Option Card ───────────────────────────────────────────────────────────────
function OptionCard({
  option, index, isSelected, playerEnergy, playerMoney,
  costMult, effectMult, onSelect, sponsoredMode, catAccent,
}: {
  option: ActionOption;
  index: number;
  isSelected: boolean;
  playerEnergy: number;
  playerMoney: number;
  costMult?: number;
  effectMult?: number;
  onSelect: () => void;
  sponsoredMode?: boolean;
  catAccent: string;
}) {
  const cm = costMult ?? 1;
  const em = effectMult ?? 1;
  const isSponsored = isSelected && sponsoredMode && option.sponsoredVariant;
  const activeCosts   = isSponsored ? option.sponsoredVariant!.costs   : option.costs;
  const activeEffects = isSponsored ? option.sponsoredVariant!.effects : option.effects;
  const activeRisk    = isSponsored ? (option.sponsoredVariant!.risk ?? option.risk) : option.risk;

  const energyCost = activeCosts.energy ? Math.round(activeCosts.energy * cm) : 0;
  const moneyCost  = activeCosts.money  ? Math.round(activeCosts.money  * cm) : 0;
  const canAfford  = playerEnergy >= energyCost && playerMoney >= moneyCost;

  const diff = DIFF[index];

  const borderColor = isSponsored ? "#D4A843" : isSelected ? catAccent : diff.border;
  const bgColor     = isSponsored
    ? "linear-gradient(145deg, rgba(212,168,67,0.08), rgba(255,255,255,0.03))"
    : isSelected
      ? `linear-gradient(145deg, ${diff.glow}, rgba(255,255,255,0.03))`
      : "rgba(255,255,255,0.03)";

  return (
    <button
      onClick={onSelect}
      style={{
        width: "100%",
        padding: "14px 16px",
        borderRadius: 20,
        background: bgColor,
        border: isSelected ? `2px solid ${borderColor}` : `1px solid ${canAfford ? diff.border : "rgba(255,255,255,0.06)"}`,
        cursor: "pointer",
        opacity: canAfford ? 1 : 0.45,
        textAlign: "right",
        fontFamily: "inherit",
        transform: isSelected ? "scale(1.02)" : "scale(1)",
        transition: "transform 0.2s ease, border-color 0.2s ease",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Top shimmer on selected */}
      {isSelected && (
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 2,
          background: isSponsored
            ? "linear-gradient(90deg, transparent, #D4A843, #F0C966, transparent)"
            : `linear-gradient(90deg, transparent, ${catAccent}, transparent)`,
          opacity: 0.7,
        }} />
      )}

      {/* Row 1: emoji + name + difficulty + time */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
        <span style={{ fontSize: 26, flexShrink: 0 }}>
          {isSponsored ? option.sponsoredVariant!.brandEmoji : option.emoji}
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: 15, fontWeight: 900,
            color: isSelected ? "white" : "rgba(255,255,255,0.85)",
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          }}>
            {isSponsored ? option.sponsoredVariant!.displayName : option.name}
          </div>
        </div>
        {/* Difficulty badge */}
        <span style={{
          fontSize: 9, fontWeight: 800,
          padding: "3px 8px", borderRadius: 8,
          background: `${diff.color}15`,
          color: diff.color,
          border: `1px solid ${diff.color}25`,
          flexShrink: 0,
        }}>
          {diff.label}
        </span>
        <span style={{ fontSize: 9, color: "rgba(255,255,255,0.25)", flexShrink: 0 }}>
          ⏱ {toPersian(activeCosts.time)}د
        </span>
      </div>

      {/* Row 2: costs (red) then effects (green/gold) */}
      <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
        {/* Costs */}
        {energyCost > 0 && (
          <Tag text={`⚡ -${toPersian(energyCost)}`} color="#f87171" bg="rgba(239,68,68,0.1)" />
        )}
        {moneyCost > 0 && (
          <Tag text={`💰 -${formatMoney(moneyCost)}`} color="#f87171" bg="rgba(239,68,68,0.1)" />
        )}

        {/* Effects */}
        {activeEffects.map((eff, j) => {
          const val = Math.round(eff.value * em);
          const label = eff.label.replace(/[+\-][\d۰-۹,.]+/, (m) => {
            const sign = m.startsWith("-") ? "-" : "+";
            if (eff.key === "money") return `${sign}${formatMoney(Math.abs(val))}`;
            return `${sign}${toPersian(Math.abs(val))}`;
          });
          const effectColor = isSponsored ? "#F0C966" : eff.key === "money" ? "#4ade80" : "#4ade80";
          return (
            <Tag
              key={j}
              text={label}
              color={effectColor}
              bg={isSponsored ? "rgba(212,168,67,0.1)" : "rgba(74,222,128,0.1)"}
            />
          );
        })}

        {/* Sponsored badge */}
        {!isSelected && option.sponsoredVariant && (
          <Tag text="✦ اسپانسر" color="#D4A843" bg="rgba(212,168,67,0.1)" />
        )}
      </div>

      {/* Risk row */}
      {activeRisk && (
        <div style={{
          marginTop: 8, fontSize: 10, fontWeight: 700,
          color: "#fbbf24", display: "flex", alignItems: "center", gap: 4,
        }}>
          ⚠️ {toPersian(Math.round(activeRisk.chance * 100))}٪ احتمال: {activeRisk.label}
        </div>
      )}
    </button>
  );
}

// ─── Tag ───────────────────────────────────────────────────────────────────────
function Tag({ text, color, bg }: { text: string; color: string; bg: string }) {
  return (
    <span style={{
      fontSize: 10, fontWeight: 800,
      padding: "3px 8px", borderRadius: 8,
      background: bg, color,
      border: `1px solid ${color}20`,
    }}>
      {text}
    </span>
  );
}

// ─── Preview Bar ───────────────────────────────────────────────────────────────
function PreviewBar({ option, player, bankChecking, costMult, effectMult }: {
  option: ActionOption;
  player: Record<string, unknown>;
  bankChecking: number;
  costMult: number;
  effectMult: number;
}) {
  const changes: { key: string; emoji: string; before: number; after: number; color: string }[] = [];
  const EMOJI: Record<string, { emoji: string; color: string }> = {
    energy:    { emoji: "⚡", color: "#facc15" },
    happiness: { emoji: "😊", color: "#c084fc" },
    health:    { emoji: "❤️", color: "#f43f5e" },
    hunger:    { emoji: "🍔", color: "#4ade80" },
    xp:        { emoji: "✨", color: "#818cf8" },
    money:     { emoji: "💰", color: "#4ade80" },
    stars:     { emoji: "⭐", color: "#fbbf24" },
  };

  if (option.costs.energy && typeof player.energy === "number") {
    const cost = Math.round(option.costs.energy * costMult);
    changes.push({ key: "energy", emoji: "⚡", color: "#facc15", before: player.energy, after: Math.max(0, player.energy - cost) });
  }
  if (option.costs.money) {
    const cost = Math.round(option.costs.money * costMult);
    changes.push({ key: "money", emoji: "💰", color: "#4ade80", before: bankChecking, after: Math.max(0, bankChecking - cost) });
  }
  for (const eff of option.effects) {
    const val = Math.round(eff.value * effectMult);
    const meta = EMOJI[eff.key] ?? { emoji: "?", color: "#94a3b8" };
    if (eff.key === "money") {
      const ex = changes.find((c) => c.key === "money");
      if (ex) ex.after = Math.max(0, ex.after + val);
      else changes.push({ key: "money", emoji: "💰", color: "#4ade80", before: bankChecking, after: Math.max(0, bankChecking + val) });
    } else if (eff.key in player && typeof player[eff.key] === "number") {
      const ex = changes.find((c) => c.key === eff.key);
      if (ex) ex.after = Math.max(0, ex.after + val);
      else changes.push({ key: eff.key, emoji: meta.emoji, color: meta.color, before: player[eff.key] as number, after: Math.max(0, (player[eff.key] as number) + val) });
    }
  }

  if (changes.length === 0) return null;

  return (
    <div className="anim-preview-in" style={{
      marginTop: 10, padding: "10px 14px", borderRadius: 16,
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(255,255,255,0.07)",
    }}>
      <div style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.35)", marginBottom: 8, textAlign: "center" }}>
        بعد از انجام
      </div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "center" }}>
        {changes.map((ch) => {
          const isDown = ch.after < ch.before;
          const isMoney = ch.key === "money";
          return (
            <div key={ch.key} style={{
              display: "flex", alignItems: "center", gap: 4,
              padding: "4px 10px", borderRadius: 10,
              background: isDown ? "rgba(239,68,68,0.07)" : "rgba(74,222,128,0.07)",
              border: `1px solid ${isDown ? "rgba(239,68,68,0.15)" : "rgba(74,222,128,0.15)"}`,
            }}>
              <span style={{ fontSize: 11 }}>{ch.emoji}</span>
              <span style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>
                {isMoney ? formatMoney(ch.before) : toPersian(ch.before)}
              </span>
              <span style={{ fontSize: 9, color: "rgba(255,255,255,0.2)" }}>→</span>
              <span style={{ fontSize: 10, fontWeight: 800, color: isDown ? "#f87171" : "#4ade80" }}>
                {isMoney ? formatMoney(ch.after) : toPersian(ch.after)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Sponsor Toggle ────────────────────────────────────────────────────────────
function SponsorToggle({ sponsored, active, onToggle }: {
  sponsored: SponsoredVariant;
  active: boolean;
  onToggle: (v: boolean) => void;
}) {
  return (
    <div style={{
      marginTop: 10, padding: "6px", borderRadius: 16,
      background: "rgba(255,255,255,0.03)",
      border: active ? "1px solid rgba(212,168,67,0.3)" : "1px solid rgba(255,255,255,0.06)",
      display: "flex", gap: 4, transition: "border-color 0.2s",
    }}>
      <button
        onClick={() => onToggle(false)}
        style={{
          flex: 1, padding: "9px 0", borderRadius: 11, border: "none",
          background: !active ? "rgba(255,255,255,0.09)" : "transparent",
          color: !active ? "white" : "rgba(255,255,255,0.35)",
          fontSize: 12, fontWeight: 800, fontFamily: "inherit", cursor: "pointer",
          transition: "all 0.2s",
        }}
      >
        عادی
      </button>
      <button
        onClick={() => onToggle(true)}
        style={{
          flex: 1, padding: "9px 0", borderRadius: 11, border: "none",
          background: active ? "linear-gradient(135deg, #D4A843, #F0C966)" : "transparent",
          color: active ? "white" : "rgba(255,255,255,0.35)",
          fontSize: 12, fontWeight: 800, fontFamily: "inherit", cursor: "pointer",
          textShadow: active ? "0 1px 2px rgba(0,0,0,0.25)" : "none",
          transition: "all 0.2s",
        }}
      >
        ✦ {sponsored.brandName}
      </button>
    </div>
  );
}

// ─── Executing Phase ───────────────────────────────────────────────────────────
function ExecutingPhase({ category, option, sponsoredVariant, catColor }: {
  category: (typeof ACTION_CATEGORIES)[0];
  option?: ActionOption;
  sponsoredVariant?: SponsoredVariant;
  catColor: { accent: string };
}) {
  const isSponsored = !!sponsoredVariant;
  return (
    <div style={{ textAlign: "center", padding: "36px 0" }}>
      <div className="anim-breathe" style={{ fontSize: 60, marginBottom: 16 }}>
        {isSponsored ? sponsoredVariant.brandEmoji : (option?.emoji ?? category.emoji)}
      </div>
      <div style={{ fontSize: 16, fontWeight: 900, color: "white", marginBottom: 4 }}>
        {isSponsored ? sponsoredVariant.displayName : (option?.name ?? category.name)}
      </div>
      <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginBottom: 20 }}>
        در حال انجام...
      </div>
      <div style={{
        height: 6, borderRadius: 3,
        background: "rgba(255,255,255,0.07)", overflow: "hidden", margin: "0 40px",
      }}>
        <div
          className="anim-loading-bar"
          style={{
            width: "45%", height: "100%", borderRadius: 3,
            background: isSponsored
              ? "linear-gradient(90deg, transparent, #D4A843, #F0C966, transparent)"
              : `linear-gradient(90deg, transparent, ${catColor.accent}, transparent)`,
          }}
        />
      </div>
    </div>
  );
}

// ─── Result Phase ──────────────────────────────────────────────────────────────
function ResultPhase({ result, catColor, onClose }: {
  result: ActionResult;
  catColor: { accent: string; glow: string };
  onClose: () => void;
}) {
  if (!result.success) {
    return (
      <div style={{ textAlign: "center", padding: "24px 0" }}>
        <div className="anim-reward-pop" style={{ fontSize: 56, marginBottom: 12 }}>😬</div>
        <div style={{ fontSize: 17, fontWeight: 900, color: "white", marginBottom: 8 }}>نمیشه!</div>
        <div style={{
          fontSize: 13, fontWeight: 700, color: "#f87171",
          padding: "10px 16px", borderRadius: 14,
          background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.15)",
          marginBottom: 20,
        }}>
          {result.insufficientReason}
        </div>
        <button onClick={onClose} style={{
          width: "100%", padding: "13px 0", borderRadius: 18,
          border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)",
          color: "rgba(255,255,255,0.55)", fontSize: 14, fontWeight: 700,
          fontFamily: "inherit", cursor: "pointer",
        }}>
          باشه 😤
        </button>
      </div>
    );
  }

  // Find the biggest reward to show as hero number
  const moneyEffect = result.effects.find((e) => e.label.includes("💰"));
  const xpEffect    = result.effects.find((e) => e.label.includes("✨"));
  const heroEffect  = moneyEffect ?? xpEffect ?? result.effects[0];
  const otherEffects = result.effects.filter((e) => e !== heroEffect);

  const accentColor = result.wasSponsored ? "#F0C966" : catColor.accent;

  return (
    <div style={{ textAlign: "center", padding: "20px 0" }}>
      {result.riskTriggered ? (
        <>
          <div className="anim-reward-pop" style={{ fontSize: 52, marginBottom: 10 }}>😱</div>
          <div style={{ fontSize: 16, fontWeight: 900, color: "#fbbf24", marginBottom: 8 }}>
            انجام شد ولی...
          </div>
          <div style={{
            fontSize: 12, fontWeight: 700, color: "#f87171",
            padding: "8px 14px", borderRadius: 12,
            background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.15)",
            marginBottom: 16,
          }}>
            {result.riskTriggered.label}
          </div>
        </>
      ) : (
        <>
          {/* Hero icon */}
          <div className="anim-reward-pop" style={{ fontSize: 52, marginBottom: 10 }}>
            {result.wasSponsored ? "🌟" : "✅"}
          </div>

          {/* Sponsor badge */}
          {result.wasSponsored && result.brandName && (
            <div style={{
              display: "inline-block",
              fontSize: 10, fontWeight: 800,
              padding: "4px 14px", borderRadius: 10,
              background: "linear-gradient(135deg, #D4A843, #F0C966)",
              color: "white", textShadow: "0 1px 2px rgba(0,0,0,0.2)",
              marginBottom: 10,
            }}>
              ✦ با اسپانسری {result.brandName}
            </div>
          )}

          {/* Hero reward — BIG */}
          {heroEffect && (
            <div style={{
              fontSize: 34, fontWeight: 900,
              color: accentColor,
              marginBottom: 4,
              letterSpacing: "-1px",
              fontVariantNumeric: "tabular-nums",
              textShadow: `0 0 20px ${accentColor}60`,
            }}>
              {heroEffect.label}
            </div>
          )}

          {/* Secondary effects */}
          {otherEffects.length > 0 && (
            <div style={{ display: "flex", gap: 7, justifyContent: "center", flexWrap: "wrap", marginTop: 8 }}>
              {otherEffects.map((eff, i) => (
                <span key={i} className="anim-reward-float" style={{
                  fontSize: 12, fontWeight: 800,
                  padding: "5px 12px", borderRadius: 12,
                  background: result.wasSponsored ? "rgba(212,168,67,0.12)" : `${catColor.glow}`,
                  color: accentColor,
                  border: `1px solid ${accentColor}25`,
                  animationDelay: `${i * 0.08}s`,
                }}>
                  {eff.label}
                </span>
              ))}
            </div>
          )}
        </>
      )}

      <button
        onClick={onClose}
        style={{
          width: "100%", marginTop: 20, padding: "13px 0", borderRadius: 20,
          border: `1.5px solid ${accentColor}40`,
          background: `${catColor.glow}`,
          color: accentColor, fontSize: 14, fontWeight: 900,
          fontFamily: "inherit", cursor: "pointer",
        }}
      >
        {result.riskTriggered ? "آخ... باشه" : "عالیه! ✓"}
      </button>
    </div>
  );
}
