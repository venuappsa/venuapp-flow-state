
import React from 'react';
import { addWeeks, format, startOfWeek, endOfWeek, subWeeks } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface WeekToolbarProps {
  currentDate: Date;
  onPrevWeek: () => void;
  onNextWeek: () => void;
  onToday: () => void;
}

export default function WeekToolbar({
  currentDate,
  onPrevWeek,
  onNextWeek,
  onToday
}: WeekToolbarProps) {
  const weekStart = startOfWeek(currentDate);
  const weekEnd = endOfWeek(currentDate);

  return (
    <Card className="mb-4">
      <CardContent className="p-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" onClick={onPrevWeek}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={onNextWeek}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="text-sm font-medium">
          {format(weekStart, 'MMM d')} - {format(weekEnd, 'MMM d, yyyy')}
        </div>
        
        <Button variant="outline" size="sm" onClick={onToday}>
          Today
        </Button>
      </CardContent>
    </Card>
  );
}
