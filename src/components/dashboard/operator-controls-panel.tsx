import {
  CheckCircle2,
  Crosshair,
  Eye,
  MoveHorizontal,
  RotateCw,
  ShieldCheck,
  Unlock,
  Zap,
} from "lucide-react"
import type { ReactNode } from "react"
import { useMemo, useState } from "react"
import type { CarrierOrientation } from "../../lib/fabrication-api-actions"
import { burnStageToLbrnFileKey } from "../../lib/lbrn-files"
import type { Job } from "../../types/fabrication"
import { Button } from "../ui/button"

type CarrierAction =
  | { type: "clamp" }
  | { type: "move"; x: number }
  | { type: "release" }
  | { angle_deg: number; type: "rotate" }
  | { orientation: CarrierOrientation; type: "rotate_to" }

interface OperatorControlsPanelProps {
  burnRuns: unknown[]
  error: string | null
  isLoadingBurnRuns: boolean
  isRunningAction: boolean
  job: Job | null
  onBurnStage: (lbrnFileKey: string) => void
  onCarrierAction: (action: CarrierAction) => void
  onCompleteStage: () => void
  onInspectBurnRun: (laserBurnRunId: string) => void
  onSetLaserOrigin: (origin: { x: number; y: number }) => void
  selectedBurnRun: unknown
}

const jogDistanceMm = 5
const jogRotationDeg = 15

export function OperatorControlsPanel({
  burnRuns,
  error,
  isLoadingBurnRuns,
  isRunningAction,
  job,
  onBurnStage,
  onCarrierAction,
  onCompleteStage,
  onInspectBurnRun,
  onSetLaserOrigin,
  selectedBurnRun,
}: OperatorControlsPanelProps) {
  const [originX, setOriginX] = useState("0")
  const [originY, setOriginY] = useState("0")
  const carrierPositionX = useMemo(
    () => getCarrierNumber(job?.carrierState, ["position_x", "x"]),
    [job?.carrierState],
  )
  const carrierRotationDeg = useMemo(
    () =>
      getCarrierNumber(job?.carrierState, [
        "rotation_deg",
        "angle_deg",
        "rotation",
      ]),
    [job?.carrierState],
  )
  const lbrnFileKey =
    burnStageToLbrnFileKey[
      job?.currentStage as keyof typeof burnStageToLbrnFileKey
    ]
  const canBurn = Boolean(job && lbrnFileKey)

  return (
    <section className="mt-5 rounded-[10px] border border-line bg-white/95 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
      <div className="border-b border-line-soft p-[18px]">
        <span className="text-[10px] font-bold uppercase tracking-normal text-muted">
          Operator Controls
        </span>
        <h2 className="m-0 mt-1 text-[21px] font-extrabold text-ink">
          Stage, Carrier, Laser
        </h2>
      </div>

      {error ? (
        <div className="border-b border-line-soft bg-red-soft px-[18px] py-3 text-xs font-semibold text-red">
          {error}
        </div>
      ) : null}

      <div className="grid grid-cols-3 divide-x divide-line-soft max-[1080px]:grid-cols-1 max-[1080px]:divide-x-0 max-[1080px]:divide-y">
        <ControlGroup
          title="Stage Control"
          detail={job?.currentStage ?? "No job selected"}
        >
          <Button
            className="w-full"
            disabled={!job || isRunningAction}
            variant="primary"
            onClick={onCompleteStage}
          >
            <CheckCircle2 size={16} />
            Complete Current Stage
          </Button>
        </ControlGroup>

        <ControlGroup
          title="Carrier"
          detail={`x ${formatNumber(carrierPositionX)} / ${formatNumber(
            carrierRotationDeg,
          )} deg`}
        >
          <div className="grid grid-cols-2 gap-2">
            <Button
              disabled={!job || isRunningAction}
              onClick={() => onCarrierAction({ type: "clamp" })}
            >
              <ShieldCheck size={15} />
              Clamp
            </Button>
            <Button
              disabled={!job || isRunningAction}
              onClick={() => onCarrierAction({ type: "release" })}
            >
              <Unlock size={15} />
              Release
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Button
              disabled={!job || isRunningAction}
              onClick={() =>
                onCarrierAction({
                  type: "move",
                  x: (carrierPositionX ?? 0) - jogDistanceMm,
                })
              }
            >
              <MoveHorizontal size={15} />X -{jogDistanceMm}
            </Button>
            <Button
              disabled={!job || isRunningAction}
              onClick={() =>
                onCarrierAction({
                  type: "move",
                  x: (carrierPositionX ?? 0) + jogDistanceMm,
                })
              }
            >
              <MoveHorizontal size={15} />X +{jogDistanceMm}
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Button
              disabled={!job || isRunningAction}
              onClick={() =>
                onCarrierAction({
                  angle_deg: (carrierRotationDeg ?? 0) - jogRotationDeg,
                  type: "rotate",
                })
              }
            >
              <RotateCw size={15} />-{jogRotationDeg} deg
            </Button>
            <Button
              disabled={!job || isRunningAction}
              onClick={() =>
                onCarrierAction({
                  angle_deg: (carrierRotationDeg ?? 0) + jogRotationDeg,
                  type: "rotate",
                })
              }
            >
              <RotateCw size={15} />+{jogRotationDeg} deg
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {(["top", "bottom", "pcb_insertion", "pcb_drop"] as const).map(
              (orientation) => (
                <Button
                  className="min-w-0 text-[12px]"
                  disabled={!job || isRunningAction}
                  key={orientation}
                  onClick={() =>
                    onCarrierAction({ orientation, type: "rotate_to" })
                  }
                >
                  {orientation}
                </Button>
              ),
            )}
          </div>
        </ControlGroup>

        <ControlGroup
          title="Laser"
          detail={canBurn ? lbrnFileKey : "Burn disabled for this stage"}
        >
          <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] gap-2">
            <NumberInput label="X" value={originX} onChange={setOriginX} />
            <NumberInput label="Y" value={originY} onChange={setOriginY} />
            <Button
              className="self-end"
              disabled={!job || isRunningAction}
              onClick={() =>
                onSetLaserOrigin({
                  x: Number(originX) || 0,
                  y: Number(originY) || 0,
                })
              }
            >
              <Crosshair size={15} />
              Origin
            </Button>
          </div>
          <Button
            className="w-full"
            disabled={!canBurn || isRunningAction || !lbrnFileKey}
            variant={canBurn ? "primary" : "soft"}
            onClick={() => lbrnFileKey && onBurnStage(lbrnFileKey)}
          >
            <Zap size={16} />
            Burn Current Stage
          </Button>
        </ControlGroup>
      </div>

      <div className="border-t border-line-soft p-[18px]">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-normal text-muted">
              laser_burn_runs/list
            </span>
            <h3 className="m-0 mt-1 text-[17px] font-extrabold text-ink">
              Burn History
            </h3>
          </div>
          {isLoadingBurnRuns ? (
            <span className="rounded-[7px] bg-blue-soft px-2 py-1.5 text-[10px] font-extrabold uppercase text-blue-strong">
              Loading
            </span>
          ) : null}
        </div>

        {burnRuns.length > 0 ? (
          <div className="grid grid-cols-[minmax(0,1fr)_minmax(260px,0.7fr)] gap-3 max-[820px]:grid-cols-1">
            <div className="grid gap-2">
              {burnRuns.slice(0, 6).map((burnRun, index) => {
                const id = getBurnRunId(burnRun) ?? `burn-run-${index + 1}`

                return (
                  <button
                    className="grid min-h-[54px] grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-lg border border-line-soft bg-surface-soft px-3 py-2 text-left text-inherit hover:border-[#91c7f4]"
                    key={id}
                    type="button"
                    onClick={() => onInspectBurnRun(id)}
                  >
                    <span className="min-w-0">
                      <strong className="block overflow-hidden text-ellipsis whitespace-nowrap text-sm font-extrabold text-ink">
                        {getBurnRunLabel(burnRun, index)}
                      </strong>
                      <small className="mt-0.5 block overflow-hidden text-ellipsis whitespace-nowrap font-mono text-[11px] text-muted">
                        {getBurnRunSubtext(burnRun)}
                      </small>
                    </span>
                    <Eye size={16} className="text-blue" />
                  </button>
                )
              })}
            </div>
            <ValueBlock value={selectedBurnRun ?? burnRuns[0]} />
          </div>
        ) : (
          <div className="rounded-lg border border-line-soft bg-surface-soft p-4 text-sm font-semibold text-muted">
            No burn runs returned.
          </div>
        )}
      </div>
    </section>
  )
}

