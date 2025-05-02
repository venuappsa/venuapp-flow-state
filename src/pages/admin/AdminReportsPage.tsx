
import React, { useState } from 'react';
import AdminPanelLayout from '@/components/layouts/AdminPanelLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle, Download, FileDown, Filter, Loader2, CalendarIcon } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { format, subDays } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { DateRange } from "react-day-picker";

// Mock data for events
const mockEvents = [
  { 
    id: 'event-1', 
    name: 'Summer Wedding Fair',
    host: 'Emma Johnson', 
    vendor: 'Wedding Planners Inc',
    date: '2025-06-15',
    status: 'upcoming'
  },
  { 
    id: 'event-2', 
    name: 'Corporate Team Building',
    host: 'Tech Solutions Ltd', 
    vendor: 'Adventure Activities LLC',
    date: '2025-05-20',
    status: 'upcoming'
  },
  { 
    id: 'event-3', 
    name: 'Annual Charity Gala',
    host: 'Helping Hands Foundation', 
    vendor: 'Luxury Catering Co',
    date: '2025-04-10',
    status: 'completed'
  },
  { 
    id: 'event-4', 
    name: 'Music Festival',
    host: 'Rhythm Productions', 
    vendor: 'Sound & Stage Services',
    date: '2025-04-05',
    status: 'completed'
  },
  { 
    id: 'event-5', 
    name: 'Product Launch',
    host: 'Innovate Technologies', 
    vendor: 'Event Marketing Specialists',
    date: '2025-03-25',
    status: 'completed'
  },
];

// Mock data for quote requests
const mockQuoteRequests = [
  { 
    id: 'quote-1', 
    name: 'Wedding DJ Services',
    host: 'Sarah Parker', 
    vendor: 'Elite DJs',
    date: '2025-05-10',
    category: 'Entertainment',
    status: 'pending'
  },
  { 
    id: 'quote-2', 
    name: 'Corporate Catering',
    host: 'Global Corp', 
    vendor: 'Gourmet Catering',
    date: '2025-05-08',
    category: 'Food & Beverage',
    status: 'approved'
  },
  { 
    id: 'quote-3', 
    name: 'Event Photography',
    host: 'Jennifer Lewis', 
    vendor: 'Capture Moments',
    date: '2025-05-05',
    category: 'Photography',
    status: 'approved'
  },
  { 
    id: 'quote-4', 
    name: 'Venue Decoration',
    host: 'Wedding Bells', 
    vendor: 'Elegant Designs',
    date: '2025-05-02',
    category: 'Decoration',
    status: 'rejected'
  },
  { 
    id: 'quote-5', 
    name: 'Audio Equipment Rental',
    host: 'Conference Organizers Ltd', 
    vendor: 'Sound Solutions',
    date: '2025-04-28',
    category: 'Equipment',
    status: 'pending'
  },
];

// Categories for filtering
const eventCategories = ['All Categories', 'Wedding', 'Corporate', 'Festival', 'Charity', 'Concert', 'Conference'];
const quoteCategories = ['All Categories', 'Entertainment', 'Food & Beverage', 'Photography', 'Decoration', 'Equipment', 'Venue'];

