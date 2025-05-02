
import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Check, ChevronLeft, MapPin, Star, FileText, Calendar, Users, Clock, MessagesSquare } from "lucide-react";
import { useNotifications } from "@/contexts/NotificationContext";

// Mock vendor data
const mockVendors = [
  {
    id: "v1",
    name: "African Cuisine Caterers",
    description: "Authentic African cuisine for all your events. We specialize in traditional dishes with a modern twist.",
    longDescription: "African Cuisine Caterers brings the rich flavors of African cuisine to your events. With over 15 years of experience, our team of professional chefs creates memorable dining experiences for weddings, corporate functions, birthdays, and more. We source local ingredients to prepare authentic dishes that showcase the diverse culinary traditions across the African continent.",
    category: "Food & Beverage",
    rating: 4.8,
    location: "Johannesburg",
    address: "123 Market Street, Sandton, Johannesburg",
    phone: "+27 11 123 4567",
    email: "info@africancuisinecaterers.co.za",
    website: "www.africancuisinecaterers.co.za",
    founded: 2008,
    employees: "10-50",
    operatingHours: "Mon-Sat: 8:00-18:00",
    tags: ["Catering", "African Food", "Buffet"],
    services: [
      { name: "Full-Service Catering", price: "R250 per person" },
      { name: "Drop-off Catering", price: "R150 per person" },
      { name: "Food Stations", price: "Starting at R5,000" },
      { name: "Bar Service", price: "Starting at R3,500" },
    ],
    images: [
      "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&q=80&w=1200&h=800",
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80&w=1200&h=800",
      "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?auto=format&fit=crop&q=80&w=1200&h=800",
    ],
    reviews: [
      { id: "r1", author: "Sarah M.", rating: 5, text: "Amazing food and service! Everyone at our wedding loved the catering.", date: "2023-09-15" },
      { id: "r2", author: "Michael K.", rating: 4, text: "Great selection of dishes and very accommodating with dietary requests.", date: "2023-08-22" },
      { id: "r3", author: "Thabo N.", rating: 5, text: "The flavors were authentic and the presentation was beautiful. Highly recommend!", date: "2023-07-30" },
    ],
  },
  {
    id: "v2",
    name: "Sound Masters",
    description: "Professional sound and lighting services for events of all sizes. Top-quality equipment and experienced technicians.",
    longDescription: "Sound Masters is the premier audio-visual service provider for events across South Africa. Our team of experienced technicians deliver exceptional sound and lighting solutions tailored to your specific requirements. From intimate gatherings to large-scale productions, we have the expertise and equipment to ensure your event sounds and looks perfect.",
    category: "Audio & Visual",
    rating: 4.5,
    location: "Cape Town",
    address: "45 Long Street, Cape Town City Center",
    phone: "+27 21 987 6543",
    email: "bookings@soundmasters.co.za",
    website: "www.soundmasters.co.za",
    founded: 2012,
    employees: "10-50",
    operatingHours: "Mon-Sun: 7:00-22:00",
    tags: ["Sound", "Lighting", "DJ"],
    services: [
      { name: "Sound System Rental", price: "Starting at R2,500" },
      { name: "Professional DJ Services", price: "R5,000 per event" },
      { name: "Stage Lighting", price: "Starting at R3,500" },
      { name: "Technical Support", price: "R450 per hour" },
    ],
    images: [
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=1200&h=800",
      "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&q=80&w=1200&h=800",
      "https://images.unsplash.com/photo-1504680177321-2e6a879aac86?auto=format&fit=crop&q=80&w=1200&h=800",
    ],
    reviews: [
      { id: "r1", author: "James B.", rating: 5, text: "Excellent service and top-notch equipment. Made our corporate event a success.", date: "2023-10-05" },
      { id: "r2", author: "Lisa P.", rating: 4, text: "Great sound quality and very professional staff.", date: "2023-09-12" },
      { id: "r3", author: "David M.", rating: 4, text: "Reliable and knowledgeable team. Would use again.", date: "2023-08-28" },
    ],
  },
  // ... remaining mock vendor data
];

