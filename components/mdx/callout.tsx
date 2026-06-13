import type { ReactNode } from "react";
import { AlertTriangle, CheckCircle2, Info, Lightbulb } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type CalloutType = "info" | "warning" | "success" | "tip";

const VARIANTS: Record<CalloutType, { icon: LucideIcon; box: string; iconClass: string }> = {
  info: { icon: Info, box: "border-brand/30 bg-brand/5", iconClass: "text-brand" },
  warning: {
    icon: AlertTriangle,
    box: "border-amber-500/30 bg-amber-500/5",
    iconClass: "text-amber-500",
  },
  success: {
    icon: CheckCircle2,
    box: "border-emerald-500/30 bg-emerald-500/5",
    iconClass: "text-emerald-500",
  },
  tip: { icon: Lightbulb, box: "border-brand/30 bg-brand/5", iconClass: "text-brand" },
};

/**
 * Callout block for MDX case studies. Usage in MDX:
 * `<Callout type="success" title="Outcome">…</Callout>`
 */
export function Callout({
  type = "info",
  title,
  children,
}: {
  type?: CalloutType;
  title?: string;
  children: ReactNode;
}) {
  const { icon: Icon, box, iconClass } = VARIANTS[type];
  return (
    <div className={cn("my-6 flex gap-3 rounded-lg border p-4", box)}>
      <Icon className={cn("mt-0.5 size-5 shrink-0", iconClass)} aria-hidden="true" />
      <div className="min-w-0 text-sm leading-7 text-muted-foreground">
        {title ? <p className="font-semibold text-foreground">{title}</p> : null}
        {children}
      </div>
    </div>
  );
}
