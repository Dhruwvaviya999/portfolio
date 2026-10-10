import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  [
    "group/button relative isolate inline-flex shrink-0 cursor-pointer items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap outline-none select-none",
    "transition-[color,background-color,border-color,box-shadow,translate,scale] duration-200 ease-out motion-reduce:transition-none",
    // Press feedback: a slight squeeze rather than a jump.
    "active:not-aria-[haspopup]:scale-[0.97]",
    "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
    "disabled:pointer-events-none disabled:opacity-50",
    "aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:transition-transform [&_svg]:duration-200 [&_svg:not([class*='size-'])]:size-4",
    // A trailing icon (mark it data-icon="inline-end") nudges forward on hover.
    "hover:[&_[data-icon=inline-end]]:translate-x-0.5",
  ],
  {
    variants: {
      variant: {
        default: [
          "overflow-hidden bg-brand text-brand-foreground",
          "shadow-[inset_0_1px_0_0_rgb(255_255_255/0.22),0_1px_2px_0_rgb(0_0_0/0.12)]",
          "hover:-translate-y-0.5 hover:bg-[color-mix(in_oklch,var(--brand),white_10%)]",
          "hover:shadow-[inset_0_1px_0_0_rgb(255_255_255/0.22),0_8px_24px_-8px_var(--brand)]",
          // Sheen that sweeps across on hover. -z-10 inside `isolate` keeps
          // it above the fill but under the label.
          "before:pointer-events-none before:absolute before:inset-y-0 before:left-0 before:-z-10 before:w-1/2 before:-translate-x-[150%] before:skew-x-[-20deg] before:bg-linear-to-r before:from-transparent before:via-white/30 before:to-transparent",
          "before:transition-transform before:duration-700 before:ease-out hover:before:translate-x-[250%] motion-reduce:before:hidden",
        ],
        outline: [
          "border-border bg-background/70 shadow-xs backdrop-blur-sm",
          "hover:-translate-y-0.5 hover:border-brand/50 hover:bg-brand/5 hover:text-foreground",
          "hover:shadow-[0_8px_24px_-10px_color-mix(in_oklch,var(--brand)_45%,transparent)]",
          "aria-expanded:bg-muted aria-expanded:text-foreground",
          "dark:border-input dark:bg-input/30 dark:hover:border-brand/50 dark:hover:bg-brand/10",
        ],
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
        ghost:
          "hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50",
        destructive:
          "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default:
          "h-9 gap-2 px-4 has-data-[icon=inline-end]:pr-3.5 has-data-[icon=inline-start]:pl-3.5",
        xs: "h-6 gap-1 rounded-[min(var(--radius-md),10px)] px-2 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 gap-1.5 rounded-[min(var(--radius-md),12px)] px-3 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-2.5 has-data-[icon=inline-start]:pl-2.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-11 gap-2 rounded-xl px-6 text-[0.95rem] has-data-[icon=inline-end]:pr-5 has-data-[icon=inline-start]:pl-5",
        icon: "size-8",
        "icon-xs":
          "size-6 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
        "icon-sm":
          "size-7 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg",
        "icon-lg": "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
