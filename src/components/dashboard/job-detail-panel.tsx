import { Crosshair, Factory, RadioTower, Workflow, Zap } from "lucide-react"
import { fabricationStages } from "../../data/fabrication-stages"
import { cn } from "../../lib/classnames"
import type { FabricationJobStage, Job } from "../../types/fabrication"
import { StatusBadge } from "../ui/status-badge"

interface JobDetailPanelProps {
  error: string | null
  isLoading: boolean
  job: Job | null
}

export function JobDetailPanel({ error, isLoading, job }: JobDetailPanelProps) {
  if (!job) {
    return (
      <section className="mt-5 rounded-[10px] border border-line bg-white/95 p-[18px] shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
        <PanelHeader
          detail="No jobs returned from fabrication_jobs/list"
          title="Selected Job"
        />
      </section>
    )
  }

  const activeStage =
    fabricationStages.find((stage) => stage.id === job.currentStage) ??
    fabricationStages[0]
  const stages = job.stages ?? getDefaultStages(job.currentStage)

  return (
    <section
      className="mt-5 rounded-[10px] border border-line bg-white/95 shadow-[0_10px_30px_rgba(15,23,42,0.04)]"
      aria-busy={isLoading}
    >
      <div className="flex items-start justify-between gap-4 border-b border-line-soft p-[18px] max-[760px]:flex-col">
        <PanelHeader
          detail={`${job.file} / ${job.board}`}
          eyebrow="fabrication_jobs/get"
          title={job.name}
        />
        <div className="flex flex-wrap items-center justify-end gap-2 max-[760px]:justify-start">
          {isLoading ? (
            <span className="rounded-[7px] bg-blue-soft px-2 py-1.5 text-[10px] font-extrabold uppercase text-blue-strong">
              Loading
            </span>
          ) : null}
          <StatusBadge status={job.status} />
        </div>
      </div>

      {error ? (
        <div className="border-b border-line-soft bg-red-soft px-[18px] py-3 text-xs font-semibold text-red">
          {error}
        </div>
      ) : null}

      <div className="grid grid-cols-4 divide-x divide-line-soft max-[980px]:grid-cols-2 max-[980px]:divide-x-0 max-[980px]:divide-y max-[620px]:grid-cols-1">
        <StateTile
          icon={Workflow}
          label="Job Status"
          value={job.status}
          tone="blue"
        />
        <StateTile
          icon={Factory}
          label="Current Stage"
          value={activeStage.label}
          detail={job.stage}
          tone="green"
        />
        <StateTile
          icon={RadioTower}
          label="Carrier State"
          value={summarizeValue(job.carrierState)}
          tone="slate"
        />
        <StateTile
          icon={Zap}
          label="Laser State"
          value={summarizeValue(job.laserState)}
          tone="red"
        />
      </div>

      <div className="grid grid-cols-[minmax(0,1.1fr)_minmax(280px,0.9fr)] gap-0 border-t border-line-soft max-[980px]:grid-cols-1">
        <div className="p-[18px]">
          <div className="mb-3 flex items-center gap-2">
            <Workflow size={17} className="text-blue" />
            <h2 className="m-0 text-[17px] font-extrabold text-ink">
              Stage List
            </h2>
          </div>
          <ol className="grid gap-2">
            {stages.map((stage, index) => (
              <StageRow
                currentStageId={job.currentStage}
                index={index}
                key={`${stage.id}-${index}`}
                stage={stage}
              />
            ))}
          </ol>
        </div>

        <div className="border-l border-line-soft p-[18px] max-[980px]:border-l-0 max-[980px]:border-t">
          <div className="mb-3 flex items-center gap-2">
            <Crosshair size={17} className="text-blue" />
            <h2 className="m-0 text-[17px] font-extrabold text-ink">
              Saved Alignment Origins
            </h2>
          </div>
          <ValueBlock value={job.savedAlignmentOrigins} />
        </div>
      </div>
    </section>
  )
}

function PanelHeader({
  detail,
  eyebrow = "Job Detail",
  title,
}: {
  detail: string
  eyebrow?: string
  title: string
}) {
  return (
    <div className="min-w-0">
      <span className="text-[10px] font-bold uppercase tracking-normal text-muted">
        {eyebrow}
      </span>
      <h1 className="m-0 mt-1 overflow-hidden text-ellipsis whitespace-nowrap text-[22px] font-[830] leading-tight text-ink max-[620px]:text-xl">
        {title}
      </h1>
      <p className="mt-1.5 overflow-hidden text-ellipsis whitespace-nowrap text-[12px] font-semibold text-muted">
        {detail}
      </p>
    </div>
  )
}

