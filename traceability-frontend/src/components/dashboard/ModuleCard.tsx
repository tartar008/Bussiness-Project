import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ModuleCardProps {
  title: string;
  titleTh: string;
  description: string;
  icon: LucideIcon;
  features: string[];
  color: "forest" | "earth" | "amber" | "sky";
  onClick?: () => void;
}

const colorStyles = {
  forest: {
    gradient: "from-primary/10 to-primary/5",
    iconBg: "bg-primary/15",
    iconColor: "text-primary",
    border: "hover:border-primary/30",
  },
  earth: {
    gradient: "from-secondary to-secondary/50",
    iconBg: "bg-secondary",
    iconColor: "text-secondary-foreground",
    border: "hover:border-secondary/50",
  },
  amber: {
    gradient: "from-accent/10 to-accent/5",
    iconBg: "bg-accent/15",
    iconColor: "text-accent-foreground",
    border: "hover:border-accent/30",
  },
  sky: {
    gradient: "from-info/10 to-info/5",
    iconBg: "bg-info/15",
    iconColor: "text-info",
    border: "hover:border-info/30",
  },
};

export function ModuleCard({
  title,
  titleTh,
  description,
  icon: Icon,
  features,
  color,
  onClick,
}: ModuleCardProps) {
  const styles = colorStyles[color];

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border bg-card p-6 shadow-soft transition-all duration-300",
        "hover:shadow-medium hover:-translate-y-1 cursor-pointer",
        styles.border
      )}
      onClick={onClick}
    >
      {/* Background gradient */}
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-300 group-hover:opacity-100",
          styles.gradient
        )}
      />

      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className={cn("rounded-xl p-3", styles.iconBg)}>
            <Icon className={cn("h-7 w-7", styles.iconColor)} />
          </div>
          <div className="text-right">
            <h3 className="text-lg font-semibold text-foreground">{title}</h3>
            <p className="text-sm text-muted-foreground">{titleTh}</p>
          </div>
        </div>

        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{description}</p>

        <ul className="space-y-2 mb-5">
          {features.slice(0, 3).map((feature, idx) => (
            <li
              key={idx}
              className="flex items-center gap-2 text-sm text-foreground/80"
            >
              <div className="h-1.5 w-1.5 rounded-full bg-primary/60" />
              {feature}
            </li>
          ))}
        </ul>

        <Button
          variant="ghost"
          className="w-full justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
        >
          เข้าสู่ระบบ
        </Button>
      </div>
    </div>
  );
}
