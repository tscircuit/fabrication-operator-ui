import { FileJson, Upload } from "lucide-react"
import { Button } from "../ui/button"

export function UploadPanel() {
  return (
    <section className="upload-panel" id="upload">
      <div className="upload-icon">
        <Upload size={28} />
      </div>
      <h2>Upload Circuit File</h2>
      <p>
        Start with a tscircuit Circuit JSON or KiCad file. The dashboard keeps
        this step focused on intake and conversion status.
      </p>
      <Button variant="primary">
        <FileJson size={16} />
        Choose File
      </Button>
      <div className="format-row">
        <span>.json</span>
        <span>.kicad_pcb</span>
      </div>
    </section>
  )
}
