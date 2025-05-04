
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LogoutSelfTest from './LogoutSelfTest';
import LoginSelfTest from './LoginSelfTest';
import { useFetchmanProfile } from "@/hooks/useFetchmanProfile";
import { useAllFetchmanProfiles } from "@/hooks/useAllFetchmanProfiles";
import { useUser } from "@/hooks/useUser";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, AlertCircle, RefreshCcw } from "lucide-react";

// Add a component to test fetchman profile relationships
function ProfileRelationshipTest() {
  const { user } = useUser();
  const { testProfileRelationship } = useFetchmanProfile(user?.id);
  const { testProfilesRelationship } = useAllFetchmanProfiles();
  const [singleResult, setSingleResult] = useState<any>(null);
  const [allResult, setAllResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const runSingleTest = async () => {
    setIsLoading(true);
    const result = await testProfileRelationship();
    setSingleResult(result);
    setIsLoading(false);
  };
  
  const runAllTest = async () => {
    setIsLoading(true);
    const result = await testProfilesRelationship();
    setAllResult(result);
    setIsLoading(false);
  };
  
  return (
    <div className="space-y-4 p-2">
      <div className="flex flex-col space-y-2">
        <h3 className="text-lg font-medium">Profile Relationship Tests</h3>
        <p className="text-sm text-muted-foreground">
          Test the relationship between fetchman_profiles and profiles tables
        </p>
        
        <div className="space-y-4 mt-2">
          <div className="flex flex-col space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Current User Test</span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={runSingleTest} 
                disabled={isLoading}
              >
                {isLoading ? <RefreshCcw className="h-4 w-4 animate-spin" /> : "Run Test"}
              </Button>
            </div>
            
            {singleResult && (
              <Alert variant={singleResult.success ? "default" : "destructive"}>
                {singleResult.success ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
                <AlertTitle>
                  {singleResult.success ? "Success" : "Error"}
                </AlertTitle>
                <AlertDescription className="text-xs">
                  {singleResult.message}
                </AlertDescription>
              </Alert>
            )}
          </div>
          
          <div className="flex flex-col space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">All Profiles Test</span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={runAllTest} 
                disabled={isLoading}
              >
                {isLoading ? <RefreshCcw className="h-4 w-4 animate-spin" /> : "Run Test"}
              </Button>
            </div>
            
            {allResult && (
              <Alert variant={allResult.success ? "default" : "destructive"}>
                {allResult.success ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
                <AlertTitle>
                  {allResult.success ? "Success" : "Error"}
                </AlertTitle>
                <AlertDescription className="text-xs">
                  {allResult.message}
                </AlertDescription>
              </Alert>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function FetchmanFeaturesSelfTest() {
  const [open, setOpen] = useState(false);
  
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button className="bg-venu-orange hover:bg-venu-orange/90">
          Self Test
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md md:max-w-lg overflow-y-auto">
        <SheetHeader className="pb-4">
          <SheetTitle>Fetchman Features Self-Test</SheetTitle>
          <SheetDescription>
            Test and verify Fetchman functionality
          </SheetDescription>
        </SheetHeader>
        
        <Tabs defaultValue="auth" className="w-full">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="auth">Authentication</TabsTrigger>
            <TabsTrigger value="assignments">Assignments</TabsTrigger>
            <TabsTrigger value="relationships">Relationships</TabsTrigger>
            <TabsTrigger value="api">API Calls</TabsTrigger>
          </TabsList>
          
          <TabsContent value="auth" className="space-y-4">
            <LoginSelfTest />
            <LogoutSelfTest />
          </TabsContent>
          
          <TabsContent value="assignments">
            <p className="text-sm text-muted-foreground">Assignment tests coming soon...</p>
          </TabsContent>
          
          <TabsContent value="relationships">
            <ProfileRelationshipTest />
          </TabsContent>
          
          <TabsContent value="api">
            <p className="text-sm text-muted-foreground">API tests coming soon...</p>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