export default function AdminReportsPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('events');
  
  // State for filters
  const [dateRange, setDateRange] = useState<DateRange>({
    from: subDays(new Date(), 30),
    to: new Date()
  });
  const [eventCategory, setEventCategory] = useState('All Categories');
  const [quoteCategory, setQuoteCategory] = useState('All Categories');
  const [isExporting, setIsExporting] = useState(false);
  const [dateOpen, setDateOpen] = useState(false);

  // Handle CSV export
  const handleExport = () => {
    setIsExporting(true);
    
    // Simulate export process
    setTimeout(() => {
      setIsExporting(false);
      
      // Create CSV content
      const data = activeTab === 'events' ? mockEvents : mockQuoteRequests;
      const headers = Object.keys(data[0]).join(',');
      const rows = data.map(item => Object.values(item).join(',')).join('\n');
      const csvContent = `${headers}\n${rows}`;
      
      // Create and download the file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `${activeTab}_report_${format(new Date(), 'yyyy-MM-dd')}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Export successful",
        description: `${activeTab === 'events' ? 'Events' : 'Quote Requests'} data has been exported to CSV.`,
      });
    }, 1500);
  };

  // Format date range for display
  const formatDateRange = () => {
    if (dateRange.from && dateRange.to) {
      return `${format(dateRange.from, 'MMM dd, yyyy')} - ${format(dateRange.to, 'MMM dd, yyyy')}`;
    }
    return "Select a date range";
  };

  // Handle date range change with type safety
  const handleDateRangeChange = (range: DateRange | undefined) => {
    if (range) {
      setDateRange(range);
      if (range.from && range.to) {
        setDateOpen(false);
      }
    }
  };

  return (
    <AdminPanelLayout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Report & Export Center</h1>
      </div>
      
      <Tabs defaultValue="events" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="events">Export Events</TabsTrigger>
          <TabsTrigger value="quotes">Export Quote Requests</TabsTrigger>
        </TabsList>
        
        <Card>
          <CardHeader>
            <CardTitle>{activeTab === 'events' ? 'Events Report' : 'Quote Requests Report'}</CardTitle>
            <CardDescription>
              Generate and download reports for {activeTab === 'events' ? 'events' : 'quote requests'}.
              Apply filters below to customize your report.
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              {/* Date Range Picker */}
              <div className="w-full sm:w-1/2">
                <label className="block text-sm font-medium text-muted-foreground mb-1">Date Range</label>
                <Popover open={dateOpen} onOpenChange={setDateOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formatDateRange()}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={dateRange.from}
                      selected={dateRange}
                      onSelect={handleDateRangeChange}
                      numberOfMonths={2}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              {/* Category Filter */}
              <div className="w-full sm:w-1/2">
                <label className="block text-sm font-medium text-muted-foreground mb-1">Category</label>
                <Select 
                  value={activeTab === 'events' ? eventCategory : quoteCategory} 
                  onValueChange={activeTab === 'events' ? setEventCategory : setQuoteCategory}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {(activeTab === 'events' ? eventCategories : quoteCategories).map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Table Preview */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>{activeTab === 'events' ? 'Host' : 'Requester'}</TableHead>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Date</TableHead>
                    {activeTab === 'quotes' && <TableHead>Category</TableHead>}
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(activeTab === 'events' ? mockEvents : mockQuoteRequests).map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{item.host}</TableCell>
                      <TableCell>{item.vendor}</TableCell>
                      <TableCell>{format(new Date(item.date), 'MMM dd, yyyy')}</TableCell>
                      {activeTab === 'quotes' && (
                        <TableCell>{(item as any).category}</TableCell>
                      )}
                      <TableCell>
                        <StatusBadge status={(item as any).status} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-between">
            <div className="text-sm text-muted-foreground">
              Showing {activeTab === 'events' ? mockEvents.length : mockQuoteRequests.length} records
            </div>
            <Button onClick={handleExport} disabled={isExporting}>
              {isExporting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <FileDown className="mr-2 h-4 w-4" />
                  Export as CSV
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </Tabs>
    </AdminPanelLayout>
  );
}

// Status badge component
const StatusBadge = ({ status }: { status: string }) => {
  let variant: "default" | "secondary" | "destructive" | "outline" = "default";
  
  switch (status) {
    case 'upcoming':
      variant = "default";
      break;
    case 'completed':
      variant = "secondary";
      break;
    case 'pending':
      variant = "outline";
      break;
    case 'approved':
      variant = "default";
      break;
    case 'rejected':
      variant = "destructive";
      break;
  }
  
  return (
    <Badge variant={variant}>{status}</Badge>
  );
};
