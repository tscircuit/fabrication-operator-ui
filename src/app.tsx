import { useEffect, useState } from "react"
import { Dashboard } from "./components/dashboard/dashboard"
import { JobStagesPage } from "./components/dashboard/job-stages-page"
import { useFabricationDashboard } from "./hooks/use-fabrication-dashboard"

type AppRoute = { name: "dashboard" } | { name: "job"; jobId: string }

function getRouteFromHash(): AppRoute {
  const jobMatch = window.location.hash.match(/^#\/jobs\/([^/]+)$/)
  if (jobMatch?.[1]) {
    return { name: "job", jobId: jobMatch[1] }
  }

  return { name: "dashboard" }
}

export function App() {
  const [route, setRoute] = useState<AppRoute>(() => getRouteFromHash())
  const dashboard = useFabricationDashboard()

  useEffect(() => {
    const handleHashChange = () => setRoute(getRouteFromHash())

    window.addEventListener("hashchange", handleHashChange)
    return () => window.removeEventListener("hashchange", handleHashChange)
  }, [])

  useEffect(() => {
    if (route.name === "job") {
      dashboard.setActiveJobId(route.jobId)
    }
  }, [dashboard.setActiveJobId, route])

  const handleOpenJob = (jobId: string) => {
    dashboard.setActiveJobId(jobId)
    window.location.hash = `/jobs/${jobId}`
    setRoute({ name: "job", jobId })
  }

  const handleBackToDashboard = () => {
    window.history.pushState("", document.title, window.location.pathname)
    setRoute({ name: "dashboard" })
  }

  if (route.name === "job") {
    return (
      <JobStagesPage
        dashboard={dashboard}
        onBackToDashboard={handleBackToDashboard}
      />
    )
  }

  return <Dashboard dashboard={dashboard} onOpenJob={handleOpenJob} />
}
