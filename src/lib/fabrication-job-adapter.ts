import { fabricationStages } from "../data/fabrication-stages"
import type {
  FabricationJobStage,
  FabricationStageId,
  Job,
  JobStatus,
} from "../types/fabrication"
import type {
  ApiJson,
  FakeFabricationJob,
} from "./fake-fabrication-server-client"

const stageIdSet = new Set<string>(fabricationStages.map((stage) => stage.id))

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function getValue(
  record: Record<string, unknown>,
  keys: string[],
): unknown | undefined {
  for (const key of keys) {
    if (record[key] !== undefined) {
      return record[key]
    }
  }

  return undefined
}

function getString(record: Record<string, unknown>, keys: string[]) {
  const value = getValue(record, keys)

  return typeof value === "string" && value.trim() ? value : undefined
}

function getNumber(record: Record<string, unknown>, keys: string[]) {
  const value = getValue(record, keys)

  if (typeof value === "number" && Number.isFinite(value)) {
    return value
  }

  if (typeof value === "string") {
    const numberValue = Number(value)

    return Number.isFinite(numberValue) ? numberValue : undefined
  }

  return undefined
}

function normalizeStageId(value: unknown): FabricationStageId {
  if (typeof value === "string") {
    const normalizedValue = value.toUpperCase().replace(/[-\s]+/g, "_")

    if (stageIdSet.has(normalizedValue)) {
      return normalizedValue as FabricationStageId
    }
  }

  return "LOAD_PCB"
}

function normalizeStatus(value: unknown): JobStatus {
  if (typeof value !== "string") {
    return "pending"
  }

  const normalizedValue = value.toLowerCase().replace(/[_\s]+/g, "-")

  if (
    ["complete", "completed", "done", "success", "succeeded"].includes(
      normalizedValue,
    )
  ) {
    return "completed"
  }

  if (
    ["failed", "error", "errored", "cancelled", "canceled"].includes(
      normalizedValue,
    )
  ) {
    return "failed"
  }

  if (["queued", "pending", "waiting"].includes(normalizedValue)) {
    return "pending"
  }

  return "in-progress"
}

function getProgress(currentStage: FabricationStageId, status: JobStatus) {
  if (status === "completed" || currentStage === "COMPLETE") {
    return 100
  }

  const stageIndex = fabricationStages.findIndex(
    (stage) => stage.id === currentStage,
  )

  if (stageIndex < 0) {
    return 0
  }

  return Math.round(
    (stageIndex / Math.max(fabricationStages.length - 1, 1)) * 100,
  )
}

function getStageLabel(currentStage: FabricationStageId) {
  return (
    fabricationStages.find((stage) => stage.id === currentStage)?.label ??
    currentStage
  )
}

function normalizeStageEntry(
  stage: unknown,
  index: number,
): FabricationJobStage | null {
  if (typeof stage === "string") {
    const id = normalizeStageId(stage)

    return {
      id,
      label: getStageLabel(id),
    }
  }

  if (!isRecord(stage)) {
    return null
  }

  const id =
    getString(stage, ["stage_id", "id", "name"]) ?? `stage-${index + 1}`
  const normalizedId = normalizeStageId(id)
  const hasKnownStageId = stageIdSet.has(normalizedId)

  return {
    id: hasKnownStageId ? normalizedId : id,
    label:
      getString(stage, ["label", "name", "stage_name", "stage"]) ??
      (hasKnownStageId ? getStageLabel(normalizedId) : id),
    status: getString(stage, ["status", "state"]),
    detail: getString(stage, ["detail", "description", "output"]),
  }
}

function getDefaultStages(currentStage: FabricationStageId) {
  const currentIndex = fabricationStages.findIndex(
    (stage) => stage.id === currentStage,
  )

  return fabricationStages.map((stage, index) => ({
    id: stage.id,
    label: stage.label,
    status:
      index < currentIndex
        ? "complete"
        : index === currentIndex
          ? "current"
          : "pending",
    detail: stage.output,
  }))
}

function normalizeStageList(
  record: Record<string, unknown>,
  currentStage: FabricationStageId,
) {
  const value = getValue(record, [
    "stage_list",
    "stages",
    "fabrication_stages",
    "fabrication_stage_list",
  ])

  if (!Array.isArray(value)) {
    return getDefaultStages(currentStage)
  }

  const stages = value
    .map((stage, index) => normalizeStageEntry(stage, index))
    .filter((stage): stage is FabricationJobStage => stage !== null)

  return stages.length > 0 ? stages : getDefaultStages(currentStage)
}

function normalizeCircuitJson(value: unknown) {
  return Array.isArray(value) ? (value as unknown[]) : []
}

export function normalizeFabricationJob(
  rawJob: FakeFabricationJob,
  fallback?: Job,
): Job {
  const record = rawJob as Record<string, unknown>
  const id =
    getString(record, ["fabrication_job_id", "job_id", "id"]) ??
    fallback?.id ??
    "unknown-job"
  const rawCurrentStage = getValue(record, [
    "current_stage",
    "currentStage",
    "stage_id",
  ])
  const rawStatus = getValue(record, ["status", "job_status"])
  const currentStage =
    rawCurrentStage == null
      ? (fallback?.currentStage ?? "LOAD_PCB")
      : normalizeStageId(rawCurrentStage)
  const status =
    rawStatus == null
      ? (fallback?.status ?? "pending")
      : normalizeStatus(rawStatus)
  const progress =
    getNumber(record, ["progress", "percent_complete", "completion"]) ??
    fallback?.progress ??
    getProgress(currentStage, status)
  const file =
    getString(record, ["file", "filename", "file_name", "source_file"]) ??
    fallback?.file ??
    `${id}.json`
  const circuitJson = getValue(record, ["circuit_json", "circuitJson"])

  return {
    id,
    name:
      getString(record, ["name", "job_name", "title"]) ??
      fallback?.name ??
      file.replace(/\.[^.]+$/, ""),
    file,
    loadCircuitJson: () => Promise.resolve(normalizeCircuitJson(circuitJson)),
    board:
      getString(record, ["board", "board_size", "boardSize"]) ??
      fallback?.board ??
      "Unknown board",
    layers:
      getString(record, ["layers", "layer_stack", "layerStack"]) ??
      fallback?.layers ??
      "top / bottom",
    stage:
      getString(record, ["stage", "stage_status", "stageStatus"]) ??
      getStageLabel(currentStage),
    currentStage,
    status,
    elapsed:
      getString(record, ["elapsed", "elapsed_time", "elapsedTime"]) ??
      fallback?.elapsed ??
      "0:00",
    progress: Math.max(0, Math.min(100, Math.round(progress))),
    stages: normalizeStageList(record, currentStage),
    carrierState:
      getValue(record, ["carrier_state", "carrierState", "carrier"]) ??
      fallback?.carrierState,
    laserState:
      getValue(record, ["laser_state", "laserState", "laser"]) ??
      fallback?.laserState,
    savedAlignmentOrigins:
      getValue(record, [
        "saved_alignment_origins",
        "savedAlignmentOrigins",
        "alignment_origins",
        "alignmentOrigins",
      ]) ?? fallback?.savedAlignmentOrigins,
    raw: rawJob,
  }
}

export function normalizeFabricationJobs(rawJobs: FakeFabricationJob[]) {
  return rawJobs.map((rawJob) => normalizeFabricationJob(rawJob))
}

export function isApiJsonObject(
  value: ApiJson,
): value is Record<string, ApiJson | undefined> {
  return isRecord(value)
}
