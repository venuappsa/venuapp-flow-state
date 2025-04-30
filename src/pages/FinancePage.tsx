
import { useState } from "react";
import HostPanelLayout from "@/components/layouts/HostPanelLayout";
import FinancialOverview from "@/components/host/finance/FinancialOverview";
import TransactionTable from "@/components/host/finance/TransactionTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Settings, 
  FileText,
  ChevronRight,
  BarChart3
} from "lucide-react";
import { mockTransactions, mockFinancialStats } from "@/data/financeData";
import { useNavigate } from "react-router-dom";

export default function FinancePage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <HostPanelLayout>
      <div className="container mx-auto py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-venu-purple to-venu-dark-purple">
              Financial Dashboard
            </h1>
            <p className="text-gray-500">Manage your financial data and transactions</p>
          </div>
          <div className="flex space-x-2 mt-2 md:mt-0">
            <Button 
              variant="outline" 
              onClick={() => navigate("/host/finance/settings")}
            >
              <Settings className="mr-2 h-4 w-4" />
              Payment Settings
            </Button>
            <Button>
              <FileText className="mr-2 h-4 w-4" />
              Generate Report
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="space-y-6">
              <FinancialOverview stats={mockFinancialStats} />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      <span>Revenue Overview</span>
                      <Button variant="ghost" size="sm" className="gap-1">
                        <span className="text-xs">View All</span>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-center h-[300px]">
                      <BarChart3 className="h-24 w-24 text-gray-300" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      <span>Recent Transactions</span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="gap-1"
                        onClick={() => setActiveTab("transactions")}
                      >
                        <span className="text-xs">View All</span>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockTransactions.slice(0, 5).map((transaction) => (
                        <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium">{transaction.vendorName}</p>
                            <p className="text-sm text-gray-500">
                              {new Date(transaction.date).toLocaleDateString()}
                            </p>
                          </div>
                          <div className={`text-right ${
                            transaction.status === 'paid' ? 'text-green-600' : 
                            transaction.status === 'pending' ? 'text-amber-600' : 
                            transaction.status === 'failed' ? 'text-red-600' :
                            'text-gray-600'
                          }`}>
                            <p className="font-medium">
                              R {Math.abs(transaction.amount).toLocaleString()}
                            </p>
                            <p className="text-sm text-gray-500 capitalize">{transaction.status}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="transactions">
            <TransactionTable transactions={mockTransactions} />
          </TabsContent>
          
          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Financial Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center h-[400px]">
                  <div className="text-center">
                    <BarChart3 className="h-24 w-24 mx-auto text-gray-300" />
                    <p className="mt-4 text-gray-500">Advanced analytics coming soon</p>
                    <Button variant="outline" className="mt-4">Request Early Access</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </HostPanelLayout>
  );
}
