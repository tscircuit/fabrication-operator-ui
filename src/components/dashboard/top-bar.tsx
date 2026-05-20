import { Zap } from "lucide-react"
import { Button } from "../ui/button"

export function TopBar() {
  return (
    <header className="sticky top-0 z-10 grid min-h-16 grid-cols-[minmax(180px,1fr)_auto_minmax(120px,1fr)] items-center gap-5 border-b border-line bg-white/90 px-6 py-2.5 backdrop-blur-2xl max-[980px]:grid-cols-[1fr_auto] max-[620px]:px-4">
      <div className="flex items-center gap-2.5">
        <div className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-blue to-[#0c8de8] text-white shadow-[0_8px_24px_rgba(11,118,209,0.25)]">
          <Zap size={20} strokeWidth={2.4} />
        </div>
        <div>
          <span className="block text-[15px] font-[780] leading-tight text-ink">
            PCBBurn
          </span>
          <span className="mt-0.5 block text-[11px] font-semibold text-muted">
            Dashboard
          </span>
        </div>
      </div>

      <nav
        className="flex justify-center gap-5 max-[980px]:hidden"
        aria-label="Dashboard navigation"
      >
        <a
          className="text-sm font-semibold text-[#394253] no-underline hover:text-blue"
          href="#jobs"
        >
          Jobs
        </a>
        <a
          className="text-sm font-semibold text-[#394253] no-underline hover:text-blue"
          href="#upload"
        >
          Upload
        </a>
      </nav>

      <Button className="justify-self-end px-[18px]" variant="primary">
        New Job
      </Button>
    </header>
  )
}
