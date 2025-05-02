
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { toast } from '@/components/ui/use-toast';
import { format } from 'date-fns';
import { Check, Calendar as CalendarIcon, Plus, Trash2, Pencil, CalendarCheck, ChevronRight } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description: string;
  deadline: Date;
  completed: boolean;
  assignedTo?: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
}

// Mock event data
const mockEvent = {
  id: "event-1",
  name: "Corporate Annual Gala",
  date: "2024-06-15T18:00:00Z",
  location: "Grand Ballroom, Sandton",
};

// Mock assigned vendors
const mockVendors = [
  { id: "v1", name: "Gourmet Catering Co." },
  { id: "v2", name: "Urban Sound DJ's" },
  { id: "v3", name: "Elegant Decor Solutions" }
];

// Mock tasks
const initialTasks: Task[] = [
  {
    id: "task-1",
    title: "Finalize menu with caterer",
    description: "Review and approve the final menu for the event",
    deadline: new Date("2024-05-15"),
    completed: true,
    assignedTo: "v1",
    category: "Food",
    priority: "high"
  },
  {
    id: "task-2",
    title: "Select music playlist",
    description: "Choose songs for different parts of the event",
    deadline: new Date("2024-05-25"),
    completed: false,
    assignedTo: "v2",
    category: "Entertainment",
    priority: "medium"
  },
  {
    id: "task-3",
    title: "Complete venue decoration plan",
    description: "Finalize colors, themes, and layout for decoration",
    deadline: new Date("2024-05-30"),
    completed: false,
    assignedTo: "v3",
    category: "Decor",
    priority: "high"
  }
];

const categories = ["General", "Food", "Decor", "Entertainment", "Logistics", "Administration"];

