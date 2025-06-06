
import React from "react";
import HostPanelLayout from "@/components/layouts/HostPanelLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Download, BookOpen, Video, FileText, HelpCircle } from "lucide-react";

export default function HostKnowledgePage() {
  const articleCategories = [
    { id: "getting-started", title: "Getting Started" },
    { id: "event-planning", title: "Event Planning" },
    { id: "vendor-management", title: "Vendor Management" },
    { id: "guest-management", title: "Guest Management" },
    { id: "finance", title: "Finance" },
    { id: "analytics", title: "Analytics" },
  ];

  const mockArticles = [
    { 
      id: 1, 
      title: "Getting Started with Venuapp", 
      excerpt: "Learn how to set up your account and create your first event.",
      category: "getting-started",
      icon: <BookOpen className="h-5 w-5" />,
      readTime: "5 min read"
    },
    { 
      id: 2, 
      title: "How to Invite Vendors to Your Event", 
      excerpt: "Step-by-step guide to inviting vendors and managing their responses.",
      category: "vendor-management",
      icon: <FileText className="h-5 w-5" />,
      readTime: "7 min read"
    },
    { 
      id: 3, 
      title: "Managing Guest Lists and RSVPs", 
      excerpt: "Learn how to create and manage guest lists for your events.",
      category: "guest-management",
      icon: <BookOpen className="h-5 w-5" />,
      readTime: "6 min read"
    },
    { 
      id: 4, 
      title: "Understanding Event Analytics", 
      excerpt: "A comprehensive guide to interpreting your event analytics.",
      category: "analytics",
      icon: <FileText className="h-5 w-5" />,
      readTime: "10 min read"
    },
    { 
      id: 5, 
      title: "Financial Reporting for Events", 
      excerpt: "Learn how to generate and understand financial reports for your events.",
      category: "finance",
      icon: <FileText className="h-5 w-5" />,
      readTime: "8 min read"
    }
  ];

  const mockVideos = [
    {
      id: 1,
      title: "Venuapp Platform Tour",
      duration: "5:32",
      thumbnail: "/lovable-uploads/2577f88d-c4f8-45d2-a150-fa973a1ae957.png"
    },
    {
      id: 2,
      title: "How to Create the Perfect Event",
      duration: "8:47",
      thumbnail: "/lovable-uploads/9d0f57b8-df3f-4b8c-9311-d4546047a3ca.png"
    },
    {
      id: 3,
      title: "Managing Vendors Effectively",
      duration: "6:23",
      thumbnail: "/lovable-uploads/60e514f6-8668-4b57-b0f1-fe2ea1d0b808.png"
    }
  ];

  return (
    <HostPanelLayout>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-venu-purple to-venu-dark-purple mb-6">
          Knowledge Base
        </h1>
        
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                <CardDescription>Find answers to common questions about using Venuapp</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <h3 className="font-medium">How do I create my first event?</h3>
                  <p className="text-sm text-muted-foreground">
                    To create your first event, navigate to the Events tab and click on the "New Event" button. 
                    Follow the guided steps to set up your event details, venue, and schedule.
                  </p>
                </div>
                
                <div className="space-y-3">
                  <h3 className="font-medium">How do I invite vendors to my event?</h3>
                  <p className="text-sm text-muted-foreground">
                    You can invite vendors from the Vendors tab by clicking "Invite Vendors". You can send direct invitations 
                    via email or generate a unique QR code that vendors can scan to join your event.
                  </p>
                </div>
                
                <div className="space-y-3">
                  <h3 className="font-medium">How are payments processed?</h3>
                  <p className="text-sm text-muted-foreground">
                    Payments are processed securely through our integrated payment provider. You can track all 
                    transactions in the Finance section and set up automatic payouts to your bank account.
                  </p>
                </div>
                
                <div className="space-y-3">
                  <h3 className="font-medium">How can I contact support?</h3>
                  <p className="text-sm text-muted-foreground">
                    You can contact our support team through the Help tab or by emailing support@venuapp.com. 
                    Our team is available 24/7 to assist you with any issues or questions.
                  </p>
                </div>
                
                <div className="space-y-3">
                  <h3 className="font-medium">How do I upgrade my subscription?</h3>
                  <p className="text-sm text-muted-foreground">
                    To upgrade your subscription, go to your account settings and select "Subscription". 
                    From there, you can view and select from our available subscription plans.
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
                    Reach out to our dedicated support team for personalized assistance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium mb-1">Email</p>
                      <p className="text-sm text-muted-foreground">support@venuapp.com</p>
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
                    Download guides, templates, and resources for your events
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-center justify-between p-3 border rounded-md">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5" />
                        <span>Event Planning Guide</span>
                      </div>
                      <Button variant="ghost" size="icon">
                        <Download className="h-4 w-4" />
                      </Button>
                    </li>
                    <li className="flex items-center justify-between p-3 border rounded-md">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5" />
                        <span>Vendor Contract Template</span>
                      </div>
                      <Button variant="ghost" size="icon">
                        <Download className="h-4 w-4" />
                      </Button>
                    </li>
                    <li className="flex items-center justify-between p-3 border rounded-md">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5" />
                        <span>Guest List Template</span>
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
    </HostPanelLayout>
  );
}
