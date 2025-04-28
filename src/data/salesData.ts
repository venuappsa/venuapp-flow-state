
import { SalesData } from "@/components/SalesBreakdownDialog";

// Generate mock transaction data for a given event
const generateMockTransactions = (eventId: string, eventName: string) => {
  const types = ["ticketSales", "merchantFees", "commission", "foodAndDrinks", "other"] as const;
  const transactionCount = Math.floor(Math.random() * 10) + 5; // 5-15 transactions
  
  const transactions = Array.from({ length: transactionCount }, (_, i) => {
    const type = types[Math.floor(Math.random() * types.length)];
    const amount = Math.floor(Math.random() * 5000) + 500;
    const daysAgo = Math.floor(Math.random() * 30);
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    
    let description = '';
    switch(type) {
      case 'ticketSales':
        description = `Tickets sold for ${eventName}`;
        break;
      case 'merchantFees':
        description = `Vendor setup fees for ${eventName}`;
        break;
      case 'commission':
        description = `Sales commission from vendors`;
        break;
      case 'foodAndDrinks':
        description = `Food & beverage sales`;
        break;
      case 'other':
        description = `Miscellaneous revenue`;
        break;
    }
    
    return {
      id: `trans-${eventId}-${i}`,
      type,
      description,
      amount,
      date: date.toISOString(),
    };
  });
  
  return transactions;
};

// Generate detailed sales data for events
export const generateEventSalesData = (eventId: string, eventName: string, totalRevenue: number): SalesData => {
  // Generate random breakdown percentages
  const ticketPercentage = Math.random() * 0.4 + 0.4; // 40-80%
  const merchantPercentage = Math.random() * 0.15; // 0-15%
  const commissionPercentage = Math.random() * 0.15; // 0-15%
  const foodPercentage = Math.random() * 0.20; // 0-20%
  const otherPercentage = 1 - ticketPercentage - merchantPercentage - commissionPercentage - foodPercentage;
  
  const ticketSales = Math.floor(totalRevenue * ticketPercentage);
  const merchantFees = Math.floor(totalRevenue * merchantPercentage);
  const commission = Math.floor(totalRevenue * commissionPercentage);
  const foodAndDrinks = Math.floor(totalRevenue * foodPercentage);
  const other = totalRevenue - ticketSales - merchantFees - commission - foodAndDrinks;
  
  const transactions = generateMockTransactions(eventId, eventName);
  
  return {
    eventId,
    eventName,
    total: totalRevenue,
    breakdown: {
      ticketSales,
      merchantFees,
      commission,
      foodAndDrinks,
      other,
    },
    transactions,
  };
};
