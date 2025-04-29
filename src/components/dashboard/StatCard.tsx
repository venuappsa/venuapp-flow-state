
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  onClick?: () => void;
  className?: string;
  gradient?: boolean;
}

export function StatCard({
  title,
  value,
  description,
  icon,
  change,
  changeType = 'neutral',
  onClick,
  className,
  gradient = false,
}: StatCardProps) {
  return (
    <Card
      onClick={onClick}
      className={cn(
        "overflow-hidden hover:shadow-md transition-all duration-300 cursor-pointer hover:scale-[1.02] h-full",
        gradient && "bg-gradient-to-br from-white to-venu-soft-gray border-transparent",
        className
      )}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className={cn(
            "rounded-full p-3 mb-4",
            gradient ? "bg-white/80 text-venu-purple" : "bg-venu-purple/10 text-venu-purple"
          )}>
            {icon}
          </div>
          {change && (
            <div className={cn(
              "text-xs px-2 py-1 rounded-full font-medium",
              changeType === 'positive' ? 'bg-green-100 text-green-800' : 
              changeType === 'negative' ? 'bg-red-100 text-red-800' : 
              'bg-gray-100 text-gray-700'
            )}>
              {change}
            </div>
          )}
        </div>
        <div>
          <h3 className="font-medium text-gray-500 text-sm">{title}</h3>
          <div className={cn(
            "text-2xl font-bold mt-1",
            gradient && "text-venu-purple"
          )}>
            {value}
          </div>
          {description && (
            <p className="text-xs text-gray-500 mt-1">{description}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
