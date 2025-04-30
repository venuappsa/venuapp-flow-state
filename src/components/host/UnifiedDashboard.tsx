
import React from "react";
import { DashboardSection } from "@/components/dashboard/DashboardSection";
import { StatCard } from "@/components/dashboard/StatCard";
import CreateNewResource from "@/components/host/CreateNewResource";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Building, 
  CalendarRange,
  Store,
  Users,
  Plus,
  CreditCard,
  ChevronRight
} from "lucide-react";

// Mock data for dashboard
const mockData = {
  venues: {
    count: 3,
    change: "+1",
    changeType: "positive" as const,
  },
  events: {
    upcoming: 5,
    past: 8,
    change: "+2",
    changeType: "positive" as const,
  },
  merchants: {
    active: 12,
    pending: 3,
  },
  revenue: {
    current: "R 14,520",
    change: "+12%",
    changeType: "positive" as const,
  },
  guests: {
    current: 367,
    change: "+24%",
    changeType: "positive" as const,
  }
};

export default function UnifiedDashboard() {
  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      <DashboardSection 
        title="Overview" 
        description="Your key metrics at a glance"
        gradient
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Active Venues"
            value={mockData.venues.count}
            icon={<Building size={24} />}
            change={mockData.venues.change}
            changeType={mockData.venues.changeType}
            gradient
          />
          <StatCard
            title="Upcoming Events"
            value={mockData.events.upcoming}
            description={`${mockData.events.past} past events`}
            icon={<CalendarRange size={24} />}
            change={mockData.events.change}
            changeType={mockData.events.changeType}
            gradient
          />
          <StatCard
            title="Active Merchants"
            value={mockData.merchants.active}
            description={`${mockData.merchants.pending} pending invitations`}
            icon={<Store size={24} />}
            gradient
          />
          <StatCard
            title="Monthly Revenue"
            value={mockData.revenue.current}
            icon={<CreditCard size={24} />}
            change={mockData.revenue.change}
            changeType={mockData.revenue.changeType}
            gradient
          />
        </div>
      </DashboardSection>

      {/* Quick Actions */}
      <DashboardSection 
        title="Quick Actions"
        description="Start managing your venues and events"
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <CreateNewResource
            title="Create Venue"
            description="Add a new venue to your portfolio"
            link="/host/venues/new"
            icon={<Building size={24} />}
            variant="dashed"
          />
          <CreateNewResource
            title="Create Event"
            description="Schedule a new event at your venue"
            link="/host/events/new"
            icon={<CalendarRange size={24} />}
            variant="dashed"
          />
          <CreateNewResource
            title="Invite Merchants"
            description="Find vendors for your events"
            link="/host/merchants"
            icon={<Store size={24} />}
            variant="dashed"
          />
        </div>
      </DashboardSection>

      {/* Recent Events */}
      <DashboardSection
        title="Recent Events"
        description="Your latest events and their status"
        action={
          <Button variant="ghost" size="sm" className="gap-1" asChild>
            <a href="/host/events">
              View All <ChevronRight className="h-4 w-4" />
            </a>
          </Button>
        }
      >
        <div className="grid grid-cols-1 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Summer Food Festival</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">May 15, 2025 • Coastal Beach Venue</p>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Store className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">24 vendors</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">250 expected</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">Details</Button>
                  <Button size="sm">Manage</Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Wine & Jazz Night</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">June 2, 2025 • Downtown Gallery</p>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Store className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">8 vendors</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">120 expected</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">Details</Button>
                  <Button size="sm">Manage</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardSection>
    </div>
  );
}
