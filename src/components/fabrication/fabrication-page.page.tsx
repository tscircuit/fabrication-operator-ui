import { initialJobs } from "../../data/fabrication-data"
import { FabricationPage } from "./fabrication-page"

const noop = () => {}

export default {
  "In Progress": (
    <FabricationPage job={initialJobs[0]} onBackToDashboard={noop} />
  ),
  Completed: <FabricationPage job={initialJobs[1]} onBackToDashboard={noop} />,
  "Needs Review": (
    <FabricationPage job={initialJobs[2]} onBackToDashboard={noop} />
  ),
}
