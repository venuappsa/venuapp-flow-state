
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function ErrorTest() {
  const [shouldError, setShouldError] = useState(false);
  
  if (shouldError) {
    throw new Error("This is a test error to demonstrate the error boundary");
  }
  
  return (
    <div className="p-4 border rounded-md mb-4">
      <h3 className="font-bold mb-2">Error Boundary Test</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Click the button below to trigger an error and see the error boundary in action.
      </p>
      <Button 
        variant="destructive" 
        onClick={() => setShouldError(true)}
      >
        Trigger Error
      </Button>
    </div>
  );
}
