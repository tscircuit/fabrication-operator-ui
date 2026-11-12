import { test } from "bun:test"
import assert from "node:assert/strict"
import { normalizeFabricationJob } from "../src/lib/fabrication-job-adapter"

// Adapter unit tests only: no React rendering, server, file conversion or devices.
const previous = () =>
  normalizeFabricationJob({
    fabrication_job_id: "job-display-fixture",
    current_stage: "TOP_COPPER_FILL",
    status: "in_progress",
    progress: 31,
    name: "Display fixture",
  })

for (const status of ["complete", "completed", "done", "success", "succeeded"]) {
  test(`explicit job completion status ${status} replaces stale progress`, () => {
    const job = normalizeFabricationJob({ status }, previous())
    assert.equal(job.status, "completed")
    assert.equal(job.progress, 100)
  })
}

for (const field of ["current_stage", "currentStage", "stage_id"]) {
  test(`explicit COMPLETE through ${field} replaces stale progress`, () => {
    const job = normalizeFabricationJob({ [field]: "complete" }, previous())
    assert.equal(job.currentStage, "COMPLETE")
    assert.equal(job.progress, 100)
  })
}

test("completed stage and status replace stale progress together", () => {
  const job = normalizeFabricationJob(
    { current_stage: "COMPLETE", status: "completed" },
    previous(),
  )
  assert.equal(job.currentStage, "COMPLETE")
  assert.equal(job.status, "completed")
  assert.equal(job.progress, 100)
})

test("job_status alias retains completion handling", () => {
  const job = normalizeFabricationJob({ job_status: "success" }, previous())
  assert.equal(job.status, "completed")
  assert.equal(job.progress, 100)
})

for (const progress of [0, 42, 100, "0", "42"]) {
  test(`explicit progress ${JSON.stringify(progress)} keeps precedence`, () => {
    const job = normalizeFabricationJob(
      { current_stage: "COMPLETE", status: "completed", progress },
      previous(),
    )
    assert.equal(job.progress, Number(progress))
  })
}

for (const [field, values] of [
  ["percent_complete", [0, 51]],
  ["completion", [0, 62]],
] as const) {
  for (const progress of values) {
    test(`explicit ${field}=${progress} keeps precedence`, () => {
      const job = normalizeFabricationJob(
        { current_stage: "COMPLETE", status: "completed", [field]: progress },
        previous(),
      )
      assert.equal(job.progress, progress)
    })
  }
}

test("unfinished stage updates retain existing fallback progress", () => {
  const job = normalizeFabricationJob(
    { current_stage: "BOTTOM_ALIGNMENT", status: "in_progress" },
    previous(),
  )
  assert.equal(job.currentStage, "BOTTOM_ALIGNMENT")
  assert.equal(job.progress, 31)
})

test("metadata-only updates retain fallback progress and state", () => {
  const job = normalizeFabricationJob({ name: "New display name" }, previous())
  assert.equal(job.progress, 31)
  assert.equal(job.currentStage, "TOP_COPPER_FILL")
  assert.equal(job.status, "in-progress")
})

test("no raw completion signal does not reinterpret fallback completion state", () => {
  const fallback = { ...previous(), currentStage: "COMPLETE" as const, status: "completed" as const, progress: 64 }
  assert.equal(normalizeFabricationJob({ name: "Metadata update" }, fallback).progress, 64)
})

test("null state fields retain original fallback semantics", () => {
  const job = normalizeFabricationJob(
    { current_stage: null, status: null } as unknown as Parameters<typeof normalizeFabricationJob>[0],
    previous(),
  )
  assert.equal(job.progress, 31)
  assert.equal(job.currentStage, "TOP_COPPER_FILL")
  assert.equal(job.status, "in-progress")
})

test("failed job status retains intermediate fallback progress", () => {
  const job = normalizeFabricationJob({ status: "failed" }, previous())
  assert.equal(job.status, "failed")
  assert.equal(job.progress, 31)
})

test("without fallback the existing completion calculation is unchanged", () => {
  assert.equal(normalizeFabricationJob({ status: "completed" }).progress, 100)
  assert.equal(normalizeFabricationJob({ current_stage: "COMPLETE" }).progress, 100)
})

test("without fallback an unfinished stage keeps its original calculated progress", () => {
  const job = normalizeFabricationJob({ current_stage: "TOP_COPPER_FILL", status: "in_progress" })
  assert.equal(job.progress, 33)
})

test("completion normalization preserves other fields and does not mutate inputs", async () => {
  const fallback = previous()
  const fallbackBefore = { ...fallback }
  const raw = {
    fabrication_job_id: "job-display-fixture",
    current_stage: "COMPLETE",
    status: "completed",
    name: "Finished display fixture",
    file: "board.json",
    board: "10 x 20 mm",
    layers: "top / bottom",
    elapsed: "2:31",
    circuit_json: [{ type: "pcb_board", width: 10, height: 20 }],
    carrier_state: { x: 7 },
    laser_state: { state: "idle" },
    saved_alignment_origins: { top: { x: 1, y: 2 } },
  }
  const rawBefore = structuredClone(raw)
  const job = normalizeFabricationJob(raw, fallback)
  assert.equal(job.progress, 100)
  assert.equal(job.name, raw.name)
  assert.equal(job.file, raw.file)
  assert.equal(job.board, raw.board)
  assert.equal(job.layers, raw.layers)
  assert.equal(job.elapsed, raw.elapsed)
  assert.equal(job.stage, "Complete")
  assert.deepEqual(await job.loadCircuitJson(), raw.circuit_json)
  assert.deepEqual(job.carrierState, raw.carrier_state)
  assert.deepEqual(job.laserState, raw.laser_state)
  assert.deepEqual(job.savedAlignmentOrigins, raw.saved_alignment_origins)
  assert.equal(job.raw, raw)
  assert.deepEqual(raw, rawBefore)
  assert.deepEqual(fallback, fallbackBefore)
})
