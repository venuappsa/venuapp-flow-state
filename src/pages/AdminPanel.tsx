
import React from "react";
import AdminPanelLayout from "@/components/layouts/AdminPanelLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AdminPanel() {
  return (
    <AdminPanelLayout>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">128</div>
              <p className="text-sm text-muted-foreground">Total registered users</p>
              <Button variant="outline" className="mt-4 w-full">View Users</Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Hosts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">36</div>
              <p className="text-sm text-muted-foreground">Active venue hosts</p>
              <Button variant="outline" className="mt-4 w-full">Manage Hosts</Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">52</div>
              <p className="text-sm text-muted-foreground">Upcoming events</p>
              <Button variant="outline" className="mt-4 w-full">View Events</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminPanelLayout>
  );
}
