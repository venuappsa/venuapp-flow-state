
import React from "react";
import VendorPanelLayout from "@/components/layouts/VendorPanelLayout";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function VendorMessagesPage() {
  const [searchParams] = useSearchParams();
  const threadId = searchParams.get('thread');
  
  return (
    <VendorPanelLayout>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Messages</h1>
        
        {threadId ? (
          <Card>
            <CardHeader>
              <CardTitle>Thread: {threadId}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                This is the message thread view for vendors. In a full implementation, this would show the conversation history for thread ID: {threadId}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            <Card className="cursor-pointer hover:bg-accent/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Event Confirmation</CardTitle>
                <p className="text-xs text-muted-foreground">From: Event Team</p>
              </CardHeader>
              <CardContent>
                <p className="text-sm">Your booth has been confirmed for the Summer Festival</p>
                <p className="text-xs text-muted-foreground mt-2">30 min ago</p>
              </CardContent>
            </Card>
            
            <Card className="cursor-pointer hover:bg-accent/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Payment Reminder</CardTitle>
                <p className="text-xs text-muted-foreground">From: Finance Team</p>
              </CardHeader>
              <CardContent>
                <p className="text-sm">Your payment is due by Friday for the upcoming event</p>
                <p className="text-xs text-muted-foreground mt-2">3 hours ago</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </VendorPanelLayout>
  );
}
