
import React from "react";
import HostPanelLayout from "@/components/layouts/HostPanelLayout";
import TaskManager from "@/components/event/TaskManager";

export default function EventTasksPage() {
  return (
    <HostPanelLayout>
      <div className="max-w-6xl mx-auto">
        <TaskManager />
      </div>
    </HostPanelLayout>
  );
}
