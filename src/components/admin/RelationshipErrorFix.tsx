
import React from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle, Repeat, Shield } from "lucide-react";
import { useSchemaFix } from "@/hooks/useSchemaFix";

interface RelationshipErrorFixProps {
  testError: string | null;
  onSuccess: () => void;
}

export function RelationshipErrorFix({ testError, onSuccess }: RelationshipErrorFixProps) {
  const { 
    isRepairing, 
    repairDetails, 
    repairSuccess, 
    forceSchemaReset, 
    repairProfiles,
    setRepairSuccess
  } = useSchemaFix();

  // Check for bypass flag
  React.useEffect(() => {
    if (repairSuccess) {
      onSuccess();
    }
  }, [repairSuccess, onSuccess]);

  // Handler for page refresh
  const refreshPage = () => {
    window.location.reload();
  };

  if (!testError) return null;
  
  if (repairSuccess) {
    return (
      <div className="p-4 mb-4 bg-green-50 border border-green-200 rounded-md">
        <h3 className="text-sm font-medium text-green-800 flex items-center">
          <CheckCircle className="h-4 w-4 mr-2" />
          Repair Successful
        </h3>
        <p className="text-sm text-green-600 mt-1">
          Relationship issues have been fixed successfully.
        </p>
        <div className="mt-3">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={refreshPage}
          >
            Refresh Page
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Alert variant="destructive" className="mb-4">
      <AlertCircle className="h-4 w-4 mr-2" />
      <AlertTitle>Schema Relationship Issue Detected</AlertTitle>
      <AlertDescription>
        <p className="mt-1">{testError}</p>
        
        {repairDetails && isRepairing && (
          <div className="mt-2 text-xs bg-amber-50 p-2 rounded border border-amber-200">
            <div className="font-medium">Repair status:</div>
            <div className="mt-1 whitespace-pre-line">{repairDetails}</div>
          </div>
        )}
        
        <div className="mt-3 flex flex-wrap gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => repairProfiles(false)}
            disabled={isRepairing}
          >
            <Shield className="h-4 w-4 mr-1" />
            {isRepairing ? "Repairing..." : "Auto-Repair"}
          </Button>
          
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={forceSchemaReset}
            disabled={isRepairing}
          >
            <Repeat className="h-4 w-4 mr-1" />
            Force Reset Schema Cache
          </Button>
          
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={() => repairProfiles(true)}
            disabled={isRepairing}
          >
            Bypass & Continue
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={refreshPage}
          >
            Refresh Page
          </Button>
        </div>
        
        <p className="text-xs text-red-500 mt-2">
          Note: "Force Reset Schema Cache" uses aggressive methods to clear all caching layers and may require refreshing the page.
        </p>
      </AlertDescription>
    </Alert>
  );
}
