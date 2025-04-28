
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Search, Plus, Filter, User, Mail, Phone, Calendar, Building } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface StaffMember {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive';
  availability: string[];
}

interface VenueStaffTabProps {
  venueId: string;
}

export default function VenueStaffTab({ venueId }: VenueStaffTabProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [addStaffDialogOpen, setAddStaffDialogOpen] = useState(false);
  
  const staffMembers: StaffMember[] = [
    {
      id: "s1",
      name: "John Smith",
      role: "Manager",
      email: "john@example.com",
      phone: "+27 82 555 1234",
      status: "active",
      availability: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
    },
    {
      id: "s2",
      name: "Sarah Johnson",
      role: "Assistant Manager",
      email: "sarah@example.com",
      phone: "+27 83 444 5678",
      status: "active",
      availability: ["Monday", "Wednesday", "Friday", "Saturday"]
    },
    {
      id: "s3",
      name: "Michael Brown",
      role: "Security",
      email: "michael@example.com",
      phone: "+27 84 333 9876",
      status: "active",
      availability: ["Friday", "Saturday", "Sunday"]
    },
    {
      id: "s4",
      name: "Jessica White",
      role: "Bartender",
      email: "jessica@example.com",
      phone: "+27 82 111 2222",
      status: "inactive",
      availability: ["Thursday", "Friday", "Saturday"]
    },
  ];
  
  const handleAddStaff = () => {
    toast({
      title: "Staff Member Added",
      description: "New staff member has been added successfully",
    });
    setAddStaffDialogOpen(false);
  };
  
  const filteredStaff = staffMembers.filter(staff => {
    const matchesSearch = 
      staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = !roleFilter || staff.role === roleFilter;
    const matchesStatus = !statusFilter || staff.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
        <div>
          <h2 className="text-xl font-bold">Venue Staff</h2>
          <p className="text-sm text-gray-500">
            Manage staff members for this venue
          </p>
        </div>
        <Button onClick={() => setAddStaffDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Staff
        </Button>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input 
            placeholder="Search staff..." 
            className="pl-9" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Roles</SelectItem>
              <SelectItem value="Manager">Manager</SelectItem>
              <SelectItem value="Assistant Manager">Assistant Manager</SelectItem>
              <SelectItem value="Security">Security</SelectItem>
              <SelectItem value="Bartender">Bartender</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStaff.map(staff => (
          <Card key={staff.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="bg-gray-100 p-3 rounded-full">
                      <User className="h-5 w-5 text-gray-700" />
                    </div>
                    <div>
                      <h3 className="font-medium">{staff.name}</h3>
                      <Badge className={`${
                        staff.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {staff.status === 'active' ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    {staff.role}
                  </Badge>
                </div>
                
                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-600">{staff.email}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-600">{staff.phone}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-600">Available: {staff.availability.join(", ")}</span>
                  </div>
                </div>
              </div>
              
              <div className="border-t p-4 bg-gray-50 flex justify-between">
                <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800 hover:bg-blue-50">
                  View Schedule
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-800 hover:bg-gray-100">
                  Edit
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {filteredStaff.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-md">
          <User className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-medium mb-2">No staff members found</h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            {searchQuery || roleFilter || statusFilter 
              ? "No staff members match your search criteria."
              : "This venue doesn't have any staff members assigned yet."}
          </p>
          <Button onClick={() => setAddStaffDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Staff Member
          </Button>
        </div>
      )}
      
      {/* Add Staff Dialog */}
      <Dialog open={addStaffDialogOpen} onOpenChange={setAddStaffDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Staff Member</DialogTitle>
            <DialogDescription>
              Add a new staff member to this venue.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">Name</label>
              <Input id="name" placeholder="Enter staff name" />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">Email</label>
              <Input id="email" type="email" placeholder="staff@example.com" />
            </div>
            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium">Phone Number</label>
              <Input id="phone" placeholder="+27 12 345 6789" />
            </div>
            <div className="space-y-2">
              <label htmlFor="role" className="text-sm font-medium">Role</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Manager">Manager</SelectItem>
                  <SelectItem value="Assistant Manager">Assistant Manager</SelectItem>
                  <SelectItem value="Security">Security</SelectItem>
                  <SelectItem value="Bartender">Bartender</SelectItem>
                  <SelectItem value="Waiter">Waiter</SelectItem>
                  <SelectItem value="Host">Host</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Working Days</label>
              <div className="grid grid-cols-4 gap-2">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                  <div key={day} className="flex items-center space-x-2">
                    <input type="checkbox" id={day} className="rounded border-gray-300" />
                    <label htmlFor={day} className="text-sm">{day}</label>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Assign To</label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="thisVenue" className="rounded border-gray-300" defaultChecked />
                  <label htmlFor="thisVenue" className="text-sm">This Venue</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="allVenues" className="rounded border-gray-300" />
                  <label htmlFor="allVenues" className="text-sm">All Venues</label>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter className="sm:justify-between">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setAddStaffDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button type="button" onClick={handleAddStaff}>
              Add Staff Member
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
