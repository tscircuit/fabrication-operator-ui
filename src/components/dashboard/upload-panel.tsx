import { FileJson, Upload } from "lucide-react"
import { Button } from "../ui/button"

export function UploadPanel() {
  return (
    <section
      className="mt-5 flex min-h-[230px] flex-col items-center justify-center rounded-[10px] border border-dashed border-line bg-white/95 p-6 text-center shadow-[0_10px_30px_rgba(15,23,42,0.04)]"
      id="upload"
    >
      <div className="grid h-[54px] w-[54px] place-items-center rounded-[14px] bg-blue-soft text-blue">
        <Upload size={28} />
      </div>
      <h2 className="mt-3 text-[21px] font-extrabold text-ink">
        Upload Circuit File
      </h2>
      <p className="mb-4 mt-2 max-w-[500px] text-sm leading-normal text-[#4d5765]">
        Start with a tscircuit Circuit JSON or KiCad file. The dashboard keeps
        this step focused on intake and conversion status.
      </p>
      <Button className="px-[18px]" variant="primary">
        <FileJson size={16} />
        Choose File
      </Button>
      <div className="mt-3.5 flex flex-wrap justify-center gap-2">
        <span className="rounded-[7px] border border-line-soft bg-[#f8fafc] px-2 py-1 font-mono text-[11px] text-muted">
          .json
        </span>
        <span className="rounded-[7px] border border-line-soft bg-[#f8fafc] px-2 py-1 font-mono text-[11px] text-muted">
          .kicad_pcb
        </span>
      </div>
    </section>
  )
}
