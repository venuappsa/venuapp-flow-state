
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminPanelLayout from "@/components/layouts/AdminPanelLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  Calendar,
  Check,
  ChevronDown,
  ChevronUp,
  Plus,
  Trash2,
} from "lucide-react";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useNotifications } from "@/contexts/NotificationContext";

// Mock events data
const mockEvents = [
  {
    id: "1",
    name: "Summer Music Festival",
    date: new Date(2025, 6, 15),
    location: "Pretoria Botanical Gardens",
    description: "Annual music festival featuring local artists",
  },
  {
    id: "2",
    name: "Corporate Tech Conference",
    date: new Date(2025, 7, 22),
    location: "Cape Town Convention Center",
    description: "Industry-leading tech conference",
  },
  {
    id: "3",
    name: "Wedding Expo",
    date: new Date(2025, 8, 10),
    location: "Sandton Convention Center",
    description: "Showcase of wedding services and products",
  },
  {
    id: "4",
    name: "Food & Wine Festival",
    date: new Date(2025, 9, 5),
    location: "Johannesburg Exhibition Centre",
    description: "Celebration of local cuisine and wines",
  },
];

// Mock timeline tasks
const initialTasks = [
  {
    id: "t1",
    title: "Initial planning meeting",
    dueDate: new Date(2025, 5, 10),
    status: "completed",
  },
  {
    id: "t2",
    title: "Vendor selection deadline",
    dueDate: new Date(2025, 5, 25),
    status: "completed",
  },
  {
    id: "t3",
    title: "Marketing materials finalized",
    dueDate: new Date(2025, 6, 1),
    status: "planned",
  },
  {
    id: "t4",
    title: "Ticket sales launch",
    dueDate: new Date(2025, 6, 5),
    status: "planned",
  },
  {
    id: "t5",
    title: "Final vendor check-in",
    dueDate: new Date(2025, 6, 10),
    status: "planned",
  },
];

