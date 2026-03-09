"use client";
import { useState, useEffect, useMemo } from "react";
import TopHeader from "@/components/layout/TopHeader";
import BottomNav from "@/components/layout/BottomNav";
import CityEconomyBanner from "@/components/jobs/CityEconomyBanner";
import CareerProfileCard from "@/components/jobs/CareerProfileCard";
import SmartFilters from "@/components/jobs/SmartFilters";
import type { SmartFilterKey } from "@/components/jobs/SmartFilters";
import JobCardV2 from "@/components/jobs/JobCardV2";
import InterviewModal from "@/components/jobs/InterviewModal";
import type { InterviewResult } from "@/components/jobs/InterviewModal";
import { jobListings, toPersian } from "@/data/mock";
import type { JobListing, SeniorityLevel } from "@/data/mock";
import { useGameStore } from "@/stores/gameStore";
import { useCityStore } from "@/game/city/city-store";
import { getCityGameplayModifiers } from "@/game/integration/city-impact-resolver";
import { inferJobSector } from "@/game/integration/job-city-bridge";
import { useCareerStore } from "@/game/career/career-store";

// Calculate best match score across all seniority levels of a job
function getBestMatchScore(
  job: JobListing,
  playerXp: number,
  completedCourses: string[],
  playerSkills: { name: string; level: number }[],
  cityHiringBoost: number,
): number {
  let best = 0;
  for (const level of job.seniorityLevels) {
    const xpScore    = level.minXp === 0 ? 40 : Math.min(1, playerXp / level.minXp) * 40;
    const totalSkills = level.requirements.length;
    const metSkills  = totalSkills === 0 ? 1 : level.requirements.filter((req) => {
      const ps = playerSkills.find((s) => s.name === req.skill);
      return ps && ps.level >= req.level;
    }).length / totalSkills;
    const totalCourses = level.requiredCourses.length;
    const metCourses   = totalCourses === 0 ? 1 : level.requiredCourses.filter((c) =>
      completedCourses.includes(c)
    ).length / totalCourses;
    const cityScore = Math.min(15, 7.5 + cityHiringBoost * 50);
    const score = Math.round(Math.min(100, xpScore + metSkills * 30 + metCourses * 15 + cityScore));
    if (score > best) best = score;
  }
  return best;
}

