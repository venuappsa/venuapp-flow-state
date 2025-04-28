
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Search, BookOpen, FileText, Download, ExternalLink, Star } from "lucide-react";
import HostPanelLayout from "@/components/layouts/HostPanelLayout";
import { useSubscription } from "@/hooks/useSubscription";
import { getTierLevel } from "@/utils/pricingUtils";

export default function KnowledgeBasePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("guides");
  const { subscription_tier = "Free" } = useSubscription();
  
  const tierLevel = getTierLevel(subscription_tier);
  
  const knowledgeBase = {
    guides: [
      {
        id: 1,
        title: "Getting Started with Venue Management",
        description: "Learn how to set up your venues and configure basic settings",
        icon: "book",
        category: "Setup",
        updated: "2025-03-15",
        minTier: 0,
      },
      {
        id: 2,
        title: "Creating Your First Event",
        description: "Step-by-step guide to creating and configuring events",
        icon: "calendar",
        category: "Events",
        updated: "2025-04-02",
        minTier: 0,
      },
      {
        id: 3,
        title: "Inviting and Managing Merchants",
        description: "Learn how to invite, approve, and manage merchants for your venues and events",
        icon: "users",
        category: "Merchants",
        updated: "2025-04-10",
        minTier: 0,
      },
      {
        id: 4,
        title: "Advanced Analytics Dashboard",
        description: "How to leverage analytics to grow your business",
        icon: "bar-chart",
        category: "Analytics",
        updated: "2025-03-28",
        minTier: 2,
      },
      {
        id: 5,
        title: "Configuring Payment Settings",
        description: "Set up your payment options, commission rates, and transaction settings",
        icon: "credit-card",
        category: "Finance",
        updated: "2025-04-05",
        minTier: 0,
      },
      {
        id: 6,
        title: "Multi-venue Management",
        description: "Efficiently manage multiple venues from a single dashboard",
        icon: "building",
        category: "Venues",
        updated: "2025-03-20",
        minTier: 1,
      },
      {
        id: 7,
        title: "Revenue Forecasting",
        description: "Use historical data to predict future revenue and attendance",
        icon: "trending-up",
        category: "Analytics",
        updated: "2025-04-12",
        minTier: 3,
      },
    ],
    faqs: [
      {
        id: 1,
        question: "How do I change my subscription plan?",
        answer: "You can change your subscription plan by going to the Subscription page in your Host Panel. From there, you can view available plans and select the one that best fits your needs.",
        category: "Billing",
        minTier: 0,
      },
      {
        id: 2,
        question: "How do stall fees work for merchants?",
        answer: "Stall fees are charges you can set for merchants to participate in your events or use space at your venues. You can set default stall fees in your Settings, or customize them per event or venue. The fees can be collected through the Venuapp payment system.",
        category: "Merchants",
        minTier: 0,
      },
      {
        id: 3,
        question: "What commission rates are applied to vendor sales?",
        answer: "Commission rates vary based on your subscription tier. Free plan has an 8% commission, Starter has 5%, Growth has 3.5%, Pro has 2%, and Enterprise has custom rates. These commissions are automatically calculated and collected on all transactions processed through the Venuapp payment system.",
        category: "Finance",
        minTier: 0,
      },
      {
        id: 4,
        question: "How do I access advanced analytics?",
        answer: "Advanced analytics are available on higher subscription tiers. Growth tier users and above can access detailed guest demographics and vendor performance metrics. To view these, go to the Analytics tab in your Host Panel.",
        category: "Analytics",
        minTier: 2,
      },
      {
        id: 5,
        question: "Can I have multiple team members access my host account?",
        answer: "Yes, you can add team members to your host account. The number of admin team users depends on your subscription tier. Go to Settings > Team Members to add and manage user permissions.",
        category: "Account",
        minTier: 1,
      },
      {
        id: 6,
        question: "What is the difference between venue-based and event-based plans?",
        answer: "Venue-based plans are ideal for businesses with permanent venues that host regular events. They offer monthly billing with a per-event fee. Event-based plans are best for occasional event organizers and charge per event without monthly fees. Both plans offer similar features, but with different pricing structures.",
        category: "Billing",
        minTier: 0,
      },
      {
        id: 7,
        question: "How do I contact priority support?",
        answer: "Priority support is available for Growth and higher tier subscribers. You can access it through the Support tab in your dashboard, or by clicking on the chat icon in the bottom right corner of any page. Growth tier users receive high priority support, while Pro and Enterprise tiers get dedicated account managers.",
        category: "Support",
        minTier: 2,
      },
    ],
    support: [
      {
        id: 1,
        title: "Email Support",
        description: "Contact our support team by email",
        icon: "mail",
        link: "mailto:support@venuapp.co.za",
        minTier: 0,
      },
      {
        id: 2,
        title: "Knowledge Base",
        description: "Browse our comprehensive knowledge base",
        icon: "book-open",
        link: "#",
        minTier: 0,
      },
      {
        id: 3,
        title: "Chat Support",
        description: "Get real-time assistance from our support team",
        icon: "message-circle",
        link: "#",
        minTier: 1,
      },
      {
        id: 4,
        title: "Priority Support",
        description: "Get faster response times and dedicated support",
        icon: "zap",
        link: "#",
        minTier: 2,
      },
      {
        id: 5,
        title: "Dedicated Account Manager",
        description: "Work directly with a dedicated account manager",
        icon: "user",
        link: "#",
        minTier: 3,
      },
    ],
  };
  
  const filteredGuides = knowledgeBase.guides.filter(guide => {
    // Filter by search query
    if (searchQuery && !guide.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !guide.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Filter by subscription tier
    return guide.minTier <= tierLevel;
  });
  
  const filteredFaqs = knowledgeBase.faqs.filter(faq => {
    // Filter by search query
    if (searchQuery && !faq.question.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !faq.answer.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Filter by subscription tier
    return faq.minTier <= tierLevel;
  });
  
  const filteredSupport = knowledgeBase.support.filter(support => {
    // Filter by search query
    if (searchQuery && !support.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !support.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Filter by subscription tier
    return support.minTier <= tierLevel;
  });
  
  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case "book":
        return <BookOpen className="h-5 w-5" />;
      case "calendar":
        return <CalendarIcon className="h-5 w-5" />;
      case "users":
        return <UsersIcon className="h-5 w-5" />;
      case "bar-chart":
        return <BarChartIcon className="h-5 w-5" />;
      case "credit-card":
        return <CreditCardIcon className="h-5 w-5" />;
      case "building":
        return <BuildingIcon className="h-5 w-5" />;
      case "trending-up":
        return <TrendingUpIcon className="h-5 w-5" />;
      case "mail":
        return <MailIcon className="h-5 w-5" />;
      case "book-open":
        return <BookOpen className="h-5 w-5" />;
      case "message-circle":
        return <MessageCircleIcon className="h-5 w-5" />;
      case "zap":
        return <ZapIcon className="h-5 w-5" />;
      case "user":
        return <UserIcon className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  return (
    <HostPanelLayout>
      <div className="max-w-6xl mx-auto py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold">Knowledge Base</h1>
            <p className="text-gray-600 mt-1">
              Find guides, FAQs, and support resources for using Venuapp
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative flex-grow md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search knowledge base..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              Documentation
            </Button>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 mb-8 border">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="bg-venu-orange/10 p-4 rounded-full">
              <BookOpen className="h-10 w-10 text-venu-orange" />
            </div>
            <div className="flex-grow text-center md:text-left">
              <h2 className="text-xl font-semibold">Need help with your Venuapp account?</h2>
              <p className="text-gray-600 mt-1">Browse our guides, check FAQs, or contact support based on your subscription tier.</p>
            </div>
            <div className="flex gap-3">
              <Button variant="default">
                Contact Support
              </Button>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-background mb-8">
            <TabsTrigger value="guides" className="flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              Guides
            </TabsTrigger>
            <TabsTrigger value="faqs" className="flex items-center">
              <QuestionMarkIcon className="h-4 w-4 mr-2" />
              FAQs
            </TabsTrigger>
            <TabsTrigger value="support" className="flex items-center">
              <LifeBuoyIcon className="h-4 w-4 mr-2" />
              Support
            </TabsTrigger>
          </TabsList>

          <TabsContent value="guides" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGuides.map(guide => (
                <Card key={guide.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div className="bg-gray-100 p-2 rounded-md">
                        {getIconComponent(guide.icon)}
                      </div>
                      <Badge variant="outline">{guide.category}</Badge>
                    </div>
                    <CardTitle className="mt-3 text-lg">{guide.title}</CardTitle>
                    <CardDescription>{guide.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-gray-500">Updated {formatDate(guide.updated)}</p>
                    <Button variant="ghost" size="sm" className="mt-2 w-full justify-start">
                      <FileText className="h-4 w-4 mr-2" />
                      Read Guide
                    </Button>
                  </CardContent>
                </Card>
              ))}
              {filteredGuides.length === 0 && (
                <div className="col-span-3 text-center py-12">
                  <p className="text-gray-500">No guides found. Try adjusting your search.</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="faqs" className="mt-0">
            <div className="space-y-6">
              {filteredFaqs.map(faq => (
                <Card key={faq.id}>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg">{faq.question}</CardTitle>
                      <Badge>{faq.category}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
              {filteredFaqs.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500">No FAQs found. Try adjusting your search.</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="support" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSupport.map(support => (
                <Card key={support.id} className={support.minTier <= tierLevel ? "cursor-pointer hover:shadow-md transition-shadow" : "opacity-50 cursor-not-allowed"}>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div className="bg-gray-100 p-2 rounded-md">
                        {getIconComponent(support.icon)}
                      </div>
                      {support.minTier > 0 && (
                        <Badge variant={support.minTier <= tierLevel ? "secondary" : "outline"}>
                          {getTierName(support.minTier)}+
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="mt-3 text-lg">{support.title}</CardTitle>
                    <CardDescription>{support.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-full justify-start" 
                      disabled={support.minTier > tierLevel}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Access Support
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="mt-8 bg-gray-50 p-6 rounded-lg border">
              <h3 className="text-lg font-semibold mb-4">Support Levels by Subscription Tier</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white divide-y divide-gray-200 rounded-md border">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Plan Tier
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email Support
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Chat Support
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Priority
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Response Time
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-medium">Free</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <CheckIcon className="h-4 w-4 text-green-600" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <XIcon className="h-4 w-4 text-gray-400" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span>Limited</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span>48 hours</span>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-medium">Starter</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <CheckIcon className="h-4 w-4 text-green-600" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <CheckIcon className="h-4 w-4 text-green-600" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span>Standard</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span>24 hours</span>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-medium">Growth</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <CheckIcon className="h-4 w-4 text-green-600" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <CheckIcon className="h-4 w-4 text-green-600" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span>High</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span>8 hours</span>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-medium">Pro</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <CheckIcon className="h-4 w-4 text-green-600" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <CheckIcon className="h-4 w-4 text-green-600" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span>Priority</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span>4 hours</span>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-medium">Enterprise</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <CheckIcon className="h-4 w-4 text-green-600" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <CheckIcon className="h-4 w-4 text-green-600" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span>24/7 Dedicated</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span>1 hour</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </HostPanelLayout>
  );
}

function getTierName(level: number) {
  switch(level) {
    case 0:
      return "Free";
    case 1:
      return "Starter";
    case 2:
      return "Growth";
    case 3:
      return "Pro";
    case 4:
      return "Enterprise";
    default:
      return "Free";
  }
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-ZA', { 
    day: 'numeric', 
    month: 'short', 
    year: 'numeric' 
  }).format(date);
}

// SVG Icon components
function UsersIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function CalendarIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function BarChartIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <line x1="12" y1="20" x2="12" y2="10" />
      <line x1="18" y1="20" x2="18" y2="4" />
      <line x1="6" y1="20" x2="6" y2="16" />
    </svg>
  );
}

function CreditCardIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
      <line x1="1" y1="10" x2="23" y2="10" />
    </svg>
  );
}

function BuildingIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
      <path d="M9 22v-4h6v4" />
      <path d="M8 6h.01" />
      <path d="M16 6h.01" />
      <path d="M8 10h.01" />
      <path d="M16 10h.01" />
      <path d="M8 14h.01" />
      <path d="M16 14h.01" />
    </svg>
  );
}

function TrendingUpIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  );
}

function MailIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M22 6c0 8-10 12-10 12S2 14 2 6" />
      <path d="m2 6 10 5L22 6" />
    </svg>
  );
}

function MessageCircleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  );
}

function ZapIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  );
}

function UserIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M18 20a6 6 0 0 0-12 0" />
      <circle cx="12" cy="10" r="4" />
    </svg>
  );
}

function QuestionMarkIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M10 12a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
      <path d="M12 16h.01" />
      <path d="M12 8v-2" />
      <path d="M12 4h-2.5a3.5 3.5 0 0 0 0 7h3a3.5 3.5 0 0 1 0 7h-2.5" />
    </svg>
  );
}

function LifeBuoyIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="4" />
      <line x1="4.93" y1="4.93" x2="9.17" y2="9.17" />
      <line x1="14.83" y1="14.83" x2="19.07" y2="19.07" />
      <line x1="14.83" y1="9.17" x2="19.07" y2="4.93" />
      <line x1="14.83" y1="9.17" x2="18.36" y2="5.64" />
      <line x1="4.93" y1="19.07" x2="9.17" y2="14.83" />
    </svg>
  );
}

function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function XIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}
