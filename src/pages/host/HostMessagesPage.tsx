
import React from "react";
import HostPanelLayout from "@/components/layouts/HostPanelLayout";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function HostMessagesPage() {
  const [searchParams] = useSearchParams();
  const threadId = searchParams.get('thread');
  
  return (
    <HostPanelLayout>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Messages</h1>
        
        {threadId ? (
          <Card>
            <CardHeader>
              <CardTitle>Thread: {threadId}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                This is the message thread view. In a full implementation, this would show the conversation history for thread ID: {threadId}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            <Card className="cursor-pointer hover:bg-accent/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Vendor Question</CardTitle>
                <p className="text-xs text-muted-foreground">From: Food Truck Co</p>
              </CardHeader>
              <CardContent>
                <p className="text-sm">What time can we arrive to set up?</p>
                <p className="text-xs text-muted-foreground mt-2">15 min ago</p>
              </CardContent>
            </Card>
            
            <Card className="cursor-pointer hover:bg-accent/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Guest Inquiry</CardTitle>
                <p className="text-xs text-muted-foreground">From: Jane Smith</p>
              </CardHeader>
              <CardContent>
                <p className="text-sm">Are there vegetarian options at the event?</p>
                <p className="text-xs text-muted-foreground mt-2">2 hours ago</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </HostPanelLayout>
  );
}
