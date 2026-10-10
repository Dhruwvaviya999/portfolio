import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * Shared field look: soft glassy fill, a border that firms up on hover, and a
 * brand glow on focus. Validation styling uses `user-invalid`, so a required
 * field only turns red after the visitor has interacted with it, not on load.
 */
const fieldClass = cn(
  "w-full min-w-0 rounded-xl border border-input bg-background/60 text-sm shadow-xs outline-none",
  "transition-[color,background-color,border-color,box-shadow] duration-200 ease-out motion-reduce:transition-none",
  "placeholder:text-muted-foreground/70",
  "hover:border-foreground/20",
  "focus-visible:border-brand/60 focus-visible:bg-background focus-visible:ring-4 focus-visible:ring-brand/15",
  "user-invalid:border-destructive/60 user-invalid:focus-visible:ring-destructive/15",
  "disabled:cursor-not-allowed disabled:opacity-50",
  "dark:bg-input/20 dark:hover:border-foreground/25 dark:focus-visible:bg-input/30"
)

/** Leading icon slot; turns brand-colored while its field has focus. */
function FieldIcon({
  icon,
  className,
}: {
  icon: React.ReactNode
  className?: string
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute left-3.5 text-muted-foreground transition-colors duration-200 group-focus-within/field:text-brand [&_svg]:size-4",
        className
      )}
    >
      {icon}
    </span>
  )
}

function Input({
  className,
  type,
  icon,
  ...props
}: React.ComponentProps<"input"> & { icon?: React.ReactNode }) {
  const input = (
    <input
      type={type}
      data-slot="input"
      className={cn(fieldClass, "h-11 px-3.5", icon && "pl-10", className)}
      {...props}
    />
  )
  if (!icon) return input
  return (
    <div className="group/field relative">
      <FieldIcon icon={icon} className="top-1/2 -translate-y-1/2" />
      {input}
    </div>
  )
}

/** Grows with its content (where `field-sizing` is supported) up to max-h. */
function Textarea({
  className,
  icon,
  ...props
}: React.ComponentProps<"textarea"> & { icon?: React.ReactNode }) {
  const textarea = (
    <textarea
      data-slot="textarea"
      className={cn(
        fieldClass,
        "field-sizing-content min-h-32 max-h-72 resize-none px-3.5 py-3 leading-relaxed",
        icon && "pl-10",
        className
      )}
      {...props}
    />
  )
  if (!icon) return textarea
  return (
    <div className="group/field relative">
      {/* Lines up with the first line of text. */}
      <FieldIcon icon={icon} className="top-4" />
      {textarea}
    </div>
  )
}

export { Input, Textarea }
