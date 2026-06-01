import { ArrowLeft, CheckCircle2, CircleDashed, Clock3 } from "lucide-react"
import { useEffect, useState } from "react"
import { fabricationStages } from "../../data/fabrication-stages"
import { cn } from "../../lib/classnames"
import type { FabricationStageId, Job } from "../../types/fabrication"
import { JobPreviewSvg } from "../dashboard/job-preview-svg"
import { Button } from "../ui/button"
import { StatusBadge } from "../ui/status-badge"
import { CameraPreviewCard } from "./camera-preview-card"

interface FabricationPageProps {
  job: Job
  onBackToDashboard: () => void
  onConfirmStage: (stageId: FabricationStageId) => void
}

export function FabricationPage({
  job,
  onBackToDashboard,
  onConfirmStage,
}: FabricationPageProps) {
  const [activeStageId, setActiveStageId] = useState<FabricationStageId>(
    job.currentStage,
  )

  useEffect(() => {
    setActiveStageId(job.currentStage)
  }, [job.currentStage])

  const activeStage =
    fabricationStages.find((stage) => stage.id === activeStageId) ??
    fabricationStages[0]
  const currentStageIndex = fabricationStages.findIndex(
    (stage) => stage.id === job.currentStage,
  )
  const activeStageIndex = fabricationStages.findIndex(
    (stage) => stage.id === activeStage.id,
  )

  return (
    <div className="min-h-screen min-w-80 bg-[radial-gradient(circle_at_18%_14%,rgba(11,118,209,0.08),transparent_24rem),linear-gradient(180deg,#ffffff_0%,#f7f8fb_52%,#eef2f7_100%)] font-sans text-ink antialiased">
      <header className="sticky top-0 z-10 grid min-h-[72px] grid-cols-[minmax(130px,1fr)_minmax(240px,auto)_minmax(130px,1fr)] items-center gap-[18px] border-b border-line bg-white/90 px-6 py-3 backdrop-blur-2xl max-[980px]:grid-cols-1">
        <Button className="w-fit" variant="soft" onClick={onBackToDashboard}>
          <ArrowLeft size={16} />
          Dashboard
        </Button>

        <div className="min-w-0 text-center max-[980px]:text-left">
          <span className="text-[10px] font-bold uppercase tracking-normal text-muted">
            Fabrication Stages
          </span>
          <strong className="mt-1 block overflow-hidden text-ellipsis whitespace-nowrap text-lg font-[830] text-ink">
            {job.name}
          </strong>
          <small className="mt-0.5 block overflow-hidden text-ellipsis whitespace-nowrap font-mono text-[11px] text-muted">
            {job.file}
          </small>
        </div>

        <StatusBadge
          className="justify-self-end max-[980px]:justify-self-start"
          status={job.status}
        />
      </header>

      <main className="mx-auto grid w-[min(1180px,calc(100%_-_48px))] grid-cols-[300px_minmax(0,1fr)] gap-[22px] py-7 pb-16 max-[980px]:w-[min(calc(100%_-_32px),760px)] max-[980px]:grid-cols-1">
        <aside
          className="self-start overflow-hidden rounded-[10px] border border-line bg-white shadow-[0_8px_26px_rgba(15,23,42,0.04)]"
          aria-label="Fabrication stages"
        >
          <div className="flex items-center justify-between gap-3 border-b border-line-soft p-4">
            <span className="text-[10px] font-bold uppercase tracking-normal text-muted">
              Workflow
            </span>
            <strong className="text-xs font-bold text-ink">
              {Math.min(currentStageIndex + 1, fabricationStages.length)} of{" "}
              {fabricationStages.length}
            </strong>
          </div>

          <div className="relative grid gap-1 p-3 before:absolute before:bottom-5 before:left-7 before:top-5 before:w-0.5 before:bg-line-soft before:content-['']">
            {fabricationStages.map((stage, index) => {
              const isCurrent = stage.id === job.currentStage
              const isActive = stage.id === activeStage.id
              const isComplete = index < currentStageIndex
              const isPending = index > currentStageIndex
              const StageIcon = isComplete
                ? CheckCircle2
                : isCurrent
                  ? Clock3
                  : CircleDashed
              const stageState = isComplete
                ? "Done"
                : isCurrent
                  ? "Current"
                  : "Pending"

              return (
                <button
                  className={cn(
                    "relative grid min-h-[62px] w-full cursor-pointer grid-cols-[36px_minmax(0,1fr)] items-center gap-3 rounded-lg border border-transparent py-2.5 pl-1 pr-2.5 text-left text-inherit transition duration-150 ease-out hover:border-[#91c7f4] hover:bg-[#f5fbff]",
                    isComplete && "bg-green-soft/35 hover:border-green/35",
                    isCurrent && "border-blue/30 bg-blue-soft/70",
                    isActive &&
                      !isCurrent &&
                      !isComplete &&
                      "border-[#91c7f4] bg-[#f5fbff]",
                    isPending && "bg-white",
                  )}
                  key={stage.id}
                  type="button"
                  onClick={() => setActiveStageId(stage.id)}
                >
                  <span
                    className={cn(
                      "z-[1] grid h-8 w-8 place-items-center rounded-full border-2",
                      isComplete &&
                        "border-green bg-green text-white shadow-[0_0_0_4px_rgba(233,248,241,1)]",
                      isCurrent &&
                        "border-blue bg-blue text-white shadow-[0_0_0_4px_rgba(232,243,255,1)]",
                      isPending && "border-[#cbd5e1] bg-white text-[#94a3b8]",
                      isActive &&
                        !isCurrent &&
                        !isComplete &&
                        "border-blue bg-blue-soft text-blue",
                    )}
                  >
                    <StageIcon size={16} strokeWidth={2.4} />
                  </span>
                  <span className="min-w-0">
                    <span className="flex min-w-0 items-center justify-between gap-2">
                      <strong
                        className={cn(
                          "block overflow-hidden text-ellipsis whitespace-nowrap text-[13px] font-bold",
                          isComplete && "text-[#087443]",
                          isCurrent && "text-blue-strong",
                          isPending && "text-[#5f6673]",
                        )}
                      >
                        {stage.label}
                      </strong>
                      <span
                        className={cn(
                          "shrink-0 rounded-full px-2 py-0.5 text-[9px] font-extrabold uppercase",
                          isComplete && "bg-green-soft text-[#087443]",
                          isCurrent && "bg-blue text-white",
                          isPending && "bg-[#edf1f5] text-[#667085]",
                        )}
                      >
                        {stageState}
                      </span>
                    </span>
                    <small
                      className={cn(
                        "mt-1 block overflow-hidden text-ellipsis whitespace-nowrap text-[11px]",
                        isPending ? "text-[#98a2b3]" : "text-muted",
                      )}
                    >
                      {stage.description}
                    </small>
                  </span>
                </button>
              )
            })}
          </div>
        </aside>

        <section className="grid min-w-0 gap-[18px]">
          <div className="rounded-[10px] border border-line bg-white p-[22px] shadow-[0_8px_26px_rgba(15,23,42,0.04)]">
            <div className="flex items-start justify-between gap-4 max-[720px]:flex-col">
              <div className="min-w-0">
                <div className="text-[10px] font-bold uppercase tracking-normal text-muted">
                  Stage {activeStageIndex + 1}
                </div>
                <h1 className="mt-1.5 text-[34px] font-bold leading-tight text-ink">
                  {activeStage.label}
                </h1>
              </div>
              <Button
                className="min-h-[42px] shrink-0 px-4 text-sm max-[720px]:w-full"
                disabled={
                  activeStageIndex !== currentStageIndex ||
                  job.status === "completed"
                }
                variant={
                  activeStageIndex === currentStageIndex &&
                  job.status !== "completed"
                    ? "primary"
                    : "soft"
                }
                onClick={() => onConfirmStage(activeStage.id)}
              >
                <CheckCircle2 size={17} />
                {job.status === "completed"
                  ? "Confirmed"
                  : activeStageIndex === currentStageIndex
                    ? activeStage.id === "COMPLETE"
                      ? "Complete Job"
                      : "Confirm & Next"
                    : activeStageIndex < currentStageIndex
                      ? "Confirmed"
                      : "Confirm & Next"}
              </Button>
            </div>
            <p className="mt-2.5 max-w-[760px] text-[15px] leading-relaxed text-[#4d5765]">
              {activeStage.detail}
            </p>

            <div className="mt-5 grid grid-cols-3 gap-3 max-[980px]:grid-cols-1">
              <span className="min-w-0 rounded-lg border border-line-soft bg-surface-soft p-3.5">
                <small className="text-[10px] font-bold uppercase tracking-normal text-muted">
                  Output
                </small>
                <strong className="mt-1.5 block overflow-hidden text-ellipsis whitespace-nowrap text-sm font-bold text-ink">
                  {activeStage.output}
                </strong>
              </span>
              <span className="min-w-0 rounded-lg border border-line-soft bg-surface-soft p-3.5">
                <small className="text-[10px] font-bold uppercase tracking-normal text-muted">
                  Estimate
                </small>
                <strong className="mt-1.5 block overflow-hidden text-ellipsis whitespace-nowrap text-sm font-bold text-ink">
                  {activeStage.duration}
                </strong>
              </span>
              <span className="min-w-0 rounded-lg border border-line-soft bg-surface-soft p-3.5">
                <small className="text-[10px] font-bold uppercase tracking-normal text-muted">
                  Board
                </small>
                <strong className="mt-1.5 block overflow-hidden text-ellipsis whitespace-nowrap text-sm font-bold text-ink">
                  {job.board}
                </strong>
              </span>
            </div>
          </div>

          <div className="grid min-w-0 [grid-template-areas:'camera'_'circuit'] gap-[18px] min-[1120px]:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.9fr)] min-[1120px]:[grid-template-areas:'circuit_camera'] min-[1120px]:items-stretch">
            <CameraPreviewCard />

            <div className="[grid-area:circuit] min-w-0 rounded-[10px] border border-line bg-white p-[18px] shadow-[0_8px_26px_rgba(15,23,42,0.04)]">
              <div className="mb-3.5 flex items-center justify-between gap-4 max-[620px]:flex-col max-[620px]:items-start">
                <div>
                  <h2 className="m-0 text-[21px] font-extrabold text-ink">
                    Circuit Preview
                  </h2>
                  <p className="mt-1 text-[10px] font-bold normal-case tracking-normal text-muted">
                    PCB SVG generated from Circuit JSON
                  </p>
                </div>
                <span className="rounded-lg border border-line-soft bg-[#f8fafc] px-2.5 py-1.5 font-mono text-[11px] text-muted">
                  {job.layers}
                </span>
              </div>
              <div className="grid min-h-[420px] w-full place-items-center overflow-hidden rounded-lg border border-line-soft bg-[#f8fafc] bg-[image:linear-gradient(rgba(11,118,209,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(11,118,209,0.05)_1px,transparent_1px)] bg-[length:16px_16px] [&_img]:block [&_img]:h-full [&_img]:max-h-[520px] [&_img]:w-full [&_img]:object-contain">
                <JobPreviewSvg job={job} />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
