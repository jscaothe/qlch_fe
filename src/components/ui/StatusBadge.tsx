import React from "react";
import { cn } from "@/lib/utils";

type RoomStatus = "vacant" | "occupied" | "maintenance" | "reserved";

type StatusBadgeProps = {
  status: RoomStatus;
  className?: string;
};

const statusConfig = {
  vacant: {
    label: "Còn trống",
    className: "bg-emerald-100 text-emerald-800"
  },
  occupied: {
    label: "Đã thuê",
    className: "bg-blue-100 text-blue-800"
  },
  maintenance: {
    label: "Bảo trì",
    className: "bg-amber-100 text-amber-800"
  }
};

const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const config = statusConfig[status];
  
  return (
    <span 
      className={cn(
        "px-2 py-1 rounded-full text-xs font-medium",
        config.className,
        className
      )}
      aria-label={`Trạng thái: ${config.label}`}
      tabIndex={0}
    >
      {config.label}
    </span>
  );
};

export default StatusBadge;
