
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { Check, Info } from "lucide-react";
import { useUser } from "@/hooks/useUser";
import { useSubscription } from "@/hooks/useSubscription";
import { useUserRoles } from "@/hooks/useUserRoles";
import { useNavigate, useLocation } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { useBreakpoint } from "@/hooks/useResponsive";
import { Badge } from "@/components/ui/badge";
import { getPricingPlans } from "@/utils/pricingUtils";
import { Separator } from "@/components/ui/separator";

const PRICE_IDS = {
  basic: "price_1OT7NbGVnlGQn0rKkm5MNuMp",
  premium: "price_1OT7NuGVnlGQn0rKYTeHQsrE",
  enterprise: "price_1OT7OPGVnlGQn0rKqTNCYLhc",
};

const SubscribePage = () => {
  const { user, loading: userLoading } = useUser();
  console.log("SubscribePage: User state:", user ? "Logged in" : "Not logged in", "Loading:", userLoading);
  
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
  
  // Redirect authenticated users to the subscription management page
  useEffect(() => {
    console.log("SubscribePage: Checking redirect logic, user:", Boolean(user), "userLoading:", userLoading);
    if (!userLoading && user) {
      console.log("SubscribePage: User logged in, redirecting to host/subscription");
      navigate("/host/subscription", { replace: true });
    }
  }, [user, userLoading, navigate]);
  
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

  // If still loading user data, show a simple loading state
  if (userLoading) {
    return (
      <div className="py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Loading...</h1>
        <Skeleton className="h-8 w-64 mx-auto" />
      </div>
    );
  }

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

  // Simple debug component at the top of the page to help diagnose issues
  const renderDebugInfo = () => (
    <div className="bg-gray-100 p-2 text-xs text-gray-700 mb-4">
      <p>Debug: Page loaded | Auth state: {user ? "Logged in" : "Not logged in"}</p>
      <p>URL: {location.pathname}</p>
    </div>
  );

  // Since we're inside MainLayout, we don't need to render Navbar/Footer here
  return (
    <div className="min-h-[calc(100vh-180px)]">
      {process.env.NODE_ENV !== 'production' && renderDebugInfo()}
      
      {user === null && ( // Only show guest content if definitely not logged in
        <>
          {renderGuestSubscribeForm()}
          {renderPlanCTASection()}
        </>
      )}
    </div>
  );
};

export default SubscribePage;
