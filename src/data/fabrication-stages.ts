import type { FabricationStage } from "../types/fabrication"

export const fabricationStages: FabricationStage[] = [
  {
    id: "LOAD_PCB",
    label: "Load PCB",
    description: "Place the copper board on the bed.",
    detail:
      "Confirm the board is seated flat, aligned with the fixture, and ready for camera alignment.",
    output: "Board position captured",
    duration: "30 sec",
  },
  {
    id: "TOP_ALIGNMENT",
    label: "Top Alignment",
    description: "Align the laser path to the top layer.",
    detail:
      "Use the generated PCB reference to verify top-side origin and rotation before creating burn files.",
    output: "Top alignment offset",
    duration: "1 min",
  },
  {
    id: "TOP_DEOXIDATION",
    label: "Top Deoxidation",
    description: "Prepare the top copper surface.",
    detail:
      "Run the cleaning pass so the copper-fill pass has a consistent surface to burn.",
    output: "Top deoxidation LBRN",
    duration: "2 min",
  },
  {
    id: "TOP_COPPER_FILL",
    label: "Top Copper Fill",
    description: "Burn the top copper geometry.",
    detail:
      "Generate and review the top copper fill output before starting fabrication.",
    output: "Top copper LBRN",
    duration: "5 min",
  },
  {
    id: "ROTATE_BOARD",
    label: "Rotate Board",
    description: "Flip the board for bottom processing.",
    detail:
      "Rotate the board 180 degrees and return it to the fixture without shifting the origin.",
    output: "Rotation confirmed",
    duration: "20 sec",
  },
  {
    id: "BOTTOM_ALIGNMENT",
    label: "Bottom Alignment",
    description: "Align the laser path to the bottom layer.",
    detail:
      "Confirm the bottom-side reference points and compensate for the board flip.",
    output: "Bottom alignment offset",
    duration: "1 min",
  },
  {
    id: "BOTTOM_DEOXIDATION",
    label: "Bottom Deoxidation",
    description: "Prepare the bottom copper surface.",
    detail:
      "Run the cleaning pass for bottom-side copper before the final burn pass.",
    output: "Bottom deoxidation LBRN",
    duration: "2 min",
  },
  {
    id: "BOTTOM_COPPER_FILL",
    label: "Bottom Copper Fill",
    description: "Burn the bottom copper geometry.",
    detail:
      "Generate and review the bottom copper fill output for double-sided boards.",
    output: "Bottom copper LBRN",
    duration: "5 min",
  },
  {
    id: "FINAL_INSPECTION",
    label: "Final Inspection",
    description: "Check the fabricated board.",
    detail:
      "Review the board visually and confirm the job outputs before marking the job complete.",
    output: "Inspection log",
    duration: "1 min",
  },
  {
    id: "COMPLETE",
    label: "Complete",
    description: "Job outputs are ready.",
    detail: "The fabrication workflow is complete and ready for handoff.",
    output: "Job complete",
    duration: "Done",
  },
]
