import { useEffect, useState } from "react"
import { Dashboard } from "./components/dashboard/dashboard"
import { FabricationPage } from "./components/fabrication/fabrication-page"
import { initialJobs } from "./data/fabrication-data"

function getJobIdFromHash() {
  const match = window.location.hash.match(/^#\/jobs\/([^/]+)$/)
  return match?.[1] ?? null
}

export function App() {
  const [selectedJobId, setSelectedJobId] = useState<string | null>(() =>
    getJobIdFromHash(),
  )
  const selectedJob = initialJobs.find((job) => job.id === selectedJobId)

  useEffect(() => {
    const handleHashChange = () => setSelectedJobId(getJobIdFromHash())

    window.addEventListener("hashchange", handleHashChange)
    return () => window.removeEventListener("hashchange", handleHashChange)
  }, [])

  const handleOpenJob = (jobId: string) => {
    window.location.hash = `/jobs/${jobId}`
    setSelectedJobId(jobId)
  }

  const handleBackToDashboard = () => {
    window.history.pushState("", document.title, window.location.pathname)
    setSelectedJobId(null)
  }

  if (selectedJob) {
    return (
      <FabricationPage
        job={selectedJob}
        onBackToDashboard={handleBackToDashboard}
      />
    )
  }

  return <Dashboard onOpenJob={handleOpenJob} />
}
