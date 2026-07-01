import type { Job } from "../../types/fabrication"
import { JobCard } from "./job-card"

interface JobQueueProps {
  activeJob: Job | null
  jobs: Job[]
  isLoading: boolean
  onOpenJob: (jobId: string) => void
}

export function JobQueue({
  activeJob,
  jobs,
  isLoading,
  onOpenJob,
}: JobQueueProps) {
  return (
    <section
      className="mt-5 min-w-0 rounded-[10px] border border-line bg-white/95 p-[18px] shadow-[0_10px_30px_rgba(15,23,42,0.04)]"
      id="jobs"
    >
      <div className="mb-3.5 flex items-center justify-between gap-4 max-[620px]:flex-col max-[620px]:items-start">
        <div>
          <h2 className="m-0 text-[21px] font-extrabold text-ink">
            Recent Jobs
          </h2>
          <p className="mt-1 text-[10px] font-bold normal-case tracking-normal text-muted">
            {isLoading
              ? "Loading fabrication_jobs/list"
              : "Select a job card to open fabrication_jobs stages"}
          </p>
        </div>
      </div>

      {jobs.length > 0 ? (
        <div className="grid grid-cols-3 gap-3.5 max-[980px]:grid-cols-1">
          {jobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              isActive={job.id === activeJob?.id}
              onSelect={() => onOpenJob(job.id)}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-line-soft bg-surface-soft p-4 text-sm font-semibold text-muted">
          No fabrication jobs returned.
        </div>
      )}
    </section>
  )
}
