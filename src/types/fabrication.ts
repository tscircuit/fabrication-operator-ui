export type JobStatus = "in-progress" | "pending" | "completed" | "failed"

export interface Job {
  id: string
  name: string
  file: string
  board: string
  layers: string
  stage: string
  status: JobStatus
  elapsed: string
  progress: number
}
