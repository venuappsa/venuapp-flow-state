
import React from "react";
import HostPanelLayout from "@/components/layouts/HostPanelLayout";
import ProfilePage from "./ProfilePage";

export default function HostProfilePage() {
  return (
    <HostPanelLayout>
      <ProfilePage type="host" />
    </HostPanelLayout>
  );
}
