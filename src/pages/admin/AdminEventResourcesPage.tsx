
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminPanelLayout from "@/components/layouts/AdminPanelLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  DollarSign,
  FileText,
  Package,
  Plus,
  Trash2,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
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

// Initial resource data
const initialResources = {
  budgetItems: [
    { id: "b1", name: "Venue Rental", amount: 25000, notes: "Includes basic setup" },
    { id: "b2", name: "Sound Equipment", amount: 12000, notes: "Premium package" },
    { id: "b3", name: "Catering", amount: 35000, notes: "For 200 people" },
  ],
  notes: [
    { id: "n1", title: "Venue Requirements", content: "Need accessible entrances and parking" },
    { id: "n2", title: "Media Contact", content: "John from Daily News will cover the event" },
  ],
  physicalItems: [
    { id: "p1", name: "Tables", quantity: 25, location: "Main Storage" },
    { id: "p2", name: "Chairs", quantity: 200, location: "Main Storage" },
    { id: "p3", name: "Projectors", quantity: 2, location: "Tech Room" },
  ],
};

export default function AdminEventResourcesPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<any>(null);
  const [resources, setResources] = useState(initialResources);
  const [activeTab, setActiveTab] = useState("budget");
  const { addNotification, sendEmail } = useNotifications();

  // New item states
  const [newBudgetItem, setNewBudgetItem] = useState({ name: "", amount: "", notes: "" });
  const [newNote, setNewNote] = useState({ title: "", content: "" });
  const [newPhysicalItem, setNewPhysicalItem] = useState({ name: "", quantity: "", location: "" });

  useEffect(() => {
    // Find the event by ID
    const foundEvent = mockEvents.find((e) => e.id === id);
    if (foundEvent) {
      setEvent(foundEvent);
    }
  }, [id]);

  const handleAddBudgetItem = () => {
    if (newBudgetItem.name.trim() === "" || newBudgetItem.amount.trim() === "") return;

    const item = {
      id: `b${resources.budgetItems.length + 1}`,
      name: newBudgetItem.name,
      amount: parseFloat(newBudgetItem.amount),
      notes: newBudgetItem.notes,
    };

    setResources({
      ...resources,
      budgetItems: [...resources.budgetItems, item],
    });

    setNewBudgetItem({ name: "", amount: "", notes: "" });
  };

  const handleAddNote = () => {
    if (newNote.title.trim() === "" || newNote.content.trim() === "") return;

    const note = {
      id: `n${resources.notes.length + 1}`,
      title: newNote.title,
      content: newNote.content,
    };

    setResources({
      ...resources,
      notes: [...resources.notes, note],
    });

    setNewNote({ title: "", content: "" });
  };

  const handleAddPhysicalItem = () => {
    if (newPhysicalItem.name.trim() === "" || newPhysicalItem.quantity.trim() === "") return;

    const item = {
      id: `p${resources.physicalItems.length + 1}`,
      name: newPhysicalItem.name,
      quantity: parseInt(newPhysicalItem.quantity),
      location: newPhysicalItem.location,
    };

    setResources({
      ...resources,
      physicalItems: [...resources.physicalItems, item],
    });

    setNewPhysicalItem({ name: "", quantity: "", location: "" });
  };

  const handleDeleteBudgetItem = (id: string) => {
    setResources({
      ...resources,
      budgetItems: resources.budgetItems.filter((item) => item.id !== id),
    });
  };

  const handleDeleteNote = (id: string) => {
    setResources({
      ...resources,
      notes: resources.notes.filter((note) => note.id !== id),
    });
  };

  const handleDeletePhysicalItem = (id: string) => {
    setResources({
      ...resources,
      physicalItems: resources.physicalItems.filter((item) => item.id !== id),
    });
  };

  const handleSaveResources = () => {
    addNotification({
      title: "Resources Saved",
      message: `Resources for ${event?.name} have been saved successfully.`,
      type: "success",
    });
    
    sendEmail(
      "admin@venuapp.com",
      `Resources Updated: ${event?.name}`,
      `The resources for ${event?.name} have been updated.`
    );
  };

  const totalBudget = resources.budgetItems.reduce(
    (sum, item) => sum + item.amount,
    0
  );

  return (
    <AdminPanelLayout>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate(`/admin/events/${id}/timeline`)}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" /> Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold">{event?.name || "Loading..."}: Resources</h1>
              <p className="text-gray-500">{event?.description}</p>
            </div>
          </div>
          <Button onClick={handleSaveResources}>Save Resources</Button>
        </div>

        <Card className="p-6 mb-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="budget">
                <DollarSign className="h-4 w-4 mr-2" /> Budget Items
              </TabsTrigger>
              <TabsTrigger value="notes">
                <FileText className="h-4 w-4 mr-2" /> Notes
              </TabsTrigger>
              <TabsTrigger value="physical">
                <Package className="h-4 w-4 mr-2" /> Physical Items
              </TabsTrigger>
            </TabsList>
            
            {/* Budget Items Tab */}
            <TabsContent value="budget">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold">Budget Items</h2>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Total Budget:</p>
                    <p className="font-bold text-lg">R{totalBudget.toLocaleString()}</p>
                  </div>
                </div>

                {/* Add new budget item form */}
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <h3 className="font-medium mb-3">Add Budget Item</h3>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
                      <Input
                        value={newBudgetItem.name}
                        onChange={(e) => setNewBudgetItem({ ...newBudgetItem, name: e.target.value })}
                        placeholder="Item name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Amount (R)</label>
                      <Input
                        value={newBudgetItem.amount}
                        onChange={(e) => setNewBudgetItem({ ...newBudgetItem, amount: e.target.value })}
                        placeholder="0.00"
                        type="number"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                      <Input
                        value={newBudgetItem.notes}
                        onChange={(e) => setNewBudgetItem({ ...newBudgetItem, notes: e.target.value })}
                        placeholder="Optional notes"
                      />
                    </div>
                  </div>
                  <Button onClick={handleAddBudgetItem} className="mt-3">
                    <Plus className="h-4 w-4 mr-2" /> Add Item
                  </Button>
                </div>

                {/* Budget items list */}
                {resources.budgetItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      {item.notes && <p className="text-sm text-gray-500">{item.notes}</p>}
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-medium">R{item.amount.toLocaleString()}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-600 h-8 w-8"
                        onClick={() => handleDeleteBudgetItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}

                {resources.budgetItems.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No budget items yet. Add your first item above.
                  </div>
                )}
              </div>
            </TabsContent>
            
            {/* Notes Tab */}
            <TabsContent value="notes">
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Event Notes</h2>

                {/* Add new note form */}
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <h3 className="font-medium mb-3">Add Note</h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                      <Input
                        value={newNote.title}
                        onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                        placeholder="Note title"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                      <Textarea
                        value={newNote.content}
                        onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                        placeholder="Note content"
                        rows={3}
                      />
                    </div>
                  </div>
                  <Button onClick={handleAddNote} className="mt-3">
                    <Plus className="h-4 w-4 mr-2" /> Add Note
                  </Button>
                </div>

                {/* Notes list */}
                <div className="space-y-3">
                  {resources.notes.map((note) => (
                    <div key={note.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium">{note.title}</h3>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:text-red-600 h-8 w-8"
                          onClick={() => handleDeleteNote(note.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="mt-2 text-gray-700">{note.content}</p>
                    </div>
                  ))}

                  {resources.notes.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No notes yet. Add your first note above.
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
            
            {/* Physical Items Tab */}
            <TabsContent value="physical">
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Physical Items</h2>

                {/* Add new physical item form */}
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <h3 className="font-medium mb-3">Add Physical Item</h3>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
                      <Input
                        value={newPhysicalItem.name}
                        onChange={(e) => setNewPhysicalItem({ ...newPhysicalItem, name: e.target.value })}
                        placeholder="Item name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                      <Input
                        value={newPhysicalItem.quantity}
                        onChange={(e) => setNewPhysicalItem({ ...newPhysicalItem, quantity: e.target.value })}
                        placeholder="0"
                        type="number"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                      <Input
                        value={newPhysicalItem.location}
                        onChange={(e) => setNewPhysicalItem({ ...newPhysicalItem, location: e.target.value })}
                        placeholder="Storage location"
                      />
                    </div>
                  </div>
                  <Button onClick={handleAddPhysicalItem} className="mt-3">
                    <Plus className="h-4 w-4 mr-2" /> Add Item
                  </Button>
                </div>

                {/* Physical items list */}
                {resources.physicalItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      {item.location && <p className="text-sm text-gray-500">Location: {item.location}</p>}
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-medium">Qty: {item.quantity}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-600 h-8 w-8"
                        onClick={() => handleDeletePhysicalItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}

                {resources.physicalItems.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No physical items yet. Add your first item above.
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </Card>

        <div className="flex justify-between">
          <Button variant="outline" onClick={() => navigate(`/admin/events/${id}/timeline`)}>
            Manage Timeline
          </Button>
          <Button variant="outline" onClick={() => navigate(`/admin/events/${id}/vendors`)}>
            Assign Vendors
          </Button>
        </div>
      </div>
    </AdminPanelLayout>
  );
}
