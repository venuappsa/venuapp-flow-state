
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  loading?: boolean;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  gradient?: boolean;
}

export function StatCard({
  title,
  value,
  description,
  icon,
  loading = false,
  change,
  changeType,
  gradient = false,
}: StatCardProps) {
  return (
    <Card className={gradient ? "bg-gradient-to-br from-white to-gray-50" : ""}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            {loading ? (
              <Skeleton className="h-8 w-20 mt-1" />
            ) : (
              <h3 className="text-2xl font-bold mt-1">{value}</h3>
            )}
            {change && (
              <p className={`text-xs ${
                changeType === "positive" ? "text-green-600" :
                changeType === "negative" ? "text-red-600" :
                "text-gray-500"
              } mt-1 flex items-center`}>
                {change}
              </p>
            )}
            {description && (
              <p className="text-xs text-gray-500 mt-1">{description}</p>
            )}
          </div>
          {icon && (
            <div className={`h-10 w-10 rounded-full ${gradient ? "bg-venu-orange/10" : "bg-primary/10"} flex items-center justify-center`}>
              {loading ? (
                <Skeleton className="h-6 w-6 rounded-full" />
              ) : (
                icon
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
