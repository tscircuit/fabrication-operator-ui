import type { ButtonHTMLAttributes } from "react"

type ButtonVariant = "primary" | "soft" | "icon-label" | "job-action"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
}

const variantClassName: Record<ButtonVariant, string> = {
  primary: "primary-button",
  soft: "soft-button",
  "icon-label": "icon-label-button",
  "job-action": "job-action",
}

export function Button({
  className = "",
  type = "button",
  variant = "soft",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`${variantClassName[variant]} ${className}`.trim()}
      type={type}
      {...props}
    />
  )
}
