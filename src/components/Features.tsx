
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, MapPin, CreditCard, RefreshCw, ShoppingBag, Users } from "lucide-react";

const features = [
  {
    title: "In-Seat Delivery",
    description: "Never miss a moment. Get food and drinks delivered directly to your seat.",
    icon: <MapPin className="h-10 w-10 text-venu-orange" />
  },
  {
    title: "No More Queues",
    description: "Skip the lines and spend more time enjoying events with our seamless ordering system.",
    icon: <Clock className="h-10 w-10 text-venu-orange" />
  },
  {
    title: "QR Collections",
    description: "Quick and convenient pickup points with QR code technology for faster service.",
    icon: <ShoppingBag className="h-10 w-10 text-venu-orange" />
  },
  {
    title: "Secure Payments",
    description: "Multiple payment options with state-of-the-art security for worry-free transactions.",
    icon: <CreditCard className="h-10 w-10 text-venu-orange" />
  },
  {
    title: "Real-Time Updates",
    description: "Track your orders and receive notifications about preparation and delivery status.",
    icon: <RefreshCw className="h-10 w-10 text-venu-orange" />
  },
  {
    title: "Multi-Merchant Platform",
    description: "Access various food, drink, and merchandise vendors all in one convenient app.",
    icon: <Users className="h-10 w-10 text-venu-orange" />
  }
];

const Features = () => {
  return (
    <section id="features" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-venu-black">
            Innovative <span className="text-venu-orange">Features</span>
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            Discover how Venuapp transforms the event experience for audiences and businesses alike.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="transition-all duration-300 hover:shadow-lg border-t-4 border-t-venu-orange">
              <CardHeader>
                <div className="mb-4">{feature.icon}</div>
                <CardTitle className="text-xl font-bold">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base text-gray-600">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
