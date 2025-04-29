// Import statements
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { Check, Info } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useUser } from "@/hooks/useUser";
import { useSubscription } from "@/hooks/useSubscription";
import { useUserRoles } from "@/hooks/useUserRoles";
import { useNavigate, useLocation } from "react-router-dom";
import AuthTransitionWrapper from "@/components/AuthTransitionWrapper";
import { Skeleton } from "@/components/ui/skeleton";
import { useBreakpoint } from "@/hooks/useResponsive";
import { Badge } from "@/components/ui/badge";
import { getPricingPlans } from "@/utils/pricingUtils";
import PlanTypeSelector from "@/components/analytics/PlanTypeSelector";
import { Separator } from "@/components/ui/separator";

const GuestPage = () => {
  // Replace PlanType with string for selectedPlanType
  const [selectedPlanType, setSelectedPlanType] = useState<string>("venue");
  const { user } = useUser();
  const { data: userRoles = [], isLoading: rolesLoading } = useUserRoles(user?.id);
  const { 
    subscribed, 
    subscription_tier, 
    subscription_end, 
    subscription_status,
    isLoading: subLoading, 
    checkSubscription, 
    createCheckout 
  } = useSubscription();
  
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const breakpoint = useBreakpoint();
  
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const subStatus = params.get('subscription');
    
    if (subStatus === 'success') {
      toast({
        title: "Subscription successful!",
        description: "Your subscription has been activated.",
        variant: "default"
      });
      checkSubscription();
    } else if (subStatus === 'canceled') {
      toast({
        title: "Subscription canceled",
        description: "You can subscribe at any time when you're ready.",
        variant: "default"
      });
    }
  }, [location.search]);

  const isHost = userRoles?.includes("host");
  const pricingPlans = getPricingPlans();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const emailContent = `
        Name: ${name}
        Email: ${email}
        Interested as: ${role}
      `;

      const response = await fetch("https://formsubmit.co/ajax/hello@venuapp.co.za", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          subject: "Early Access Subscription - Venuapp",
          message: emailContent,
          email: email,
          name: name
        }),
      });

      if (response.ok) {
        toast({
          title: "Subscription successful!",
          description: "You're now on the list to get early access to Venuapp.",
        });
        setEmail("");
        setName("");
        setRole("");
      } else {
        throw new Error("Failed to subscribe");
      }
    } catch (error) {
      toast({
        title: "Error subscribing",
        description: "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePlanSelect = async (planId: string, planName: string) => {
    await createCheckout(planId, planName);
  };

  const renderGuestSubscribeForm = () => (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-venu-black mb-6">
              Be The <span className="text-venu-orange">First</span> To Know
            </h1>
            <p className="text-gray-600 text-lg mb-8">
              Venuapp is coming soon to revolutionize South Africa's event experience. Join our waiting list to be among the first to access our platform when we launch.
            </p>
            <div className="space-y-6">
              <div className="flex items-start">
                <Check className="mr-2 h-5 w-5 text-venu-orange flex-shrink-0 mt-0.5" />
                <span>Be first in line when we launch</span>
              </div>
              <div className="flex items-start">
                <Check className="mr-2 h-5 w-5 text-venu-orange flex-shrink-0 mt-0.5" />
                <span>Receive exclusive pre-launch offers</span>
              </div>
              <div className="flex items-start">
                <Check className="mr-2 h-5 w-5 text-venu-orange flex-shrink-0 mt-0.5" />
                <span>Get early access to features and benefits</span>
              </div>
              <div className="flex items-start">
                <Check className="mr-2 h-5 w-5 text-venu-orange flex-shrink-0 mt-0.5" />
                <span>Stay updated on our progress and launch date</span>
              </div>
            </div>
          </div>
          <div>
            <Card className="border-t-4 border-t-venu-orange shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl">Subscribe for Early Access</CardTitle>
                <CardDescription>
                  Fill in your details to join our waiting list
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6" aria-labelledby="subscribe-form-title">
                  <h3 id="subscribe-form-title" className="sr-only">Subscribe for early access</h3>
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">
                      Full Name
                    </label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      autoComplete="name"
                      required
                      aria-label="Your full name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email Address
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="email"
                      required
                      aria-label="Your email address"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="role" className="text-sm font-medium">
                      I am interested as a
                    </label>
                    <Select value={role} onValueChange={setRole} name="role">
                      <SelectTrigger id="role" aria-label="Select your role">
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="customer">Customer</SelectItem>
                        <SelectItem value="host">Event Host</SelectItem>
                        <SelectItem value="merchant">Merchant</SelectItem>
                        <SelectItem value="fetchman">Fetchman</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-venu-orange text-white hover:bg-venu-orange/90"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Subscribing..." : "I Want This First!"}
                  </Button>
                  
                  <p className="text-xs text-gray-500 text-center">
                    By subscribing, you agree to receive updates about Venuapp.
                    We respect your privacy and will never share your information.
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );

  const renderPricingPlans = () => (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="text-venu-orange">Subscription</span> Plans
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-6">
            Choose the right plan for your venues and events. All plans include our core features with varying capacities and additional benefits.
          </p>
          
          <PlanTypeSelector 
            selectedPlanType={selectedPlanType} 
            onChange={setSelectedPlanType} 
            className="mb-8"
          />
          
          <div className="inline-flex items-center justify-center w-full">
            <hr className="w-64 h-px my-8 bg-gray-200 border-0" />
            <span className="absolute px-3 font-medium text-gray-500 bg-white">
              {selectedPlanType === "venue" ? "Monthly Venue Plans" : "Per-Event Plans"}
            </span>
          </div>
          
          <p className="text-sm text-gray-500 mt-4 mb-8">
            {selectedPlanType === "venue" 
              ? "Perfect for venues that host multiple events over time. Billed monthly."
              : "Ideal for one-time events or special occasions. Pay per event."}
          </p>
        </div>

        {subLoading ? (
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Skeleton className="h-96 w-full" />
            <Skeleton className="h-96 w-full" />
            <Skeleton className="h-96 w-full" />
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Basic Plan */}
            <Card className={`flex flex-col ${subscription_tier === 'basic' ? 'border-venu-orange shadow-lg' : ''}`}>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Basic</CardTitle>
                  {subscription_tier === 'basic' && (
                    <Badge className="bg-venu-orange">Current Plan</Badge>
                  )}
                </div>
                <CardDescription>For smaller venues and events</CardDescription>
                <div className="mt-4">
                  <span className="text-3xl font-bold">
                    {selectedPlanType === "venue" ? "R499" : "R250"}
                  </span>
                  <span className="text-gray-500 ml-2">
                    /{selectedPlanType === "venue" ? "month" : "event"}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="space-y-3">
                  {selectedPlanType === "venue" ? (
                    <>
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                        <span>Up to 3 venues</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                        <span>Up to 5 events per venue monthly</span>
                      </li>
                    </>
                  ) : (
                    <>
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                        <span>Single event use</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                        <span>Up to 3 merchants allowed</span>
                      </li>
                    </>
                  )}
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>Basic analytics</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>Standard support</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>5% commission on transactions</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                {subscription_tier === 'basic' ? (
                  <Button className="w-full bg-gray-200 text-gray-700 cursor-not-allowed" disabled>
                    Current Plan
                  </Button>
                ) : (
                  <Button 
                    className="w-full" 
                    variant={subscription_tier ? "outline" : "default"} 
                    onClick={() => handlePlanSelect(
                      "Basic", 
                      "Basic"
                    )}
                    disabled={isSubmitting}
                  >
                    {subscription_tier ? "Switch to Basic" : "Select Basic"}
                  </Button>
                )}
              </CardFooter>
            </Card>

            {/* Premium Plan */}
            <Card className={`flex flex-col ${subscription_tier === 'premium' ? 'border-venu-orange shadow-lg' : 'md:scale-105 shadow-lg border-venu-orange/80'}`}>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Premium</CardTitle>
                  {subscription_tier === 'premium' ? (
                    <Badge className="bg-venu-orange">Current Plan</Badge>
                  ) : (
                    <Badge variant="outline" className="border-venu-orange text-venu-orange">Popular</Badge>
                  )}
                </div>
                <CardDescription>For growing businesses</CardDescription>
                <div className="mt-4">
                  <span className="text-3xl font-bold">
                    {selectedPlanType === "venue" ? "R999" : "R650"}
                  </span>
                  <span className="text-gray-500 ml-2">
                    /{selectedPlanType === "venue" ? "month" : "event"}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="space-y-3">
                  {selectedPlanType === "venue" ? (
                    <>
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                        <span>Up to 10 venues</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                        <span>Unlimited events</span>
                      </li>
                    </>
                  ) : (
                    <>
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                        <span>Single event use</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                        <span>Up to 6 merchants allowed</span>
                      </li>
                    </>
                  )}
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>Advanced analytics and reporting</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>Priority support</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>3.5% commission on transactions</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                {subscription_tier === 'premium' ? (
                  <Button className="w-full bg-gray-200 text-gray-700 cursor-not-allowed" disabled>
                    Current Plan
                  </Button>
                ) : (
                  <Button 
                    className="w-full bg-venu-orange hover:bg-venu-orange/90"
                    onClick={() => handlePlanSelect(
                      "Premium", 
                      "Premium"
                    )}
                    disabled={isSubmitting}
                  >
                    {subscription_tier ? "Switch to Premium" : "Select Premium"}
                  </Button>
                )}
              </CardFooter>
            </Card>

            {/* Enterprise Plan */}
            <Card className={`flex flex-col ${subscription_tier === 'enterprise' ? 'border-venu-orange shadow-lg' : ''}`}>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Enterprise</CardTitle>
                  {subscription_tier === 'enterprise' && (
                    <Badge className="bg-venu-orange">Current Plan</Badge>
                  )}
                </div>
                <CardDescription>For large organizations</CardDescription>
                <div className="mt-4">
                  <span className="text-3xl font-bold">
                    {selectedPlanType === "venue" ? "R2499" : "R1070"}
                  </span>
                  <span className="text-gray-500 ml-2">
                    /{selectedPlanType === "venue" ? "month" : "event"}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="space-y-3">
                  {selectedPlanType === "venue" ? (
                    <>
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                        <span>Unlimited venues</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                        <span>Unlimited events with premium features</span>
                      </li>
                    </>
                  ) : (
                    <>
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                        <span>Single event use</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                        <span>Up to 10 merchants allowed</span>
                      </li>
                    </>
                  )}
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>Enterprise analytics with custom reports</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>Dedicated account manager</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>2% commission on transactions</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                {subscription_tier === 'enterprise' ? (
                  <Button className="w-full bg-gray-200 text-gray-700 cursor-not-allowed" disabled>
                    Current Plan
                  </Button>
                ) : (
                  <Button 
                    className="w-full" 
                    variant={subscription_tier ? "outline" : "default"} 
                    onClick={() => handlePlanSelect(
                      "Enterprise", 
                      "Enterprise"
                    )}
                    disabled={isSubmitting}
                  >
                    {subscription_tier ? "Switch to Enterprise" : "Select Enterprise"}
                  </Button>
                )}
              </CardFooter>
            </Card>
          </div>
        )}

        {subscription_tier && (
          <div className="mt-12 text-center">
            <div className="bg-blue-50 text-blue-800 p-4 rounded-md inline-block max-w-2xl">
              <div className="flex items-center">
                <Info className="h-5 w-5 mr-2" />
                <span className="font-medium">Current Subscription</span>
              </div>
              <p className="mt-2">
                You are currently on the <span className="font-medium">{subscription_tier}</span> plan.
                {subscription_end && (
                  <span> Your subscription renews on {new Date(subscription_end).toLocaleDateString()}.</span>
                )}
              </p>
              {subscription_status && subscription_status !== "none" && (
                <p className="mt-1">
                  Status: <span className="font-medium capitalize">{subscription_status}</span>
                </p>
              )}
              
              <Button 
                variant="link" 
                className="mt-2"
                onClick={() => navigate("/host/subscription")}
              >
                Manage your subscription
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );

  const renderPlanCTASection = () => (
    <section className="py-16 bg-gradient-to-r from-venu-orange/5 to-amber-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">
          Launch Your <span className="text-venu-orange">Venue</span> with Venuapp
        </h2>
        <p className="text-gray-600 text-lg max-w-3xl mx-auto mb-8">
          Give your guests the best experience by using our digital platform for your venues.
          Easy management, reduced queues, and increased sales.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
          {[
            "Ticket Management",
            "Menu Ordering",
            "In-seat Delivery",
            "Vendor Management",
            "Real-time Analytics",
            "Customer Data",
            "Integrated Payments",
            "Marketing Tools"
          ].map((feature, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <span className="font-medium">{feature}</span>
            </div>
          ))}
        </div>
        <div className="mt-12">
          {!isHost && (
            <Button onClick={() => navigate("/auth")} size="lg" className="bg-venu-orange hover:bg-venu-orange/90">
              Register as a Host
            </Button>
          )}
        </div>
      </div>
    </section>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-20">
        {isHost ? (
          <>
            {renderPricingPlans()}
            <section className="py-12 bg-white">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
                <div className="max-w-3xl mx-auto space-y-6">
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="font-medium mb-2">What's the difference between venue and event plans?</h3>
                    <p className="text-gray-600">Venue plans are monthly subscriptions ideal for venues that host multiple events regularly. Event plans are one-time payments perfect for individual events.</p>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="font-medium mb-2">Can I pause my subscription?</h3>
                    <p className="text-gray-600">Yes, you can pause your subscription once per quarter for up to 14 days. Visit the subscription management page to use this feature.</p>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="font-medium mb-2">How do commissions work?</h3>
                    <p className="text-gray-600">Commissions are calculated on transaction volume processed through the platform. Higher tier plans offer lower commission rates.</p>
                  </div>
                </div>
              </div>
            </section>
          </>
        ) : (
          <>
            {renderGuestSubscribeForm()}
            {renderPlanCTASection()}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default GuestPage;
