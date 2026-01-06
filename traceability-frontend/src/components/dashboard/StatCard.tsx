import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    label: string;
  };
  accentColor?: "primary" | "success" | "warning" | "info";
  className?: string;
}

const accentColors = {
  primary: "border-l-primary bg-primary/5",
  success: "border-l-success bg-success/5",
  warning: "border-l-warning bg-warning/5",
  info: "border-l-info bg-info/5",
};

const iconColors = {
  primary: "text-primary bg-primary/10",
  success: "text-success bg-success/10",
  warning: "text-warning bg-warning/10",
  info: "text-info bg-info/10",
};

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  accentColor = "primary",
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border-l-4 bg-card p-6 shadow-soft transition-all duration-200 hover:shadow-medium",
        accentColors[accentColor],
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold tracking-tight text-foreground">{value}</p>
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
          {trend && (
            <div className="flex items-center gap-1 pt-1">
              <span
                className={cn(
                  "text-sm font-medium",
                  trend.value >= 0 ? "text-success" : "text-destructive"
                )}
              >
                {trend.value >= 0 ? "+" : ""}
                {trend.value}%
              </span>
              <span className="text-xs text-muted-foreground">{trend.label}</span>
            </div>
          )}
        </div>
        <div className={cn("rounded-lg p-3", iconColors[accentColor])}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}
