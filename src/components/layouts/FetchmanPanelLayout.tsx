
import React from "react";
import FetchmanHeader from "@/components/fetchman/FetchmanHeader";
import FetchmanSidebar from "@/components/fetchman/FetchmanSidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import AuthTransitionWrapper from "@/components/AuthTransitionWrapper";

interface FetchmanPanelLayoutProps {
  children: React.ReactNode;
}

const FetchmanPanelLayout = ({ children }: FetchmanPanelLayoutProps) => {
  return (
    <AuthTransitionWrapper
      requireAuth={true}
      allowedRoles={["fetchman"]}
      showFallback={true}
      redirectTo="/auth"
    >
      <div className="min-h-screen flex flex-col bg-gray-50">
        <FetchmanHeader />
        <div className="flex-1 flex pt-16">
          <FetchmanSidebar />
          <ScrollArea className="flex-1 h-[calc(100vh-4rem)]">
            <main className="flex-1 p-6 overflow-auto">{children}</main>
          </ScrollArea>
        </div>
      </div>
    </AuthTransitionWrapper>
  );
};

export default FetchmanPanelLayout;
