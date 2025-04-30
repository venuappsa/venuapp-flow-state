
import { useState } from 'react';
import AdminPanelLayout from '@/components/layouts/AdminPanelLayout';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';
import { Search, ArrowUpDown, CreditCard } from 'lucide-react';
import { mockPayouts } from '@/data/financeData';

export default function AdminPayoutsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState('vendorName');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
  // Filter payouts based on search
  const filteredPayouts = mockPayouts.filter(payout =>
    payout.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payout.accountDetails.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Sort payouts
  const sortedPayouts = [...filteredPayouts].sort((a, b) => {
    if (sortColumn === 'vendorName') {
      return sortDirection === 'asc'
        ? a.vendorName.localeCompare(b.vendorName)
        : b.vendorName.localeCompare(a.vendorName);
    }
    
    if (sortColumn === 'amount') {
      return sortDirection === 'asc'
        ? a.amount - b.amount
        : b.amount - a.amount;
    }
    
    if (sortColumn === 'date') {
      return sortDirection === 'asc'
        ? new Date(a.date).getTime() - new Date(b.date).getTime()
        : new Date(b.date).getTime() - new Date(a.date).getTime();
    }
    
    return 0;
  });
  
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };
  
  const handlePayVendor = (vendorId: string, vendorName: string) => {
    // This would typically trigger a payment process
    toast({
      title: 'Payment initiated',
      description: `Payment for ${vendorName} has been initiated.`,
    });
  };

  return (
    <AdminPanelLayout>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Vendor Payouts</h1>
            <p className="text-gray-500">Manage and process payments to vendors</p>
          </div>
          <Button>
            <CreditCard className="mr-2 h-4 w-4" />
            Process All Pending
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Pending Payouts</CardTitle>
            <CardDescription>Review and process payments to vendors</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative w-full mb-4">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search vendors..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="cursor-pointer" onClick={() => handleSort('vendorName')}>
                      <div className="flex items-center">
                        Vendor
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort('amount')}>
                      <div className="flex items-center">
                        Amount
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead>Account</TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort('date')}>
                      <div className="flex items-center">
                        Date
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Events</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedPayouts.map(payout => (
                    <TableRow key={payout.id}>
                      <TableCell className="font-medium">{payout.vendorName}</TableCell>
                      <TableCell>R {payout.amount.toLocaleString()}</TableCell>
                      <TableCell>{payout.accountDetails}</TableCell>
                      <TableCell>{new Date(payout.date).toLocaleDateString()}</TableCell>
                      <TableCell>
                        {payout.status === 'paid' ? (
                          <Badge className="bg-green-100 text-green-800">Paid</Badge>
                        ) : (
                          <Badge className="bg-amber-100 text-amber-800">Pending</Badge>
                        )}
                      </TableCell>
                      <TableCell>{payout.eventCount} events</TableCell>
                      <TableCell className="text-right">
                        <Button 
                          size="sm" 
                          disabled={payout.status === 'paid'}
                          onClick={() => handlePayVendor(payout.vendorId, payout.vendorName)}
                        >
                          {payout.status === 'paid' ? 'Paid' : 'Pay Now'}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminPanelLayout>
  );
}
