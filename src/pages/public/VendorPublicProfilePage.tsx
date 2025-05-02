
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Mail, Phone, Globe, Star, Clock, Calendar, UserPlus, ShieldCheck } from "lucide-react";
import { useUser } from "@/hooks/useUser";
import { useUserRoles } from "@/hooks/useUserRoles";
import { VendorProfile } from "@/types/vendor";
import HostInviteModal from "@/components/host/HostInviteModal";

// Mock vendor data - in a real app, fetch from your API
const mockVendors: Partial<VendorProfile>[] = [
  {
    id: "v1",
    user_id: "user1",
    business_name: "Gourmet Delights Catering",
    company_name: "Gourmet Delights (Pty) Ltd",
    business_category: "Food",
    contact_name: "John Smith",
    contact_email: "john@gourmetdelights.co.za",
    contact_phone: "+27 82 555 1234",
    address: "123 Main Street",
    city: "Cape Town",
    state: "Western Cape",
    country: "South Africa",
    description: "Premium catering service specializing in gourmet meals for corporate events and weddings.",
    logo_url: "https://images.unsplash.com/photo-1551218808-94e220e084d2?q=80&w=1400&auto=format&fit=crop",
    website: "https://gourmetdelights.co.za",
    verification_status: "verified"
  },
  {
    id: "v2",
    user_id: "user2",
    business_name: "Sound Systems Pro",
    company_name: "Sound Systems Pro CC",
    business_category: "Audio Equipment",
    contact_name: "Sarah Johnson",
    contact_email: "sarah@soundsystemspro.co.za",
    contact_phone: "+27 83 777 5678",
    address: "45 Tech Avenue",
    city: "Johannesburg",
    state: "Gauteng",
    country: "South Africa",
    description: "Professional sound systems and equipment rental for events of all sizes.",
    logo_url: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1400&auto=format&fit=crop",
    website: "https://soundsystemspro.co.za",
    verification_status: "pending"
  }
];

// Mock services offered
const mockServices = [
  {
    id: "s1",
    vendor_id: "v1",
    name: "Full Service Catering",
    description: "Complete catering service including setup, service, and cleanup",
    price: 350,
    price_unit: "per person"
  },
  {
    id: "s2",
    vendor_id: "v1",
    name: "Cocktail Reception",
    description: "Hors d'oeuvres and drinks for social gatherings",
    price: 200,
    price_unit: "per person"
  },
  {
    id: "s3",
    vendor_id: "v2",
    name: "Basic Sound System",
    description: "PA system suitable for small venues up to 100 people",
    price: 2500,
    price_unit: "per day"
  },
  {
    id: "s4",
    vendor_id: "v2",
    name: "Complete Event Sound",
    description: "Full sound solution with technician for large events",
    price: 8500,
    price_unit: "per day"
  }
];

// Mock reviews
const mockReviews = [
  {
    id: "r1",
    vendor_id: "v1",
    author: "Event Organizer Co.",
    rating: 4.8,
    comment: "Excellent food and service. Our guests were impressed with the quality and presentation.",
    date: "2025-04-10"
  },
  {
    id: "r2",
    vendor_id: "v1",
    author: "Corporate Events Ltd",
    rating: 4.5,
    comment: "Great catering for our corporate function. Would recommend for business events.",
    date: "2025-03-22"
  },
  {
    id: "r3",
    vendor_id: "v2",
    author: "Festival Productions",
    rating: 5.0,
    comment: "Top notch sound equipment and very professional team. Made our event a success.",
    date: "2025-04-05"
  }
];

