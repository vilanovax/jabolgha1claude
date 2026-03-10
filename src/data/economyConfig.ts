// ─── Economy Config ───
// Single source of truth for all economic constants.
// Adjust these values to rebalance without touching game logic.

// ─── Work Income ──────────────────────────────────────────────
// Base rates for a player with NO active job (freelance).
// When player has a job, income = job.salary / WORK_DAYS_PER_MONTH.

export const WORK_INCOME_BASE = {
  part_time:  1_500_000,  // 1.5M — half day freelance
  full_shift: 3_000_000,  // 3M   — full day freelance (~90M/month)
  overtime:   5_000_000,  // 5M   — extended freelance (with fatigue risk)
} as const;

/** Used to convert monthly salary → per-shift income */
export const WORK_DAYS_PER_MONTH = 22;

// Target income/expense ratio: 3–5× (player spends 20–35% of income)

// ─── Investment (Quick Invest — action templates) ─────────────
// These are small "action" investments, not the full Market System.
// Principal is returned — only profit/loss is calculated on top.
// EV must be ≥ 0 at target risk.

export const QUICK_INVEST = {
  small: {
    cost:           5_000_000,
    grossReturn:    7_000_000,  // 5M principal + 2M profit
    riskChance:     0.35,
    riskPenalty:   -2_000_000,  // partial loss — EV ≈ +1.3M
  },
  medium: {
    cost:          15_000_000,
    grossReturn:   21_000_000,  // 15M + 6M profit
    riskChance:     0.45,
    riskPenalty:   -8_000_000,  // EV ≈ +2.4M
  },
  big: {
    cost:          30_000_000,
    grossReturn:   45_000_000,  // 30M + 15M profit
    riskChance:     0.50,
    riskPenalty:  -18_000_000,  // EV ≈ +6M
  },
} as const;

// ─── Bank ─────────────────────────────────────────────────────
export const BANK_SAVINGS_DAILY_RATE = 0.08; // 0.08% daily ≈ 29% annual

// ─── Living Cost Multiplier Thresholds ────────────────────────
// City inflation modifier boundaries
export const INFLATION_MULTIPLIER_MIN = 0.8;
export const INFLATION_MULTIPLIER_MAX = 1.6;

// ─── Market System ────────────────────────────────────────────
// Base parameters for Dynamic Market System

/** Stock price daily change limits */
export const STOCK_DAILY_CHANGE_MAX = 0.12;  // ±12% max per day
export const STOCK_DAILY_CHANGE_MIN = -0.12;

/** Gold daily change limits */
export const GOLD_DAILY_CHANGE_MAX  = 0.04;  // ±4% max (safer asset)
export const GOLD_DAILY_CHANGE_MIN  = -0.04;

/** Startup outcome check delay */
export const STARTUP_MIN_DAYS = 7;
export const STARTUP_MAX_DAYS = 21;

/** Default startup outcome probabilities by stage */
export const STARTUP_SUCCESS_CHANCE = {
  idea:   0.25,
  seed:   0.45,
  growth: 0.65,
} as const;

/** Startup return multipliers on success/failure */
export const STARTUP_SUCCESS_RETURN = 2.5;  // 2.5× investment on success
export const STARTUP_FAILURE_RETURN = 0.2;  // get back 20% on failure (write-off)
