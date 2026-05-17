import { useFabricationDashboard } from "../../hooks/use-fabrication-dashboard"
import { StatusCard } from "../ui/status-card"
import { DashboardHeading } from "./dashboard-heading"
import { JobQueue } from "./job-queue"
import { TopBar } from "./top-bar"
import { UploadPanel } from "./upload-panel"

interface DashboardProps {
  onOpenJob: (jobId: string) => void
}

export function Dashboard({ onOpenJob }: DashboardProps) {
  const { activeJob, jobs, setActiveJobId, stats } = useFabricationDashboard()

  const handleOpenJob = (jobId: string) => {
    setActiveJobId(jobId)
    onOpenJob(jobId)
  }

  return (
    <div className="app-shell">
      <TopBar />

      <main className="dashboard-page">
        <DashboardHeading />

        <section className="status-grid" aria-label="Job status summary">
          {stats.map((stat) => (
            <StatusCard key={stat.label} {...stat} />
          ))}
        </section>

        <UploadPanel />

        <JobQueue
          jobs={jobs}
          activeJob={activeJob}
          onSelectJob={handleOpenJob}
        />
      </main>
    </div>
  )
}
