
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

// Sales data types
export interface SalesData {
  eventId: string;
  eventName: string;
  total: number;
  breakdown: {
    ticketSales: number;
    merchantFees: number;
    commission: number;
    foodAndDrinks: number;
    other: number;
  };
  transactions: SalesTransaction[];
}

export interface SalesTransaction {
  id: string;
  type: "ticketSales" | "merchantFees" | "commission" | "foodAndDrinks" | "other";
  description: string;
  amount: number;
  date: string;
}

interface SalesBreakdownDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  salesData: SalesData | null;
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];
const RADIAN = Math.PI / 180;

const SalesBreakdownDialog: React.FC<SalesBreakdownDialogProps> = ({
  open,
  onOpenChange,
  salesData,
}) => {
  if (!salesData) return null;

  const pieData = [
    { name: "Ticket Sales", value: salesData.breakdown.ticketSales },
    { name: "Merchant Fees", value: salesData.breakdown.merchantFees },
    { name: "Commission", value: salesData.breakdown.commission },
    { name: "Food & Drinks", value: salesData.breakdown.foodAndDrinks },
    { name: "Other", value: salesData.breakdown.other },
  ].filter(item => item.value > 0);

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Revenue Breakdown for {salesData.eventName}</DialogTitle>
          <DialogDescription>
            Total Revenue: R {salesData.total.toLocaleString()}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="chart">Chart</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Revenue Type</TableHead>
                  <TableHead className="text-right">Amount (ZAR)</TableHead>
                  <TableHead className="text-right">Percentage</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pieData.map((entry, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{entry.name}</TableCell>
                    <TableCell className="text-right">
                      R {entry.value.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      {((entry.value / salesData.total) * 100).toFixed(1)}%
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="font-bold">
                  <TableCell>Total</TableCell>
                  <TableCell className="text-right">
                    R {salesData.total.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">100%</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="chart" className="mt-4">
            <Card>
              <CardContent className="pt-6">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={renderCustomizedLabel}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => `R ${value.toLocaleString()}`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transactions" className="mt-4">
            <div className="max-h-[400px] overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {salesData.transactions.map((transaction, idx) => (
                    <TableRow key={idx}>
                      <TableCell>
                        {new Date(transaction.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {transaction.type === "ticketSales" && "Ticket Sales"}
                        {transaction.type === "merchantFees" && "Merchant Fees"}
                        {transaction.type === "commission" && "Commission"}
                        {transaction.type === "foodAndDrinks" && "Food & Drinks"}
                        {transaction.type === "other" && "Other"}
                      </TableCell>
                      <TableCell>{transaction.description}</TableCell>
                      <TableCell className="text-right">
                        R {transaction.amount.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default SalesBreakdownDialog;
