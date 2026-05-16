import type { Job } from "../../types/fabrication"
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
      className={isActive ? "job-card selected" : "job-card"}
      type="button"
      onClick={onSelect}
    >
      <span className="job-card-preview">
        <JobPreviewSvg />
      </span>
      <span className="job-card-main">
        <strong>{job.name}</strong>
        <small>{job.file}</small>
      </span>
      <span className="job-card-meta">
        <Metric label="Board" value={job.board} />
        <Metric label="Layers" value={job.layers} />
        <Metric label="State" value={job.stage} />
      </span>
      <span className="job-card-footer">
        <StatusBadge status={job.status} />
      </span>
    </button>
  )
}
