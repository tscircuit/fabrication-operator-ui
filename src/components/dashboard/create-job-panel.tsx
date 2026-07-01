import { FilePlus2, Sparkles } from "lucide-react"
import { useState } from "react"
import { initialJobs } from "../../data/fabrication-data"
import { Button } from "../ui/button"

interface CreateJobPanelProps {
  actionMessage: string | null
  isCreating: boolean
  onCreateJob: (sampleJobId: string) => void
}

export function CreateJobPanel({
  actionMessage,
  isCreating,
  onCreateJob,
}: CreateJobPanelProps) {
  const [sampleJobId, setSampleJobId] = useState(initialJobs[0]?.id ?? "")

  return (
    <section className="mt-5 rounded-[10px] border border-line bg-white/95 p-[18px] shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
      <div className="flex items-start justify-between gap-4 max-[760px]:flex-col">
        <div className="min-w-0">
          <span className="text-[10px] font-bold uppercase tracking-normal text-muted">
            fabrication_jobs/create
          </span>
          <h2 className="m-0 mt-1 text-[21px] font-extrabold text-ink">
            Create Fabrication Job
          </h2>
          <p className="mt-1.5 max-w-[680px] text-sm leading-normal text-[#4d5765]">
            Generates split LightBurn files with circuit-json-to-lbrn, then
            sends the required lbrn_files payload to the server.
          </p>
        </div>
        <div className="flex w-[min(100%,420px)] items-center gap-2 max-[620px]:w-full max-[620px]:flex-col">
          <select
            className="min-h-[38px] min-w-0 flex-1 rounded-lg border border-line bg-white px-3 text-sm font-semibold text-ink outline-none focus:border-blue max-[620px]:w-full"
            value={sampleJobId}
            onChange={(event) => setSampleJobId(event.target.value)}
          >
            {initialJobs.map((job) => (
              <option key={job.id} value={job.id}>
                {job.name}
              </option>
            ))}
          </select>
          <Button
            className="shrink-0 max-[620px]:w-full"
            disabled={isCreating || !sampleJobId}
            variant="primary"
            onClick={() => onCreateJob(sampleJobId)}
          >
            {isCreating ? <Sparkles size={16} /> : <FilePlus2 size={16} />}
            {isCreating ? "Creating" : "Create"}
          </Button>
        </div>
      </div>
      {actionMessage ? (
        <div className="mt-3 rounded-lg border border-blue/20 bg-blue-soft px-3 py-2 text-xs font-bold text-blue-strong">
          {actionMessage}
        </div>
      ) : null}
    </section>
  )
}
