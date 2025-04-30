
export interface Transaction {
  id: string;
  eventId: string;
  eventName: string;
  vendorId: string;
  vendorName: string;
  amount: number;
  status: 'paid' | 'pending' | 'refunded' | 'failed';
  date: string;
  description: string;
}

export interface VendorPayout {
  id: string;
  vendorId: string;
  vendorName: string;
  amount: number;
  status: 'paid' | 'pending';
  date: string;
  accountDetails: string;
  eventCount: number;
}

export interface FinancialStats {
  totalRevenue: number;
  pendingPayments: number;
  paidToVendors: number;
  outstandingInvoices: number;
  monthlyGrowth: number;
  yearToDateIncome: number;
}

export const mockTransactions: Transaction[] = [
  {
    id: 'tr1',
    eventId: 'ev1',
    eventName: 'Summer Food Festival',
    vendorId: 'v1',
    vendorName: 'Gourmet Delights',
    amount: 3250,
    status: 'paid',
    date: '2025-04-15',
    description: 'Event booking payment'
  },
  {
    id: 'tr2',
    eventId: 'ev2',
    eventName: 'Wine & Jazz Night',
    vendorId: 'v2',
    vendorName: 'Vino Experts',
    amount: 1750,
    status: 'pending',
    date: '2025-04-18',
    description: 'Event booking deposit'
  },
  {
    id: 'tr3',
    eventId: 'ev3',
    eventName: 'Corporate Workshop',
    vendorId: 'v3',
    vendorName: 'Business Catering Co',
    amount: 5300,
    status: 'paid',
    date: '2025-04-10',
    description: 'Full event payment'
  },
  {
    id: 'tr4',
    eventId: 'ev1',
    eventName: 'Summer Food Festival',
    vendorId: 'v4',
    vendorName: 'Artisanal Breads',
    amount: 860,
    status: 'paid',
    date: '2025-04-12',
    description: 'Vendor booth fee'
  },
  {
    id: 'tr5',
    eventId: 'ev4',
    eventName: 'Weekend Market',
    vendorId: 'v5',
    vendorName: 'Farm Fresh Produce',
    amount: 450,
    status: 'failed',
    date: '2025-04-05',
    description: 'Payment failed - insufficient funds'
  },
  {
    id: 'tr6',
    eventId: 'ev2',
    eventName: 'Wine & Jazz Night',
    vendorId: 'v6',
    vendorName: 'Cheese Specialists',
    amount: 925,
    status: 'pending',
    date: '2025-04-20',
    description: 'Pending approval'
  },
  {
    id: 'tr7',
    eventId: 'ev5',
    eventName: 'Art & Craft Fair',
    vendorId: 'v7',
    vendorName: 'Handmade Pottery',
    amount: 780,
    status: 'refunded',
    date: '2025-03-28',
    description: 'Refunded - event cancelled'
  },
  {
    id: 'tr8',
    eventId: 'ev3',
    eventName: 'Corporate Workshop',
    vendorId: 'v8',
    vendorName: 'Coffee Caterers',
    amount: 1200,
    status: 'paid',
    date: '2025-04-09',
    description: 'Coffee service payment'
  }
];

export const mockPayouts: VendorPayout[] = [
  {
    id: 'p1',
    vendorId: 'v1',
    vendorName: 'Gourmet Delights',
    amount: 2950,
    status: 'paid',
    date: '2025-04-18',
    accountDetails: 'Bank transfer ****1234',
    eventCount: 3
  },
  {
    id: 'p2',
    vendorId: 'v2',
    vendorName: 'Vino Experts',
    amount: 1600,
    status: 'pending',
    date: '2025-04-25',
    accountDetails: 'PayPal account',
    eventCount: 1
  },
  {
    id: 'p3',
    vendorId: 'v3',
    vendorName: 'Business Catering Co',
    amount: 4800,
    status: 'paid',
    date: '2025-04-15',
    accountDetails: 'Bank transfer ****5678',
    eventCount: 2
  },
  {
    id: 'p4',
    vendorId: 'v4',
    vendorName: 'Artisanal Breads',
    amount: 780,
    status: 'pending',
    date: '2025-04-22',
    accountDetails: 'Awaiting bank details',
    eventCount: 1
  },
  {
    id: 'p5',
    vendorId: 'v6',
    vendorName: 'Cheese Specialists',
    amount: 850,
    status: 'pending',
    date: '2025-04-28',
    accountDetails: 'Bank transfer ****9012',
    eventCount: 1
  },
  {
    id: 'p6',
    vendorId: 'v8',
    vendorName: 'Coffee Caterers',
    amount: 1080,
    status: 'paid',
    date: '2025-04-14',
    accountDetails: 'PayPal account',
    eventCount: 2
  }
];

export const mockFinancialStats: FinancialStats = {
  totalRevenue: 152450,
  pendingPayments: 23890,
  paidToVendors: 67320,
  outstandingInvoices: 18540,
  monthlyGrowth: 12.8,
  yearToDateIncome: 324780
};
