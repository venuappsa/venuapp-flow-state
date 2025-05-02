
import React from "react";
import HostPanelLayout from "@/components/layouts/HostPanelLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, BookOpen, Video, FileText, HelpCircle, ArrowRight } from "lucide-react";

export default function HostKnowledgePage() {
  const guides = [
    { id: 1, title: "Getting Started with Venuapp", description: "Learn the basics of setting up your host account and creating your first event.", category: "basics", icon: <BookOpen className="h-5 w-5 text-venu-orange" /> },
    { id: 2, title: "Working with Vendors", description: "How to invite, manage, and collaborate with vendors for your events.", category: "vendors", icon: <BookOpen className="h-5 w-5 text-venu-orange" /> },
    { id: 3, title: "Event Management Best Practices", description: "Tips and tricks for efficient event planning and management.", category: "events", icon: <BookOpen className="h-5 w-5 text-venu-orange" /> },
    { id: 4, title: "Venue Setup and Configuration", description: "Learn how to configure your venues for optimal event management.", category: "venues", icon: <BookOpen className="h-5 w-5 text-venu-orange" /> },
    { id: 5, title: "Financial Management for Events", description: "Managing budgets, payments, and finances for your events.", category: "finance", icon: <BookOpen className="h-5 w-5 text-venu-orange" /> },
  ];
  
  const videos = [
    { id: 1, title: "Venuapp Platform Tour", duration: "5:32", category: "basics", thumbnail: "/placeholder-image.jpg" },
    { id: 2, title: "How to Create an Event", duration: "3:45", category: "events", thumbnail: "/placeholder-image.jpg" },
    { id: 3, title: "Managing Vendor Relationships", duration: "6:12", category: "vendors", thumbnail: "/placeholder-image.jpg" },
  ];
  
  const faqs = [
    { id: 1, question: "How do I invite vendors to my event?", answer: "You can invite vendors through the Vendor Management section of your event. Go to Events > [Your Event] > Vendors > Invite Vendors." },
    { id: 2, question: "Can I customize the layout of my venue?", answer: "Yes, you can customize venue layouts through the Venue Management section. You can add floor plans, tables, and other elements." },
    { id: 3, question: "How do ticket sales work?", answer: "Ticket sales are managed through the Tickets tab in your event dashboard. You can create different ticket types, set prices, and track sales." },
    { id: 4, question: "How do I track event expenses?", answer: "You can track expenses in the Finance section of your event. Add expense items, categorize them, and generate reports." },
    { id: 5, question: "Can guests RSVP through the platform?", answer: "Yes, guests can RSVP through the guest portal. You can share a link or QR code for them to access the RSVP form." },
  ];

  return (
    <HostPanelLayout>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-venu-purple to-venu-dark-purple mb-6">
          Knowledge Base
        </h1>
        
        <div className="relative mb-8 max-w-3xl mx-auto">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <Input placeholder="Search the knowledge base..." className="pl-12 py-6 text-lg" />
          <Button className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-venu-orange hover:bg-venu-dark-orange">
            Search
          </Button>
        </div>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Popular Resources</CardTitle>
            <CardDescription>Frequently accessed guides and documentation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {guides.slice(0, 3).map((guide) => (
                <Card key={guide.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    {guide.icon}
                    <CardTitle className="text-md mt-2">{guide.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">{guide.description}</p>
                    <Button variant="ghost" className="text-venu-orange flex items-center p-0 h-auto hover:bg-transparent hover:text-venu-dark-orange">
                      Read guide <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Tabs defaultValue="guides" className="mb-8">
          <TabsList className="mb-4">
            <TabsTrigger value="guides">Guides</TabsTrigger>
            <TabsTrigger value="videos">Video Tutorials</TabsTrigger>
            <TabsTrigger value="faqs">FAQs</TabsTrigger>
          </TabsList>
          
          <TabsContent value="guides">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {guides.map((guide) => (
                <div key={guide.id} className="bg-white p-4 rounded-lg shadow">
                  <div className="flex gap-3">
                    {guide.icon}
                    <div>
                      <h3 className="font-medium">{guide.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{guide.description}</p>
                      <Button variant="ghost" className="text-venu-orange flex items-center p-0 h-auto hover:bg-transparent hover:text-venu-dark-orange">
                        Read guide <ArrowRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="videos">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((video) => (
                <div key={video.id} className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="aspect-video bg-gray-200 relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Video className="h-12 w-12 text-white opacity-80" />
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium">{video.title}</h3>
                    <p className="text-sm text-muted-foreground">{video.duration}</p>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="faqs">
            <div className="space-y-4">
              {faqs.map((faq) => (
                <Card key={faq.id}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-md flex items-start gap-2">
                      <HelpCircle className="h-5 w-5 text-venu-orange shrink-0 mt-0.5" />
                      <span>{faq.question}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
        
        <Card className="bg-venu-orange/10 border-venu-orange">
          <CardHeader>
            <CardTitle className="text-venu-dark-orange flex items-center gap-2">
              <HelpCircle className="h-5 w-5" />
              Need Additional Help?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Can't find what you're looking for? Our support team is ready to assist you.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button>Contact Support</Button>
              <Button variant="outline">Schedule Demo</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </HostPanelLayout>
  );
}
