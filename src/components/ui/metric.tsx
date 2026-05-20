export function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-lg bg-surface-soft px-2.5 py-[9px]">
      <span className="text-[10px] font-bold uppercase tracking-normal text-muted">
        {label}
      </span>
      <strong className="mt-1 block overflow-hidden text-ellipsis whitespace-normal font-mono text-xs font-bold leading-tight text-text">
        {value}
      </strong>
    </div>
  )
}
