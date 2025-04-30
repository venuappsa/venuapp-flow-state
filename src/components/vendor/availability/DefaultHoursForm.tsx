
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Save } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { DefaultHours, saveDefaultHours } from '@/utils/availability';

interface DefaultHoursFormProps {
  userId: string;
  initialValues: DefaultHours;
  onSave: (hours: DefaultHours) => void;
  onApplyToWeek: () => void;
}

export default function DefaultHoursForm({ 
  userId, 
  initialValues, 
  onSave, 
  onApplyToWeek 
}: DefaultHoursFormProps) {
  const [timeStart, setTimeStart] = useState(initialValues.timeStart);
  const [timeEnd, setTimeEnd] = useState(initialValues.timeEnd);
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveDefaults = async () => {
    setIsSaving(true);
    try {
      const defaultHours: DefaultHours = {
        timeStart,
        timeEnd
      };
      
      saveDefaultHours(userId, defaultHours);
      onSave(defaultHours);
      
      toast({
        title: 'Default hours saved',
        description: 'Your default working hours have been updated.',
      });
    } catch (error) {
      console.error('Error saving default hours:', error);
      toast({
        title: 'Failed to save default hours',
        description: 'Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="shadow-sm">
      <CardContent className="space-y-4 p-4">
        <h3 className="font-medium mb-2">Default Working Hours</h3>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label htmlFor="default-start">Start</Label>
            <Input 
              id="default-start" 
              type="time" 
              value={timeStart}
              onChange={e => setTimeStart(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="default-end">End</Label>
            <Input 
              id="default-end" 
              type="time" 
              value={timeEnd}
              onChange={e => setTimeEnd(e.target.value)}
            />
          </div>
        </div>
        <Button 
          className="w-full mt-2" 
          variant="outline"
          onClick={handleSaveDefaults}
          disabled={isSaving}
        >
          {isSaving ? 'Saving...' : 'Save Default Hours'}
          <Save className="ml-2 h-4 w-4" />
        </Button>
        
        <Button 
          className="w-full" 
          variant="outline" 
          onClick={onApplyToWeek}
        >
          Apply to Current Week
        </Button>
      </CardContent>
    </Card>
  );
}
