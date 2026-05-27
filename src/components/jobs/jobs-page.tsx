import { ArrowLeft, ExternalLink } from "lucide-react"
import type { Job } from "../../types/fabrication"
import { Button } from "../ui/button"
import { StatusBadge } from "../ui/status-badge"

interface JobsPageProps {
  jobs: Job[]
  onBackToDashboard: () => void
  onOpenJob: (jobId: string) => void
}

export function JobsPage({
  jobs,
  onBackToDashboard,
  onOpenJob,
}: JobsPageProps) {
  return (
    <div className="min-h-screen min-w-80 bg-[radial-gradient(circle_at_18%_14%,rgba(11,118,209,0.08),transparent_24rem),linear-gradient(180deg,#ffffff_0%,#f7f8fb_52%,#eef2f7_100%)] font-sans text-ink antialiased">
      <header className="sticky top-0 z-10 grid min-h-[72px] grid-cols-[minmax(130px,1fr)_minmax(240px,auto)_minmax(130px,1fr)] items-center gap-[18px] border-b border-line bg-white/90 px-6 py-3 backdrop-blur-2xl max-[980px]:grid-cols-1">
        <Button className="w-fit" variant="soft" onClick={onBackToDashboard}>
          <ArrowLeft size={16} />
          Dashboard
        </Button>

        <div className="min-w-0 text-center max-[980px]:text-left">
          <span className="text-[10px] font-bold uppercase tracking-normal text-muted">
            Conversion Jobs
          </span>
          <strong className="mt-1 block overflow-hidden text-ellipsis whitespace-nowrap text-lg font-[830] text-ink">
            Export Status
          </strong>
          <small className="mt-0.5 block overflow-hidden text-ellipsis whitespace-nowrap text-[11px] text-muted">
            {jobs.length} jobs tracked
          </small>
        </div>
      </header>

      <main className="mx-auto w-[min(1180px,calc(100%_-_48px))] py-8 pb-16 max-[980px]:w-[min(calc(100%_-_32px),760px)]">
        <section className="rounded-[10px] border border-line bg-white/95 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
          <div className="flex items-start justify-between gap-4 border-b border-line-soft p-[18px] max-[620px]:flex-col">
            <div>
              <h1 className="m-0 text-[28px] font-[830] leading-tight text-ink">
                All Conversion Jobs
              </h1>
              <p className="mt-2 max-w-[620px] text-sm leading-normal text-[#4d5765]">
                Review every conversion job, current fabrication stage, and
                export readiness from one queue.
              </p>
            </div>
          </div>

          <div className="divide-y divide-line-soft">
            {jobs.map((job) => (
              <article
                className="grid grid-cols-[minmax(0,1.2fr)_repeat(3,minmax(120px,0.7fr))_auto] items-center gap-4 p-[18px] max-[980px]:grid-cols-2 max-[620px]:grid-cols-1"
                key={job.id}
              >
                <div className="min-w-0">
                  <div className="flex min-w-0 items-center gap-2">
                    <h2 className="m-0 overflow-hidden text-ellipsis whitespace-nowrap text-[16px] font-extrabold text-ink">
                      {job.name}
                    </h2>
                    <StatusBadge status={job.status} />
                  </div>
                  <p className="mt-1 overflow-hidden text-ellipsis whitespace-nowrap font-mono text-[11px] text-muted">
                    {job.file}
                  </p>
                </div>

                <JobField label="Board" value={job.board} />
                <JobField label="Stage" value={job.stage} />
                <JobField label="Elapsed" value={job.elapsed} />

                <div className="min-w-[160px] max-[980px]:col-span-2 max-[620px]:col-span-1">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <span className="text-[10px] font-bold uppercase tracking-normal text-muted">
                      Export
                    </span>
                    <span className="font-mono text-[11px] font-bold text-text">
                      {job.progress}%
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-[#edf1f5]">
                    <div
                      className="h-full rounded-full bg-blue"
                      style={{ width: `${job.progress}%` }}
                    />
                  </div>
                </div>

                <Button
                  className="justify-self-end max-[980px]:justify-self-start"
                  variant="primary"
                  onClick={() => onOpenJob(job.id)}
                >
                  <ExternalLink size={15} />
                  Open
                </Button>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}

function JobField({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <span className="text-[10px] font-bold uppercase tracking-normal text-muted">
        {label}
      </span>
      <strong className="mt-1 block overflow-hidden text-ellipsis whitespace-nowrap text-[13px] font-bold text-text">
        {value}
      </strong>
    </div>
  )
}
