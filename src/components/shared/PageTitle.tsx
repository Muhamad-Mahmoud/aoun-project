import { cn } from "@/lib/utils";

interface PageTitleProps {
  title: string;
  children?: React.ReactNode;
  className?: string;
}

export function PageTitle({ title, children, className }: PageTitleProps) {
  return (
    <div className={cn("flex flex-col gap-1 md:flex-row md:items-center md:justify-between", className)}>
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
          {title}
        </h1>
      </div>
      {children && (
        <div className="flex items-center gap-2">
          {children}
        </div>
      )}
    </div>
  );
}
