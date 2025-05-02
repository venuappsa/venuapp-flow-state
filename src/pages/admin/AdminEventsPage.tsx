
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminPanelLayout from "@/components/layouts/AdminPanelLayout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { CalendarIcon, Edit, Plus, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useNotifications } from "@/contexts/NotificationContext";

// Mock event data
const mockEvents = [
  {
    id: "1",
    name: "Summer Music Festival",
    date: new Date(2025, 6, 15),
    location: "Pretoria Botanical Gardens",
    vendorsAssigned: 5,
  },
  {
    id: "2",
    name: "Corporate Tech Conference",
    date: new Date(2025, 7, 22),
    location: "Cape Town Convention Center",
    vendorsAssigned: 8,
  },
  {
    id: "3",
    name: "Wedding Expo",
    date: new Date(2025, 8, 10),
    location: "Sandton Convention Center",
    vendorsAssigned: 12,
  },
  {
    id: "4",
    name: "Food & Wine Festival",
    date: new Date(2025, 9, 5),
    location: "Johannesburg Exhibition Centre",
    vendorsAssigned: 15,
  },
];

interface EventFormData {
  name: string;
  date: Date;
  location: string;
  description: string;
}

export default function AdminEventsPage() {
  const navigate = useNavigate();
  const [events, setEvents] = useState(mockEvents);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any | null>(null);
  const { addNotification, sendEmail } = useNotifications();

  const { register, handleSubmit, reset, setValue, watch } = useForm<EventFormData>();
  const selectedDate = watch("date");

  const handleCreateOrUpdateEvent = (data: EventFormData) => {
    if (editingEvent) {
      // Update existing event
      setEvents((prev) =>
        prev.map((event) =>
          event.id === editingEvent.id
            ? {
                ...event,
                name: data.name,
                date: data.date,
                location: data.location,
              }
            : event
        )
      );
      
      addNotification({
        title: "Event Updated",
        message: `"${data.name}" has been updated successfully.`,
        type: "success",
      });
      
      // Simulate sending email notification
      sendEmail(
        "admin@venuapp.com",
        "Event Updated",
        `The event "${data.name}" has been updated.`
      );

    } else {
      // Create new event
      const newEvent = {
        id: (events.length + 1).toString(),
        name: data.name,
        date: data.date,
        location: data.location,
        vendorsAssigned: 0,
      };
      
      setEvents((prev) => [...prev, newEvent]);
      
      addNotification({
        title: "Event Created",
        message: `"${data.name}" has been created successfully.`,
        type: "success",
      });
      
      // Simulate sending email notification
      sendEmail(
        "admin@venuapp.com",
        "New Event Created",
        `A new event "${data.name}" has been created.`
      );
    }
    
    reset();
    setEditingEvent(null);
    setIsDialogOpen(false);
  };

  const handleEditEvent = (event: any) => {
    setEditingEvent(event);
    setValue("name", event.name);
    setValue("date", event.date);
    setValue("location", event.location);
    setValue("description", event.description || "");
    setIsDialogOpen(true);
  };

  const handleDeleteEvent = (id: string) => {
    const eventToDelete = events.find((event) => event.id === id);
    setEvents((prev) => prev.filter((event) => event.id !== id));
    
    addNotification({
      title: "Event Deleted",
      message: `"${eventToDelete?.name}" has been deleted.`,
      type: "info",
    });
    
    sendEmail(
      "admin@venuapp.com",
      "Event Deleted",
      `The event "${eventToDelete?.name}" has been deleted.`
    );
  };

  const openDialogForNewEvent = () => {
    setEditingEvent(null);
    reset({
      name: "",
      date: new Date(),
      location: "",
      description: "",
    });
    setIsDialogOpen(true);
  };

  return (
    <AdminPanelLayout>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Event Management</h1>
          <Button onClick={openDialogForNewEvent}>
            <Plus className="mr-2 h-4 w-4" /> Create Event
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Vendors Assigned</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.map((event) => (
                <TableRow key={event.id}>
                  <TableCell className="font-medium">{event.name}</TableCell>
                  <TableCell>{format(event.date, "PPP")}</TableCell>
                  <TableCell>{event.location}</TableCell>
                  <TableCell>{event.vendorsAssigned}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/admin/events/${event.id}/vendors`)}
                      >
                        Assign Vendors
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleEditEvent(event)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="icon" className="text-red-500">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete the event "{event.name}".
                              This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteEvent(event.id)}
                              className="bg-red-500 hover:bg-red-600"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {events.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No events found. Create your first event.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Event Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>{editingEvent ? "Edit Event" : "Create Event"}</DialogTitle>
            <DialogDescription>
              {editingEvent
                ? "Edit the details of your event."
                : "Fill in the details to create a new event."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(handleCreateOrUpdateEvent)}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  className="col-span-3"
                  {...register("name", { required: true })}
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Date</Label>
                <div className="col-span-3">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !selectedDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={(date) => setValue("date", date || new Date())}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="location" className="text-right">
                  Location
                </Label>
                <Input
                  id="location"
                  className="col-span-3"
                  {...register("location", { required: true })}
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Textarea
                  id="description"
                  className="col-span-3"
                  {...register("description")}
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="submit">
                {editingEvent ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AdminPanelLayout>
  );
}
