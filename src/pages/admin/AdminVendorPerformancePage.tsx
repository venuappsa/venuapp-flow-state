
import React, { useState, useMemo } from 'react';
import AdminPanelLayout from '@/components/layouts/AdminPanelLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Link } from 'react-router-dom';
import { ChevronUp, ChevronDown, Download, Filter, Search, Star, X } from 'lucide-react';
import { format, subDays } from 'date-fns';

// Mock vendor performance data
const mockVendors = [
  {
    id: 'vendor-1',
    name: 'Elite Catering Services',
    eventsBooked: 12,
    avgRating: 4.8,
    profileCompletion: 100,
    revenue: 28750,
    category: 'Food & Beverage'
  },
  {
    id: 'vendor-2',
    name: 'Sound Masters DJ',
    eventsBooked: 8,
    avgRating: 4.9,
    profileCompletion: 95,
    revenue: 16000,
    category: 'Entertainment'
  },
  {
    id: 'vendor-3',
    name: 'Floral Fantasy Decorators',
    eventsBooked: 15,
    avgRating: 4.5,
    profileCompletion: 90,
    revenue: 22500,
    category: 'Decoration'
  },
  {
    id: 'vendor-4',
    name: 'Snap Perfect Photography',
    eventsBooked: 10,
    avgRating: 4.7,
    profileCompletion: 100,
    revenue: 20000,
    category: 'Photography'
  },
  {
    id: 'vendor-5',
    name: 'Elegant Venues',
    eventsBooked: 6,
    avgRating: 4.9,
    profileCompletion: 100,
    revenue: 45000,
    category: 'Venue'
  },
  {
    id: 'vendor-6',
    name: 'Sunrise Bakers',
    eventsBooked: 14,
    avgRating: 4.6,
    profileCompletion: 85,
    revenue: 18500,
    category: 'Food & Beverage'
  },
  {
    id: 'vendor-7',
    name: 'Tech Events AV',
    eventsBooked: 9,
    avgRating: 4.4,
    profileCompletion: 90,
    revenue: 31000,
    category: 'Equipment'
  },
  {
    id: 'vendor-8',
    name: 'Party Planners Pro',
    eventsBooked: 11,
    avgRating: 4.3,
    profileCompletion: 80,
    revenue: 27500,
    category: 'Event Planning'
  },
  {
    id: 'vendor-9',
    name: 'Luxe Linen Services',
    eventsBooked: 7,
    avgRating: 4.7,
    profileCompletion: 95,
    revenue: 14000,
    category: 'Decoration'
  },
  {
    id: 'vendor-10',
    name: 'Security Plus',
    eventsBooked: 5,
    avgRating: 4.8,
    profileCompletion: 90,
    revenue: 12500,
    category: 'Security'
  }
];

const categories = [
  'All Categories',
  'Food & Beverage',
  'Entertainment',
  'Decoration',
  'Photography',
  'Venue',
  'Equipment',
  'Event Planning',
  'Security'
];

