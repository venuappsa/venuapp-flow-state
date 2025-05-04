
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Calendar, ArrowUpRight } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/hooks/useUser";
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

interface EarningsData {
  date: string;
  amount: number;
}

export default function FetchmanEarningsPage() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [fetchmanProfile, setFetchmanProfile] = useState<any>(null);
  const [earningsData, setEarningsData] = useState<EarningsData[]>([]);
  const [paymentHistory, setPaymentHistory] = useState<any[]>([]);
  const [currentBalance, setCurrentBalance] = useState(0);
  const [currentMonthEarnings, setCurrentMonthEarnings] = useState(0);
  const [lastMonthEarnings, setLastMonthEarnings] = useState(0);
  const [isLoading, setIsLoading] = useState({
    profile: true,
    earnings: true,
    payments: true,
  });

  useEffect(() => {
    const fetchFetchmanProfile = async () => {
      if (!user?.id) return;
      
      try {
        const { data, error } = await supabase
          .from('fetchman_profiles')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();
        
        if (error) {
          console.error("Error fetching fetchman profile:", error);
          return;
        }
        
        setFetchmanProfile(data);
      } catch (err) {
        console.error("Error in fetchFetchmanProfile:", err);
      } finally {
        setIsLoading(prev => ({ ...prev, profile: false }));
      }
    };
    
    fetchFetchmanProfile();
  }, [user]);

  useEffect(() => {
    const fetchEarningsData = async () => {
      if (!fetchmanProfile) return;
      
      try {
        // Get completed deliveries for the past 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const { data: deliveries, error } = await supabase
          .from('fetchman_deliveries')
          .select('*')
          .eq('fetchman_id', fetchmanProfile.id)
          .eq('status', 'completed')
          .gte('completion_time', thirtyDaysAgo.toISOString())
          .order('completion_time', { ascending: true });
        
        if (error) {
          console.error("Error fetching earnings data:", error);
          return;
        }
        
        // Process data for the chart - group by date
        const dailyEarnings: Record<string, number> = {};
        let runningBalance = 0;
        let currentMonthTotal = 0;
        let lastMonthTotal = 0;
        
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
        
        deliveries?.forEach(delivery => {
          const date = new Date(delivery.completion_time);
          const dateString = date.toLocaleDateString('en-ZA', { month: 'short', day: 'numeric' });
          const amount = delivery.fee || 0;
          
          // Add to daily earnings
          if (dailyEarnings[dateString]) {
            dailyEarnings[dateString] += amount;
          } else {
            dailyEarnings[dateString] = amount;
          }
          
          // Add to running balance
          runningBalance += amount;
          
          // Check if current month
          if (date.getMonth() === currentMonth && date.getFullYear() === currentYear) {
            currentMonthTotal += amount;
          }
          
          // Check if last month
          if (date.getMonth() === lastMonth && date.getFullYear() === lastMonthYear) {
            lastMonthTotal += amount;
          }
        });
        
        // Convert to array format for chart
        const chartData = Object.keys(dailyEarnings).map(date => ({
          date,
          amount: dailyEarnings[date]
        }));
        
        // Ensure we have at least 7 data points for the chart
        const existingDates = new Set(chartData.map(item => item.date));
        const today = new Date();
        
        for (let i = 0; i < 7; i++) {
          const date = new Date();
          date.setDate(today.getDate() - i);
          const dateString = date.toLocaleDateString('en-ZA', { month: 'short', day: 'numeric' });
          
          if (!existingDates.has(dateString)) {
            chartData.push({
              date: dateString,
              amount: 0
            });
          }
        }
        
        // Sort by date
        chartData.sort((a, b) => {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          return dateA.getTime() - dateB.getTime();
        });
        
        setEarningsData(chartData);
        setCurrentBalance(runningBalance);
        setCurrentMonthEarnings(currentMonthTotal);
        setLastMonthEarnings(lastMonthTotal);
      } catch (err) {
        console.error("Error processing earnings data:", err);
      } finally {
        setIsLoading(prev => ({ ...prev, earnings: false }));
      }
    };
    
    const fetchPaymentHistory = async () => {
      if (!fetchmanProfile) return;
      
      try {
        // Mock payment history for now - in a real app, this would come from a payments table
        const mockPayments = [
          { 
            id: "1", 
            date: "2025-04-30", 
            amount: 1850, 
            status: "completed", 
            reference: "PAY-8346921" 
          },
          { 
            id: "2", 
            date: "2025-03-31", 
            amount: 2200, 
            status: "completed", 
            reference: "PAY-7265104" 
          },
          { 
            id: "3", 
            date: "2025-02-28", 
            amount: 1950, 
            status: "completed", 
            reference: "PAY-6198375" 
          },
          { 
            id: "4", 
            date: "2025-01-31", 
            amount: 1750, 
            status: "completed", 
            reference: "PAY-5124698" 
          },
        ];
        
        setPaymentHistory(mockPayments);
      } catch (err) {
        console.error("Error fetching payment history:", err);
      } finally {
        setIsLoading(prev => ({ ...prev, payments: false }));
      }
    };
    
    if (fetchmanProfile) {
      fetchEarningsData();
      fetchPaymentHistory();
    }
  }, [fetchmanProfile]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const withdrawFunds = () => {
    toast({
      title: "Withdrawal Initiated",
      description: `R${currentBalance} will be transferred to your bank account within 1-3 business days.`,
    });
  };

  const exportPaymentHistory = () => {
    const csvData = [
      ['Date', 'Reference', 'Amount', 'Status'],
      ...paymentHistory.map(payment => [
        formatDate(payment.date),
        payment.reference,
        `R ${payment.amount}`,
        payment.status
      ])
    ];
    
    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'payment_history.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold mb-2">Earnings</h1>
        <p className="text-gray-500">Track your earnings and payment history</p>
      </div>

      {isLoading.profile || isLoading.earnings ? (
        <div className="text-center py-10">Loading earnings data...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Current Balance</CardTitle>
                <CardDescription>Available for withdrawal</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">R {currentBalance}</p>
                <Button 
                  className="mt-4 w-full" 
                  onClick={withdrawFunds}
                  disabled={currentBalance <= 0}
                >
                  Withdraw Funds
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">This Month</CardTitle>
                <CardDescription>{new Date().toLocaleDateString('en-ZA', { month: 'long', year: 'numeric' })}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">R {currentMonthEarnings}</p>
                {lastMonthEarnings > 0 && (
                  <p className="text-sm text-green-600">
                    {currentMonthEarnings >= lastMonthEarnings 
                      ? `↑ ${Math.round((currentMonthEarnings / lastMonthEarnings - 1) * 100)}% from last month`
                      : `↓ ${Math.round((1 - currentMonthEarnings / lastMonthEarnings) * 100)}% from last month`
                    }
                  </p>
                )}
                <div className="mt-2 text-sm text-gray-500">
                  {Math.round(currentMonthEarnings / 150)} deliveries completed
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Last Month</CardTitle>
                <CardDescription>
                  {new Date(new Date().setMonth(new Date().getMonth() - 1))
                    .toLocaleDateString('en-ZA', { month: 'long', year: 'numeric' })}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">R {lastMonthEarnings}</p>
                <div className="mt-2 text-sm text-gray-500">
                  {Math.round(lastMonthEarnings / 150)} deliveries completed
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Earnings Overview</CardTitle>
                  <CardDescription>Track your daily earnings</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <Calendar className="mr-2 h-4 w-4" />
                  Filter
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={earningsData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="amount" 
                      stroke="#ff6b35" 
                      activeDot={{ r: 8 }} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="payment-history">
            <TabsList className="mb-6">
              <TabsTrigger value="payment-history">Payment History</TabsTrigger>
              <TabsTrigger value="trip-history">Trip History</TabsTrigger>
              <TabsTrigger value="tax-documents">Tax Documents</TabsTrigger>
            </TabsList>
            
            <TabsContent value="payment-history">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Payment History</CardTitle>
                      <CardDescription>Record of your monthly payouts</CardDescription>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={exportPaymentHistory}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Export
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <table className="min-w-full">
                      <thead>
                        <tr className="border-b bg-muted/50">
                          <th className="py-3 px-4 text-left text-sm font-medium">Date</th>
                          <th className="py-3 px-4 text-left text-sm font-medium">Reference</th>
                          <th className="py-3 px-4 text-left text-sm font-medium">Amount</th>
                          <th className="py-3 px-4 text-left text-sm font-medium">Status</th>
                          <th className="py-3 px-4 text-right text-sm font-medium"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {isLoading.payments ? (
                          <tr>
                            <td colSpan={5} className="py-10 text-center">
                              Loading payment history...
                            </td>
                          </tr>
                        ) : paymentHistory.length > 0 ? (
                          paymentHistory.map((payment) => (
                            <tr key={payment.id} className="border-b">
                              <td className="py-3 px-4 text-sm">{formatDate(payment.date)}</td>
                              <td className="py-3 px-4 text-sm">{payment.reference}</td>
                              <td className="py-3 px-4 text-sm font-medium">R {payment.amount}</td>
                              <td className="py-3 px-4 text-sm">
                                <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                                  {payment.status}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-right text-sm">
                                <Button variant="ghost" size="sm">
                                  <ArrowUpRight className="h-4 w-4" />
                                </Button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={5} className="py-10 text-center">
                              No payment history available.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="trip-history">
              <Card>
                <CardHeader>
                  <CardTitle>Trip History</CardTitle>
                  <CardDescription>Record of your delivery trips</CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Will implement this in future updates */}
                  <div className="text-center py-10">
                    <p className="text-gray-500">Detail trip history coming soon</p>
                    <Button className="mt-4" onClick={() => navigate('/fetchman/assignments')}>
                      View Assignments
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="tax-documents">
              <Card>
                <CardHeader>
                  <CardTitle>Tax Documents</CardTitle>
                  <CardDescription>Access your tax documents</CardDescription>
                </CardHeader>
                <CardContent className="text-center py-10">
                  <p className="text-gray-500">Tax documents will be available at the end of the tax year.</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
}
