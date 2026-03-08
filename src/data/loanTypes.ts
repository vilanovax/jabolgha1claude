export interface LoanType {
  id: string;
  name: string;
  emoji: string;
  maxAmount: number;
  interestRate: number;      // monthly interest rate %
  termMonths: number;        // repayment in game-months (30 days each)
  requiresLevel: number;
  requiresSavings: number;   // min savings to qualify
  description: string;
}

export interface ActiveLoan {
  id: string;
  typeId: string;
  typeName: string;
  originalAmount: number;
  remainingPrincipal: number;
  monthlyPayment: number;
  interestRate: number;
  remainingInstallments: number;
  totalInstallments: number;
  nextPaymentDay: number;    // dayInGame when next payment due
  latePayments: number;
}

export const LOAN_TYPES: LoanType[] = [
  {
    id: "emergency",
    name: "وام اضطراری",
    emoji: "🆘",
    maxAmount: 10_000_000,
    interestRate: 3,
    termMonths: 6,
    requiresLevel: 1,
    requiresSavings: 0,
    description: "وام سریع برای شرایط اضطراری با سود بالا",
  },
  {
    id: "personal",
    name: "وام شخصی",
    emoji: "💳",
    maxAmount: 30_000_000,
    interestRate: 2,
    termMonths: 12,
    requiresLevel: 2,
    requiresSavings: 0,
    description: "وام عمومی برای نیازهای شخصی",
  },
  {
    id: "business",
    name: "وام کسب‌وکار",
    emoji: "🏢",
    maxAmount: 100_000_000,
    interestRate: 1.8,
    termMonths: 18,
    requiresLevel: 3,
    requiresSavings: 20_000_000,
    description: "سرمایه برای راه‌اندازی یا توسعه کسب‌وکار",
  },
  {
    id: "housing",
    name: "وام مسکن",
    emoji: "🏠",
    maxAmount: 200_000_000,
    interestRate: 1.5,
    termMonths: 24,
    requiresLevel: 5,
    requiresSavings: 50_000_000,
    description: "وام بلندمدت برای خرید یا اجاره مسکن",
  },
];

export function calculateMonthlyPayment(amount: number, monthlyRate: number, termMonths: number): number {
  const r = monthlyRate / 100;
  if (r === 0) return Math.round(amount / termMonths);
  return Math.round((amount * r * Math.pow(1 + r, termMonths)) / (Math.pow(1 + r, termMonths) - 1));
}
