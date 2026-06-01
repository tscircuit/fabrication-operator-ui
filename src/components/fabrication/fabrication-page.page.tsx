import { initialJobs } from "../../data/fabrication-data"
import { FabricationPage } from "./fabrication-page"

const noop = () => {}

export default {
  "In Progress": (
    <FabricationPage
      job={initialJobs[0]}
      onBackToDashboard={noop}
      onConfirmStage={noop}
    />
  ),
  Completed: (
    <FabricationPage
      job={initialJobs[1]}
      onBackToDashboard={noop}
      onConfirmStage={noop}
    />
  ),
  "Needs Review": (
    <FabricationPage
      job={initialJobs[2]}
      onBackToDashboard={noop}
      onConfirmStage={noop}
    />
  ),
}
