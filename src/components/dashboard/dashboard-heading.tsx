import { CheckCircle2, CircleAlert, Clock3, Factory } from "lucide-react"
import { fabricationStages } from "../../data/fabrication-stages"
import { cn } from "../../lib/classnames"
import type { Job } from "../../types/fabrication"
import { StatusBadge } from "../ui/status-badge"

interface DashboardHeadingProps {
  activeJob: Job
  jobs: Job[]
}

export function DashboardHeading({ activeJob, jobs }: DashboardHeadingProps) {
  const failedJobs = jobs.filter((job) => job.status === "failed")
  const pendingJobs = jobs.filter((job) => job.status === "pending")
  const readyJobs = jobs.filter((job) => job.status !== "failed")
  const lastExport = jobs.find((job) => job.status === "completed")
  const activeStage =
    fabricationStages.find((stage) => stage.id === activeJob.currentStage) ??
    fabricationStages[0]
  const needsAttention = failedJobs.length > 0

  const operationSignals = [
    {
      label: "Queue Health",
      value: needsAttention ? "Needs attention" : "Ready",
      detail: `${readyJobs.length}/${jobs.length} jobs clear`,
      tone: needsAttention ? "red" : "green",
      icon: needsAttention ? CircleAlert : CheckCircle2,
    },
    {
      label: "Current Stage",
      value: activeStage.label,
      detail: activeJob.stage,
      tone: "blue",
      icon: Factory,
    },
    {
      label: "Queued",
      value: `${pendingJobs.length} waiting`,
      detail:
        pendingJobs.length > 0 ? pendingJobs[0].name : "No pending handoff",
      tone: pendingJobs.length > 0 ? "slate" : "green",
      icon: Clock3,
    },
    {
      label: "Last Export",
      value: lastExport?.name ?? "No export yet",
      detail: lastExport?.file ?? "Complete a job to generate output",
      tone: lastExport ? "green" : "slate",
      icon: lastExport ? CheckCircle2 : Clock3,
    },
  ]

  return (
    <section className="rounded-[10px] border border-line bg-white shadow-[0_8px_26px_rgba(15,23,42,0.04)]">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-5 border-b border-line-soft p-5 max-[760px]:grid-cols-1">
        <div className="min-w-0">
          <span className="text-[10px] font-bold uppercase tracking-normal text-muted">
            Production Control
          </span>
          <div className="mt-2 flex min-w-0 flex-wrap items-center gap-3">
            <h1 className="m-0 overflow-hidden text-ellipsis whitespace-nowrap text-[28px] font-[830] leading-tight text-ink max-[620px]:text-2xl">
              {activeJob.name}
            </h1>
            <StatusBadge status={activeJob.status} />
          </div>
          <p className="mt-2 max-w-[760px] text-[14px] leading-relaxed text-[#4d5765]">
            {activeJob.file} / {activeJob.board} / {activeJob.layers}
          </p>
        </div>

        <div
          className={cn(
            "inline-flex min-h-[42px] items-center gap-2 rounded-lg border px-3 text-sm font-bold",
            needsAttention
              ? "border-red/25 bg-red-soft text-red"
              : "border-green/25 bg-green-soft text-[#087443]",
          )}
        >
          {needsAttention ? (
            <CircleAlert size={17} />
          ) : (
            <CheckCircle2 size={17} />
          )}
          {needsAttention ? `${failedJobs.length} issue open` : "Ready"}
        </div>
      </div>

      <div className="grid grid-cols-4 divide-x divide-line-soft max-[980px]:grid-cols-2 max-[980px]:divide-x-0 max-[980px]:divide-y max-[560px]:grid-cols-1">
        {operationSignals.map((signal) => {
          const SignalIcon = signal.icon

          return (
            <div
              className="grid min-h-[104px] grid-cols-[minmax(0,1fr)_40px] gap-3 p-4"
              key={signal.label}
            >
              <div className="min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-normal text-muted">
                  {signal.label}
                </span>
                <strong className="mt-1.5 block overflow-hidden text-ellipsis whitespace-nowrap text-[16px] font-extrabold text-ink">
                  {signal.value}
                </strong>
                <small className="mt-1 block overflow-hidden text-ellipsis whitespace-nowrap text-[12px] font-semibold text-muted">
                  {signal.detail}
                </small>
              </div>
              <span
                className={cn(
                  "grid h-10 w-10 place-items-center rounded-lg",
                  signal.tone === "red" && "bg-red-soft text-red",
                  signal.tone === "green" && "bg-green-soft text-green",
                  signal.tone === "blue" && "bg-blue-soft text-blue",
                  signal.tone === "slate" && "bg-[#edf1f5] text-[#475467]",
                )}
              >
                <SignalIcon size={19} />
              </span>
            </div>
          )
        })}
      </div>
    </section>
  )
}