export default function JobsPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const [filter, setFilter]         = useState<SmartFilterKey>("all");
  const [applied, setApplied]       = useState<number[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalPhase, setModalPhase]     = useState<"loading" | "interview" | "result">("loading");
  const [modalResult, setModalResult]   = useState<InterviewResult | null>(null);
  const [selectedJob, setSelectedJob]   = useState<JobListing | null>(null);

  const player          = useGameStore((s) => s.player);
  const completedCourses = useGameStore((s) => s.completedCourses);
  const skills          = useGameStore((s) => s.skills);
  const allSkills       = [...skills.hard, ...skills.soft];
  const careerStore     = useCareerStore();

  // City modifiers (primitive selectors to avoid infinite loop)
  const lastUpdatedDay  = useCityStore((s) => s.lastUpdatedDay);
  const economyHealth   = useCityStore((s) => s.economyHealth);
  const cityModifiers   = useMemo(() => {
    if (!mounted) return null;
    return getCityGameplayModifiers(useCityStore.getState());
  }, [mounted, lastUpdatedDay, economyHealth]);

  const playerXp = mounted ? player.xp : 0;

  // Per-job hiring boost from city
  function getCityBoost(job: JobListing): number {
    if (!cityModifiers) return 0;
    const sector = inferJobSector(job);
    return cityModifiers.jobMarket.hiringChanceModifierBySector[sector] ?? 0;
  }

  // Annotate jobs with match scores for filtering
  const annotated = useMemo(() => jobListings.map((job) => ({
    job,
    score: getBestMatchScore(job, playerXp, completedCourses, allSkills, getCityBoost(job)),
    boost: getCityBoost(job),
  // eslint-disable-next-line react-hooks/exhaustive-deps
  })), [playerXp, completedCourses, allSkills.length, cityModifiers]);

  const filtered = useMemo(() => {
    switch (filter) {
      case "best":    return annotated.filter((a) => a.score >= 60);
      case "hot":     return annotated.filter((a) => a.job.isHot);
      case "premium": return annotated.filter((a) => a.job.isPremium);
      default:        return annotated;
    }
  }, [filter, annotated]);

  const counts: Record<SmartFilterKey, number> = {
    all:     annotated.length,
    best:    annotated.filter((a) => a.score >= 60).length,
    hot:     annotated.filter((a) => a.job.isHot).length,
    premium: annotated.filter((a) => a.job.isPremium).length,
  };

  function handleApply(jobId: number, seniority: SeniorityLevel) {
    const job = jobListings.find((j) => j.id === jobId);
    if (!job || applied.includes(jobId)) return;

    setSelectedJob(job);
    setModalPhase("loading");
    setModalResult(null);
    setModalVisible(true);

    // Phase 1: loading (1.5s) → Phase 2: interview mini-event (1.5s) → Phase 3: result
    setTimeout(() => {
      setModalPhase("interview");

      setTimeout(() => {
        const roll      = Math.random() * 100;
        const xpRatio   = Math.min(1, playerXp / seniority.minXp);
        const boost     = getCityBoost(job);
        const baseChance = 35 + xpRatio * 40 + boost * 20; // 35–75%+
        const accepted  = roll <= baseChance;

        const result: InterviewResult = accepted
          ? {
              accepted: true,
              xpGain: 50 + Math.floor(Math.random() * 30),
              moneyGain: seniority.salary,
              reputationGain: 3 + Math.floor(Math.random() * 5),
            }
          : {
              accepted: false,
              rejectReason:
                baseChance < 45
                  ? "سطح مهارت شما کافی نیست."
                  : baseChance < 60
                    ? "رقابت زیاد بود. اعتبار بیشتری نیاز دارید."
                    : "یک کاندیدای قوی‌تر انتخاب شد.",
              tip:
                baseChance < 45
                  ? "دوره‌های بیشتری بگذرانید و XP کسب کنید."
                  : "شهرت حرفه‌ای خود را با پروژه‌های بیشتر بالا ببرید.",
            };

        setModalResult(result);
        setModalPhase("result");
        if (accepted) {
          setApplied((prev) => [...prev, jobId]);
          // Fire career progression events
          careerStore.handleJobAccepted(job.type, job.title, job.company);
          careerStore.handleInterviewSuccess(job.type, job.title);
        }
      }, 2000);
    }, 1500);
  }

  function handleModalClose() {
    setModalVisible(false);
    setSelectedJob(null);
  }

  return (
    <div className="scene-bg" style={{ minHeight: "100dvh" }}>
      <TopHeader />

      {/* Floating particles */}
      {[0, 1, 2, 3].map((i) => (
        <div key={i} style={{
          position: "fixed",
          width: 3, height: 3, borderRadius: "50%",
          background: i % 2 === 0 ? "rgba(96,165,250,0.3)" : "rgba(212,168,67,0.3)",
          top: `${15 + i * 20}%`,
          right: `${8 + i * 22}%`,
          animation: `particle-drift ${5 + i * 2}s ease-in-out ${i * 1.5}s infinite`,
          pointerEvents: "none", zIndex: 0,
        }} />
      ))}

      <div className="page-enter" style={{
        paddingTop: "calc(var(--header-h) + 8px)",
        paddingBottom: "calc(var(--nav-h) + 16px)",
        paddingLeft: 14, paddingRight: 14,
        position: "relative", zIndex: 2,
      }}>
        {/* Page header */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          marginBottom: 14,
        }}>
          <div style={{
            fontSize: 18, fontWeight: 800, color: "white",
            display: "flex", alignItems: "center", gap: 8,
          }}>
            <span style={{ fontSize: 22 }}>💼</span>
            بازار کار
          </div>
          <div style={{
            fontSize: 11, fontWeight: 700, padding: "4px 12px",
            borderRadius: 100,
            background: "rgba(74,222,128,0.1)", color: "#4ade80",
            border: "1px solid rgba(74,222,128,0.2)",
          }}>
            {toPersian(jobListings.length)} آگهی
          </div>
        </div>

        {/* City economy banner */}
        <CityEconomyBanner />

        {/* Career profile */}
        <CareerProfileCard />

        {/* Smart filters */}
        <SmartFilters active={filter} onChange={setFilter} counts={counts} />

        {/* Job cards V2 */}
        {filtered.length > 0 ? (
          filtered.map(({ job, boost }) => (
            <JobCardV2
              key={job.id}
              job={job}
              isApplied={applied.includes(job.id)}
              onApply={handleApply}
              playerXp={playerXp}
              completedCourses={completedCourses}
              playerSkills={allSkills}
              cityHiringBoost={boost}
            />
          ))
        ) : (
          <div style={{
            textAlign: "center", padding: "40px 20px",
            color: "rgba(255,255,255,0.3)", fontSize: 13,
          }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
            آگهی‌ای در این دسته وجود نداره
          </div>
        )}
      </div>

      <BottomNav />

      <InterviewModal
        visible={modalVisible}
        phase={modalPhase}
        result={modalResult}
        jobTitle={selectedJob?.title ?? ""}
        onClose={handleModalClose}
      />
    </div>
  );
}
