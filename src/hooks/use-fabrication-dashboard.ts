import { Activity, AlertTriangle, CheckCircle2, Clock3 } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { initialJobs } from "../data/fabrication-data"
import {
  normalizeFabricationJob,
  normalizeFabricationJobs,
} from "../lib/fabrication-job-adapter"
import { fakeFabricationServerClient } from "../lib/fake-fabrication-server-client"
import type { Job } from "../types/fabrication"

export function useFabricationDashboard() {
  const [jobs, setJobs] = useState(initialJobs)
  const [activeJobId, setActiveJobId] = useState(initialJobs[0].id)
  const [activeJobDetails, setActiveJobDetails] = useState<Job | null>(
    initialJobs[0],
  )
  const [isLoadingJobs, setIsLoadingJobs] = useState(true)
  const [isLoadingJobDetails, setIsLoadingJobDetails] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const queuedActiveJob = jobs.find((job) => job.id === activeJobId) ?? null
  const activeJob =
    activeJobDetails?.id === activeJobId ? activeJobDetails : queuedActiveJob

  useEffect(() => {
    let isCurrent = true

    async function loadJobs() {
      setIsLoadingJobs(true)

      try {
        const rawJobs = await fakeFabricationServerClient.listFabricationJobs()
        const serverJobs = normalizeFabricationJobs(rawJobs)

        if (!isCurrent) {
          return
        }

        setJobs(serverJobs)
        setError(null)
        setActiveJobId((currentActiveJobId) => {
          if (serverJobs.some((job) => job.id === currentActiveJobId)) {
            return currentActiveJobId
          }

          return serverJobs[0]?.id ?? ""
        })
      } catch (requestError) {
        if (!isCurrent) {
          return
        }

        setJobs(initialJobs)
        setActiveJobId(
          (currentActiveJobId) => currentActiveJobId || initialJobs[0].id,
        )
        setActiveJobDetails(initialJobs[0])
        setError(
          requestError instanceof Error
            ? requestError.message
            : "Unable to load fabrication jobs",
        )
      } finally {
        if (isCurrent) {
          setIsLoadingJobs(false)
        }
      }
    }

    loadJobs()

    return () => {
      isCurrent = false
    }
  }, [])

  useEffect(() => {
    if (!activeJobId) {
      setActiveJobDetails(null)
      return
    }

    let isCurrent = true

    async function loadJobDetails() {
      const fallbackJob = jobs.find((job) => job.id === activeJobId)

      setIsLoadingJobDetails(true)

      try {
        const rawJob = await fakeFabricationServerClient.getFabricationJob({
          fabrication_job_id: activeJobId,
        })
        const serverJob = normalizeFabricationJob(rawJob, fallbackJob)

        if (!isCurrent) {
          return
        }

        setActiveJobDetails(serverJob)
        setError(null)
      } catch (requestError) {
        if (!isCurrent) {
          return
        }

        if (fallbackJob) {
          setActiveJobDetails(fallbackJob)
        }

        setError(
          requestError instanceof Error
            ? requestError.message
            : "Unable to load fabrication job details",
        )
      } finally {
        if (isCurrent) {
          setIsLoadingJobDetails(false)
        }
      }
    }

    loadJobDetails()

    return () => {
      isCurrent = false
    }
  }, [activeJobId, jobs])

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
    error,
    jobs,
    isLoadingJobDetails,
    isLoadingJobs,
    setActiveJobId,
    setJobs,
    stats,
  }
}
