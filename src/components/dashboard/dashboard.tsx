import { useFabricationDashboard } from "../../hooks/use-fabrication-dashboard"
import { StatusCard } from "../ui/status-card"
import { CreateJobPanel } from "./create-job-panel"
import { DashboardHeading } from "./dashboard-heading"
import { JobDetailPanel } from "./job-detail-panel"
import { JobQueue } from "./job-queue"
import { OperatorControlsPanel } from "./operator-controls-panel"
import { TopBar } from "./top-bar"
import { UploadPanel } from "./upload-panel"

interface DashboardProps {
  onOpenJobs: () => void
}

export function Dashboard({ onOpenJobs }: DashboardProps) {
  const {
    actionMessage,
    activeJob,
    burnRuns,
    burnStage,
    completeStage,
    createJob,
    error,
    inspectBurnRun,
    isCreatingJob,
    isLoadingBurnRuns,
    isLoadingJobDetails,
    isLoadingJobs,
    isRunningAction,
    jobs,
    runCarrierAction,
    selectedBurnRun,
    setActiveJobId,
    setLaserOrigin,
    stats,
  } = useFabricationDashboard()

  return (
    <div className="min-h-screen min-w-80 bg-[radial-gradient(circle_at_18%_14%,rgba(11,118,209,0.08),transparent_24rem),linear-gradient(180deg,#ffffff_0%,#f7f8fb_52%,#eef2f7_100%)] font-sans text-ink antialiased">
      <TopBar />

      <main className="mx-auto w-[min(1180px,calc(100%_-_48px))] py-11 pb-16 max-[980px]:w-[min(calc(100%_-_32px),760px)] max-[980px]:pt-8">
        <DashboardHeading activeJob={activeJob} jobs={jobs} />

        <section
          className="mt-7 grid grid-cols-4 gap-3.5 max-[980px]:grid-cols-1 max-[620px]:grid-cols-2"
          aria-label="Job status summary"
        >
          {stats.map((stat) => (
            <StatusCard key={stat.label} {...stat} />
          ))}
        </section>

        <UploadPanel />

        <CreateJobPanel
          actionMessage={actionMessage}
          isCreating={isCreatingJob}
          onCreateJob={createJob}
        />

        <JobQueue
          jobs={jobs}
          activeJob={activeJob}
          isLoading={isLoadingJobs}
          onSelectJob={setActiveJobId}
          onViewAll={onOpenJobs}
        />

        <JobDetailPanel
          error={error}
          isLoading={isLoadingJobDetails}
          job={activeJob}
        />

        <OperatorControlsPanel
          burnRuns={burnRuns}
          error={error}
          isLoadingBurnRuns={isLoadingBurnRuns}
          isRunningAction={isRunningAction}
          job={activeJob}
          onBurnStage={burnStage}
          onCarrierAction={runCarrierAction}
          onCompleteStage={completeStage}
          onInspectBurnRun={inspectBurnRun}
          onSetLaserOrigin={setLaserOrigin}
          selectedBurnRun={selectedBurnRun}
        />
      </main>
    </div>
  )
}
