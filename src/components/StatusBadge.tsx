import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, XCircle, AlertCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

export type StatusType = 'success' | 'warning' | 'error' | 'info' | 'pending';

interface StatusBadgeProps {
  status: StatusType;
  label: string;
  showIcon?: boolean;
  className?: string;
}

const statusConfig = {
  success: {
    className: "bg-[hsl(160,60%,50%,0.2)] text-[hsl(160,60%,50%)] border-[hsl(160,60%,50%,0.3)]",
    icon: CheckCircle2,
  },
  warning: {
    className: "bg-[hsl(40,90%,55%,0.2)] text-[hsl(40,90%,55%)] border-[hsl(40,90%,55%,0.3)]",
    icon: AlertCircle,
  },
  error: {
    className: "bg-[hsl(0,70%,60%,0.2)] text-[hsl(0,70%,60%)] border-[hsl(0,70%,60%,0.3)]",
    icon: XCircle,
  },
  info: {
    className: "bg-[hsl(195,80%,70%,0.2)] text-[hsl(195,80%,70%)] border-[hsl(195,80%,70%,0.3)]",
    icon: Info,
  },
  pending: {
    className: "bg-[hsl(40,90%,55%,0.2)] text-[hsl(40,90%,55%)] border-[hsl(40,90%,55%,0.3)]",
    icon: Clock,
  },
};

export const StatusBadge = ({ 
  status, 
  label, 
  showIcon = true, 
  className 
}: StatusBadgeProps) => {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge className={cn(config.className, className)}>
      {showIcon && <Icon className="h-3 w-3 ml-1" />}
      {label}
    </Badge>
  );
};

