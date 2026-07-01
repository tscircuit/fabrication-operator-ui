import { ArrowLeft } from "lucide-react"
import type { FabricationDashboardState } from "../../hooks/use-fabrication-dashboard"
import { Button } from "../ui/button"
import { StatusBadge } from "../ui/status-badge"
import { JobDetailPanel } from "./job-detail-panel"
import { OperatorControlsPanel } from "./operator-controls-panel"
import { TopBar } from "./top-bar"

interface JobStagesPageProps {
  dashboard: FabricationDashboardState
  onBackToDashboard: () => void
}

export function JobStagesPage({
  dashboard,
  onBackToDashboard,
}: JobStagesPageProps) {
  const {
    activeJob,
    burnRuns,
    burnStage,
    completeStage,
    error,
    inspectBurnRun,
    isLoadingBurnRuns,
    isLoadingJobDetails,
    isRunningAction,
    runCarrierAction,
    selectedBurnRun,
    setLaserOrigin,
  } = dashboard

  return (
    <div className="min-h-screen min-w-80 bg-[radial-gradient(circle_at_18%_14%,rgba(11,118,209,0.08),transparent_24rem),linear-gradient(180deg,#ffffff_0%,#f7f8fb_52%,#eef2f7_100%)] font-sans text-ink antialiased">
      <TopBar />

      <main className="mx-auto w-[min(1180px,calc(100%_-_48px))] py-8 pb-16 max-[980px]:w-[min(calc(100%_-_32px),760px)]">
        <header className="flex items-center justify-between gap-4 rounded-[10px] border border-line bg-white/95 p-[18px] shadow-[0_10px_30px_rgba(15,23,42,0.04)] max-[760px]:flex-col max-[760px]:items-start">
          <Button variant="soft" onClick={onBackToDashboard}>
            <ArrowLeft size={16} />
            Dashboard
          </Button>

          <div className="min-w-0 text-center max-[760px]:text-left">
            <span className="text-[10px] font-bold uppercase tracking-normal text-muted">
              fabrication_jobs stages
            </span>
            <h1 className="m-0 mt-1 overflow-hidden text-ellipsis whitespace-nowrap text-[22px] font-[830] leading-tight text-ink">
              {activeJob?.name ?? "Loading job"}
            </h1>
            <p className="mt-1 overflow-hidden text-ellipsis whitespace-nowrap font-mono text-[11px] text-muted">
              {activeJob?.file ?? "fabrication_jobs/get"}
            </p>
          </div>

          {activeJob ? <StatusBadge status={activeJob.status} /> : null}
        </header>

        <JobDetailPanel
          error={error}
          isLoading={isLoadingJobDetails}
          job={activeJob}
        />

        <OperatorControlsPanel
          burnRuns={burnRuns}
          error={error}
          isLoadingBurnRuns={isLoadingBurnRuns}
          isRunningAction={isRunningAction}
          job={activeJob}
          onBurnStage={burnStage}
          onCarrierAction={runCarrierAction}
          onCompleteStage={completeStage}
          onInspectBurnRun={inspectBurnRun}
          onSetLaserOrigin={setLaserOrigin}
          selectedBurnRun={selectedBurnRun}
        />
      </main>
    </div>
  )
}
