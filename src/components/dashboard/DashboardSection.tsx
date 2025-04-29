
import React from "react";
import { cn } from "@/lib/utils";

interface DashboardSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  action?: React.ReactNode;
  gradient?: boolean;
}

export function DashboardSection({
  title,
  description,
  children,
  className,
  action,
  gradient = false,
}: DashboardSectionProps) {
  return (
    <section className={cn("space-y-4 animate-fade-in", className)}>
      <div className="flex items-start justify-between">
        <div>
          <h2 className={cn(
            "text-lg font-semibold flex items-center",
            gradient && "bg-clip-text text-transparent bg-gradient-to-r from-venu-purple to-venu-dark-purple"
          )}>
            {title}
          </h2>
          {description && (
            <p className="text-sm text-gray-500 mt-1">{description}</p>
          )}
        </div>
        {action && (
          <div>{action}</div>
        )}
      </div>
      <div className="mt-4">
        {children}
      </div>
    </section>
  );
}