export default function VendorPublicProfilePage() {
  const { vendorId } = useParams<{ vendorId: string }>();
  const { user } = useUser();
  const { data: userRoles = [] } = useUserRoles(user?.id);
  const { toast } = useToast();
  const [vendor, setVendor] = useState<Partial<VendorProfile> | null>(null);
  const [services, setServices] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [inviteModalOpen, setInviteModalOpen] = useState<boolean>(false);
  
  // Is the current user a host?
  const isHost = userRoles.includes('host');

  useEffect(() => {
    // Fetch vendor data
    setLoading(true);
    
    // Simulate API fetch with timeout
    setTimeout(() => {
      const foundVendor = mockVendors.find(v => v.id === vendorId);
      
      if (foundVendor) {
        setVendor(foundVendor);
        
        // Get related services
        const vendorServices = mockServices.filter(s => s.vendor_id === vendorId);
        setServices(vendorServices);
        
        // Get related reviews
        const vendorReviews = mockReviews.filter(r => r.vendor_id === vendorId);
        setReviews(vendorReviews);
      } else {
        toast({
          title: "Vendor Not Found",
          description: "The vendor profile you're looking for doesn't exist",
          variant: "destructive",
        });
      }
      
      setLoading(false);
    }, 1000);
  }, [vendorId, toast]);
  
  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-100 animate-pulse h-64 rounded-lg mb-6"></div>
          <div className="bg-gray-100 animate-pulse h-8 w-1/2 rounded mb-4"></div>
          <div className="bg-gray-100 animate-pulse h-4 w-3/4 rounded mb-2"></div>
          <div className="bg-gray-100 animate-pulse h-4 w-2/3 rounded"></div>
        </div>
      </div>
    );
  }
  
  if (!vendor) {
    return (
      <div className="container mx-auto py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Vendor Not Found</h1>
        <p className="mb-4">The vendor profile you're looking for doesn't exist or has been removed.</p>
        <Link to="/vendors">
          <Button>Browse All Vendors</Button>
        </Link>
      </div>
    );
  }

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0;

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
          <div className="h-48 bg-gradient-to-r from-venu-purple to-venu-dark-purple relative">
            {vendor.logo_url && (
              <div className="absolute bottom-0 left-8 transform translate-y-1/2 bg-white rounded-full p-1 shadow-md">
                <img 
                  src={vendor.logo_url} 
                  alt={vendor.business_name || "Vendor"} 
                  className="w-24 h-24 rounded-full object-cover"
                />
              </div>
            )}
            {vendor.verification_status === "verified" && (
              <div className="absolute top-4 right-4 bg-white rounded-full p-2">
                <ShieldCheck className="w-6 h-6 text-green-600" />
              </div>
            )}
          </div>
          
          <div className="pt-16 pb-6 px-8">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-2xl font-bold">{vendor.business_name || vendor.company_name}</h1>
                <p className="text-gray-600">{vendor.business_category}</p>
              </div>
              
              {user && isHost && (
                <Button 
                  onClick={() => setInviteModalOpen(true)}
                  className="flex items-center gap-2"
                >
                  <UserPlus className="w-4 h-4" />
                  Invite to Event
                </Button>
              )}
            </div>
            
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6 text-sm mb-6">
              {vendor.city && (
                <div className="flex items-center gap-1 text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>{vendor.city}, {vendor.state}</span>
                </div>
              )}
              
              {vendor.contact_email && (
                <div className="flex items-center gap-1 text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span>{vendor.contact_email}</span>
                </div>
              )}
              
              {vendor.contact_phone && (
                <div className="flex items-center gap-1 text-gray-600">
                  <Phone className="w-4 h-4" />
                  <span>{vendor.contact_phone}</span>
                </div>
              )}
              
              {vendor.website && (
                <div className="flex items-center gap-1 text-gray-600">
                  <Globe className="w-4 h-4" />
                  <a href={vendor.website} target="_blank" rel="noopener noreferrer" className="hover:text-venu-purple">
                    Website
                  </a>
                </div>
              )}
            </div>
            
            <div className="flex gap-4 mb-6">
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                <span className="font-medium">{averageRating.toFixed(1)}</span>
                <span className="text-gray-500">({reviews.length} reviews)</span>
              </div>
              
              <div className="flex items-center gap-1">
                <Calendar className="w-5 h-5 text-blue-500" />
                <span className="text-gray-600">Available for bookings</span>
              </div>
            </div>
            
            {vendor.description && (
              <div className="border-t pt-4">
                <p className="text-gray-700">{vendor.description}</p>
              </div>
            )}
          </div>
        </div>
        
        <Tabs defaultValue="services" className="mb-6">
          <TabsList className="mb-4">
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
          </TabsList>
          
          <TabsContent value="services" className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Services Offered</h2>
            {services.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {services.map((service) => (
                  <Card key={service.id} className="overflow-hidden">
                    <CardHeader className="pb-3">
                      <CardTitle>{service.name}</CardTitle>
                      <CardDescription>{service.description}</CardDescription>
                    </CardHeader>
                    <CardFooter className="flex justify-between pt-1">
                      <span className="font-medium">R {service.price.toLocaleString()}</span>
                      <span className="text-gray-500">{service.price_unit}</span>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No services listed yet.</p>
            )}
          </TabsContent>
          
          <TabsContent value="reviews">
            <h2 className="text-xl font-semibold mb-4">Customer Reviews</h2>
            {reviews.length > 0 ? (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <Card key={review.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{review.author}</CardTitle>
                        <div className="flex items-center">
                          <span className="font-medium mr-1">{review.rating.toFixed(1)}</span>
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        </div>
                      </div>
                      <CardDescription>{new Date(review.date).toLocaleDateString()}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p>{review.comment}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No reviews yet.</p>
            )}
          </TabsContent>
          
          <TabsContent value="about">
            <h2 className="text-xl font-semibold mb-4">About {vendor.business_name || vendor.company_name}</h2>
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {vendor.description && (
                    <div>
                      <h3 className="font-medium mb-2">Business Description</h3>
                      <p className="text-gray-700">{vendor.description}</p>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-medium mb-2">Contact Information</h3>
                      <ul className="space-y-2 text-gray-700">
                        {vendor.contact_name && (
                          <li className="flex items-start gap-2">
                            <span className="font-medium w-24">Contact:</span>
                            <span>{vendor.contact_name}</span>
                          </li>
                        )}
                        {vendor.contact_email && (
                          <li className="flex items-start gap-2">
                            <span className="font-medium w-24">Email:</span>
                            <span>{vendor.contact_email}</span>
                          </li>
                        )}
                        {vendor.contact_phone && (
                          <li className="flex items-start gap-2">
                            <span className="font-medium w-24">Phone:</span>
                            <span>{vendor.contact_phone}</span>
                          </li>
                        )}
                        {vendor.website && (
                          <li className="flex items-start gap-2">
                            <span className="font-medium w-24">Website:</span>
                            <a href={vendor.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                              {vendor.website}
                            </a>
                          </li>
                        )}
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-2">Location</h3>
                      <ul className="space-y-2 text-gray-700">
                        {vendor.address && (
                          <li className="flex items-start gap-2">
                            <span className="font-medium w-24">Address:</span>
                            <span>{vendor.address}</span>
                          </li>
                        )}
                        {vendor.city && (
                          <li className="flex items-start gap-2">
                            <span className="font-medium w-24">City:</span>
                            <span>{vendor.city}</span>
                          </li>
                        )}
                        {vendor.state && (
                          <li className="flex items-start gap-2">
                            <span className="font-medium w-24">Province:</span>
                            <span>{vendor.state}</span>
                          </li>
                        )}
                        {vendor.country && (
                          <li className="flex items-start gap-2">
                            <span className="font-medium w-24">Country:</span>
                            <span>{vendor.country}</span>
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Business Details</h3>
                    <div className="flex items-center gap-2">
                      <Badge variant={vendor.verification_status === "verified" ? "success" : "outline"}>
                        {vendor.verification_status === "verified" ? "Verified Business" : "Verification Pending"}
                      </Badge>
                      <Badge variant="outline">{vendor.business_category || "General"}</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      {vendor && (
        <HostInviteModal
          isOpen={inviteModalOpen}
          onClose={() => setInviteModalOpen(false)}
          vendorProfile={vendor as VendorProfile}
        />
      )}
    </div>
  );
}
