import { Activity, AlertTriangle, CheckCircle2, Clock3 } from "lucide-react"
import { useMemo, useState } from "react"
import { initialJobs } from "../data/fabrication-data"

export function useFabricationDashboard() {
  const [jobs, setJobs] = useState(initialJobs)
  const [activeJobId, setActiveJobId] = useState(initialJobs[0].id)

  const activeJob = jobs.find((job) => job.id === activeJobId) ?? jobs[0]

  const stats = useMemo(
    () => [
      {
        label: "Active Jobs",
        value: jobs.filter((job) => job.status === "in-progress").length,
        tone: "blue",
        icon: Activity,
      },
      {
        label: "Completed Today",
        value: jobs.filter((job) => job.status === "completed").length,
        tone: "green",
        icon: CheckCircle2,
      },
      {
        label: "Queued",
        value: jobs.filter((job) => job.status === "pending").length,
        tone: "slate",
        icon: Clock3,
      },
      {
        label: "Issues",
        value: jobs.filter((job) => job.status === "failed").length,
        tone: "red",
        icon: AlertTriangle,
      },
    ],
    [jobs],
  )

  return {
    activeJob,
    jobs,
    setActiveJobId,
    setJobs,
    stats,
  }
}
