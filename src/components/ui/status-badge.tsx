import type { JobStatus } from "../../types/fabrication"
import { cn } from "../../lib/classnames"

const statusClassName: Record<JobStatus, string> = {
  "in-progress": "bg-blue-soft text-blue-strong",
  pending: "bg-[#edf1f5] text-[#475467]",
  completed: "bg-green-soft text-[#087443]",
  failed: "bg-red-soft text-[#b4232f]",
}

export function StatusBadge({
  className,
  status,
}: {
  className?: string
  status: JobStatus
}) {
  return (
    <span
      className={cn(
        "inline-flex whitespace-nowrap rounded-[7px] px-2 py-1.5 text-[10px] font-extrabold uppercase",
        statusClassName[status],
        className,
      )}
    >
      {status}
    </span>
  )
}
