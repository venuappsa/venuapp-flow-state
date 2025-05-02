
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import FetchmanControlSliders from "@/components/fetchman/FetchmanControlSliders";
import FetchmanStats from "@/components/fetchman/FetchmanStats";
import FetchmanShiftPlanTable from "@/components/fetchman/FetchmanShiftPlan";
import { AlertCircle } from "lucide-react";
import { calculateFetchmanEstimate, calculateFetchmanCost, generateFetchmanStaffingPlan } from "@/utils/fetchmanCalculator";
import FetchmanPanelLayout from "@/components/layouts/FetchmanPanelLayout";

export default function FetchmanDashboardPage() {
  // Initialize state for fetchman calculator
  const [capacity, setCapacity] = useState(500);
  const [vendors, setVendors] = useState(10);
  const [hours, setHours] = useState(8);
  const [rate, setRate] = useState(150);

  // Calculate fetchman statistics based on input
  const fetchmenCount = calculateFetchmanEstimate(capacity, vendors);
  const totalCost = calculateFetchmanCost(fetchmenCount, hours);
  const staffingPlan = generateFetchmanStaffingPlan(fetchmenCount, hours);

  return (
    <FetchmanPanelLayout>
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

        {/* Using existing fetchman components with the proper props */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Fetchman Estimator</CardTitle>
              <CardDescription>Adjust parameters to calculate required fetchmen</CardDescription>
            </CardHeader>
            <CardContent>
              <FetchmanControlSliders 
                capacity={capacity}
                vendors={vendors}
                hours={hours}
                rate={rate}
                onCapacityChange={setCapacity}
                onVendorsChange={setVendors}
                onHoursChange={setHours}
                onRateChange={setRate}
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Staffing Summary</CardTitle>
              <CardDescription>Based on your event parameters</CardDescription>
            </CardHeader>
            <CardContent>
              <FetchmanStats 
                fetchmenCount={fetchmenCount}
                hours={hours}
                rate={rate}
                totalCost={totalCost}
                hasOvertime={false}
              />
              <FetchmanShiftPlanTable staffingPlan={staffingPlan} />
            </CardContent>
          </Card>
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
    </FetchmanPanelLayout>
  );
}
