import { Camera, CheckCircle2, RefreshCw } from "lucide-react"
import { cn } from "../../lib/classnames"
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

const statusClassName: Record<CameraStatus, string> = {
  simulated: "bg-blue-soft text-blue-strong",
  "no-camera": "bg-red-soft text-[#b4232f]",
  connected: "bg-green-soft text-[#087443]",
}

export function CameraPreviewCard({
  status = "simulated",
  imageUrl,
  onStartCamera,
  onRetakeSnapshot,
  onUseSnapshot,
}: CameraPreviewCardProps) {
  return (
    <div className="flex min-w-0 flex-col gap-3.5 rounded-[10px] border border-line bg-white p-[18px] shadow-[0_8px_26px_rgba(15,23,42,0.04)] [grid-area:camera] min-[1120px]:self-stretch">
      <div className="mb-0 flex items-center justify-between gap-4 max-[620px]:flex-col max-[620px]:items-start">
        <div>
          <h2 className="m-0 text-[21px] font-extrabold text-ink">
            Camera Preview
          </h2>
          <p className="mt-1 text-[10px] font-bold normal-case tracking-normal text-muted">
            Live view used for alignment and rotation checks.
          </p>
        </div>
        <span
          className={cn(
            "inline-flex min-h-[26px] items-center whitespace-nowrap rounded-[7px] px-2 text-[10px] font-extrabold uppercase",
            statusClassName[status],
          )}
        >
          {statusLabel[status]}
        </span>
      </div>

      <div className="relative grid min-h-[280px] w-full place-items-center overflow-hidden rounded-lg border border-[#202938] bg-[#070b12] bg-[image:linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[length:18px_18px] text-[#d0d5dd] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.03)] after:pointer-events-none after:absolute after:inset-4 after:rounded-md after:border after:border-white/10 after:content-[''] min-[1120px]:min-h-0 min-[1120px]:flex-1 [&_img]:block [&_img]:h-full [&_img]:w-full [&_img]:object-cover">
        {imageUrl ? (
          <img alt="Camera alignment preview" src={imageUrl} />
        ) : (
          <span className="z-[1] text-[13px] font-bold text-[#d0d5dd]">
            Camera feed unavailable
          </span>
        )}
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-2.5 max-[980px]:grid-cols-1">
        <Button
          className="min-w-0 whitespace-nowrap px-2.5"
          variant="soft"
          onClick={onStartCamera}
        >
          <Camera size={15} />
          Start Camera
        </Button>
        <Button
          className="min-w-0 whitespace-nowrap px-2.5"
          variant="soft"
          onClick={onRetakeSnapshot}
        >
          <RefreshCw size={15} />
          Retake Snapshot
        </Button>
        <Button
          className="min-w-0 whitespace-nowrap px-2.5"
          variant="primary"
          onClick={onUseSnapshot}
        >
          <CheckCircle2 size={15} />
          Use Snapshot
        </Button>
      </div>
    </div>
  )
}
