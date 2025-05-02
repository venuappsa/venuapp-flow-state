
import React from "react";
import VendorPanelLayout from "@/components/layouts/VendorPanelLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Download, BookOpen, Video, FileText, HelpCircle } from "lucide-react";

export default function VendorKnowledgePage() {
  const articleCategories = [
    { id: "getting-started", title: "Getting Started" },
    { id: "service-management", title: "Service Management" },
    { id: "booking-management", title: "Booking Management" },
    { id: "pricing-tools", title: "Pricing Tools" },
    { id: "finance", title: "Finance" },
    { id: "analytics", title: "Analytics" },
  ];

  const mockArticles = [
    { 
      id: 1, 
      title: "Getting Started as a Vendor", 
      excerpt: "Learn how to set up your vendor profile and showcase your services.",
      category: "getting-started",
      icon: <BookOpen className="h-5 w-5" />,
      readTime: "5 min read"
    },
    { 
      id: 2, 
      title: "Managing Your Services", 
      excerpt: "A comprehensive guide to adding and managing services you offer.",
      category: "service-management",
      icon: <FileText className="h-5 w-5" />,
      readTime: "7 min read"
    },
    { 
      id: 3, 
      title: "Handling Booking Requests", 
      excerpt: "Learn how to efficiently manage booking requests from hosts.",
      category: "booking-management",
      icon: <BookOpen className="h-5 w-5" />,
      readTime: "6 min read"
    },
    { 
      id: 4, 
      title: "Optimizing Your Pricing Strategy", 
      excerpt: "Tips and strategies for setting competitive pricing for your services.",
      category: "pricing-tools",
      icon: <FileText className="h-5 w-5" />,
      readTime: "10 min read"
    },
    { 
      id: 5, 
      title: "Getting Paid and Managing Finances", 
      excerpt: "Learn about the payment process and financial tracking tools.",
      category: "finance",
      icon: <FileText className="h-5 w-5" />,
      readTime: "8 min read"
    }
  ];

  const mockVideos = [
    {
      id: 1,
      title: "Vendor Platform Tour",
      duration: "4:23",
      thumbnail: "/lovable-uploads/2577f88d-c4f8-45d2-a150-fa973a1ae957.png"
    },
    {
      id: 2,
      title: "How to Get More Bookings",
      duration: "7:15",
      thumbnail: "/lovable-uploads/9d0f57b8-df3f-4b8c-9311-d4546047a3ca.png"
    },
    {
      id: 3,
      title: "Maximizing Your Profile Visibility",
      duration: "5:47",
      thumbnail: "/lovable-uploads/60e514f6-8668-4b57-b0f1-fe2ea1d0b808.png"
    }
  ];

  return (
    <VendorPanelLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Knowledge Base</h1>
        
        <div className="mb-6">
          <div className="relative max-w-lg mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input placeholder="Search knowledge base..." className="pl-10" />
          </div>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {articleCategories.map((category) => (
              <Button key={category.id} variant="outline" size="sm" className="rounded-full">
                {category.title}
              </Button>
            ))}
          </div>
        </div>
        
        <Tabs defaultValue="articles" className="space-y-6">
          <TabsList>
            <TabsTrigger value="articles">Articles</TabsTrigger>
            <TabsTrigger value="videos">Video Guides</TabsTrigger>
            <TabsTrigger value="faqs">FAQs</TabsTrigger>
            <TabsTrigger value="support">Get Support</TabsTrigger>
          </TabsList>
          
          <TabsContent value="articles">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mockArticles.map((article) => (
                <Card key={article.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between mb-2">
                      <div className="h-8 w-8 rounded-full bg-venu-orange/10 text-venu-orange flex items-center justify-center">
                        {article.icon}
                      </div>
                      <span className="text-xs text-gray-500">{article.readTime}</span>
                    </div>
                    <CardTitle className="text-lg">{article.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="mb-4">{article.excerpt}</CardDescription>
                    <Button variant="link" className="px-0">Read Article</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="videos">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockVideos.map((video) => (
                <Card key={video.id} className="overflow-hidden">
                  <div className="relative">
                    <img 
                      src={video.thumbnail} 
                      alt={video.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <div className="h-12 w-12 rounded-full bg-white/90 flex items-center justify-center">
                        <Video className="h-6 w-6 text-venu-orange" />
                      </div>
                      <span className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                        {video.duration}
                      </span>
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-lg">{video.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Button variant="link" className="px-0">Watch Video</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="faqs">
            <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
                <CardDescription>Find answers to common questions about being a vendor on Venuapp</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <h3 className="font-medium">How do I receive booking requests?</h3>
                  <p className="text-sm text-muted-foreground">
                    Booking requests will appear in your dashboard and you'll receive email notifications. 
                    You can accept or decline requests directly from your dashboard.
                  </p>
                </div>
                
                <div className="space-y-3">
                  <h3 className="font-medium">How do I get paid for my services?</h3>
                  <p className="text-sm text-muted-foreground">
                    Payments are processed securely through our integrated payment system. Once a booking is completed,
                    funds will be transferred to your linked bank account within 7 business days.
                  </p>
                </div>
                
                <div className="space-y-3">
                  <h3 className="font-medium">How do I update my availability?</h3>
                  <p className="text-sm text-muted-foreground">
                    You can update your availability in the "Availability" section of your dashboard.
                    You can set regular hours or block specific dates.
                  </p>
                </div>
                
                <div className="space-y-3">
                  <h3 className="font-medium">What fees does Venuapp charge?</h3>
                  <p className="text-sm text-muted-foreground">
                    Venuapp charges a 10% service fee on each booking. This fee covers payment processing,
                    marketing, and platform maintenance.
                  </p>
                </div>
                
                <div className="space-y-3">
                  <h3 className="font-medium">How can I improve my visibility to hosts?</h3>
                  <p className="text-sm text-muted-foreground">
                    Complete your profile with high-quality photos, detailed service descriptions,
                    competitive pricing, and encourage satisfied clients to leave reviews.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="support">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-venu-orange/10 text-venu-orange flex items-center justify-center">
                      <HelpCircle className="h-5 w-5" />
                    </div>
                    <CardTitle>Contact Support</CardTitle>
                  </div>
                  <CardDescription>
                    Reach out to our dedicated vendor support team for assistance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium mb-1">Email</p>
                      <p className="text-sm text-muted-foreground">vendor-support@venuapp.com</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-1">Live Chat</p>
                      <p className="text-sm text-muted-foreground">Available Monday to Friday, 9am - 5pm</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-1">Phone</p>
                      <p className="text-sm text-muted-foreground">+27 12 345 6789</p>
                    </div>
                    <Button className="w-full">Contact Support</Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-venu-orange/10 text-venu-orange flex items-center justify-center">
                      <Download className="h-5 w-5" />
                    </div>
                    <CardTitle>Resources</CardTitle>
                  </div>
                  <CardDescription>
                    Download guides and templates to help grow your business
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-center justify-between p-3 border rounded-md">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5" />
                        <span>Vendor Success Guide</span>
                      </div>
                      <Button variant="ghost" size="icon">
                        <Download className="h-4 w-4" />
                      </Button>
                    </li>
                    <li className="flex items-center justify-between p-3 border rounded-md">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5" />
                        <span>Service Description Template</span>
                      </div>
                      <Button variant="ghost" size="icon">
                        <Download className="h-4 w-4" />
                      </Button>
                    </li>
                    <li className="flex items-center justify-between p-3 border rounded-md">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5" />
                        <span>Pricing Calculator</span>
                      </div>
                      <Button variant="ghost" size="icon">
                        <Download className="h-4 w-4" />
                      </Button>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </VendorPanelLayout>
  );
}
