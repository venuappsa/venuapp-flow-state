
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  DollarSign, 
  CreditCard, 
  Store, 
  FileText,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { FinancialStats } from '@/data/financeData';

interface FinancialOverviewProps {
  stats: FinancialStats;
}

export default function FinancialOverview({ stats }: FinancialOverviewProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Revenue</p>
              <h3 className="text-2xl font-bold">R {stats.totalRevenue.toLocaleString()}</h3>
              <p className="text-sm text-green-600 flex items-center">
                <TrendingUp className="h-4 w-4 mr-1" />
                +{stats.monthlyGrowth}%
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
              <p className="text-sm text-gray-500">Pending Payments</p>
              <h3 className="text-2xl font-bold">R {stats.pendingPayments.toLocaleString()}</h3>
              <p className="text-sm text-amber-600">Awaiting Processing</p>
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
              <p className="text-sm text-gray-500">Paid to Vendors</p>
              <h3 className="text-2xl font-bold">R {stats.paidToVendors.toLocaleString()}</h3>
              <p className="text-sm text-blue-600 flex items-center">
                <TrendingUp className="h-4 w-4 mr-1" />
                +8.4%
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Store className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Outstanding Invoices</p>
              <h3 className="text-2xl font-bold">R {stats.outstandingInvoices.toLocaleString()}</h3>
              <p className="text-sm text-red-600 flex items-center">
                <TrendingDown className="h-4 w-4 mr-1" />
                -2.3%
              </p>
            </div>
            <div className="bg-red-100 p-3 rounded-full">
              <FileText className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
