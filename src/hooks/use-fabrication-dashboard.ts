import { Activity, AlertTriangle, CheckCircle2, Clock3 } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { initialJobs } from "../data/fabrication-data"
import {
  type CarrierOrientation,
  createFabricationJobFromCircuitJson,
  burnLaserStage,
  completeCurrentStage,
  createFabricationJobFromSample,
  getLaserBurnRun,
  listLaserBurnRuns,
  type OperatorActionResult,
  runCarrierAction,
  setLaserOrigin,
} from "../lib/fabrication-api-actions"
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
  const [isCreatingJob, setIsCreatingJob] = useState(false)
  const [isRunningAction, setIsRunningAction] = useState(false)
  const [isLoadingBurnRuns, setIsLoadingBurnRuns] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [actionMessage, setActionMessage] = useState<string | null>(null)
  const [burnRuns, setBurnRuns] = useState<unknown[]>([])
  const [selectedBurnRun, setSelectedBurnRun] = useState<unknown>(null)

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

  useEffect(() => {
    if (!activeJobId) {
      setBurnRuns([])
      setSelectedBurnRun(null)
      return
    }

    const job = activeJob
    if (!job) {
      return
    }

    let isCurrent = true

    async function loadBurnRuns(selectedJob: Job) {
      setIsLoadingBurnRuns(true)

      try {
        const runs = await listLaserBurnRuns(selectedJob)

        if (!isCurrent) {
          return
        }

        setBurnRuns(Array.isArray(runs) ? runs : [])
      } catch {
        if (isCurrent) {
          setBurnRuns([])
        }
      } finally {
        if (isCurrent) {
          setIsLoadingBurnRuns(false)
        }
      }
    }

    loadBurnRuns(job)

    return () => {
      isCurrent = false
    }
  }, [activeJobId, activeJob])

  function replaceJob(updatedJob: Job) {
    setJobs((currentJobs) => {
      const hasJob = currentJobs.some((job) => job.id === updatedJob.id)

      if (!hasJob) {
        return [updatedJob, ...currentJobs]
      }

      return currentJobs.map((job) =>
        job.id === updatedJob.id ? updatedJob : job,
      )
    })
    setActiveJobId(updatedJob.id)
    setActiveJobDetails(updatedJob)
  }

  async function createJob(sampleJobId: string) {
    setIsCreatingJob(true)
    setError(null)
    setActionMessage("Generating LBRN files")

    try {
      const createdJob = await createFabricationJobFromSample(sampleJobId)
      replaceJob(createdJob)
      setActionMessage("Fabrication job created")
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to create fabrication job",
      )
    } finally {
      setIsCreatingJob(false)
    }
  }

  async function createJobFromCircuitJsonFile(file: File) {
    setIsCreatingJob(true)
    setError(null)
    setActionMessage("Reading Circuit JSON")

    try {
      const circuitJson = JSON.parse(await file.text()) as unknown
      setActionMessage("Generating LBRN files")

      const createdJob = await createFabricationJobFromCircuitJson({
        circuitJson,
        file: file.name,
        name: file.name.replace(/\.[^.]+$/, "") || file.name,
      })
      replaceJob(createdJob)
      setActionMessage("Fabrication job created")
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to create fabrication job",
      )
    } finally {
      setIsCreatingJob(false)
    }
  }

  async function completeStage() {
    if (!activeJob) {
      return
    }

    setIsRunningAction(true)
    setError(null)

    try {
      const updatedJob = await completeCurrentStage(activeJob)
      replaceJob(updatedJob)
      setActionMessage("Current stage completed")
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to complete current stage",
      )
    } finally {
      setIsRunningAction(false)
    }
  }

  async function runAction(
    action:
      | { type: "clamp" }
      | { type: "move"; x: number }
      | { type: "release" }
      | { angle_deg: number; type: "rotate" }
      | { orientation: CarrierOrientation; type: "rotate_to" },
  ) {
    if (!activeJob) {
      return
    }

    await runServerAction(() => runCarrierAction(activeJob, action))
  }

  async function setOrigin(origin: { x: number; y: number }) {
    if (!activeJob) {
      return
    }

    await runServerAction(() => setLaserOrigin(activeJob, origin))
  }

  async function burnStage(lbrnFileKey: string) {
    if (!activeJob) {
      return
    }

    await runServerAction(() => burnLaserStage(activeJob, lbrnFileKey))
  }

  async function runServerAction(action: () => Promise<OperatorActionResult>) {
    setIsRunningAction(true)
    setError(null)

    try {
      const result = await action()
      setActionMessage(result.label)
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to run operator action",
      )
    } finally {
      setIsRunningAction(false)
    }
  }

  async function inspectBurnRun(laserBurnRunId: string) {
    if (!activeJob) {
      return
    }

    setIsLoadingBurnRuns(true)
    setError(null)

    try {
      const burnRun = await getLaserBurnRun(activeJob, laserBurnRunId)
      setSelectedBurnRun(burnRun)
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to load laser burn run",
      )
    } finally {
      setIsLoadingBurnRuns(false)
    }
  }

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
    actionMessage,
    activeJob,
    burnRuns,
    burnStage,
    completeStage,
    createJob,
    createJobFromCircuitJsonFile,
    error,
    inspectBurnRun,
    isCreatingJob,
    isLoadingBurnRuns,
    jobs,
    isLoadingJobDetails,
    isLoadingJobs,
    isRunningAction,
    runCarrierAction: runAction,
    selectedBurnRun,
    setActiveJobId,
    setJobs,
    setLaserOrigin: setOrigin,
    stats,
  }
}

export type FabricationDashboardState = ReturnType<
  typeof useFabricationDashboard
>
