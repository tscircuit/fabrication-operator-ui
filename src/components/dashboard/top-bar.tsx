import { Zap } from "lucide-react"
import { Button } from "../ui/button"

export function TopBar() {
  return (
    <header className="top-bar">
      <div className="brand-lockup">
        <div className="brand-mark">
          <Zap size={20} strokeWidth={2.4} />
        </div>
        <div>
          <span className="brand-name">PCBBurn</span>
          <span className="brand-context">Dashboard</span>
        </div>
      </div>

      <nav className="top-nav" aria-label="Dashboard navigation">
        <a href="#jobs">Jobs</a>
        <a href="#upload">Upload</a>
      </nav>

      <Button variant="primary">New Job</Button>
    </header>
  )
}
