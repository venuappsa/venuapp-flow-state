
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FetchmanControlSliders } from "@/components/fetchman/FetchmanControlSliders";
import { FetchmanStats } from "@/components/fetchman/FetchmanStats";
import { FetchmanShiftPlan } from "@/components/fetchman/FetchmanShiftPlan";
import { AlertCircle, Calendar, MessageSquare, Settings } from "lucide-react";

// Create a basic layout similar to the other role layouts
const FetchmanLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm py-4 px-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img
            src="/lovable-uploads/c8628e28-1db7-453f-b8d6-13301457b8dc.png"
            alt="Venuapp Logo"
            className="h-8 w-8 object-contain"
          />
          <h1 className="text-xl font-semibold text-venu-orange">Venuapp Fetchman</h1>
        </div>
        <div className="flex items-center gap-4">
          <MessageSquare className="h-5 w-5 text-gray-500" />
          <Calendar className="h-5 w-5 text-gray-500" />
          <Settings className="h-5 w-5 text-gray-500" />
          <div className="h-8 w-8 rounded-full bg-venu-orange text-white flex items-center justify-center">
            FB
          </div>
        </div>
      </header>
      <main className="container mx-auto py-8 px-4">{children}</main>
    </div>
  );
};

export default function FetchmanDashboardPage() {
  return (
    <FetchmanLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Fetchman Dashboard</h1>
          <p className="text-gray-500">Welcome back, manage your delivery assignments and track your earnings.</p>
        </div>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Action Required</AlertTitle>
          <AlertDescription>
            Please complete your profile information and upload your vehicle details to receive more delivery opportunities.
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Today's Earnings</CardTitle>
              <CardDescription>May 2, 2025</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">R 450</p>
              <p className="text-sm text-green-600">↑ 15% from yesterday</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Active Orders</CardTitle>
              <CardDescription>Currently in progress</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">3</p>
              <p className="text-sm text-muted-foreground">2 pickups, 1 delivery</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Completion Rate</CardTitle>
              <CardDescription>Last 30 days</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">98%</p>
              <p className="text-sm text-green-600">Top tier performance</p>
            </CardContent>
          </Card>
        </div>

        {/* Using existing fetchman components */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <FetchmanStats />
          <FetchmanControlSliders />
        </div>

        <div className="mb-6">
          <FetchmanShiftPlan />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Deliveries</CardTitle>
            <CardDescription>Your recent delivery activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Order ID</th>
                    <th className="text-left py-3 px-4">Customer</th>
                    <th className="text-left py-3 px-4">Location</th>
                    <th className="text-right py-3 px-4">Amount</th>
                    <th className="text-right py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-3 px-4">#F8742</td>
                    <td className="py-3 px-4">Sarah J.</td>
                    <td className="py-3 px-4">Sandton City Mall</td>
                    <td className="py-3 px-4 text-right">R 120</td>
                    <td className="py-3 px-4 text-right">
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                        Completed
                      </span>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4">#F8741</td>
                    <td className="py-3 px-4">Michael T.</td>
                    <td className="py-3 px-4">Rosebank Mall</td>
                    <td className="py-3 px-4 text-right">R 85</td>
                    <td className="py-3 px-4 text-right">
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                        Completed
                      </span>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4">#F8740</td>
                    <td className="py-3 px-4">James L.</td>
                    <td className="py-3 px-4">Hyde Park Corner</td>
                    <td className="py-3 px-4 text-right">R 150</td>
                    <td className="py-3 px-4 text-right">
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                        Completed
                      </span>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4">#F8739</td>
                    <td className="py-3 px-4">Emma R.</td>
                    <td className="py-3 px-4">Menlyn Park</td>
                    <td className="py-3 px-4 text-right">R 95</td>
                    <td className="py-3 px-4 text-right">
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                        Completed
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </FetchmanLayout>
  );
}