export default function TaskManager() {
  const { eventId } = useParams<{ eventId: string }>();
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [newTask, setNewTask] = useState<Partial<Task>>({
    title: '',
    description: '',
    deadline: new Date(),
    completed: false,
    category: 'General',
    priority: 'medium'
  });
  
  // Sort tasks by completion status and then by deadline
  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.completed === b.completed) {
      return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
    }
    return a.completed ? 1 : -1;
  });

  // Group tasks by completion status
  const pendingTasks = sortedTasks.filter(task => !task.completed);
  const completedTasks = sortedTasks.filter(task => task.completed);

  const handleOpenTaskDialog = (task?: Task) => {
    if (task) {
      setEditingTask(task);
      setNewTask({
        title: task.title,
        description: task.description,
        deadline: new Date(task.deadline),
        completed: task.completed,
        assignedTo: task.assignedTo,
        category: task.category,
        priority: task.priority
      });
    } else {
      setEditingTask(null);
      setNewTask({
        title: '',
        description: '',
        deadline: new Date(),
        completed: false,
        category: 'General',
        priority: 'medium'
      });
    }
    setTaskDialogOpen(true);
  };

  const handleSaveTask = () => {
    if (!newTask.title) {
      toast({
        title: "Required field missing",
        description: "Task title is required",
        variant: "destructive"
      });
      return;
    }

    if (editingTask) {
      // Update existing task
      setTasks(tasks.map(task => 
        task.id === editingTask.id ? 
        { 
          ...task, 
          title: newTask.title || '',
          description: newTask.description || '',
          deadline: newTask.deadline || new Date(),
          assignedTo: newTask.assignedTo,
          category: newTask.category || 'General',
          priority: (newTask.priority as 'low' | 'medium' | 'high') || 'medium'
        } : task
      ));
      
      toast({
        title: "Task updated",
        description: "The task has been updated successfully"
      });
    } else {
      // Create new task
      const task: Task = {
        id: `task-${Date.now()}`,
        title: newTask.title || '',
        description: newTask.description || '',
        deadline: newTask.deadline || new Date(),
        completed: false,
        assignedTo: newTask.assignedTo,
        category: newTask.category || 'General',
        priority: (newTask.priority as 'low' | 'medium' | 'high') || 'medium'
      };
      
      setTasks([...tasks, task]);
      
      toast({
        title: "Task created",
        description: "The new task has been created successfully"
      });
    }
    
    setTaskDialogOpen(false);
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
    
    toast({
      title: "Task deleted",
      description: "The task has been deleted successfully"
    });
  };

  const handleToggleTaskCompletion = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
    
    const task = tasks.find(task => task.id === taskId);
    if (task) {
      toast({
        title: task.completed ? "Task reopened" : "Task completed",
        description: `"${task.title}" has been marked as ${task.completed ? "incomplete" : "complete"}`
      });
    }
  };

  const getVendorName = (vendorId?: string) => {
    if (!vendorId) return "Unassigned";
    const vendor = mockVendors.find(v => v.id === vendorId);
    return vendor ? vendor.name : "Unknown Vendor";
  };

  const getPriorityBadge = (priority: 'low' | 'medium' | 'high') => {
    switch (priority) {
      case 'high':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">High</Badge>;
      case 'medium':
        return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200">Medium</Badge>;
      case 'low':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Low</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Event Timeline & Tasks</h1>
          <p className="text-gray-500">Manage tasks for {mockEvent.name}</p>
        </div>
        <Button onClick={() => handleOpenTaskDialog()}>
          <Plus className="mr-2 h-4 w-4" />
          Add Task
        </Button>
      </div>

      {/* Event Summary */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-medium">Event Date</h2>
              <div className="flex items-center mt-1">
                <CalendarCheck className="h-5 w-5 mr-2 text-venu-orange" />
                <span>{format(new Date(mockEvent.date), "MMMM d, yyyy 'at' h:mm a")}</span>
              </div>
            </div>
            <div className="hidden sm:block">
              <div className="flex items-center gap-2">
                <span className="text-gray-500">Event day is</span>
                <Badge variant="outline" className="text-venu-orange">
                  {Math.ceil((new Date(mockEvent.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days away
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timeline and Tasks */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Tasks Timeline</h2>
          <div className="text-sm text-gray-500">
            {pendingTasks.length} pending • {completedTasks.length} completed
          </div>
        </div>

        <div className="space-y-6">
          {/* Pending Tasks Section */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-3">Pending Tasks</h3>
            {pendingTasks.length > 0 ? (
              <div className="space-y-3">
                {pendingTasks.map((task) => (
                  <Card key={task.id} className="relative">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-2">
                        {/* Task completion toggle */}
                        <button 
                          className="mt-1 h-5 w-5 rounded-full border border-gray-300 flex items-center justify-center"
                          onClick={() => handleToggleTaskCompletion(task.id)}
                        >
                          {task.completed && <Check className="h-3 w-3" />}
                        </button>
                        
                        {/* Task content */}
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <h4 className="font-medium">{task.title}</h4>
                            <div className="flex items-center gap-2">
                              {getPriorityBadge(task.priority)}
                              <Badge variant="outline">{task.category}</Badge>
                            </div>
                          </div>
                          
                          {task.description && (
                            <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                          )}
                          
                          <div className="flex flex-wrap gap-x-4 gap-y-2 mt-2 text-sm">
                            {/* Deadline */}
                            <div className="flex items-center">
                              <CalendarIcon className="h-3.5 w-3.5 mr-1 text-gray-500" />
                              <span>
                                {format(new Date(task.deadline), "MMM d, yyyy")}
                              </span>
                            </div>
                            
                            {/* Assigned vendor */}
                            {task.assignedTo && (
                              <div className="text-gray-600">
                                Assigned to: {getVendorName(task.assignedTo)}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex gap-1">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0"
                            onClick={() => handleOpenTaskDialog(task)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
                            onClick={() => handleDeleteTask(task.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 border rounded-lg">
                <CalendarCheck className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                <h3 className="text-lg font-medium">No pending tasks</h3>
                <p className="text-gray-500 mb-4">All your tasks are completed</p>
                <Button onClick={() => handleOpenTaskDialog()}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Task
                </Button>
              </div>
            )}
          </div>

          {/* Completed Tasks Section */}
          {completedTasks.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-3">Completed Tasks</h3>
              <div className="space-y-3">
                {completedTasks.map((task) => (
                  <Card key={task.id} className="relative bg-gray-50">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-2">
                        {/* Task completion toggle */}
                        <button 
                          className="mt-1 h-5 w-5 rounded-full bg-venu-orange border-transparent flex items-center justify-center"
                          onClick={() => handleToggleTaskCompletion(task.id)}
                        >
                          <Check className="h-3 w-3 text-white" />
                        </button>
                        
                        {/* Task content */}
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <h4 className="font-medium line-through text-gray-500">{task.title}</h4>
                            <Badge variant="outline">{task.category}</Badge>
                          </div>
                          
                          {task.description && (
                            <p className="text-sm text-gray-500 mt-1 line-through">{task.description}</p>
                          )}
                          
                          <div className="flex flex-wrap gap-x-4 gap-y-2 mt-2 text-sm text-gray-500">
                            {/* Deadline */}
                            <div className="flex items-center">
                              <CalendarIcon className="h-3.5 w-3.5 mr-1 text-gray-400" />
                              <span>
                                {format(new Date(task.deadline), "MMM d, yyyy")}
                              </span>
                            </div>
                            
                            {/* Assigned vendor */}
                            {task.assignedTo && (
                              <div>
                                Assigned to: {getVendorName(task.assignedTo)}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Action button */}
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
                          onClick={() => handleDeleteTask(task.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Task Dialog */}
      <Dialog open={taskDialogOpen} onOpenChange={setTaskDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingTask ? "Edit Task" : "Add New Task"}</DialogTitle>
            <DialogDescription>
              {editingTask 
                ? "Update the details of your task" 
                : "Fill in the details to create a new task"}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Task Title</label>
              <Input 
                placeholder="Enter task title"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea 
                placeholder="Add details about this task"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Deadline</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {newTask.deadline && format(new Date(newTask.deadline), "MMM d, yyyy")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={new Date(newTask.deadline || Date.now())}
                      onSelect={(date) => date && setNewTask({ ...newTask, deadline: date })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <Select 
                  value={newTask.category} 
                  onValueChange={(value) => setNewTask({ ...newTask, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Priority</label>
                <Select 
                  value={newTask.priority} 
                  onValueChange={(value: 'low' | 'medium' | 'high') => setNewTask({ ...newTask, priority: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Assigned To</label>
                <Select 
                  value={newTask.assignedTo} 
                  onValueChange={(value) => setNewTask({ ...newTask, assignedTo: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Unassigned" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Unassigned</SelectItem>
                    {mockVendors.map((vendor) => (
                      <SelectItem key={vendor.id} value={vendor.id}>{vendor.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setTaskDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveTask}>
              {editingTask ? "Save Changes" : "Create Task"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
