
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Users,
  Plus,
  Mail,
  Phone,
  Clock,
  MapPin,
  Calendar,
  CircleCheck,
  CircleX,
  Search
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";

// Mock staff data
const mockStaff = [
  {
    id: "staff-1",
    name: "John Smith",
    email: "john.smith@example.com",
    phone: "+27 81 234 5678",
    role: "Event Manager",
    status: "confirmed",
    availability: "Full Day"
  },
  {
    id: "staff-2",
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    phone: "+27 82 345 6789",
    role: "Security Lead",
    status: "confirmed",
    availability: "18:00 - 00:00"
  },
  {
    id: "staff-3",
    name: "David Ndlovu",
    email: "david.n@example.com",
    phone: "+27 83 456 7890",
    role: "Bar Manager",
    status: "confirmed",
    availability: "17:00 - 23:00"
  },
  {
    id: "staff-4",
    name: "Emily Chen",
    email: "emily.c@example.com",
    phone: "+27 84 567 8901",
    role: "Ticket Scanner",
    status: "pending",
    availability: "16:30 - 20:30"
  },
  {
    id: "staff-5",
    name: "Michael van Rooyen",
    email: "michael.v@example.com",
    phone: "+27 85 678 9012",
    role: "Sound Engineer",
    status: "confirmed",
    availability: "15:00 - 23:30"
  }
];

// Mock role requirements
const roleRequirements = [
  { role: "Event Manager", required: 1, assigned: 1 },
  { role: "Security Staff", required: 5, assigned: 3 },
  { role: "Bar Staff", required: 4, assigned: 2 },
  { role: "Ticket Scanners", required: 3, assigned: 1 },
  { role: "Sound Engineers", required: 2, assigned: 1 }
];

