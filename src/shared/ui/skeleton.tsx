import { cn } from "@/shared/utils"

function Skeleton({ className, shimmer = true, ...props }: React.ComponentProps<"div"> & { shimmer?: boolean }) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        "rounded-xl border-slate-100",
        shimmer ? "skeleton-shimmer" : "bg-accent animate-pulse",
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }

