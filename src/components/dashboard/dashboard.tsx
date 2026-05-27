import { useFabricationDashboard } from "../../hooks/use-fabrication-dashboard"
import { StatusCard } from "../ui/status-card"
import { DashboardHeading } from "./dashboard-heading"
import { JobQueue } from "./job-queue"
import { TopBar } from "./top-bar"
import { UploadPanel } from "./upload-panel"

interface DashboardProps {
  onOpenJob: (jobId: string) => void
  onOpenJobs: () => void
}

export function Dashboard({ onOpenJob, onOpenJobs }: DashboardProps) {
  const { activeJob, jobs, setActiveJobId, stats } = useFabricationDashboard()

  const handleOpenJob = (jobId: string) => {
    setActiveJobId(jobId)
    onOpenJob(jobId)
  }

  return (
    <div className="min-h-screen min-w-80 bg-[radial-gradient(circle_at_18%_14%,rgba(11,118,209,0.08),transparent_24rem),linear-gradient(180deg,#ffffff_0%,#f7f8fb_52%,#eef2f7_100%)] font-sans text-ink antialiased">
      <TopBar />

      <main className="mx-auto w-[min(1180px,calc(100%_-_48px))] py-11 pb-16 max-[980px]:w-[min(calc(100%_-_32px),760px)] max-[980px]:pt-8">
        <DashboardHeading />

        <section
          className="mt-7 grid grid-cols-4 gap-3.5 max-[980px]:grid-cols-1 max-[620px]:grid-cols-2"
          aria-label="Job status summary"
        >
          {stats.map((stat) => (
            <StatusCard key={stat.label} {...stat} />
          ))}
        </section>

        <UploadPanel />

        <JobQueue
          jobs={jobs}
          activeJob={activeJob}
          onSelectJob={handleOpenJob}
          onViewAll={onOpenJobs}
        />
      </main>
    </div>
  )
}
