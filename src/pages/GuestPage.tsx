
import HostPanelLayout from "@/components/layouts/HostPanelLayout";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartContainer, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { ResponsiveContainer, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { generateMockAnalyticsData } from "@/data/analyticsData";

const GuestAnalyticsPage = () => {
  const [selectedTab, setSelectedTab] = useState<string>("demographics");
  const data = generateMockAnalyticsData("Pro"); // Use Pro tier data for richer visualization

  const ageData = [
    { name: "18-24", value: 28, color: "#22c55e" },
    { name: "25-34", value: 35, color: "#16a34a" },
    { name: "35-44", value: 22, color: "#15803d" },
    { name: "45-54", value: 10, color: "#166534" },
    { name: "55+", value: 5, color: "#14532d" }
  ];

  const genderData = [
    { name: "Male", value: 52, color: "#3b82f6" },
    { name: "Female", value: 45, color: "#ec4899" },
    { name: "Other", value: 3, color: "#8b5cf6" }
  ];

  const attendanceData = [
    { month: "Jan", attendance: 1200 },
    { month: "Feb", attendance: 1500 },
    { month: "Mar", attendance: 1800 },
    { month: "Apr", attendance: 1600 },
    { month: "May", attendance: 2100 },
    { month: "Jun", attendance: 2400 }
  ];

  const retentionData = [
    { name: "First-time", value: 65, color: "#3b82f6" },
    { name: "Returning", value: 35, color: "#8b5cf6" }
  ];

  const satisfactionData = [
    { category: "Overall Experience", rating: 4.2 },
    { category: "Event Quality", rating: 4.5 },
    { category: "Food & Beverage", rating: 3.9 },
    { category: "Staff Service", rating: 4.3 },
    { category: "Value for Money", rating: 3.8 },
    { category: "Venue Facilities", rating: 4.1 }
  ];

  // Fixed colors for group size chart
  const groupSizeColors = [
    { name: "Solo", color: "#f59e0b" },
    { name: "Couples", color: "#ff6b00" },
    { name: "Groups (3-5)", color: "#ef4444" },
    { name: "Large Groups (6+)", color: "#8b5cf6" }
  ];

  return (
    <HostPanelLayout>
      <div className="max-w-7xl mx-auto py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Guest Analytics</h1>
          <p className="text-gray-500">Comprehensive insights on guest profiles and behavior</p>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
          <TabsList className="bg-white border p-1 rounded-lg">
            <TabsTrigger value="demographics">Demographics</TabsTrigger>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
            <TabsTrigger value="satisfaction">Satisfaction</TabsTrigger>
            <TabsTrigger value="retention">Retention</TabsTrigger>
          </TabsList>

          <TabsContent value="demographics" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Age Distribution</CardTitle>
                  <CardDescription>Breakdown of attendees by age group</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ChartContainer config={{}}>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={ageData}
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                            label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          >
                            {ageData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => `${value}%`} />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Gender Distribution</CardTitle>
                  <CardDescription>Breakdown of attendees by gender</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ChartContainer config={{}}>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={genderData}
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                            label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          >
                            {genderData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => `${value}%`} />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Regional Distribution</CardTitle>
                <CardDescription>Where your guests are coming from</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ChartContainer config={{value: {label: "Guests"}}}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          { region: "Johannesburg", value: 35 },
                          { region: "Pretoria", value: 22 },
                          { region: "Cape Town", value: 15 },
                          { region: "Durban", value: 12 },
                          { region: "Port Elizabeth", value: 8 },
                          { region: "Other", value: 8 }
                        ]}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                        <XAxis type="number" />
                        <YAxis dataKey="region" type="category" width={100} />
                        <Tooltip formatter={(value) => `${value}%`} />
                        <Bar dataKey="value" fill="#ff6b00" />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="attendance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Monthly Attendance</CardTitle>
                <CardDescription>Guest attendance trends over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ChartContainer
                    config={{
                      attendance: {
                        label: "Attendance",
                        theme: {
                          light: "#ff6b00",
                          dark: "#ff6b00"
                        }
                      }
                    }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={attendanceData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="attendance" stroke="#ff6b00" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Peak Arrival Times</CardTitle>
                  <CardDescription>When guests typically arrive</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="h-[200px]">
                    <ChartContainer config={{count: {label: "Guest Count"}}}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={[
                            { time: "10:00", count: 50 },
                            { time: "11:00", count: 120 },
                            { time: "12:00", count: 200 },
                            { time: "13:00", count: 180 },
                            { time: "14:00", count: 140 },
                            { time: "15:00", count: 90 },
                            { time: "16:00", count: 70 },
                            { time: "17:00", count: 110 },
                            { time: "18:00", count: 180 },
                            { time: "19:00", count: 220 },
                            { time: "20:00", count: 170 },
                          ]}
                          margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
                        >
                          <XAxis dataKey="time" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="count" fill="#ff6b00" />
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Average Stay Duration</CardTitle>
                  <CardDescription>How long guests remain at events</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="h-[200px]">
                    <ChartContainer config={{percentage: {label: "% of Guests"}}}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={[
                            { duration: "<1 hr", percentage: 5 },
                            { duration: "1-2 hrs", percentage: 15 },
                            { duration: "2-3 hrs", percentage: 30 },
                            { duration: "3-4 hrs", percentage: 35 },
                            { duration: "4+ hrs", percentage: 15 },
                          ]}
                          margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
                        >
                          <XAxis dataKey="duration" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="percentage" fill="#ff6b00" />
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Group Size</CardTitle>
                  <CardDescription>How guests attend events</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="h-[200px]">
                    <ChartContainer config={{percentage: {label: "% of Bookings"}}}>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={[
                              { name: "Solo", value: 20, color: "#f59e0b" },
                              { name: "Couples", value: 35, color: "#ff6b00" },
                              { name: "Groups (3-5)", value: 30, color: "#ef4444" },
                              { name: "Large Groups (6+)", value: 15, color: "#8b5cf6" }
                            ]}
                            cx="50%"
                            cy="50%"
                            outerRadius={70}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {groupSizeColors.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => `${value}%`} />
                          <Legend layout="vertical" align="right" verticalAlign="middle" />
                        </PieChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="satisfaction" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Guest Satisfaction Ratings</CardTitle>
                <CardDescription>Average ratings across categories (out of 5)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ChartContainer
                    config={{
                      rating: {
                        label: "Rating",
                        theme: {
                          light: "#ff6b00",
                          dark: "#ff6b00"
                        }
                      }
                    }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={satisfactionData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="category" />
                        <YAxis domain={[0, 5]} />
                        <Tooltip formatter={(value) => `${value}/5`} />
                        <Bar dataKey="rating" fill="#ff6b00">
                          {satisfactionData.map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={entry.rating > 4.2 ? "#22c55e" : entry.rating > 3.8 ? "#f59e0b" : "#ef4444"} 
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="retention" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Guest Type</CardTitle>
                  <CardDescription>First-time vs. returning guests</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ChartContainer config={{}}>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={retentionData}
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                            label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          >
                            {retentionData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => `${value}%`} />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Retention Rate</CardTitle>
                  <CardDescription>Return rate by event type</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ChartContainer config={{rate: {label: "Return Rate"}}}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={[
                            { event: "Festivals", rate: 45 },
                            { event: "Concerts", rate: 38 },
                            { event: "Food Markets", rate: 65 },
                            { event: "Sports Events", rate: 58 },
                            { event: "Exhibitions", rate: 42 }
                          ]}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis dataKey="event" />
                          <YAxis />
                          <Tooltip formatter={(value) => `${value}%`} />
                          <Bar dataKey="rate" fill="#8b5cf6" />
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </HostPanelLayout>
  );
};

export default GuestAnalyticsPage;
