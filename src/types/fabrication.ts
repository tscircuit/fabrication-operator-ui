export type JobStatus = "in-progress" | "pending" | "completed" | "failed"

export type FabricationStageId =
  | "LOAD_PCB"
  | "TOP_ALIGNMENT"
  | "TOP_DEOXIDATION"
  | "TOP_COPPER_FILL"
  | "ROTATE_BOARD"
  | "BOTTOM_ALIGNMENT"
  | "BOTTOM_DEOXIDATION"
  | "BOTTOM_COPPER_FILL"
  | "FINAL_INSPECTION"
  | "COMPLETE"

export interface Job {
  id: string
  name: string
  file: string
  loadCircuitJson: () => Promise<unknown[]>
  board: string
  layers: string
  stage: string
  currentStage: FabricationStageId
  status: JobStatus
  elapsed: string
  progress: number
}

export interface FabricationStage {
  id: FabricationStageId
  label: string
  description: string
  detail: string
  output: string
  duration: string
}
