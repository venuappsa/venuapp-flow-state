
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from 'lucide-react';
import { cn } from "@/lib/utils";

interface CreateNewResourceProps {
  title: string;
  description: string;
  link: string;
  icon?: React.ReactNode;
  className?: string;
  variant?: 'default' | 'bordered' | 'dashed';
}

export default function CreateNewResource({
  title,
  description,
  link,
  icon = <Plus className="h-8 w-8" />,
  className,
  variant = 'default'
}: CreateNewResourceProps) {
  return (
    <Link to={link}>
      <Card className={cn(
        "h-full transition-all duration-300 hover:shadow-md hover:scale-[1.02]",
        variant === 'dashed' && "border-dashed border-2",
        variant === 'bordered' && "border-2",
        className
      )}>
        <CardContent className="flex flex-col items-center justify-center text-center h-full p-6 gap-3">
          <div className={cn(
            "rounded-full p-4 mb-2",
            variant === 'default' ? "bg-venu-orange/10 text-venu-orange" : "bg-muted text-muted-foreground"
          )}>
            {icon}
          </div>
          <h3 className="font-semibold">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
