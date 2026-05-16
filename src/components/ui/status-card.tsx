import type { LucideIcon } from "lucide-react"

interface StatusCardProps {
  label: string
  value: number
  tone: string
  icon: LucideIcon
}

export function StatusCard({
  label,
  value,
  tone,
  icon: Icon,
}: StatusCardProps) {
  return (
    <article className={`status-card ${tone}`}>
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
      <span className="status-icon">
        <Icon size={22} />
      </span>
    </article>
  )
}
