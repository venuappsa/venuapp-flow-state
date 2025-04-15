import { Button } from "@/components/ui/button";
import { Download, Building, Check, TrendingUp, Users, ShieldCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const HostPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-20">
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center rounded-full px-4 py-1 mb-4 bg-venu-orange/10 text-venu-orange font-medium">
                  <Building className="mr-2 h-4 w-4" />
                  <span>For Event Hosts</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-venu-black mb-6">
                  Elevate Your <span className="text-venu-orange">Event Experience</span>
                </h1>
                <p className="text-gray-600 text-lg mb-8">
                  Transform your venue operations with Venuapp's comprehensive event management platform. Increase revenue, reduce congestion, and provide a superior experience for attendees.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <Button className="bg-venu-orange text-white hover:bg-venu-orange/90">
                    <a href="/subscribe">I Want This First!</a>
                  </Button>
                  <Button variant="outline" className="border-venu-orange text-venu-orange hover:bg-venu-orange/10">
                    <Download className="mr-2 h-4 w-4" />
                    <span>Download App</span>
                  </Button>
                </div>
              </div>
              <div className="relative rounded-lg overflow-hidden shadow-xl">
                <img 
                  src="/lovable-uploads/814de6a3-f5ad-4066-9fd5-8a8b46acb410.png" 
                  alt="Concert venue with large audience"
                  className="w-full h-auto object-cover rounded-lg"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
              Benefits for <span className="text-venu-orange">Event Hosts</span>
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "Increased Revenue",
                  description: "Boost your venue's sales with higher order volumes and reduced operational costs.",
                  icon: <TrendingUp className="h-5 w-5 text-venu-orange" />
                },
                {
                  title: "Enhanced Customer Experience",
                  description: "Provide a premium service that differentiates your venue from competitors.",
                  icon: <Users className="h-5 w-5 text-venu-orange" />
                },
                {
                  title: "Streamlined Operations",
                  description: "Reduce congestion at concession stands and optimize staff allocation.",
                  icon: <Check className="h-5 w-5 text-venu-orange" />
                },
                {
                  title: "Real-Time Analytics",
                  description: "Access valuable insights on sales, customer preferences, and operational efficiency.",
                  icon: <TrendingUp className="h-5 w-5 text-venu-orange" />
                },
                {
                  title: "Merchant Management",
                  description: "Easily onboard and manage vendors for your events through a single platform.",
                  icon: <Users className="h-5 w-5 text-venu-orange" />
                },
                {
                  title: "Secure Transactions",
                  description: "Ensure all payments are processed securely through our verified system.",
                  icon: <ShieldCheck className="h-5 w-5 text-venu-orange" />
                }
              ].map((benefit, index) => (
                <Card key={index} className="border-t-4 border-t-venu-orange">
                  <CardContent className="pt-6">
                    <div className="flex items-start">
                      <div className="mr-4 mt-1 bg-venu-orange/10 p-2 rounded-full">
                        {benefit.icon}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg mb-2">{benefit.title}</h3>
                        <p className="text-gray-600">{benefit.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1">
                <h2 className="text-2xl md:text-3xl font-bold mb-6">
                  Partner with <span className="text-venu-orange">Venuapp</span>
                </h2>
                <p className="text-gray-600 mb-6">
                  Join South Africa's premier mobile marketplace for live events and transform how your venue operates. Our platform is designed to help you:
                </p>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <Check className="mr-2 h-5 w-5 text-venu-orange flex-shrink-0 mt-0.5" />
                    <span>Modernize your venue with cutting-edge mobile ordering technology</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="mr-2 h-5 w-5 text-venu-orange flex-shrink-0 mt-0.5" />
                    <span>Increase per-head spending by making ordering more convenient</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="mr-2 h-5 w-5 text-venu-orange flex-shrink-0 mt-0.5" />
                    <span>Gather valuable data on customer preferences and spending habits</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="mr-2 h-5 w-5 text-venu-orange flex-shrink-0 mt-0.5" />
                    <span>Create a better overall event experience that keeps attendees coming back</span>
                  </li>
                </ul>
                <div className="mt-8">
                  <Button className="bg-venu-orange text-white hover:bg-venu-orange/90">
                    <a href="/subscribe">I Want This First!</a>
                  </Button>
                </div>
              </div>
              <div className="order-1 md:order-2">
                <img 
                  src="/lovable-uploads/da8e3c18-ccdf-47b2-b37c-d422706d433c.png" 
                  alt="Concert stage with colorful lighting and confetti"
                  className="w-full h-auto rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default HostPage;
