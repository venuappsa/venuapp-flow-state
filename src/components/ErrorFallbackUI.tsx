
import React from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface ErrorFallbackUIProps {
  error: Error;
  resetError: () => void;
}

export const ErrorFallbackUI: React.FC<ErrorFallbackUIProps> = ({ error, resetError }) => {
  const { toast } = useToast();
  
  const handleContactSupport = () => {
    toast({
      title: "Support Request Sent",
      description: "Our team has been notified and will contact you shortly.",
      duration: 5000,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md bg-card rounded-lg shadow-lg p-6 text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-red-100 p-3 rounded-full">
            <AlertTriangle className="h-10 w-10 text-destructive" />
          </div>
        </div>
        <h2 className="text-2xl font-bold mb-2 text-foreground">Something went wrong</h2>
        <p className="text-muted-foreground mb-6">
          We're sorry, but an unexpected error occurred. Our team has been notified.
        </p>
        {process.env.NODE_ENV !== "production" && (
          <div className="bg-muted p-3 rounded-md mb-6 text-left overflow-auto max-h-32">
            <p className="text-xs font-mono text-muted-foreground">{error.toString()}</p>
          </div>
        )}
        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <Button onClick={resetError} className="w-full">
            Try Again
          </Button>
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={handleContactSupport}
          >
            Contact Support
          </Button>
        </div>
      </div>
    </div>
  );
};
