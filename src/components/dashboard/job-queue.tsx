import type { Job } from "../../types/fabrication"
import { Button } from "../ui/button"
import { JobCard } from "./job-card"

interface JobQueueProps {
  jobs: Job[]
  activeJob: Job
  onSelectJob: (jobId: string) => void
}

export function JobQueue({ jobs, activeJob, onSelectJob }: JobQueueProps) {
  return (
    <section className="job-section" id="jobs">
      <div className="section-header">
        <div>
          <h2>Recent Jobs</h2>
          <p>Conversion jobs and export status</p>
        </div>
        <Button variant="icon-label">View All</Button>
      </div>

      <div className="job-list">
        {jobs.map((job) => (
          <JobCard
            key={job.id}
            job={job}
            isActive={job.id === activeJob.id}
            onSelect={() => onSelectJob(job.id)}
          />
        ))}
      </div>
    </section>
  )
}
