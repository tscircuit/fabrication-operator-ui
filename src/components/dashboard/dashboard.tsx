import type { FabricationDashboardState } from "../../hooks/use-fabrication-dashboard"
import { CreateJobPanel } from "./create-job-panel"
import { DashboardHeading } from "./dashboard-heading"
import { JobQueue } from "./job-queue"
import { TopBar } from "./top-bar"

interface DashboardProps {
  dashboard: FabricationDashboardState
  onOpenJob: (jobId: string) => void
}

export function Dashboard({ dashboard, onOpenJob }: DashboardProps) {
  const {
    actionMessage,
    activeJob,
    createJobFromCircuitJsonFile,
    createJob,
    isCreatingJob,
    isLoadingJobs,
    jobs,
  } = dashboard

  return (
    <div className="min-h-screen min-w-80 bg-[radial-gradient(circle_at_18%_14%,rgba(11,118,209,0.08),transparent_24rem),linear-gradient(180deg,#ffffff_0%,#f7f8fb_52%,#eef2f7_100%)] font-sans text-ink antialiased">
      <TopBar />

      <main className="mx-auto w-[min(1180px,calc(100%_-_48px))] py-11 pb-16 max-[980px]:w-[min(calc(100%_-_32px),760px)] max-[980px]:pt-8">
        <DashboardHeading activeJob={null} jobs={jobs} />

        <CreateJobPanel
          actionMessage={actionMessage}
          isCreating={isCreatingJob}
          onCreateJob={createJob}
          onCreateJobFromFile={createJobFromCircuitJsonFile}
        />

        <JobQueue
          jobs={jobs}
          activeJob={activeJob}
          isLoading={isLoadingJobs}
          onOpenJob={onOpenJob}
        />
      </main>
    </div>
  )
}
