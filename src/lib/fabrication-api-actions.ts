import { initialJobs } from "../data/fabrication-data"
import type { Job } from "../types/fabrication"
import { normalizeFabricationJob } from "./fabrication-job-adapter"
import {
  type ApiJson,
  fakeFabricationServerClient,
} from "./fake-fabrication-server-client"
import { createLbrnFilesForFabricationJob } from "./lbrn-files"

export type OperatorActionResult = {
  label: string
  response: ApiJson
}

export type CarrierOrientation = "bottom" | "pcb_drop" | "pcb_insertion" | "top"

function getLookup(job: Job) {
  return { fabrication_job_id: job.id }
}

export async function createFabricationJobFromSample(sampleJobId: string) {
  const sampleJob = initialJobs.find((job) => job.id === sampleJobId)

  if (!sampleJob) {
    throw new Error("Choose a sample circuit before creating a job")
  }

  const circuitJson = await sampleJob.loadCircuitJson()
  const lbrnFiles = await createLbrnFilesForFabricationJob(circuitJson)
  const rawJob = await fakeFabricationServerClient.createFabricationJob({
    name: sampleJob.name,
    file: sampleJob.file,
    board: sampleJob.board,
    layers: sampleJob.layers,
    circuit_json: circuitJson as ApiJson,
    lbrn_files: lbrnFiles,
  })

  return normalizeFabricationJob(rawJob, sampleJob)
}

export async function completeCurrentStage(job: Job) {
  const rawJob =
    await fakeFabricationServerClient.moveFabricationJobToNextStage(
      getLookup(job),
    )

  return normalizeFabricationJob(rawJob, job)
}

export async function runCarrierAction(
  job: Job,
  action:
    | { type: "clamp" }
    | { type: "move"; x: number }
    | { type: "release" }
    | { angle_deg: number; type: "rotate" }
    | { orientation: CarrierOrientation; type: "rotate_to" },
): Promise<OperatorActionResult> {
  if (action.type === "clamp") {
    return {
      label: "Carrier clamped PCB",
      response: await fakeFabricationServerClient.clampPcb(getLookup(job)),
    }
  }

  if (action.type === "release") {
    return {
      label: "Carrier released PCB",
      response: await fakeFabricationServerClient.releasePcb(getLookup(job)),
    }
  }

  if (action.type === "move") {
    return {
      label: `Carrier moved to ${action.x.toFixed(2)} mm`,
      response: await fakeFabricationServerClient.moveCarrierToX(
        getLookup(job),
        action.x,
      ),
    }
  }

  if (action.type === "rotate") {
    return {
      label: `Carrier rotated to ${action.angle_deg.toFixed(1)} deg`,
      response: await fakeFabricationServerClient.rotateCarrierToAngle(
        getLookup(job),
        action.angle_deg,
      ),
    }
  }

  return {
    label: `Carrier rotated to ${action.orientation}`,
    response: await fakeFabricationServerClient.rotateCarrierToOrientation(
      getLookup(job),
      action.orientation,
    ),
  }
}

export async function setLaserOrigin(
  job: Job,
  origin: { x: number; y: number },
) {
  return {
    label: `Laser origin set to ${origin.x.toFixed(2)}, ${origin.y.toFixed(2)}`,
    response: await fakeFabricationServerClient.setLaserOrigin(
      getLookup(job),
      origin,
    ),
  }
}

export async function burnLaserStage(job: Job, lbrnFileKey: string) {
  return {
    label: `Laser burn started for ${lbrnFileKey}`,
    response: await fakeFabricationServerClient.burnLaser(getLookup(job), {
      lbrn_file_key: lbrnFileKey,
      stage: job.currentStage,
    }),
  }
}

export function listLaserBurnRuns(job: Job) {
  return fakeFabricationServerClient.listLaserBurnRuns(getLookup(job))
}

export function getLaserBurnRun(job: Job, laserBurnRunId: string) {
  return fakeFabricationServerClient.getLaserBurnRun({
    ...getLookup(job),
    laser_burn_run_id: laserBurnRunId,
  })
}