function ControlGroup({
  children,
  detail,
  title,
}: {
  children: ReactNode
  detail: string
  title: string
}) {
  return (
    <div className="grid content-start gap-3 p-[18px]">
      <div>
        <h3 className="m-0 text-[17px] font-extrabold text-ink">{title}</h3>
        <p className="mt-1 overflow-hidden text-ellipsis whitespace-nowrap text-xs font-semibold text-muted">
          {detail}
        </p>
      </div>
      {children}
    </div>
  )
}

function NumberInput({
  label,
  onChange,
  value,
}: {
  label: string
  onChange: (value: string) => void
  value: string
}) {
  return (
    <label className="grid gap-1">
      <span className="text-[10px] font-bold uppercase tracking-normal text-muted">
        {label}
      </span>
      <input
        className="min-h-[38px] min-w-0 rounded-lg border border-line bg-white px-3 text-sm font-semibold text-ink outline-none focus:border-blue"
        inputMode="decimal"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  )
}

function ValueBlock({ value }: { value: unknown }) {
  return (
    <pre className="m-0 max-h-[260px] min-h-[150px] overflow-auto whitespace-pre-wrap rounded-lg border border-line-soft bg-[#f8fafc] p-3 font-mono text-[12px] leading-relaxed text-text">
      {formatValue(value)}
    </pre>
  )
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function getCarrierNumber(value: unknown, keys: string[]) {
  if (!isRecord(value)) {
    return undefined
  }

  for (const key of keys) {
    const directValue = value[key]

    if (typeof directValue === "number" && Number.isFinite(directValue)) {
      return directValue
    }
  }

  const position = value.position
  if (isRecord(position)) {
    for (const key of keys) {
      const nestedValue = position[key]

      if (typeof nestedValue === "number" && Number.isFinite(nestedValue)) {
        return nestedValue
      }
    }
  }

  return undefined
}

function getBurnRunId(value: unknown) {
  if (!isRecord(value)) {
    return undefined
  }

  const id = value.laser_burn_run_id ?? value.burn_run_id ?? value.id

  return typeof id === "string" ? id : undefined
}

function getBurnRunLabel(value: unknown, index: number) {
  if (!isRecord(value)) {
    return `Burn run ${index + 1}`
  }

  const filePath = value.file_path ?? value.file ?? value.filename

  return typeof filePath === "string" ? filePath : `Burn run ${index + 1}`
}

function getBurnRunSubtext(value: unknown) {
  if (!isRecord(value)) {
    return "No metadata"
  }

  const passes = value.passes ?? value.num_passes
  const createdAt = value.created_at ?? value.createdAt
  const status = value.status ?? value.state

  return [status, passes ? `${passes} passes` : null, createdAt]
    .filter(Boolean)
    .join(" / ")
}

function formatNumber(value: number | undefined) {
  return typeof value === "number" ? value.toFixed(2) : "--"
}

function formatValue(value: unknown) {
  if (value == null || value === "") {
    return "No data"
  }

  if (typeof value === "string") {
    return value
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return String(value)
  }

  return JSON.stringify(value, null, 2)
}
