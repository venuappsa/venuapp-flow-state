
import React from "react";
import AdminPanelLayout from "@/components/layouts/AdminPanelLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, Server, Database, Cloud, Globe } from "lucide-react";

export default function AdminSystemStatusPage() {
  // Mock data for system status
  const systemStatus = {
    overall: "operational",
    components: [
      { name: "API Services", status: "operational", uptime: "99.98%" },
      { name: "Database", status: "operational", uptime: "99.99%" },
      { name: "Authentication", status: "operational", uptime: "100%" },
      { name: "Storage", status: "degraded", uptime: "97.83%" },
      { name: "Payment Processing", status: "operational", uptime: "99.95%" },
      { name: "Email Services", status: "operational", uptime: "99.97%" },
    ],
    incidents: [
      {
        id: "1",
        title: "Storage performance degradation",
        date: "2025-05-02T15:30:00",
        status: "investigating",
        description: "We are experiencing slower than normal file uploads and downloads. Our engineering team is investigating the issue.",
      }
    ],
    maintenance: [
      {
        id: "1",
        title: "Scheduled Database Maintenance",
        date: "2025-05-10T02:00:00",
        duration: "120",
        description: "We will be performing database optimization that may cause brief interruptions to service.",
      }
    ]
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "operational":
        return <Badge className="bg-green-100 text-green-800">Operational</Badge>;
      case "degraded":
        return <Badge className="bg-yellow-100 text-yellow-800">Degraded</Badge>;
      case "down":
        return <Badge className="bg-red-100 text-red-800">Down</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "operational":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "degraded":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case "down":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getComponentIcon = (name: string) => {
    switch (name) {
      case "API Services":
        return <Server className="h-5 w-5 text-gray-500" />;
      case "Database":
        return <Database className="h-5 w-5 text-gray-500" />;
      case "Storage":
        return <Cloud className="h-5 w-5 text-gray-500" />;
      default:
        return <Globe className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <AdminPanelLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">System Status</h1>
            <p className="text-gray-500">Monitor and manage platform operational status</p>
          </div>
          <div className="mt-4 md:mt-0">
            {systemStatus.overall === "operational" ? (
              <Badge className="bg-green-100 text-green-800">All Systems Operational</Badge>
            ) : (
              <Badge className="bg-yellow-100 text-yellow-800">System Issues Detected</Badge>
            )}
          </div>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>System Components</CardTitle>
            <CardDescription>Current status of all platform components</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {systemStatus.components.map((component, index) => (
                <div key={index} className="p-4 border rounded-md flex items-center justify-between">
                  <div className="flex items-center">
                    {getComponentIcon(component.name)}
                    <div className="ml-3">
                      <p className="font-medium">{component.name}</p>
                      <p className="text-sm text-gray-500">Uptime: {component.uptime}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    {getStatusIcon(component.status)}
                    <span className="ml-2">{getStatusBadge(component.status)}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Active Incidents</CardTitle>
              <CardDescription>Current issues affecting the platform</CardDescription>
            </CardHeader>
            <CardContent>
              {systemStatus.incidents.length > 0 ? (
                <div className="space-y-4">
                  {systemStatus.incidents.map((incident) => (
                    <div key={incident.id} className="p-4 border rounded-md bg-yellow-50">
                      <div className="flex justify-between">
                        <h3 className="font-medium">{incident.title}</h3>
                        <Badge variant="outline">{incident.status}</Badge>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        {new Date(incident.date).toLocaleString()}
                      </p>
                      <p className="mt-2 text-sm">{incident.description}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <p className="text-lg font-medium">No Active Incidents</p>
                  <p className="text-gray-500">All systems are functioning normally</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Scheduled Maintenance</CardTitle>
              <CardDescription>Upcoming maintenance windows</CardDescription>
            </CardHeader>
            <CardContent>
              {systemStatus.maintenance.length > 0 ? (
                <div className="space-y-4">
                  {systemStatus.maintenance.map((event) => (
                    <div key={event.id} className="p-4 border rounded-md">
                      <h3 className="font-medium">{event.title}</h3>
                      <div className="flex flex-col sm:flex-row sm:justify-between text-sm text-gray-500 mt-1">
                        <span>
                          {new Date(event.date).toLocaleString()}
                        </span>
                        <span>Duration: {event.duration} minutes</span>
                      </div>
                      <p className="mt-2 text-sm">{event.description}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No scheduled maintenance</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminPanelLayout>
  );
}
