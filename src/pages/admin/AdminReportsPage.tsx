
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Calendar, Download, FileText, Filter } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AdminPanelLayout from "@/components/layouts/AdminPanelLayout";

export default function AdminReportsPage() {
  // Mock reports data
  const reports = {
    financial: [
      { id: "1", name: "Monthly Revenue Report - April 2025", type: "financial", date: "2025-05-01", format: "PDF" },
      { id: "2", name: "Quarterly Financial Summary - Q1 2025", type: "financial", date: "2025-04-15", format: "Excel" },
      { id: "3", name: "Annual Financial Report - 2024", type: "financial", date: "2025-02-20", format: "PDF" },
      { id: "4", name: "Host Subscription Revenue - April 2025", type: "financial", date: "2025-05-01", format: "CSV" },
      { id: "5", name: "Vendor Commission Summary - April 2025", type: "financial", date: "2025-05-01", format: "Excel" },
    ],
    user: [
      { id: "6", name: "New User Registrations - April 2025", type: "user", date: "2025-05-01", format: "PDF" },
      { id: "7", name: "User Activity Report - April 2025", type: "user", date: "2025-05-01", format: "Excel" },
      { id: "8", name: "User Retention Analysis - Q1 2025", type: "user", date: "2025-04-15", format: "PDF" },
      { id: "9", name: "Host Growth Report - April 2025", type: "user", date: "2025-05-01", format: "CSV" },
      { id: "10", name: "Vendor Growth Report - April 2025", type: "user", date: "2025-05-01", format: "CSV" },
    ],
    events: [
      { id: "11", name: "Events Summary - April 2025", type: "events", date: "2025-05-01", format: "PDF" },
      { id: "12", name: "Event Cancellation Analysis - Q1 2025", type: "events", date: "2025-04-15", format: "Excel" },
      { id: "13", name: "Popular Venues Report - April 2025", type: "events", date: "2025-05-01", format: "CSV" },
      { id: "14", name: "Event Type Distribution - April 2025", type: "events", date: "2025-05-01", format: "PDF" },
      { id: "15", name: "Event Size Analysis - Q1 2025", type: "events", date: "2025-04-15", format: "Excel" },
    ],
    system: [
      { id: "16", name: "System Performance - April 2025", type: "system", date: "2025-05-01", format: "PDF" },
      { id: "17", name: "Error Log Summary - April 2025", type: "system", date: "2025-05-01", format: "CSV" },
      { id: "18", name: "API Usage Report - April 2025", type: "system", date: "2025-05-01", format: "Excel" },
      { id: "19", name: "Database Performance - April 2025", type: "system", date: "2025-05-01", format: "PDF" },
      { id: "20", name: "Security Audit Report - Q1 2025", type: "system", date: "2025-04-15", format: "PDF" },
    ]
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getFormatBadge = (format: string) => {
    switch (format.toLowerCase()) {
      case "pdf":
        return <Badge className="bg-red-100 text-red-800">PDF</Badge>;
      case "excel":
        return <Badge className="bg-green-100 text-green-800">Excel</Badge>;
      case "csv":
        return <Badge className="bg-blue-100 text-blue-800">CSV</Badge>;
      default:
        return <Badge variant="outline">{format}</Badge>;
    }
  };

  return (
    <AdminPanelLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Reports Center</h1>
            <p className="text-gray-500">Access and generate system reports</p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-2">
            <Button>
              <FileText className="mr-2 h-4 w-4" />
              Generate New Report
            </Button>
          </div>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Generate Custom Report</CardTitle>
            <CardDescription>Create a custom report based on your specific requirements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Label>Report Type</Label>
                <Select>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select report type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="financial">Financial</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="events">Events</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Date Range</Label>
                <Button variant="outline" className="w-full mt-1">
                  <Calendar className="mr-2 h-4 w-4" />
                  Select Date Range
                </Button>
              </div>
              <div>
                <Label>Format</Label>
                <Select>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="excel">Excel</SelectItem>
                    <SelectItem value="csv">CSV</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <Button>Generate Report</Button>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="financial" className="space-y-6">
          <TabsList>
            <TabsTrigger value="financial">Financial</TabsTrigger>
            <TabsTrigger value="user">User</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
          </TabsList>
          
          <TabsContent value="financial">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Financial Reports</CardTitle>
                    <CardDescription>Revenue, subscriptions, and financial summaries</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Filter className="mr-2 h-4 w-4" />
                      Filter
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableCaption>A list of available financial reports</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Report Name</TableHead>
                      <TableHead>Date Generated</TableHead>
                      <TableHead>Format</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reports.financial.map((report) => (
                      <TableRow key={report.id}>
                        <TableCell className="font-medium">{report.name}</TableCell>
                        <TableCell>{formatDate(report.date)}</TableCell>
                        <TableCell>{getFormatBadge(report.format)}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm">
                            <Download className="mr-2 h-4 w-4" />
                            Download
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="user">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>User Reports</CardTitle>
                    <CardDescription>User registration, activity, and retention</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Filter className="mr-2 h-4 w-4" />
                      Filter
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableCaption>A list of available user reports</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Report Name</TableHead>
                      <TableHead>Date Generated</TableHead>
                      <TableHead>Format</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reports.user.map((report) => (
                      <TableRow key={report.id}>
                        <TableCell className="font-medium">{report.name}</TableCell>
                        <TableCell>{formatDate(report.date)}</TableCell>
                        <TableCell>{getFormatBadge(report.format)}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm">
                            <Download className="mr-2 h-4 w-4" />
                            Download
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="events">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Event Reports</CardTitle>
                    <CardDescription>Event statistics and analytics</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Filter className="mr-2 h-4 w-4" />
                      Filter
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableCaption>A list of available event reports</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Report Name</TableHead>
                      <TableHead>Date Generated</TableHead>
                      <TableHead>Format</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reports.events.map((report) => (
                      <TableRow key={report.id}>
                        <TableCell className="font-medium">{report.name}</TableCell>
                        <TableCell>{formatDate(report.date)}</TableCell>
                        <TableCell>{getFormatBadge(report.format)}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm">
                            <Download className="mr-2 h-4 w-4" />
                            Download
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="system">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>System Reports</CardTitle>
                    <CardDescription>System performance, errors, and audit logs</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Filter className="mr-2 h-4 w-4" />
                      Filter
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableCaption>A list of available system reports</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Report Name</TableHead>
                      <TableHead>Date Generated</TableHead>
                      <TableHead>Format</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reports.system.map((report) => (
                      <TableRow key={report.id}>
                        <TableCell className="font-medium">{report.name}</TableCell>
                        <TableCell>{formatDate(report.date)}</TableCell>
                        <TableCell>{getFormatBadge(report.format)}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm">
                            <Download className="mr-2 h-4 w-4" />
                            Download
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminPanelLayout>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-sm font-medium text-gray-700 mb-1">{children}</div>
  );
}
