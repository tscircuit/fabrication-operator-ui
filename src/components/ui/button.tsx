import type { ButtonHTMLAttributes } from "react"
import { cn } from "../../lib/classnames"

type ButtonVariant = "primary" | "soft" | "icon-label" | "job-action"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
}

const baseClassName =
  "inline-flex min-h-[38px] appearance-none items-center justify-center gap-2 rounded-lg border px-3.5 text-[13px] font-bold tracking-normal transition duration-150 ease-out hover:-translate-y-px disabled:pointer-events-none disabled:opacity-55"

const variantClassName: Record<ButtonVariant, string> = {
  primary:
    "border-[#0f5fa8] bg-[#0b76d1] text-white shadow-[0_10px_20px_rgba(11,118,209,0.18)] hover:border-[#0a4f8a] hover:bg-[#0868b8]",
  soft: "border-line bg-white text-[#344054] hover:border-[#b8c2d0] hover:bg-[#f8fafc]",
  "icon-label":
    "border-line bg-white text-[#344054] hover:border-[#b8c2d0] hover:bg-[#f8fafc]",
  "job-action":
    "border-line bg-white text-[#344054] hover:border-[#b8c2d0] hover:bg-[#f8fafc]",
}

export function Button({
  className = "",
  type = "button",
  variant = "soft",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(baseClassName, variantClassName[variant], className)}
      type={type}
      {...props}
    />
  )
}
