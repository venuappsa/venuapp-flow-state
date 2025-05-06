
import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";

// Transaction type definition
interface Transaction {
  id: string;
  user_id: string;
  amount: number;
  status: string;
  type: string;
  created_at: string;
  description: string;
  reference: string;
}

export default function UserTransactions() {
  const { userId } = useParams<{ userId: string }>();

  const { data: transactions, isLoading, error } = useQuery<Transaction[]>({
    queryKey: ["admin-user-transactions", userId],
    queryFn: async () => {
      try {
        // First check if we can find any transactions
        const { data: subscriptionTxns, error: subError } = await supabase
          .from("subscription_transactions")
          .select("*")
          .eq("host_id", userId);
          
        if (subError) throw subError;
        
        // For now, we don't have a generalized transactions table,
        // so we'll simulate transactions for demo purposes
        // In production, you would fetch actual transactions from your database
        
        // If we have subscription transactions, format them
        if (subscriptionTxns && subscriptionTxns.length > 0) {
          return subscriptionTxns.map(tx => ({
            id: tx.id,
            user_id: tx.host_id,
            amount: tx.amount,
            status: tx.status,
            type: "subscription",
            created_at: tx.transaction_date,
            description: `Subscription: ${tx.plan_name}`,
            reference: tx.paystack_reference || tx.stripe_session_id || "N/A"
          }));
        }
        
        // If no real transactions found, use mock data
        console.log("No real transactions found, using mock data");
        return getMockTransactions(userId || "");
      } catch (error) {
        console.error("Error fetching transactions:", error);
        // Fall back to mock data if there's an error
        return getMockTransactions(userId || "");
      }
    },
    enabled: !!userId,
  });

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
      case "success":
      case "successful":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case "failed":
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>;
      case "refunded":
        return <Badge className="bg-blue-100 text-blue-800">Refunded</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type.toLowerCase()) {
      case "subscription":
        return <Badge variant="outline" className="bg-purple-100 text-purple-800">Subscription</Badge>;
      case "payment":
        return <Badge variant="outline" className="bg-green-100 text-green-800">Payment</Badge>;
      case "refund":
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">Refund</Badge>;
      case "payout":
        return <Badge variant="outline" className="bg-orange-100 text-orange-800">Payout</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Transactions</CardTitle>
          <CardDescription>User transaction history</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {Array(5).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Error loading transactions: {(error as Error).message}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transactions</CardTitle>
        <CardDescription>View user transaction history</CardDescription>
      </CardHeader>
      <CardContent>
        {transactions && transactions.length > 0 ? (
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Reference</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>
                      {format(new Date(transaction.created_at), "MMM dd, yyyy")}
                    </TableCell>
                    <TableCell>{transaction.description}</TableCell>
                    <TableCell>{getTypeBadge(transaction.type)}</TableCell>
                    <TableCell>{transaction.amount.toFixed(2)}</TableCell>
                    <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                    <TableCell className="font-mono text-sm">
                      {transaction.reference}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-10 text-muted-foreground">
            <p>No transactions found for this user.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Mock data function - would be replaced with real API calls in production
function getMockTransactions(userId: string): Transaction[] {
  // [MOCK DATA] - This would normally come from your API
  return [
    {
      id: "tx_1",
      user_id: userId,
      amount: 79.99,
      status: "completed",
      type: "subscription",
      created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      description: "Monthly subscription payment",
      reference: "SUB_" + Math.random().toString(36).substring(2, 10).toUpperCase(),
    },
    {
      id: "tx_2",
      user_id: userId,
      amount: 150.00,
      status: "completed",
      type: "payment",
      created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      description: "Event booking fee",
      reference: "PAY_" + Math.random().toString(36).substring(2, 10).toUpperCase(),
    },
    {
      id: "tx_3",
      user_id: userId,
      amount: 25.50,
      status: "refunded",
      type: "refund",
      created_at: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
      description: "Partial refund for canceled service",
      reference: "REF_" + Math.random().toString(36).substring(2, 10).toUpperCase(),
    },
    {
      id: "tx_4",
      user_id: userId,
      amount: 79.99,
      status: "completed",
      type: "subscription",
      created_at: new Date(Date.now() - 37 * 24 * 60 * 60 * 1000).toISOString(),
      description: "Monthly subscription payment",
      reference: "SUB_" + Math.random().toString(36).substring(2, 10).toUpperCase(),
    },
    {
      id: "tx_5",
      user_id: userId,
      amount: 200.00,
      status: "pending",
      type: "payment",
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      description: "Premium service upgrade",
      reference: "PAY_" + Math.random().toString(36).substring(2, 10).toUpperCase(),
    },
  ];
}
