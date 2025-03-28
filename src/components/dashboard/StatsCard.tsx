
import React from "react";
import { cn } from "@/lib/utils";

type StatsCardProps = {
  title: string;
  value: string | number;
  icon: React.ElementType;
  change?: {
    value: string | number;
    positive: boolean;
  };
  className?: string;
};

const StatsCard = ({
  title,
  value,
  icon: Icon,
  change,
  className,
}: StatsCardProps) => {
  return (
    <div className={cn("dashboard-card", className)}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <p className="text-2xl font-bold mt-1">{value}</p>
          
          {change && (
            <div className="flex items-center mt-2">
              <span
                className={cn(
                  "text-xs font-medium",
                  change.positive ? "text-emerald-600" : "text-red-600"
                )}
              >
                {change.positive ? "+" : "-"}{change.value}
              </span>
              <span className="text-xs text-gray-500 ml-1">so với tháng trước</span>
            </div>
          )}
        </div>
        
        <div className="p-3 rounded-full gradient-primary text-white">
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
