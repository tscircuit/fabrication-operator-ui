import { useEffect, useState } from "react"
import { Dashboard } from "./components/dashboard/dashboard"
import { FabricationPage } from "./components/fabrication/fabrication-page"
import { JobsPage } from "./components/jobs/jobs-page"
import { initialJobs } from "./data/fabrication-data"
import { fabricationStages } from "./data/fabrication-stages"
import type { FabricationStageId } from "./types/fabrication"

type AppRoute =
  | { name: "dashboard" }
  | { name: "jobs" }
  | { name: "job"; jobId: string }

function getRouteFromHash(): AppRoute {
  if (window.location.hash === "#/jobs") {
    return { name: "jobs" }
  }

  const jobMatch = window.location.hash.match(/^#\/jobs\/([^/]+)$/)
  if (jobMatch?.[1]) {
    return { name: "job", jobId: jobMatch[1] }
  }

  return { name: "dashboard" }
}

export function App() {
  const [route, setRoute] = useState<AppRoute>(() => getRouteFromHash())
  const [jobs, setJobs] = useState(initialJobs)
  const selectedJob =
    route.name === "job" ? jobs.find((job) => job.id === route.jobId) : null

  useEffect(() => {
    const handleHashChange = () => setRoute(getRouteFromHash())

    window.addEventListener("hashchange", handleHashChange)
    return () => window.removeEventListener("hashchange", handleHashChange)
  }, [])

  const handleOpenJob = (jobId: string) => {
    window.location.hash = `/jobs/${jobId}`
    setRoute({ name: "job", jobId })
  }

  const handleOpenJobs = () => {
    window.location.hash = "/jobs"
    setRoute({ name: "jobs" })
  }

  const handleBackToDashboard = () => {
    window.history.pushState("", document.title, window.location.pathname)
    setRoute({ name: "dashboard" })
  }

  const handleConfirmStage = (stageId: FabricationStageId) => {
    if (!selectedJob) {
      return
    }

    const stageIndex = fabricationStages.findIndex(
      (stage) => stage.id === stageId,
    )
    const currentStageIndex = fabricationStages.findIndex(
      (stage) => stage.id === selectedJob.currentStage,
    )

    if (stageIndex < 0 || stageIndex !== currentStageIndex) {
      return
    }

    const nextStage = fabricationStages[stageIndex + 1]
    const isComplete = !nextStage
    const confirmedStage = fabricationStages[stageIndex]

    setJobs((currentJobs) =>
      currentJobs.map((job) =>
        job.id === selectedJob.id
          ? {
              ...job,
              currentStage: nextStage?.id ?? job.currentStage,
              progress: isComplete
                ? 100
                : Math.round(
                    ((stageIndex + 1) / fabricationStages.length) * 100,
                  ),
              stage: isComplete ? "Complete" : confirmedStage.output,
              status: isComplete ? "completed" : "in-progress",
            }
          : job,
      ),
    )
  }

  if (selectedJob) {
    return (
      <FabricationPage
        job={selectedJob}
        onBackToDashboard={handleBackToDashboard}
        onConfirmStage={handleConfirmStage}
      />
    )
  }

  if (route.name === "jobs") {
    return (
      <JobsPage
        jobs={jobs}
        onBackToDashboard={handleBackToDashboard}
        onOpenJob={handleOpenJob}
      />
    )
  }

  return <Dashboard onOpenJobs={handleOpenJobs} />
}
