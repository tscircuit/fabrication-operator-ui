import { Activity, AlertTriangle, CheckCircle2, Clock3 } from "lucide-react"
import type { FabricationDashboardState } from "../../hooks/use-fabrication-dashboard"
import { initialJobs } from "../../data/fabrication-data"
import type { Job } from "../../types/fabrication"
import { Dashboard } from "./dashboard"
import { JobStagesPage } from "./job-stages-page"

const jobWithMachineState: Job = {
  ...initialJobs[0],
  carrierState: {
    clamped: true,
    position_x: 18.5,
    rotation_deg: 0,
  },
  laserState: {
    origin: { x: 12.2, y: 7.8 },
    ready: true,
  },
  savedAlignmentOrigins: {
    bottom_alignment: { x: 11.95, y: 7.55 },
    top_alignment: { x: 12.2, y: 7.8 },
  },
}

const burnStageJob: Job = {
  ...jobWithMachineState,
  currentStage: "TOP_COPPER_FILL",
  stage: "Top copper LBRN",
  status: "in-progress",
  progress: 36,
}

const completedJob: Job = {
  ...initialJobs[1],
  carrierState: {
    clamped: false,
    position_x: 0,
    rotation_deg: 180,
  },
  laserState: {
    ready: false,
  },
  savedAlignmentOrigins: {
    bottom_alignment: { x: 10.4, y: 5.1 },
    top_alignment: { x: 10.6, y: 5.2 },
  },
}

function createDashboardState(
  activeJob: Job | null,
): FabricationDashboardState {
  const jobs = [jobWithMachineState, completedJob, initialJobs[2]]

  return {
    actionMessage: activeJob ? "Fabrication job created" : null,
    activeJob,
    burnRuns: activeJob
      ? [
          {
            created_at: "2026-07-01T13:25:00Z",
            file_path: "/tmp/top-copper-fill.lbrn2",
            laser_burn_run_id: "run-top-copper-fill",
            origin: { x: 12.2, y: 7.8 },
            passes: 2,
            status: "completed",
          },
        ]
      : [],
    burnStage: async () => {},
    completeStage: async () => {},
    createJob: async () => {},
    createJobFromCircuitJsonFile: async () => {},
    error: null,
    inspectBurnRun: async () => {},
    isCreatingJob: false,
    isLoadingBurnRuns: false,
    isLoadingJobDetails: false,
    isLoadingJobs: false,
    isRunningAction: false,
    jobs,
    runCarrierAction: async () => {},
    selectedBurnRun: null,
    setActiveJobId: () => {},
    setJobs: () => {},
    setLaserOrigin: async () => {},
    stats: [
      {
        icon: Activity,
        label: "Active Jobs",
        tone: "blue",
        value: jobs.filter((job) => job.status === "in-progress").length,
      },
      {
        icon: CheckCircle2,
        label: "Completed Today",
        tone: "green",
        value: jobs.filter((job) => job.status === "completed").length,
      },
      {
        icon: Clock3,
        label: "Queued",
        tone: "slate",
        value: jobs.filter((job) => job.status === "pending").length,
      },
      {
        icon: AlertTriangle,
        label: "Issues",
        tone: "red",
        value: jobs.filter((job) => job.status === "failed").length,
      },
    ],
  }
}

const noop = () => {}

export default {
  "Job Intake Dashboard": (
    <Dashboard dashboard={createDashboardState(null)} onOpenJob={noop} />
  ),
  "Fabrication Job Stages": (
    <JobStagesPage
      dashboard={createDashboardState(burnStageJob)}
      onBackToDashboard={noop}
    />
  ),
  "Completed Job Stages": (
    <JobStagesPage
      dashboard={createDashboardState(completedJob)}
      onBackToDashboard={noop}
    />
  ),
}
