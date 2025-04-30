
import React from "react";
import AdminPanelLayout from "@/components/layouts/AdminPanelLayout";
import ProfilePage from "./ProfilePage";

export default function AdminProfilePage() {
  return (
    <AdminPanelLayout>
      <ProfilePage type="admin" />
    </AdminPanelLayout>
  );
}
