import { Dashboard } from "./dashboard"
import { useFabricationDashboard } from "../../hooks/use-fabrication-dashboard"

export default function DashboardPage() {
  const dashboard = useFabricationDashboard()

  return <Dashboard dashboard={dashboard} onOpenJob={() => {}} />
}