export default function VendorProfilePage() {
  const { id } = useParams<{ id: string }>();
  const [vendor, setVendor] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quoteFormOpen, setQuoteFormOpen] = useState(false);
  const [quoteForm, setQuoteForm] = useState({
    name: "",
    email: "",
    eventType: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addNotification, sendEmail } = useNotifications();

  useEffect(() => {
    // Simulate API call to fetch vendor data
    setIsLoading(true);
    setTimeout(() => {
      const foundVendor = mockVendors.find((v) => v.id === id);
      setVendor(foundVendor);
      setIsLoading(false);
    }, 500);
  }, [id]);

  const handleQuoteFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setQuoteForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleQuoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setQuoteFormOpen(false);
      setQuoteForm({
        name: "",
        email: "",
        eventType: "",
        message: "",
      });

      // Show success notification
      addNotification({
        title: "Quote Requested",
        message: `Your quote request has been sent to ${vendor?.name}.`,
        type: "success",
      });

      // Mock email sending
      sendEmail(
        quoteForm.email,
        `Quote Request Confirmation - ${vendor?.name}`,
        `Thank you for requesting a quote from ${vendor?.name}. They will be in touch with you shortly.`
      );

      // Mock email to vendor
      sendEmail(
        vendor?.email,
        "New Quote Request",
        `You have received a new quote request from ${quoteForm.name} for a ${quoteForm.eventType} event.`
      );
    }, 1500);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 w-48 bg-gray-200 rounded mb-4"></div>
              <div className="h-64 bg-gray-200 rounded-lg mb-6"></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <div className="h-10 w-3/4 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                </div>
                <div>
                  <div className="h-12 bg-gray-200 rounded mb-4"></div>
                  <div className="h-48 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold mb-4">Vendor Not Found</h1>
          <p className="text-gray-600 mb-6">The vendor you're looking for doesn't exist or has been removed.</p>
          <Link to="/vendors">
            <Button>Browse All Vendors</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center">
              <img
                src="/lovable-uploads/c8628e28-1db7-453f-b8d6-13301457b8dc.png"
                alt="Venuapp Logo"
                className="h-10 w-10"
              />
              <span className="ml-2 text-xl font-bold text-venu-orange">Venuapp</span>
            </Link>
            <nav className="hidden md:flex space-x-6">
              <Link to="/" className="text-gray-600 hover:text-venu-orange">Home</Link>
              <Link to="/vendors" className="text-venu-orange font-medium">Vendors</Link>
              <Link to="/about" className="text-gray-600 hover:text-venu-orange">About</Link>
              <Link to="/contact" className="text-gray-600 hover:text-venu-orange">Contact</Link>
            </nav>
            <div>
              <Link to="/auth">
                <Button variant="outline">Sign In</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Back Link */}
      <div className="container mx-auto px-4 py-6">
        <Link to="/vendors" className="inline-flex items-center text-gray-600 hover:text-venu-orange">
          <ChevronLeft className="h-4 w-4 mr-1" /> Back to Vendors
        </Link>
      </div>

      <div className="container mx-auto px-4 pb-16">
        <div className="max-w-6xl mx-auto">
          {/* Main Image Gallery */}
          <div className="mb-8">
            <div className="relative h-96 rounded-lg overflow-hidden">
              <img
                src={vendor.images[activeImageIndex]}
                alt={vendor.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex space-x-2 mt-2 overflow-x-auto pb-2">
              {vendor.images.map((image: string, index: number) => (
                <div
                  key={index}
                  className={`w-24 h-16 rounded overflow-hidden cursor-pointer ${
                    activeImageIndex === index ? "ring-2 ring-venu-orange" : ""
                  }`}
                  onClick={() => setActiveImageIndex(index)}
                >
                  <img
                    src={image}
                    alt={`${vendor.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left Content */}
            <div className="md:col-span-2">
              <div className="mb-6">
                <h1 className="text-3xl font-bold mb-2">{vendor.name}</h1>
                <div className="flex items-center gap-4 text-gray-600 mb-4">
                  <div className="flex items-center">
                    <Star className="h-5 w-5 text-yellow-400 fill-yellow-400 mr-1" />
                    <span className="font-medium">{vendor.rating}</span>
                    <span className="text-gray-400 ml-1">({vendor.reviews.length} reviews)</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{vendor.location}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                  {vendor.tags.map((tag: string) => (
                    <Badge key={tag} variant="outline">{tag}</Badge>
                  ))}
                </div>

                <p className="text-gray-700 mb-6">{vendor.longDescription}</p>
              </div>

              <Tabs defaultValue="services">
                <TabsList className="mb-6">
                  <TabsTrigger value="services">
                    <FileText className="h-4 w-4 mr-2" /> Services
                  </TabsTrigger>
                  <TabsTrigger value="reviews">
                    <MessagesSquare className="h-4 w-4 mr-2" /> Reviews
                  </TabsTrigger>
                  <TabsTrigger value="about">
                    <Users className="h-4 w-4 mr-2" /> About
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="services" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Services Offered</CardTitle>
                      <CardDescription>Available services and starting prices</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {vendor.services.map((service: any, index: number) => (
                          <div key={index} className="flex justify-between pb-4 border-b last:border-0 last:pb-0">
                            <div>
                              <h3 className="font-medium">{service.name}</h3>
                            </div>
                            <div className="font-medium">{service.price}</div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="reviews">
                  <Card>
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <div>
                          <CardTitle>Customer Reviews</CardTitle>
                          <CardDescription>See what others are saying</CardDescription>
                        </div>
                        <div className="flex items-center bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">
                          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                          <span className="font-medium">{vendor.rating}</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {vendor.reviews.map((review: any) => (
                          <div key={review.id} className="pb-6 border-b last:border-0 last:pb-0">
                            <div className="flex justify-between items-center mb-2">
                              <h3 className="font-medium">{review.author}</h3>
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${
                                      i < review.rating
                                        ? "text-yellow-400 fill-yellow-400"
                                        : "text-gray-300"
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="text-gray-600 mb-1">{review.text}</p>
                            <p className="text-xs text-gray-400">{review.date}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="about">
                  <Card>
                    <CardHeader>
                      <CardTitle>About {vendor.name}</CardTitle>
                      <CardDescription>Business information and contact details</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 mb-1">Address</h3>
                          <p>{vendor.address}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 mb-1">Phone</h3>
                          <p>{vendor.phone}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 mb-1">Email</h3>
                          <p>{vendor.email}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 mb-1">Website</h3>
                          <p>{vendor.website}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 mb-1">Founded</h3>
                          <p>{vendor.founded}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 mb-1">Employees</h3>
                          <p>{vendor.employees}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 mb-1">Operating Hours</h3>
                          <p>{vendor.operatingHours}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Right Sidebar */}
            <div>
              <div className="sticky top-8 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Request a Quote</CardTitle>
                    <CardDescription>Get pricing information for your event</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Dialog open={quoteFormOpen} onOpenChange={setQuoteFormOpen}>
                      <DialogTrigger asChild>
                        <Button className="w-full">Request Quote</Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <form onSubmit={handleQuoteSubmit}>
                          <DialogHeader>
                            <DialogTitle>Request a Quote</DialogTitle>
                            <DialogDescription>
                              Fill out the form below to request pricing from {vendor.name}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="name" className="text-right">
                                Name
                              </Label>
                              <Input
                                id="name"
                                name="name"
                                value={quoteForm.name}
                                onChange={handleQuoteFormChange}
                                className="col-span-3"
                                required
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="email" className="text-right">
                                Email
                              </Label>
                              <Input
                                id="email"
                                name="email"
                                type="email"
                                value={quoteForm.email}
                                onChange={handleQuoteFormChange}
                                className="col-span-3"
                                required
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="eventType" className="text-right">
                                Event Type
                              </Label>
                              <select
                                id="eventType"
                                name="eventType"
                                value={quoteForm.eventType}
                                onChange={handleQuoteFormChange}
                                className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                required
                              >
                                <option value="">Select an event type</option>
                                <option value="Wedding">Wedding</option>
                                <option value="Corporate">Corporate</option>
                                <option value="Birthday">Birthday</option>
                                <option value="Festival">Festival</option>
                                <option value="Other">Other</option>
                              </select>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="message" className="text-right">
                                Message
                              </Label>
                              <Textarea
                                id="message"
                                name="message"
                                value={quoteForm.message}
                                onChange={handleQuoteFormChange}
                                className="col-span-3"
                                placeholder="Tell us about your event requirements"
                                required
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button type="submit" disabled={isSubmitting}>
                              {isSubmitting ? (
                                <>
                                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-t-transparent"></div>
                                  Submitting...
                                </>
                              ) : (
                                "Submit Request"
                              )}
                            </Button>
                          </DialogFooter>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex">
                      <div className="w-24 flex-shrink-0 text-gray-500">Phone:</div>
                      <div>{vendor.phone}</div>
                    </div>
                    <div className="flex">
                      <div className="w-24 flex-shrink-0 text-gray-500">Email:</div>
                      <div>{vendor.email}</div>
                    </div>
                    <div className="flex">
                      <div className="w-24 flex-shrink-0 text-gray-500">Website:</div>
                      <div>{vendor.website}</div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Business Hours</CardTitle>
                  </CardHeader>
                  <CardContent className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-gray-500" />
                    <span>{vendor.operatingHours}</span>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Location</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
                      <span>{vendor.address}</span>
                    </div>
                    <div className="h-40 bg-gray-200 rounded-md">
                      {/* This would be a map in a real application */}
                      <div className="h-full w-full flex items-center justify-center text-gray-400">
                        Map view placeholder
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