function StateTile({
  detail,
  icon: Icon,
  label,
  tone,
  value,
}: {
  detail?: string
  icon: typeof Workflow
  label: string
  tone: "blue" | "green" | "red" | "slate"
  value: string
}) {
  return (
    <div className="grid min-h-[104px] grid-cols-[minmax(0,1fr)_40px] gap-3 p-4">
      <div className="min-w-0">
        <span className="text-[10px] font-bold uppercase tracking-normal text-muted">
          {label}
        </span>
        <strong className="mt-1.5 block overflow-hidden text-ellipsis whitespace-nowrap text-[16px] font-extrabold text-ink">
          {value}
        </strong>
        {detail ? (
          <small className="mt-1 block overflow-hidden text-ellipsis whitespace-nowrap text-[12px] font-semibold text-muted">
            {detail}
          </small>
        ) : null}
      </div>
      <span
        className={cn(
          "grid h-10 w-10 place-items-center rounded-lg",
          tone === "blue" && "bg-blue-soft text-blue",
          tone === "green" && "bg-green-soft text-green",
          tone === "red" && "bg-red-soft text-red",
          tone === "slate" && "bg-[#edf1f5] text-[#475467]",
        )}
      >
        <Icon size={19} />
      </span>
    </div>
  )
}

function StageRow({
  currentStageId,
  index,
  stage,
}: {
  currentStageId: string
  index: number
  stage: FabricationJobStage
}) {
  const isCurrent =
    stage.id === currentStageId || stage.status?.toLowerCase() === "current"

  return (
    <li
      className={cn(
        "grid min-h-[58px] grid-cols-[28px_minmax(0,1fr)_auto] items-center gap-3 rounded-lg border border-line-soft bg-surface-soft px-3 py-2",
        isCurrent && "border-blue/30 bg-blue-soft",
      )}
    >
      <span
        className={cn(
          "grid h-7 w-7 place-items-center rounded-full text-[11px] font-extrabold",
          isCurrent ? "bg-blue text-white" : "bg-white text-muted",
        )}
      >
        {index + 1}
      </span>
      <span className="min-w-0">
        <strong className="block overflow-hidden text-ellipsis whitespace-nowrap text-sm font-extrabold text-ink">
          {stage.label}
        </strong>
        {stage.detail ? (
          <small className="mt-0.5 block overflow-hidden text-ellipsis whitespace-nowrap text-[11px] font-semibold text-muted">
            {stage.detail}
          </small>
        ) : null}
      </span>
      <span className="rounded-[7px] bg-white px-2 py-1 text-[10px] font-extrabold uppercase text-muted">
        {stage.status ?? (isCurrent ? "current" : "pending")}
      </span>
    </li>
  )
}

function getDefaultStages(currentStageId: string): FabricationJobStage[] {
  const currentStageIndex = fabricationStages.findIndex(
    (stage) => stage.id === currentStageId,
  )

  return fabricationStages.map((stage, index) => ({
    id: stage.id,
    label: stage.label,
    status:
      index < currentStageIndex
        ? "complete"
        : index === currentStageIndex
          ? "current"
          : "pending",
    detail: stage.output,
  }))
}

function ValueBlock({ value }: { value: unknown }) {
  const formattedValue = formatValue(value)

  return (
    <pre className="m-0 max-h-[330px] min-h-[180px] overflow-auto whitespace-pre-wrap rounded-lg border border-line-soft bg-[#f8fafc] p-3 font-mono text-[12px] leading-relaxed text-text">
      {formattedValue}
    </pre>
  )
}

function summarizeValue(value: unknown) {
  if (value == null || value === "") {
    return "No data"
  }

  if (typeof value === "string") {
    return value
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return String(value)
  }

  if (Array.isArray(value)) {
    return `${value.length} item${value.length === 1 ? "" : "s"}`
  }

  if (typeof value === "object") {
    return "Available"
  }

  return "No data"
}

function formatValue(value: unknown) {
  if (value == null || value === "") {
    return "No saved origins"
  }

  if (typeof value === "string") {
    return value
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return String(value)
  }

  return JSON.stringify(value, null, 2)
}
