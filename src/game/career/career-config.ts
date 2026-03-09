// ─── Career Config ───
// Level progression rules, salary multipliers, title map

import type { CareerLevel, CareerLevelDefinition, CareerTrack } from "./types";

/** How many work shifts equal 1 year of experience */
export const SHIFTS_PER_EXPERIENCE_YEAR = 40;

/** Ladder definitions — same for all tracks in MVP */
export const CAREER_LADDER: CareerLevelDefinition[] = [
  {
    level: "intern",
    minCareerXp: 0,
    minYearsOfExperience: 0,
    minReputation: 0,
    minAcceptedJobs: 0,
  },
  {
    level: "junior",
    minCareerXp: 100,
    minYearsOfExperience: 0,
    minReputation: 5,
    minAcceptedJobs: 1,
    minCompletedShifts: 5,
  },
  {
    level: "mid",
    minCareerXp: 300,
    minYearsOfExperience: 0.5,
    minReputation: 15,
    minAcceptedJobs: 2,
    minCompletedShifts: 20,
  },
  {
    level: "senior",
    minCareerXp: 700,
    minYearsOfExperience: 1.5,
    minReputation: 30,
    minAcceptedJobs: 3,
    minCompletedShifts: 60,
  },
  {
    level: "lead",
    minCareerXp: 1200,
    minYearsOfExperience: 2.5,
    minReputation: 45,
    minAcceptedJobs: 5,
    minCompletedShifts: 120,
  },
  {
    level: "manager",
    minCareerXp: 1800,
    minYearsOfExperience: 3.5,
    minReputation: 60,
    minAcceptedJobs: 6,
    minCompletedShifts: 200,
  },
  {
    level: "executive",
    minCareerXp: 3000,
    minYearsOfExperience: 5,
    minReputation: 80,
    minAcceptedJobs: 8,
    minCompletedShifts: 350,
  },
];

/** Salary multiplier by career level */
export const SALARY_MULTIPLIERS: Record<CareerLevel, number> = {
  intern:    0.6,
  junior:    1.0,
  mid:       1.25,
  senior:    1.6,
  lead:      2.0,
  manager:   2.3,
  executive: 3.0,
};

/** Career titles in Persian per track × level */
export const CAREER_TITLE_MAP: Record<CareerTrack, Record<CareerLevel, string>> = {
  tech: {
    intern:    "کارآموز فناوری",
    junior:    "برنامه‌نویس جونیور",
    mid:       "توسعه‌دهنده میدل",
    senior:    "توسعه‌دهنده ارشد",
    lead:      "لید فنی",
    manager:   "مدیر فنی",
    executive: "مدیرعامل فناوری (CTO)",
  },
  data: {
    intern:    "کارآموز داده",
    junior:    "تحلیلگر داده جونیور",
    mid:       "دانشمند داده",
    senior:    "دانشمند ارشد داده",
    lead:      "لید تیم داده",
    manager:   "مدیر داده",
    executive: "مدیر ارشد داده (CDO)",
  },
  design: {
    intern:    "کارآموز طراحی",
    junior:    "طراح جونیور",
    mid:       "طراح UI/UX",
    senior:    "طراح ارشد",
    lead:      "لید طراحی",
    manager:   "مدیر خلاقیت",
    executive: "مدیر ارشد طراحی",
  },
  education: {
    intern:    "دستیار آموزشی",
    junior:    "مدرس جونیور",
    mid:       "مدرس آنلاین",
    senior:    "استاد ارشد",
    lead:      "سرپرست آموزش",
    manager:   "مدیر آموزشگاه",
    executive: "مدیر ارشد آموزش",
  },
  marketing: {
    intern:    "کارآموز بازاریابی",
    junior:    "کارشناس بازاریابی",
    mid:       "متخصص دیجیتال مارکتینگ",
    senior:    "کارشناس ارشد برند",
    lead:      "لید مارکتینگ",
    manager:   "مدیر بازاریابی",
    executive: "مدیر ارشد برند (CMO)",
  },
  finance: {
    intern:    "کارآموز مالی",
    junior:    "حسابدار جونیور",
    mid:       "کارشناس مالی",
    senior:    "تحلیلگر ارشد مالی",
    lead:      "لید مالی",
    manager:   "مدیر مالی",
    executive: "مدیر ارشد مالی (CFO)",
  },
  operations: {
    intern:    "کارآموز عملیات",
    junior:    "کارشناس IT",
    mid:       "متخصص عملیات",
    senior:    "کارشناس ارشد عملیات",
    lead:      "لید عملیات",
    manager:   "مدیر عملیات",
    executive: "مدیر ارشد عملیات (COO)",
  },
  management: {
    intern:    "دستیار مدیریت",
    junior:    "مدیر پروژه جونیور",
    mid:       "مدیر پروژه",
    senior:    "مدیر ارشد پروژه",
    lead:      "مدیر برنامه",
    manager:   "مدیر واحد",
    executive: "مدیرعامل (CEO)",
  },
};

/** Career XP earned per event */
export const CAREER_XP_EVENTS = {
  work_shift_completed:    10,
  job_accepted:            30,
  interview_success:       20,
  mission_career_complete: 40,
  project_completed:       50,
  streak_bonus:             5,  // per streak day
};

/** Career level ordering for comparison */
export const LEVEL_ORDER: CareerLevel[] = [
  "intern", "junior", "mid", "senior", "lead", "manager", "executive",
];

export function getLevelIndex(level: CareerLevel): number {
  return LEVEL_ORDER.indexOf(level);
}

export function getNextLevel(level: CareerLevel): CareerLevel | null {
  const idx = getLevelIndex(level);
  return idx < LEVEL_ORDER.length - 1 ? LEVEL_ORDER[idx + 1] : null;
}
