import { useEffect, useState } from "react"
import { Dashboard } from "./components/dashboard/dashboard"
import { FabricationPage } from "./components/fabrication/fabrication-page"
import { JobsPage } from "./components/jobs/jobs-page"
import { initialJobs } from "./data/fabrication-data"

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
  const selectedJob =
    route.name === "job"
      ? initialJobs.find((job) => job.id === route.jobId)
      : null

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

  if (selectedJob) {
    return (
      <FabricationPage
        job={selectedJob}
        onBackToDashboard={handleBackToDashboard}
      />
    )
  }

  if (route.name === "jobs") {
    return (
      <JobsPage
        jobs={initialJobs}
        onBackToDashboard={handleBackToDashboard}
        onOpenJob={handleOpenJob}
      />
    )
  }

  return <Dashboard onOpenJob={handleOpenJob} onOpenJobs={handleOpenJobs} />
}
