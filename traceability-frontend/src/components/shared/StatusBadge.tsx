import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  active: { label: "ใช้งาน", variant: "default" },
  inactive: { label: "ไม่ใช้งาน", variant: "secondary" },
  pending: { label: "รอตรวจสอบ", variant: "outline" },
  passed: { label: "ผ่าน", variant: "default" },
  failed: { label: "ไม่ผ่าน", variant: "destructive" },
  expired: { label: "หมดอายุ", variant: "secondary" },
  processing: { label: "กำลังประมวลผล", variant: "outline" },
  completed: { label: "สำเร็จ", variant: "default" },
  error: { label: "ผิดพลาด", variant: "destructive" },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status] || { label: status, variant: "outline" as const };

  return (
    <Badge variant={config.variant} className={cn(className)}>
      {config.label}
    </Badge>
  );
}
