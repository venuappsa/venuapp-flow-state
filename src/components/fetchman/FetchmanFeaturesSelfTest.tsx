
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
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="auth">Authentication</TabsTrigger>
            <TabsTrigger value="assignments">Assignments</TabsTrigger>
            <TabsTrigger value="api">API Calls</TabsTrigger>
          </TabsList>
          
          <TabsContent value="auth" className="space-y-4">
            <LoginSelfTest />
            <LogoutSelfTest />
          </TabsContent>
          
          <TabsContent value="assignments">
            <p className="text-sm text-muted-foreground">Assignment tests coming soon...</p>
          </TabsContent>
          
          <TabsContent value="api">
            <p className="text-sm text-muted-foreground">API tests coming soon...</p>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
