
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Wallet, 
  CreditCard, 
  LineChart, 
  TrendingUp, 
  TrendingDown,
  DollarSign 
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { dummyTransactions } from "@/data/hostDummyData";

export default function FinanceTab() {
  const [period, setPeriod] = useState("month");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Financial Overview</h2>
          <p className="text-gray-500">Track your revenue and expenses</p>
        </div>
        <Button onClick={() => toast({ title: "Coming Soon", description: "Advanced financial tools will be available in the next update." })}>
          <Wallet className="h-4 w-4 mr-2" />
          Connect Bank
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Revenue</p>
                <h3 className="text-2xl font-bold">R 152,450</h3>
                <p className="text-sm text-green-600 flex items-center">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +15.3%
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Pending Payouts</p>
                <h3 className="text-2xl font-bold">R 23,890</h3>
                <p className="text-sm text-amber-600">Processing</p>
              </div>
              <div className="bg-amber-100 p-3 rounded-full">
                <CreditCard className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Vendor Revenue</p>
                <h3 className="text-2xl font-bold">R 45,230</h3>
                <p className="text-sm text-green-600 flex items-center">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +8.4%
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <LineChart className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Monthly Expenses</p>
                <h3 className="text-2xl font-bold">R 12,680</h3>
                <p className="text-sm text-red-600 flex items-center">
                  <TrendingDown className="h-4 w-4 mr-1" />
                  -2.3%
                </p>
              </div>
              <div className="bg-red-100 p-3 rounded-full">
                <Wallet className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dummyTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">{transaction.description}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(transaction.date).toLocaleDateString()}
                  </p>
                </div>
                <div className={`text-right ${
                  transaction.type === 'income' ? 'text-green-600' : 
                  transaction.type === 'payout' ? 'text-red-600' : 
                  'text-gray-600'
                }`}>
                  <p className="font-medium">
                    {transaction.type === 'income' ? '+' : '-'} R {Math.abs(transaction.amount).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">{transaction.status}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
