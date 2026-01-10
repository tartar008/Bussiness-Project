import { cn } from "@/lib/utils";
import { 
  ArrowRight, 
  TreePine, 
  MapPin, 
  Building2, 
  Truck, 
  CheckCircle2 
} from "lucide-react";

interface FlowStep {
  icon: React.ReactNode;
  label: string;
  labelTh: string;
}

const flowSteps: FlowStep[] = [
  { icon: <TreePine className="h-5 w-5" />, label: "Farmer", labelTh: "เกษตรกร" },
  { icon: <MapPin className="h-5 w-5" />, label: "Plot", labelTh: "แปลง" },
  { icon: <Building2 className="h-5 w-5" />, label: "Collection", labelTh: "จุดรับซื้อ" },
  { icon: <Truck className="h-5 w-5" />, label: "Receiving", labelTh: "รับซื้อ" },
  { icon: <CheckCircle2 className="h-5 w-5" />, label: "EUDR", labelTh: "รายงาน" },
];

export function SystemFlowDiagram({ className }: { className?: string }) {
  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2">
        {flowSteps.map((step, idx) => (
          <div key={idx} className="flex items-center">
            <div className="flex flex-col items-center min-w-[80px]">
              <div
                className={cn(
                  "rounded-xl p-3 mb-2 transition-all duration-300",
                  "bg-primary/10 text-primary",
                  "hover:bg-primary hover:text-primary-foreground hover:shadow-glow"
                )}
              >
                {step.icon}
              </div>
              <span className="text-xs font-medium text-foreground">{step.label}</span>
              <span className="text-[10px] text-muted-foreground">{step.labelTh}</span>
            </div>
            {idx < flowSteps.length - 1 && (
              <ArrowRight className="h-4 w-4 text-muted-foreground/50 mx-2 flex-shrink-0" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
