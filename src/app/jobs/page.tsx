"use client";
import { useState } from "react";
import TopHeader from "@/components/layout/TopHeader";
import BottomNav from "@/components/layout/BottomNav";
import ProfessionalStatusPanel from "@/components/jobs/ProfessionalStatusPanel";
import GoldenMembershipCard from "@/components/jobs/GoldenMembershipCard";
import JobTabFilters from "@/components/jobs/JobTabFilters";
import JobCard from "@/components/jobs/JobCard";
import PremiumJobCard from "@/components/jobs/PremiumJobCard";
import ApplicationModal from "@/components/jobs/ApplicationModal";
import type { ApplicationResult } from "@/components/jobs/ApplicationModal";
import { jobListings, toPersian } from "@/data/mock";
import type { JobListing } from "@/data/mock";

type TabKey = "suitable" | "hot" | "premium" | "all";

export default function JobsPage() {
  const [tab, setTab] = useState<TabKey>("suitable");
  const [applied, setApplied] = useState<number[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalPhase, setModalPhase] = useState<"loading" | "result">("loading");
  const [modalResult, setModalResult] = useState<ApplicationResult | null>(null);
  const [selectedJob, setSelectedJob] = useState<JobListing | null>(null);

  const suitable = jobListings.filter((j) => j.suitable);
  const hot = jobListings.filter((j) => j.isHot);
  const premium = jobListings.filter((j) => j.isPremium);
  const counts = {
    suitable: suitable.length,
    hot: hot.length,
    premium: premium.length,
    all: jobListings.length,
  };

  let items: JobListing[];
  switch (tab) {
    case "suitable": items = suitable; break;
    case "hot": items = hot; break;
    case "premium": items = premium; break;
    default: items = jobListings;
  }

  const premiumItems = items.filter((j) => j.isPremium);
  const regularItems = items.filter((j) => !j.isPremium);

  function handleApply(jobId: number) {
    const job = jobListings.find((j) => j.id === jobId);
    if (!job || applied.includes(jobId)) return;

    setSelectedJob(job);
    setModalPhase("loading");
    setModalResult(null);
    setModalVisible(true);

    setTimeout(() => {
      const roll = Math.random() * 100;
      const accepted = roll <= job.acceptanceChance;

      const result: ApplicationResult = accepted
        ? {
            accepted: true,
            xpGain: 50 + Math.floor(Math.random() * 30),
            moneyGain: job.salaryMin,
            reputationGain: 3 + Math.floor(Math.random() * 5),
          }
        : {
            accepted: false,
            rejectReason:
              job.acceptanceChance < 40
                ? "سطح مهارت شما کافی نیست. دوره‌های بیشتری بگذرونید."
                : job.acceptanceChance < 60
                  ? "رقابت زیاد بود. شهرت حرفه‌ای بیشتری نیاز دارید."
                  : "یک کاندیدای قوی‌تر انتخاب شد. دوباره تلاش کنید!",
          };

      setModalResult(result);
      setModalPhase("result");

      if (accepted) {
        setApplied((prev) => [...prev, jobId]);
      }
    }, 3000);
  }

  function handleModalClose() {
    setModalVisible(false);
    setSelectedJob(null);
  }

  return (
    <div className="game-bg" style={{ minHeight: "100dvh" }}>
      <TopHeader />

      <div className="page-enter" style={{
        paddingTop: "calc(var(--header-h) + 8px)",
        paddingBottom: "calc(var(--nav-h) + 16px)",
        paddingLeft: 14, paddingRight: 14,
        position: "relative", zIndex: 2,
      }}>
        {/* Page title */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          marginBottom: 14,
        }}>
          <div style={{
            fontSize: 18, fontWeight: 800, color: "#0f172a",
            display: "flex", alignItems: "center", gap: 6,
          }}>
            <span style={{ fontSize: 20 }}>💼</span>
            بازار کار
          </div>
          <div style={{
            fontSize: 11, fontWeight: 700,
            padding: "4px 12px", borderRadius: "var(--r-full)",
            background: "linear-gradient(135deg, #dcfce7, #f0fdf4)",
            color: "#16a34a", border: "1px solid #bbf7d0",
            boxShadow: "0 2px 8px rgba(34,197,94,0.15)",
          }}>
            {toPersian(suitable.length)} آگهی مناسب
          </div>
        </div>

        {/* Professional Status */}
        <ProfessionalStatusPanel />

        {/* Golden Membership */}
        <GoldenMembershipCard />

        {/* Tab Filters */}
        <JobTabFilters activeTab={tab} onTabChange={setTab} counts={counts} />

        {/* Premium Jobs */}
        {premiumItems.length > 0 && (
          <div style={{ marginBottom: 4 }}>
            {premiumItems.map((job) => (
              <PremiumJobCard
                key={job.id}
                job={job}
                isApplied={applied.includes(job.id)}
                onApply={handleApply}
              />
            ))}
          </div>
        )}

        {/* Regular Jobs */}
        {regularItems.map((job) => (
          <JobCard
            key={job.id}
            job={job}
            isApplied={applied.includes(job.id)}
            onApply={handleApply}
          />
        ))}

        {/* Empty state */}
        {items.length === 0 && (
          <div style={{
            textAlign: "center", padding: "40px 20px",
            color: "#94a3b8", fontSize: 13,
          }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
            آگهی‌ای در این دسته وجود نداره
          </div>
        )}
      </div>

      <BottomNav />

      <ApplicationModal
        visible={modalVisible}
        phase={modalPhase}
        result={modalResult}
        jobTitle={selectedJob?.title || ""}
        onClose={handleModalClose}
      />
    </div>
  );
}
