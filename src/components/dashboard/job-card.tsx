import type { Job } from "../../types/fabrication"
import { cn } from "../../lib/classnames"
import { Metric } from "../ui/metric"
import { StatusBadge } from "../ui/status-badge"
import { JobPreviewSvg } from "./job-preview-svg"

interface JobCardProps {
  job: Job
  isActive: boolean
  onSelect: () => void
}

export function JobCard({ job, isActive, onSelect }: JobCardProps) {
  return (
    <button
      className={cn(
        "flex w-full min-w-0 cursor-pointer flex-col gap-3 rounded-[9px] border border-line-soft bg-white p-3.5 text-left text-inherit transition duration-150 ease-out hover:-translate-y-px hover:border-[#91c7f4] hover:shadow-[0_12px_28px_rgba(11,118,209,0.10)]",
        isActive &&
          "border-[#91c7f4] shadow-[0_12px_28px_rgba(11,118,209,0.10)]",
      )}
      type="button"
      onClick={onSelect}
    >
      <span className="grid aspect-video w-full place-items-center overflow-hidden rounded-lg border border-line-soft bg-[#f8fafc] bg-[image:linear-gradient(rgba(11,118,209,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(11,118,209,0.05)_1px,transparent_1px)] bg-[length:12px_12px] [&_img]:block [&_img]:h-full [&_img]:w-full [&_img]:object-contain">
        <JobPreviewSvg job={job} />
      </span>
      <span className="min-w-0">
        <strong className="block overflow-hidden text-ellipsis whitespace-nowrap text-[15px] font-extrabold text-ink">
          {job.name}
        </strong>
        <small className="mt-1 block overflow-hidden text-ellipsis whitespace-nowrap font-mono text-[11px] text-muted">
          {job.file}
        </small>
      </span>
      <span className="grid grid-cols-3 gap-2 max-[620px]:grid-cols-1">
        <Metric label="Board" value={job.board} />
        <Metric label="Layers" value={job.layers} />
        <Metric label="State" value={job.stage} />
      </span>
      <span className="flex justify-start pt-0.5">
        <StatusBadge status={job.status} />
      </span>
    </button>
  )
}
