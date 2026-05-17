import type { Job } from "../types/fabrication"

export const initialJobs: Job[] = [
  {
    id: "job-001",
    name: "BlinkBuddy",
    file: "BlinkBuddy.json",
    loadCircuitJson: () =>
      import("../../assets/BlinkBuddy.json").then((module) => module.default),
    board: "72.00 x 48.00 mm",
    layers: "top / bottom",
    stage: "Ready for setup",
    status: "in-progress",
    elapsed: "4:05",
    progress: 31,
  },
  {
    id: "job-002",
    name: "led-water-accelerometer",
    file: "led-water-accelerometer.json",
    loadCircuitJson: () =>
      import("../../assets/led-water-accelerometer.json").then(
        (module) => module.default,
      ),
    board: "120.00 x 74.00 mm",
    layers: "top / bottom",
    stage: "Exported",
    status: "completed",
    elapsed: "7:36",
    progress: 100,
  },
  {
    id: "job-003",
    name: "Motor Controller",
    file: "motor-controller.json",
    loadCircuitJson: () =>
      import("../../assets/motor-controller.json").then(
        (module) => module.default,
      ),
    board: "70.00 x 70.00 mm",
    layers: "top / bottom",
    stage: "Needs review",
    status: "pending",
    elapsed: "0:00",
    progress: 8,
  },
]
