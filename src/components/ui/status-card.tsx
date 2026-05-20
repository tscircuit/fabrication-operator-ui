import type { LucideIcon } from "lucide-react"
import { cn } from "../../lib/classnames"

interface StatusCardProps {
  label: string
  value: number
  tone: string
  icon: LucideIcon
}

const iconToneClassName: Record<string, string> = {
  blue: "bg-blue-soft text-blue",
  green: "bg-green-soft text-green",
  slate: "bg-[#edf1f5] text-[#475467]",
  red: "bg-red-soft text-red",
}

export function StatusCard({
  label,
  value,
  tone,
  icon: Icon,
}: StatusCardProps) {
  return (
    <article className="flex min-h-28 justify-between rounded-[10px] border border-line bg-white p-[18px] shadow-[0_8px_26px_rgba(15,23,42,0.04)]">
      <div>
        <span className="text-[10px] font-bold uppercase tracking-normal text-muted">
          {label}
        </span>
        <strong className="mt-2 block text-[34px] font-[820] text-ink">
          {value}
        </strong>
      </div>
      <span
        className={cn(
          "grid h-11 w-11 place-items-center rounded-[10px]",
          iconToneClassName[tone],
        )}
      >
        <Icon size={22} />
      </span>
    </article>
  )
}
