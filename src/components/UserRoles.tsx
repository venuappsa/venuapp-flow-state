
import { useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Building, ShoppingCart, Truck, Download } from "lucide-react";

const UserRoles = () => {
  // Function to detect role from URL hash
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.includes("roles?role=")) {
        const role = hash.split("role=")[1].split("&")[0];
        const validRoles = ["user", "host", "merchant", "fetchman"];
        if (validRoles.includes(role)) {
          // Find the tab trigger element and click it
          const tabTrigger = document.querySelector(`[data-value="${role}"]`);
          if (tabTrigger) {
            (tabTrigger as HTMLElement).click();
          }
        }
      }
    };

    // Run once on mount
    handleHashChange();

    // Add hash change listener
    window.addEventListener("hashchange", handleHashChange);
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  return (
    <section id="roles" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-venu-black">
            Find Your <span className="text-venu-orange">Role</span>
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            Venuapp creates value for everyone in the event ecosystem. Discover how you fit in.
          </p>
        </div>
        
        <Tabs defaultValue="user" className="max-w-4xl mx-auto">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-8">
            <TabsTrigger value="user" data-value="user" className="data-[state=active]:bg-venu-orange data-[state=active]:text-white">
              <User className="h-4 w-4 mr-2" /> User
            </TabsTrigger>
            <TabsTrigger value="host" data-value="host" className="data-[state=active]:bg-venu-orange data-[state=active]:text-white">
              <Building className="h-4 w-4 mr-2" /> Host
            </TabsTrigger>
            <TabsTrigger value="merchant" data-value="merchant" className="data-[state=active]:bg-venu-orange data-[state=active]:text-white">
              <ShoppingCart className="h-4 w-4 mr-2" /> Merchant
            </TabsTrigger>
            <TabsTrigger value="fetchman" data-value="fetchman" className="data-[state=active]:bg-venu-orange data-[state=active]:text-white">
              <Truck className="h-4 w-4 mr-2" /> Fetchman
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="user" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-6 w-6 mr-2 text-venu-orange" />
                  Customer
                </CardTitle>
                <CardDescription>The event-goer looking for a seamless experience</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Benefits:</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Skip long queues for food, drinks, and merchandise</li>
                    <li>Order from your seat without missing any moments</li>
                    <li>Browse all available vendors in one convenient app</li>
                    <li>Secure payment options with real-time order tracking</li>
                    <li>Receive in-seat delivery or pick up from designated points</li>
                  </ul>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Button className="bg-venu-orange hover:bg-venu-orange/90 w-full">
                    <a href="/register?role=user">Register as Customer</a>
                  </Button>
                  <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                    <Download size={18} />
                    <span>Download App</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="host" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building className="h-6 w-6 mr-2 text-venu-orange" />
                  Host
                </CardTitle>
                <CardDescription>Venue operators and event organizers</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Benefits:</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Streamline operations and reduce congestion at venues</li>
                    <li>Easily invite and manage merchants for your events</li>
                    <li>Gain real-time insights on sales and customer preferences</li>
                    <li>Enhance customer experience with a modern ordering system</li>
                    <li>Increase revenue with higher merchant participation</li>
                  </ul>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Button className="bg-venu-orange hover:bg-venu-orange/90 w-full">
                    <a href="/register?role=host">Register as Host</a>
                  </Button>
                  <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                    <Download size={18} />
                    <span>Download App</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="merchant" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ShoppingCart className="h-6 w-6 mr-2 text-venu-orange" />
                  Merchant
                </CardTitle>
                <CardDescription>Food, beverage, and merchandise vendors</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Benefits:</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Increase sales volume with wider customer reach</li>
                    <li>Eliminate cash handling risks with digital payments</li>
                    <li>Access detailed sales analytics and inventory management</li>
                    <li>Optimize staffing based on real-time order volumes</li>
                    <li>Seamlessly participate in multiple events</li>
                  </ul>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Button className="bg-venu-orange hover:bg-venu-orange/90 w-full">
                    <a href="/register?role=merchant">Register as Merchant</a>
                  </Button>
                  <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                    <Download size={18} />
                    <span>Download App</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="fetchman" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Truck className="h-6 w-6 mr-2 text-venu-orange" />
                  Fetchman
                </CardTitle>
                <CardDescription>Order collectors and delivery personnel</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Benefits:</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Flexible earning opportunities at various events</li>
                    <li>User-friendly app with easy navigation and order management</li>
                    <li>Clear delivery instructions with venue mapping</li>
                    <li>Secure transaction handling through the app</li>
                    <li>Performance-based incentives and rewards</li>
                  </ul>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Button className="bg-venu-orange hover:bg-venu-orange/90 w-full">
                    <a href="/register?role=fetchman">Register as Fetchman</a>
                  </Button>
                  <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                    <Download size={18} />
                    <span>Download App</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default UserRoles;
