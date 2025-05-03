
import React, { useState } from "react";
import AdminPanelLayout from "@/components/layouts/AdminPanelLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Search, Filter, Edit, Trash, Send, PlusCircle } from "lucide-react";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function AdminAnnouncementsPage() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [announceDialogOpen, setAnnounceDialogOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [audienceType, setAudienceType] = useState("all");
  const [messageType, setMessageType] = useState("info");

  // Mock data for announcements
  const [announcements, setAnnouncements] = useState([
    {
      id: "1",
      title: "Platform Maintenance Notice",
      message: "We will be performing scheduled maintenance on Saturday, May 8th from 2AM to 4AM. Brief service interruptions may occur during this time.",
      audience: "all",
      type: "warning",
      sentDate: "2025-05-01T10:30:00",
      status: "scheduled",
      sentBy: "System Admin"
    },
    {
      id: "2",
      title: "New Feature: QR Code Generation",
      message: "We're excited to announce our new QR code generation feature for event check-ins! Generate custom QR codes for your events from the Event Dashboard.",
      audience: "hosts",
      type: "info",
      sentDate: "2025-04-28T14:15:00",
      status: "sent",
      sentBy: "Product Team"
    },
    {
      id: "3",
      title: "Payment Processing Update",
      message: "We've improved our payment processing system for faster transactions and better reporting. Check out the Finance section to see the changes.",
      audience: "vendors",
      type: "info",
      sentDate: "2025-04-25T09:45:00",
      status: "sent",
      sentBy: "Finance Team"
    },
    {
      id: "4",
      title: "Important Security Update",
      message: "We've updated our security protocols. All users are encouraged to change their passwords and review account security settings.",
      audience: "all",
      type: "alert",
      sentDate: "2025-04-22T16:30:00",
      status: "sent",
      sentBy: "Security Team"
    },
  ]);

  const handleSendAnnouncement = () => {
    if (!title.trim() || !message.trim()) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const newAnnouncement = {
      id: (announcements.length + 1).toString(),
      title,
      message,
      audience: audienceType,
      type: messageType,
      sentDate: new Date().toISOString(),
      status: "sent",
      sentBy: "Admin User"
    };

    setAnnouncements([newAnnouncement, ...announcements]);
    setAnnounceDialogOpen(false);
    setTitle("");
    setMessage("");
    setAudienceType("all");
    setMessageType("info");

    toast({
      title: "Announcement sent",
      description: `Your announcement has been sent to ${audienceType === "all" ? "all users" : audienceType}.`,
    });
  };

  const handleDeleteAnnouncement = (id: string) => {
    setAnnouncements(announcements.filter(announcement => announcement.id !== id));
    toast({
      title: "Announcement deleted",
      description: "The announcement has been removed."
    });
  };

  const filteredAnnouncements = announcements.filter(
    announcement =>
      announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      announcement.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getAudienceBadge = (audience: string) => {
    switch (audience) {
      case "all":
        return <Badge className="bg-blue-100 text-blue-800">All Users</Badge>;
      case "hosts":
        return <Badge className="bg-purple-100 text-purple-800">Hosts</Badge>;
      case "vendors":
        return <Badge className="bg-green-100 text-green-800">Vendors</Badge>;
      default:
        return <Badge variant="outline">{audience}</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "info":
        return <Badge className="bg-blue-100 text-blue-800">Info</Badge>;
      case "warning":
        return <Badge className="bg-yellow-100 text-yellow-800">Warning</Badge>;
      case "alert":
        return <Badge className="bg-red-100 text-red-800">Alert</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  return (
    <AdminPanelLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Announcements</h1>
            <p className="text-gray-500">Create and manage platform announcements</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button onClick={() => setAnnounceDialogOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Announcement
            </Button>
          </div>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>All Announcements</CardTitle>
            <CardDescription>Send and track platform-wide communications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row justify-between mb-6">
              <div className="relative max-w-md mb-4 md:mb-0">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search announcements..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="space-x-2">
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                </Button>
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableCaption>List of platform announcements</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Audience</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Sent By</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAnnouncements.length > 0 ? (
                    filteredAnnouncements.map((announcement) => (
                      <TableRow key={announcement.id}>
                        <TableCell className="font-medium">
                          <div>
                            {announcement.title}
                            <div className="text-xs text-gray-500 truncate max-w-[200px]">
                              {announcement.message}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{getAudienceBadge(announcement.audience)}</TableCell>
                        <TableCell>{getTypeBadge(announcement.type)}</TableCell>
                        <TableCell>{format(new Date(announcement.sentDate), 'MMM dd, yyyy')}</TableCell>
                        <TableCell>
                          <Badge variant={announcement.status === "scheduled" ? "outline" : "default"}>
                            {announcement.status === "scheduled" ? "Scheduled" : "Sent"}
                          </Badge>
                        </TableCell>
                        <TableCell>{announcement.sentBy}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleDeleteAnnouncement(announcement.id)}
                            >
                              <Trash className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        No announcements found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Dialog open={announceDialogOpen} onOpenChange={setAnnounceDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create New Announcement</DialogTitle>
              <DialogDescription>
                Compose and send a new announcement to platform users.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  Title
                </Label>
                <Input
                  id="title"
                  placeholder="Enter announcement title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="audience" className="text-right">
                  Audience
                </Label>
                <Select value={audienceType} onValueChange={setAudienceType}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select target audience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Users</SelectItem>
                    <SelectItem value="hosts">Hosts Only</SelectItem>
                    <SelectItem value="vendors">Vendors Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="type" className="text-right">
                  Type
                </Label>
                <Select value={messageType} onValueChange={setMessageType}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select message type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="info">Information</SelectItem>
                    <SelectItem value="warning">Warning</SelectItem>
                    <SelectItem value="alert">Alert</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="message" className="text-right pt-2">
                  Message
                </Label>
                <Textarea
                  id="message"
                  placeholder="Enter announcement message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="col-span-3"
                  rows={5}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setAnnounceDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSendAnnouncement}>
                <Send className="mr-2 h-4 w-4" />
                Send Announcement
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminPanelLayout>
  );
}