export default function EventStaffTab({ eventId }: { eventId: string }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [roleFilter, setRoleFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  
  // Apply filters and search
  const filteredStaff = mockStaff.filter(staff => {
    const matchesSearch = 
      staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.role.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = roleFilter ? staff.role === roleFilter : true;
    const matchesStatus = statusFilter ? staff.status === statusFilter : true;
    
    return matchesSearch && matchesRole && matchesStatus;
  });
  
  const totalAssigned = mockStaff.filter(staff => staff.status === "confirmed").length;
  const totalRequired = roleRequirements.reduce((acc, role) => acc + role.required, 0);
  const staffingPercentage = Math.round((totalAssigned / totalRequired) * 100);

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-amber-100 text-amber-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-medium">Staff Management</h3>
          <p className="text-sm text-gray-500">Manage event staff and assignments</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Staff Member
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Staff Coverage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Users className="h-5 w-5 text-venu-orange mr-2" />
              <div>
                <div className="font-medium text-2xl">{totalAssigned} / {totalRequired}</div>
                <div className="text-sm text-gray-500">{staffingPercentage}% staffed</div>
              </div>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full mt-2">
              <div 
                className={`h-2 rounded-full ${staffingPercentage >= 80 ? 'bg-green-500' : staffingPercentage >= 50 ? 'bg-amber-500' : 'bg-red-500'}`}
                style={{ width: `${staffingPercentage}%` }} 
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Roles to Fill</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {roleRequirements.filter(r => r.assigned < r.required).map((role, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm">{role.role}</span>
                  <Badge variant="outline" className="bg-amber-50">
                    {role.assigned}/{role.required}
                  </Badge>
                </div>
              ))}
              {roleRequirements.filter(r => r.assigned < r.required).length === 0 && (
                <div className="text-center py-2">
                  <CircleCheck className="h-5 w-5 text-green-500 mx-auto mb-1" />
                  <p className="text-sm text-green-600">All roles filled</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Communications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start" onClick={() => toast({
                title: "Staff Notification Sent",
                description: "Reminder sent to all staff members"
              })}>
                <Mail className="h-4 w-4 mr-2" />
                Send Reminder
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => toast({
                title: "Staff Schedule Generated",
                description: "Schedule sent to all confirmed staff members"
              })}>
                <Calendar className="h-4 w-4 mr-2" />
                Send Schedule
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
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
          <select 
            className="px-3 py-2 bg-white border rounded-md text-sm"
            value={roleFilter || ''}
            onChange={(e) => setRoleFilter(e.target.value || null)}
          >
            <option value="">All Roles</option>
            {Array.from(new Set(mockStaff.map(staff => staff.role))).map(role => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
          
          <select 
            className="px-3 py-2 bg-white border rounded-md text-sm"
            value={statusFilter || ''}
            onChange={(e) => setStatusFilter(e.target.value || null)}
          >
            <option value="">All Status</option>
            <option value="confirmed">Confirmed</option>
            <option value="pending">Pending</option>
          </select>
          
          <div className="flex border rounded-md">
            <button
              className={`px-3 py-1.5 text-sm ${viewMode === 'grid' ? 'bg-venu-orange text-white' : 'bg-white text-gray-700'}`}
              onClick={() => setViewMode('grid')}
            >
              Grid
            </button>
            <button
              className={`px-3 py-1.5 text-sm ${viewMode === 'list' ? 'bg-venu-orange text-white' : 'bg-white text-gray-700'}`}
              onClick={() => setViewMode('list')}
            >
              List
            </button>
          </div>
        </div>
      </div>
      
      {filteredStaff.length > 0 ? (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredStaff.map((staff) => (
              <Card 
                key={staff.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="p-5">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="bg-gray-100 p-3 rounded-full">
                        <User className="h-5 w-5 text-venu-orange" />
                      </div>
                      <div>
                        <h3 className="font-medium">{staff.name}</h3>
                        <p className="text-sm text-gray-500">{staff.role}</p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(staff.status)}>
                      {staff.status.charAt(0).toUpperCase() + staff.status.slice(1)}
                    </Badge>
                  </div>
                  
                  <div className="mt-4 space-y-2 text-sm">
                    <div className="flex items-center text-gray-600">
                      <Mail className="h-4 w-4 mr-2 text-gray-400" />
                      {staff.email}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Phone className="h-4 w-4 mr-2 text-gray-400" />
                      {staff.phone}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Clock className="h-4 w-4 mr-2 text-gray-400" />
                      {staff.availability}
                    </div>
                  </div>
                  
                  <div className="mt-4 flex justify-end space-x-2">
                    {staff.status === 'pending' ? (
                      <>
                        <Button variant="outline" size="sm" onClick={() => toast({
                          title: "Staff Member Rejected",
                          description: `${staff.name} has been removed from the event`,
                          variant: "destructive"
                        })}>
                          <CircleX className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                        <Button size="sm" onClick={() => toast({
                          title: "Staff Member Confirmed",
                          description: `${staff.name} has been confirmed for the event`,
                        })}>
                          <CircleCheck className="h-4 w-4 mr-1" />
                          Confirm
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button variant="outline" size="sm" onClick={() => toast({
                          title: "Message Sent",
                          description: `Message sent to ${staff.name}`
                        })}>
                          <Mail className="h-4 w-4 mr-1" />
                          Message
                        </Button>
                        <Button size="sm" onClick={() => toast({
                          title: "Staff Details",
                          description: `View details for ${staff.name}`
                        })}>
                          Details
                        </Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto border rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Availability</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th scope="col" className="relative px-6 py-3"></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredStaff.map((staff) => (
                  <tr key={staff.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="bg-gray-100 p-1 rounded-full mr-3">
                          <User className="h-4 w-4 text-venu-orange" />
                        </div>
                        <div className="font-medium text-gray-900">{staff.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {staff.role}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex flex-col">
                        <span>{staff.email}</span>
                        <span>{staff.phone}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {staff.availability}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className={getStatusColor(staff.status)}>
                        {staff.status.charAt(0).toUpperCase() + staff.status.slice(1)}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {staff.status === 'pending' ? (
                        <div className="flex justify-end space-x-2">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <CircleX className="h-4 w-4 text-red-600" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <CircleCheck className="h-4 w-4 text-green-600" />
                          </Button>
                        </div>
                      ) : (
                        <Button variant="outline" size="sm">
                          Details
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <User className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-medium text-gray-700 mb-2">No staff found</h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            {searchQuery || roleFilter || statusFilter
              ? `No staff match your search criteria`
              : "You haven't assigned any staff to this event yet."}
          </p>
          <Button>Add Staff Member</Button>
        </div>
      )}
      
      <Card>
        <CardHeader>
          <CardTitle>Staff Assignment Guide</CardTitle>
          <CardDescription>Recommended staffing levels based on event size</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="pb-2 text-left font-medium">Role</th>
                <th className="pb-2 text-center font-medium">Recommended</th>
                <th className="pb-2 text-center font-medium">Current</th>
                <th className="pb-2 text-right font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {roleRequirements.map((role, idx) => (
                <tr key={idx} className="border-b">
                  <td className="py-3">{role.role}</td>
                  <td className="py-3 text-center">{role.required}</td>
                  <td className="py-3 text-center">{role.assigned}</td>
                  <td className="py-3 text-right">
                    {role.assigned >= role.required ? (
                      <Badge className="bg-green-100 text-green-800">Complete</Badge>
                    ) : role.assigned > 0 ? (
                      <Badge className="bg-amber-100 text-amber-800">Partial</Badge>
                    ) : (
                      <Badge className="bg-red-100 text-red-800">Needed</Badge>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          <div className="pt-4">
            <Button variant="outline" className="w-full" onClick={() => toast({
              title: "Staff Report",
              description: "Staff assignment report generated"
            })}>
              Generate Staff Report
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