export default function AdminEventTimelinePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<any>(null);
  const [tasks, setTasks] = useState(initialTasks);
  const [newTask, setNewTask] = useState({
    title: "",
    dueDate: new Date(),
    status: "planned",
  });
  const [editingTask, setEditingTask] = useState<string | null>(null);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const { addNotification, sendEmail } = useNotifications();

  useEffect(() => {
    // Find the event by ID
    const foundEvent = mockEvents.find((e) => e.id === id);
    if (foundEvent) {
      setEvent(foundEvent);
    }
  }, [id]);

  const handleAddTask = () => {
    if (newTask.title.trim() === "") return;

    const task = {
      id: `t${tasks.length + 1}`,
      title: newTask.title,
      dueDate: newTask.dueDate,
      status: newTask.status,
    };

    setTasks([...tasks, task]);
    setNewTask({
      title: "",
      dueDate: new Date(),
      status: "planned",
    });
    setIsAddingTask(false);

    addNotification({
      title: "Task Added",
      message: `"${task.title}" has been added to the timeline.`,
      type: "success",
    });
  };

  const handleUpdateTask = (taskId: string, updates: any) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, ...updates } : task
      )
    );
    
    addNotification({
      title: "Task Updated",
      message: "Timeline task has been updated.",
      type: "success",
    });
  };

  const handleDeleteTask = (taskId: string) => {
    const taskToDelete = tasks.find(task => task.id === taskId);
    
    setTasks(tasks.filter((task) => task.id !== taskId));
    
    addNotification({
      title: "Task Removed",
      message: `"${taskToDelete?.title}" has been removed from the timeline.`,
      type: "info",
    });
  };

  const handleToggleStatus = (taskId: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              status: task.status === "planned" ? "completed" : "planned",
            }
          : task
      )
    );
    
    const updatedTask = tasks.find(t => t.id === taskId);
    const newStatus = updatedTask?.status === "planned" ? "completed" : "planned";
    
    addNotification({
      title: "Task Status Changed",
      message: `"${updatedTask?.title}" marked as ${newStatus}.`,
      type: "success",
    });
  };

  const handleSaveTimeline = () => {
    addNotification({
      title: "Timeline Saved",
      message: `Timeline for ${event?.name} has been saved successfully.`,
      type: "success",
    });
    
    sendEmail(
      "admin@venuapp.com",
      `Timeline Updated: ${event?.name}`,
      `The timeline for ${event?.name} has been updated with ${tasks.length} tasks.`
    );
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    
    const newTasks = [...tasks];
    const temp = newTasks[index];
    newTasks[index] = newTasks[index - 1];
    newTasks[index - 1] = temp;
    
    setTasks(newTasks);
  };
  
  const handleMoveDown = (index: number) => {
    if (index === tasks.length - 1) return;
    
    const newTasks = [...tasks];
    const temp = newTasks[index];
    newTasks[index] = newTasks[index + 1];
    newTasks[index + 1] = temp;
    
    setTasks(newTasks);
  };

  return (
    <AdminPanelLayout>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate(`/admin/events/${id}/vendors`)}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" /> Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold">{event?.name || "Loading..."}: Timeline</h1>
              <p className="text-gray-500">{event?.description}</p>
            </div>
          </div>
          <Button onClick={handleSaveTimeline}>Save Timeline</Button>
        </div>

        <Card className="p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Timeline Tasks</h2>
            {!isAddingTask && (
              <Button onClick={() => setIsAddingTask(true)}>
                <Plus className="h-4 w-4 mr-1" /> Add Task
              </Button>
            )}
          </div>

          {isAddingTask && (
            <div className="mb-6 p-4 border rounded-lg bg-gray-50">
              <h3 className="font-medium mb-3">Add New Task</h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <Input
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    placeholder="Task title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal"
                        )}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {format(newTask.dueDate, "PPP")}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={newTask.dueDate}
                        onSelect={(date) => setNewTask({ ...newTask, dueDate: date || new Date() })}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <div className="flex justify-end mt-4 gap-2">
                <Button variant="outline" onClick={() => setIsAddingTask(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddTask}>Add Task</Button>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {tasks.map((task, index) => (
              <div
                key={task.id}
                className={cn(
                  "p-4 border rounded-lg flex items-center justify-between",
                  task.status === "completed" ? "bg-green-50 border-green-200" : "bg-white"
                )}
              >
                <div className="flex items-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "h-8 w-8 rounded-full mr-3",
                      task.status === "completed" ? "bg-green-100 text-green-600" : "bg-gray-100"
                    )}
                    onClick={() => handleToggleStatus(task.id)}
                  >
                    {task.status === "completed" && <Check className="h-4 w-4" />}
                  </Button>
                  <div>
                    {editingTask === task.id ? (
                      <Input
                        value={task.title}
                        onChange={(e) =>
                          handleUpdateTask(task.id, { title: e.target.value })
                        }
                        onBlur={() => setEditingTask(null)}
                        autoFocus
                        className="mb-1"
                      />
                    ) : (
                      <p
                        className={cn(
                          "font-medium",
                          task.status === "completed" && "line-through text-gray-500"
                        )}
                        onClick={() => setEditingTask(task.id)}
                      >
                        {task.title}
                      </p>
                    )}
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>Due: {format(task.dueDate, "MMM d, yyyy")}</span>
                      <Badge
                        variant="outline"
                        className={cn(
                          task.status === "completed"
                            ? "border-green-300 bg-green-100 text-green-700"
                            : "border-amber-300 bg-amber-100 text-amber-700"
                        )}
                      >
                        {task.status === "completed" ? "Completed" : "Planned"}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleMoveUp(index)}
                    disabled={index === 0}
                  >
                    <ChevronUp className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleMoveDown(index)}
                    disabled={index === tasks.length - 1}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Calendar className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="end">
                      <CalendarComponent
                        mode="single"
                        selected={task.dueDate}
                        onSelect={(date) =>
                          handleUpdateTask(task.id, { dueDate: date })
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-500 hover:text-red-600"
                    onClick={() => handleDeleteTask(task.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}

            {tasks.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No timeline tasks yet. Add your first task above.
              </div>
            )}
          </div>
        </Card>

        <div className="flex justify-between">
          <Button variant="outline" onClick={() => navigate(`/admin/events/${id}/vendors`)}>
            Assign Vendors
          </Button>
          <Button variant="outline" onClick={() => navigate(`/admin/events/${id}/resources`)}>
            Manage Resources
          </Button>
        </div>
      </div>
    </AdminPanelLayout>
  );
}
