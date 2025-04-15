
import { Button } from "@/components/ui/button";
import { Download, Truck, Check, Clock, MapPin, Wallet } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const FetchmanPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-20">
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center rounded-full px-4 py-1 mb-4 bg-venu-orange/10 text-venu-orange font-medium">
                  <Truck className="mr-2 h-4 w-4" />
                  <span>For Fetchmen</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-venu-black mb-6">
                  Flexible <span className="text-venu-orange">Earning Opportunities</span>
                </h1>
                <p className="text-gray-600 text-lg mb-8">
                  Join Venuapp as a Fetchman and enjoy flexible work delivering food, drinks, and merchandise to event-goers. Earn on your own schedule at exciting venues across South Africa.
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
                  src="/lovable-uploads/4a40a376-6038-4a95-b30f-8bf27958a0de.png" 
                  alt="Person handing over food order"
                  className="w-full h-auto object-cover rounded-lg"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
              Benefits for <span className="text-venu-orange">Fetchmen</span>
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "Flexible Scheduling",
                  description: "Work when you want at events that fit your schedule.",
                  icon: <Clock className="h-5 w-5 text-venu-orange" />
                },
                {
                  title: "Competitive Pay",
                  description: "Earn competitive rates plus tips and performance bonuses.",
                  icon: <Wallet className="h-5 w-5 text-venu-orange" />
                },
                {
                  title: "User-Friendly App",
                  description: "Navigate venues and manage deliveries with our intuitive app.",
                  icon: <Check className="h-5 w-5 text-venu-orange" />
                },
                {
                  title: "Clear Navigation",
                  description: "Easily find your way with detailed venue maps and seating guides.",
                  icon: <MapPin className="h-5 w-5 text-venu-orange" />
                },
                {
                  title: "Secure Transactions",
                  description: "All payments are handled through the app for your security.",
                  icon: <Wallet className="h-5 w-5 text-venu-orange" />
                },
                {
                  title: "Performance Rewards",
                  description: "Earn additional bonuses based on delivery speed and customer ratings.",
                  icon: <Check className="h-5 w-5 text-venu-orange" />
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
                  How to <span className="text-venu-orange">Get Started</span>
                </h2>
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="mr-4 flex-shrink-0 bg-venu-orange w-8 h-8 rounded-full flex items-center justify-center text-white font-bold">
                      1
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-1">Apply Online</h3>
                      <p className="text-gray-600">Complete a simple application form with your details and availability.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="mr-4 flex-shrink-0 bg-venu-orange w-8 h-8 rounded-full flex items-center justify-center text-white font-bold">
                      2
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-1">Complete Training</h3>
                      <p className="text-gray-600">Undergo brief online training about the app and delivery protocols.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="mr-4 flex-shrink-0 bg-venu-orange w-8 h-8 rounded-full flex items-center justify-center text-white font-bold">
                      3
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-1">Select Events</h3>
                      <p className="text-gray-600">Choose from available events in your area that fit your schedule.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="mr-4 flex-shrink-0 bg-venu-orange w-8 h-8 rounded-full flex items-center justify-center text-white font-bold">
                      4
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-1">Start Earning</h3>
                      <p className="text-gray-600">Begin delivering orders and earning money at exciting events.</p>
                    </div>
                  </div>
                </div>
                <div className="mt-8">
                  <Button className="bg-venu-orange text-white hover:bg-venu-orange/90">
                    <a href="/subscribe">I Want This First!</a>
                  </Button>
                </div>
              </div>
              <div className="order-1 md:order-2">
                <img 
                  src="/lovable-uploads/e64d7921-63d4-4399-bb3d-a9b79582571b.png" 
                  alt="Friends enjoying food at an event"
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

export default FetchmanPage;