export default function AdminVendorPerformancePage() {
  // State for filters and sort
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('All Categories');
  const [ratingThreshold, setRatingThreshold] = useState(3);
  const [sortField, setSortField] = useState('eventsBooked');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  // Handle sort changes
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };
  
  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('');
    setCategory('All Categories');
    setRatingThreshold(3);
  };
  
  // Filter and sort vendors
  const filteredVendors = useMemo(() => {
    let result = [...mockVendors];
    
    // Apply search filter
    if (searchQuery) {
      const lowerSearch = searchQuery.toLowerCase();
      result = result.filter(vendor => 
        vendor.name.toLowerCase().includes(lowerSearch)
      );
    }
    
    // Apply category filter
    if (category !== 'All Categories') {
      result = result.filter(vendor => vendor.category === category);
    }
    
    // Apply rating threshold filter
    result = result.filter(vendor => vendor.avgRating >= ratingThreshold);
    
    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0;
      
      if (sortField === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else {
        const aValue = a[sortField as keyof typeof a];
        const bValue = b[sortField as keyof typeof b];
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          comparison = aValue - bValue;
        }
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });
    
    return result;
  }, [searchQuery, category, ratingThreshold, sortField, sortDirection]);

  return (
    <AdminPanelLayout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Vendor Performance</h1>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Vendor Metrics</CardTitle>
          <CardDescription>
            Track and analyze vendor performance across the platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-6">
            {/* Search */}
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search vendors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            
            {/* Category Filter */}
            <div className="w-full sm:w-auto">
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Rating Threshold */}
            <div className="w-full sm:w-auto flex flex-col gap-1.5 min-w-[200px]">
              <div className="flex items-center justify-between">
                <Label htmlFor="rating-threshold" className="text-xs">
                  Min Rating ({ratingThreshold})
                </Label>
              </div>
              <div className="flex gap-2 items-center">
                <Slider
                  id="rating-threshold"
                  min={1}
                  max={5}
                  step={0.1}
                  value={[ratingThreshold]}
                  onValueChange={(values) => setRatingThreshold(values[0])}
                />
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-3.5 w-3.5 ${i < Math.floor(ratingThreshold) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                    />
                  ))}
                </div>
              </div>
            </div>
            
            {/* Clear Filters */}
            <div className="w-full sm:w-auto sm:ml-auto flex items-end">
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="mr-2 h-4 w-4" />
                Clear Filters
              </Button>
            </div>
          </div>
          
          {/* Results Count */}
          <div className="text-sm text-muted-foreground mb-4">
            Showing {filteredVendors.length} of {mockVendors.length} vendors
          </div>
          
          {/* Vendor Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[250px]">
                    <button 
                      className="flex items-center" 
                      onClick={() => handleSort('name')}
                    >
                      Vendor Name
                      {sortField === 'name' && (
                        sortDirection === 'asc' ? 
                          <ChevronUp className="ml-1 h-4 w-4" /> : 
                          <ChevronDown className="ml-1 h-4 w-4" />
                      )}
                    </button>
                  </TableHead>
                  <TableHead>
                    <button 
                      className="flex items-center" 
                      onClick={() => handleSort('eventsBooked')}
                    >
                      Events (30d)
                      {sortField === 'eventsBooked' && (
                        sortDirection === 'asc' ? 
                          <ChevronUp className="ml-1 h-4 w-4" /> : 
                          <ChevronDown className="ml-1 h-4 w-4" />
                      )}
                    </button>
                  </TableHead>
                  <TableHead>
                    <button 
                      className="flex items-center" 
                      onClick={() => handleSort('avgRating')}
                    >
                      Avg. Rating
                      {sortField === 'avgRating' && (
                        sortDirection === 'asc' ? 
                          <ChevronUp className="ml-1 h-4 w-4" /> : 
                          <ChevronDown className="ml-1 h-4 w-4" />
                      )}
                    </button>
                  </TableHead>
                  <TableHead>
                    <button 
                      className="flex items-center" 
                      onClick={() => handleSort('profileCompletion')}
                    >
                      Profile
                      {sortField === 'profileCompletion' && (
                        sortDirection === 'asc' ? 
                          <ChevronUp className="ml-1 h-4 w-4" /> : 
                          <ChevronDown className="ml-1 h-4 w-4" />
                      )}
                    </button>
                  </TableHead>
                  <TableHead>
                    <button 
                      className="flex items-center" 
                      onClick={() => handleSort('revenue')}
                    >
                      Revenue
                      {sortField === 'revenue' && (
                        sortDirection === 'asc' ? 
                          <ChevronUp className="ml-1 h-4 w-4" /> : 
                          <ChevronDown className="ml-1 h-4 w-4" />
                      )}
                    </button>
                  </TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVendors.map((vendor) => (
                  <TableRow key={vendor.id} className="cursor-pointer hover:bg-muted/50">
                    <TableCell className="font-medium">
                      <Link to={`/vendor/${vendor.id}/profile`} className="hover:underline">
                        {vendor.name}
                      </Link>
                    </TableCell>
                    <TableCell>{vendor.eventsBooked}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {vendor.avgRating}
                        <div className="flex items-center ml-2">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`h-3.5 w-3.5 ${i < Math.floor(vendor.avgRating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                            />
                          ))}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${vendor.profileCompletion >= 90 ? 'bg-green-500' : vendor.profileCompletion >= 70 ? 'bg-yellow-500' : 'bg-red-500'}`}
                            style={{ width: `${vendor.profileCompletion}%` }}
                          />
                        </div>
                        <span className="text-xs">{vendor.profileCompletion}%</span>
                      </div>
                    </TableCell>
                    <TableCell>${vendor.revenue.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{vendor.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" asChild>
                        <Link to={`/vendor/${vendor.id}/profile`}>
                          View
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                
                {filteredVendors.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      No vendors match the current filters
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </AdminPanelLayout>
  );
}
