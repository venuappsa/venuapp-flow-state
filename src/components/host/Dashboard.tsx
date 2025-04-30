
import React from "react";
import { DashboardSection } from "@/components/dashboard/DashboardSection";
import { StatCard } from "@/components/dashboard/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  Wallet,
  Users,
  TicketCheck,
  ChevronRight,
  HelpCircle,
  Store,
  MessagesSquare
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// Mock data for dashboard
const listingSummary = {
  upcoming: 5,
  pending: 2,
  cancelled: 1,
  completed: 8,
};

const earningsSummary = {
  monthly: "R 24,580",
  total: "R 132,450",
  pending: "R 5,200",
  growth: "+12%"
};

const vendorSummary = {
  active: 12,
  pending: 3,
  invitedTotal: 22,
  acceptanceRate: "68%"
};

const supportSummary = {
  open: 2,
  inProgress: 1,
  resolved: 8,
  averageResponse: "3.5 hours"
};

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Listing Summary */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Calendar className="mr-2 h-5 w-5 text-venu-orange" />
              Listings Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="flex flex-col items-center p-3 bg-green-50 rounded-lg">
                <Clock className="h-8 w-8 text-green-600 mb-1" />
                <span className="text-2xl font-bold">{listingSummary.upcoming}</span>
                <span className="text-xs text-gray-600">Upcoming</span>
              </div>
              <div className="flex flex-col items-center p-3 bg-yellow-50 rounded-lg">
                <AlertCircle className="h-8 w-8 text-yellow-600 mb-1" />
                <span className="text-2xl font-bold">{listingSummary.pending}</span>
                <span className="text-xs text-gray-600">Pending</span>
              </div>
              <div className="flex flex-col items-center p-3 bg-red-50 rounded-lg">
                <XCircle className="h-8 w-8 text-red-600 mb-1" />
                <span className="text-2xl font-bold">{listingSummary.cancelled}</span>
                <span className="text-xs text-gray-600">Cancelled</span>
              </div>
              <div className="flex flex-col items-center p-3 bg-blue-50 rounded-lg">
                <CheckCircle className="h-8 w-8 text-blue-600 mb-1" />
                <span className="text-2xl font-bold">{listingSummary.completed}</span>
                <span className="text-xs text-gray-600">Completed</span>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate('/host/events')}
                className="text-venu-orange hover:text-venu-dark-orange flex items-center"
              >
                View All Events <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Earnings Summary */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Wallet className="mr-2 h-5 w-5 text-venu-orange" />
              Earnings Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="text-sm text-gray-500">Monthly Revenue</div>
                <div className="text-2xl font-bold">{earningsSummary.monthly}</div>
                <div className="text-xs bg-green-100 text-green-800 inline-block px-2 py-1 rounded">
                  {earningsSummary.growth} from last month
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-sm text-gray-500">Total Revenue</div>
                <div className="text-2xl font-bold">{earningsSummary.total}</div>
                <div className="text-xs text-gray-500">All time earnings</div>
              </div>
              <div className="space-y-2">
                <div className="text-sm text-gray-500">Pending Payouts</div>
                <div className="text-2xl font-bold">{earningsSummary.pending}</div>
                <div className="text-xs text-gray-500">To be processed</div>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate('/host/finance')}
                className="text-venu-orange hover:text-venu-dark-orange flex items-center"
              >
                View Finances <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Vendor Summary */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Store className="mr-2 h-5 w-5 text-venu-orange" />
              Vendors & Merchants
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="text-sm text-gray-500">Active Vendors</div>
                <div className="text-2xl font-bold">{vendorSummary.active}</div>
                <div className="text-xs text-gray-500">Currently working with you</div>
              </div>
              <div className="space-y-2">
                <div className="text-sm text-gray-500">Pending Invitations</div>
                <div className="text-2xl font-bold">{vendorSummary.pending}</div>
                <div className="text-xs text-gray-500">Awaiting response</div>
              </div>
              <div className="space-y-2">
                <div className="text-sm text-gray-500">Total Invited</div>
                <div className="text-2xl font-bold">{vendorSummary.invitedTotal}</div>
                <div className="text-xs text-gray-500">All time</div>
              </div>
              <div className="space-y-2">
                <div className="text-sm text-gray-500">Acceptance Rate</div>
                <div className="text-2xl font-bold">{vendorSummary.acceptanceRate}</div>
                <div className="text-xs text-gray-500">Overall response rate</div>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate('/host/invitations')}
                className="text-venu-orange hover:text-venu-dark-orange flex items-center"
              >
                Manage Invitations <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Support Tickets */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <HelpCircle className="mr-2 h-5 w-5 text-venu-orange" />
              Support Tickets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="text-sm text-gray-500">Open Tickets</div>
                <div className="text-2xl font-bold">{supportSummary.open}</div>
                <div className="text-xs text-gray-500">Awaiting response</div>
              </div>
              <div className="space-y-2">
                <div className="text-sm text-gray-500">In Progress</div>
                <div className="text-2xl font-bold">{supportSummary.inProgress}</div>
                <div className="text-xs text-gray-500">Being handled</div>
              </div>
              <div className="space-y-2">
                <div className="text-sm text-gray-500">Resolved</div>
                <div className="text-2xl font-bold">{supportSummary.resolved}</div>
                <div className="text-xs text-gray-500">Last 30 days</div>
              </div>
              <div className="space-y-2">
                <div className="text-sm text-gray-500">Avg. Response Time</div>
                <div className="text-2xl font-bold">{supportSummary.averageResponse}</div>
                <div className="text-xs text-gray-500">Time to first reply</div>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-venu-orange hover:text-venu-dark-orange flex items-center"
              >
                View Support <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities */}
      <DashboardSection title="Recent Activities" description="Latest actions and updates">
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-white border rounded-lg">
            <div className="bg-green-100 p-2 rounded-full">
              <TicketCheck className="h-5 w-5 text-green-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium">New event listing confirmed</h3>
              <p className="text-sm text-gray-500">Summer Music Festival has been approved and is now live</p>
            </div>
            <div className="text-xs text-gray-400">2 hours ago</div>
          </div>
          <div className="flex items-center gap-4 p-4 bg-white border rounded-lg">
            <div className="bg-blue-100 p-2 rounded-full">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium">New vendor accepted invitation</h3>
              <p className="text-sm text-gray-500">Gourmet Delights (Food) has accepted your invitation</p>
            </div>
            <div className="text-xs text-gray-400">Yesterday</div>
          </div>
          <div className="flex items-center gap-4 p-4 bg-white border rounded-lg">
            <div className="bg-yellow-100 p-2 rounded-full">
              <MessagesSquare className="h-5 w-5 text-yellow-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium">Support ticket updated</h3>
              <p className="text-sm text-gray-500">Your ticket #45892 has received a response</p>
            </div>
            <div className="text-xs text-gray-400">2 days ago</div>
          </div>
        </div>
      </DashboardSection>
    </div>
  );
}
