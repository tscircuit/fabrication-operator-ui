import type { JobStatus } from "../../types/fabrication"

export function StatusBadge({ status }: { status: JobStatus }) {
  return <span className={`status-badge ${status}`}>{status}</span>
}
