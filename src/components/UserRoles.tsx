
import { useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Building, ShoppingCart, Truck } from "lucide-react";
import RoleCard from "./roles/RoleCard";
import { handleRegister } from "@/utils/registration";

const UserRoles = () => {
  // Function to detect role from URL hash
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.includes("roles?role=")) {
        const role = hash.split("role=")[1].split("&")[0];
        const validRoles = ["user", "host", "merchant", "fetchman"];
        if (validRoles.includes(role)) {
          const tabTrigger = document.querySelector(`[data-value="${role}"]`);
          if (tabTrigger) {
            (tabTrigger as HTMLElement).click();
          }
        }
      }
    };

    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  const roleData = {
    user: {
      icon: User,
      title: "Customer",
      description: "The event-goer looking for a seamless experience",
      benefits: [
        "Skip long queues for food, drinks, and merchandise",
        "Order from your seat without missing any moments",
        "Browse all available vendors in one convenient app",
        "Secure payment options with real-time order tracking",
        "Receive in-seat delivery or pick up from designated points"
      ]
    },
    host: {
      icon: Building,
      title: "Host",
      description: "Venue operators and event organizers",
      benefits: [
        "Streamline operations and reduce congestion at venues",
        "Easily invite and manage merchants for your events",
        "Gain real-time insights on sales and customer preferences",
        "Enhance customer experience with a modern ordering system",
        "Increase revenue with higher merchant participation"
      ]
    },
    merchant: {
      icon: ShoppingCart,
      title: "Merchant",
      description: "Food, beverage, and merchandise vendors",
      benefits: [
        "Increase sales volume with wider customer reach",
        "Eliminate cash handling risks with digital payments",
        "Access detailed sales analytics and inventory management",
        "Optimize staffing based on real-time order volumes",
        "Seamlessly participate in multiple events"
      ]
    },
    fetchman: {
      icon: Truck,
      title: "Fetchman",
      description: "Order collectors and delivery personnel",
      benefits: [
        "Flexible earning opportunities at various events",
        "User-friendly app with easy navigation and order management",
        "Clear delivery instructions with venue mapping",
        "Secure transaction handling through the app",
        "Performance-based incentives and rewards"
      ]
    }
  };

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
            {Object.entries(roleData).map(([key, data]) => (
              <TabsTrigger 
                key={key}
                value={key} 
                data-value={key} 
                className="data-[state=active]:bg-venu-orange data-[state=active]:text-white"
              >
                <data.icon className="h-4 w-4 mr-2" /> {data.title}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {Object.entries(roleData).map(([key, data]) => (
            <TabsContent key={key} value={key} className="space-y-4">
              <RoleCard
                icon={data.icon}
                title={data.title}
                description={data.description}
                benefits={data.benefits}
                onRegister={() => handleRegister(key)}
              />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
};

export default UserRoles;

