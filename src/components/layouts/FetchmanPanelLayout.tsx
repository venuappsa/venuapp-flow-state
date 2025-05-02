
import React from "react";
import FetchmanHeader from "@/components/fetchman/FetchmanHeader";
import FetchmanSidebar from "@/components/fetchman/FetchmanSidebar";

interface FetchmanPanelLayoutProps {
  children: React.ReactNode;
}

const FetchmanPanelLayout = ({ children }: FetchmanPanelLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <FetchmanHeader />
      <div className="flex-1 flex">
        <FetchmanSidebar />
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
};

export default FetchmanPanelLayout;
