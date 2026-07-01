import { FileJson, FilePlus2, Sparkles, Upload } from "lucide-react"
import type { ChangeEvent } from "react"
import { useState } from "react"
import { initialJobs } from "../../data/fabrication-data"
import { Button } from "../ui/button"

interface CreateJobPanelProps {
  actionMessage: string | null
  isCreating: boolean
  onCreateJob: (sampleJobId: string) => void
  onCreateJobFromFile: (file: File) => void
}

export function CreateJobPanel({
  actionMessage,
  isCreating,
  onCreateJob,
  onCreateJobFromFile,
}: CreateJobPanelProps) {
  const [sampleJobId, setSampleJobId] = useState(initialJobs[0]?.id ?? "")
  const [selectedFileName, setSelectedFileName] = useState("")

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    setSelectedFileName(file.name)
    onCreateJobFromFile(file)
    event.target.value = ""
  }

  return (
    <section
      className="mt-5 rounded-[10px] border border-line bg-white/95 p-[18px] shadow-[0_10px_30px_rgba(15,23,42,0.04)]"
      id="upload"
    >
      <div className="flex items-start justify-between gap-4 max-[760px]:flex-col">
        <div className="min-w-0">
          <span className="text-[10px] font-bold uppercase tracking-normal text-muted">
            fabrication_jobs/create
          </span>
          <h2 className="m-0 mt-1 text-[21px] font-extrabold text-ink">
            Create Fabrication Job
          </h2>
          <p className="mt-1.5 max-w-[680px] text-sm leading-normal text-[#4d5765]">
            Create from a bundled sample or open a Circuit JSON file.
          </p>
        </div>
        <div className="flex w-[min(100%,620px)] flex-wrap items-center justify-end gap-2 max-[760px]:justify-start">
          <select
            className="min-h-[38px] min-w-[220px] flex-1 rounded-lg border border-line bg-white px-3 text-sm font-semibold text-ink outline-none focus:border-blue max-[620px]:w-full"
            disabled={isCreating}
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
          <label className="inline-flex min-h-[38px] shrink-0 cursor-pointer appearance-none items-center justify-center gap-2 rounded-lg border border-line bg-white px-3.5 text-[13px] font-bold tracking-normal text-[#344054] transition duration-150 ease-out hover:-translate-y-px hover:border-[#b8c2d0] hover:bg-[#f8fafc] has-[:disabled]:pointer-events-none has-[:disabled]:opacity-55 max-[620px]:w-full">
            <Upload size={16} />
            Open JSON
            <input
              accept="application/json,.json"
              className="sr-only"
              disabled={isCreating}
              type="file"
              onChange={handleFileChange}
            />
          </label>
        </div>
      </div>
      {selectedFileName ? (
        <div className="mt-3 flex items-center gap-2 rounded-lg border border-line-soft bg-[#f8fafc] px-3 py-2 text-xs font-bold text-muted">
          <FileJson size={15} />
          {selectedFileName}
        </div>
      ) : null}
      {actionMessage ? (
        <div className="mt-3 rounded-lg border border-blue/20 bg-blue-soft px-3 py-2 text-xs font-bold text-blue-strong">
          {actionMessage}
        </div>
      ) : null}
    </section>
  )
}
