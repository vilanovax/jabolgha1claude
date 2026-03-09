// ─── Career Track Seed Data ───

import type { CareerTrack, CareerProgress } from "./types";

export interface CareerTrackMeta {
  id: CareerTrack;
  labelFa: string;
  emoji: string;
  descFa: string;
  relatedJobTypes: string[]; // job.type or job.title keywords
}

export const CAREER_TRACK_META: CareerTrackMeta[] = [
  {
    id: "tech",
    labelFa: "فناوری",
    emoji: "💻",
    descFa: "برنامه‌نویسی، مهندسی نرم‌افزار، DevOps",
    relatedJobTypes: ["استارتاپ", "برنامه", "react", "python", "فرانت", "بک", "نرم‌افزار", "it", "دیجیتال"],
  },
  {
    id: "data",
    labelFa: "داده",
    emoji: "📊",
    descFa: "علم داده، تحلیل داده، هوش مصنوعی",
    relatedJobTypes: ["داده", "data", "آمار", "تحلیلگر", "analyst"],
  },
  {
    id: "design",
    labelFa: "طراحی",
    emoji: "🎨",
    descFa: "طراحی UI/UX، گرافیک، محصول",
    relatedJobTypes: ["طراح", "ui", "ux", "گرافیک", "design"],
  },
  {
    id: "education",
    labelFa: "آموزش",
    emoji: "📚",
    descFa: "تدریس، آموزش آنلاین، محتوا",
    relatedJobTypes: ["مدرس", "آموزش", "معلم", "استاد", "teacher"],
  },
  {
    id: "marketing",
    labelFa: "بازاریابی",
    emoji: "📣",
    descFa: "دیجیتال مارکتینگ، برند، فروش",
    relatedJobTypes: ["بازاریاب", "فروش", "مارکتینگ", "برند", "marketing"],
  },
  {
    id: "finance",
    labelFa: "مالی",
    emoji: "🏦",
    descFa: "حسابداری، بانکداری، سرمایه‌گذاری",
    relatedJobTypes: ["مالی", "حساب", "بانک", "سرمایه", "finance"],
  },
  {
    id: "operations",
    labelFa: "عملیات",
    emoji: "⚙️",
    descFa: "IT، عملیات، پشتیبانی، لجستیک",
    relatedJobTypes: ["دولتی", "کارشناس", "it", "عملیات", "پشتیبانی"],
  },
  {
    id: "management",
    labelFa: "مدیریت",
    emoji: "🎯",
    descFa: "مدیریت پروژه، رهبری، کارآفرینی",
    relatedJobTypes: ["مدیر", "cto", "ceo", "manager", "director"],
  },
];

/** Infer CareerTrack from job type / title strings (Persian) */
export function inferCareerTrack(jobType?: string, jobTitle?: string): CareerTrack {
  const text = `${jobType ?? ""} ${jobTitle ?? ""}`.toLowerCase();
  for (const meta of CAREER_TRACK_META) {
    if (meta.relatedJobTypes.some((kw) => text.includes(kw))) {
      return meta.id;
    }
  }
  return "tech"; // default
}

/** Create a blank CareerProgress for a new track at intern level */
export function createInitialCareerProgress(track: CareerTrack): CareerProgress {
  const { CAREER_TITLE_MAP } = require("./career-config") as typeof import("./career-config");
  return {
    track,
    level: "intern",
    roleTitleFa: CAREER_TITLE_MAP[track].intern,
    careerXp: 0,
    yearsOfExperience: 0,
    professionalReputation: 0,
    completedWorkShifts: 0,
    acceptedJobsCount: 0,
    successfulWorkStreaks: 0,
    currentEmployerId: null,
    branch: null,
  };
}
