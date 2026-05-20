import { Camera, CheckCircle2, RefreshCw } from "lucide-react"
import { Button } from "../ui/button"

type CameraStatus = "simulated" | "no-camera" | "connected"

export interface CameraPreviewCardProps {
  status?: CameraStatus
  imageUrl?: string
  onStartCamera?: () => void
  onRetakeSnapshot?: () => void
  onUseSnapshot?: () => void
}

const statusLabel: Record<CameraStatus, string> = {
  simulated: "SIMULATED",
  "no-camera": "NO CAMERA",
  connected: "CONNECTED",
}

export function CameraPreviewCard({
  status = "simulated",
  imageUrl,
  onStartCamera,
  onRetakeSnapshot,
  onUseSnapshot,
}: CameraPreviewCardProps) {
  return (
    <div className="camera-preview-card">
      <div className="section-header">
        <div>
          <h2>Camera Preview</h2>
          <p>Live view used for alignment and rotation checks.</p>
        </div>
        <span className={`camera-status ${status}`}>{statusLabel[status]}</span>
      </div>

      <div className="camera-preview-frame">
        {imageUrl ? (
          <img alt="Camera alignment preview" src={imageUrl} />
        ) : (
          <span>Camera feed unavailable</span>
        )}
      </div>

      <div className="camera-actions">
        <Button variant="soft" onClick={onStartCamera}>
          <Camera size={15} />
          Start Camera
        </Button>
        <Button variant="soft" onClick={onRetakeSnapshot}>
          <RefreshCw size={15} />
          Retake Snapshot
        </Button>
        <Button variant="primary" onClick={onUseSnapshot}>
          <CheckCircle2 size={15} />
          Use Snapshot
        </Button>
      </div>
    </div>
  )
}
