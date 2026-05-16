import type { Job } from "../types/fabrication"

export const initialJobs: Job[] = [
  {
    id: "job-001",
    name: "Arduino Shield v2.1",
    file: "arduino-shield-v2.1.circuit.json",
    board: "68.58 x 53.34 mm",
    layers: "top / bottom",
    stage: "Ready for setup",
    status: "in-progress",
    elapsed: "4:05",
    progress: 31,
  },
  {
    id: "job-002",
    name: "LED Driver Board",
    file: "led-driver.kicad_pcb",
    board: "45.00 x 30.00 mm",
    layers: "top",
    stage: "Exported",
    status: "completed",
    elapsed: "7:36",
    progress: 100,
  },
  {
    id: "job-003",
    name: "Sensor Breakout",
    file: "sensor-breakout.circuit.json",
    board: "25.40 x 25.40 mm",
    layers: "top / bottom",
    stage: "Needs review",
    status: "pending",
    elapsed: "0:00",
    progress: 8,
  },
]
