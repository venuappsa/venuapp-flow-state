
import { Button } from "@/components/ui/button";
import { Download, User, Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const CustomerPage = () => {
  return (
    <div className="flex-grow pt-20">
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center rounded-full px-4 py-1 mb-4 bg-venu-orange/10 text-venu-orange font-medium">
                <User className="mr-2 h-4 w-4" />
                <span>For Customers</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-venu-black mb-6">
                Skip the Queues, <span className="text-venu-orange">Enjoy the Moment</span>
              </h1>
              <p className="text-gray-600 text-lg mb-8">
                Venuapp transforms your event experience by eliminating wait times and bringing delicious food and drinks directly to your seat, so you never miss a moment of the action.
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
                src="/lovable-uploads/e64d7921-63d4-4399-bb3d-a9b79582571b.png" 
                alt="Friends enjoying food at an event"
                className="w-full h-auto object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
            Benefits for <span className="text-venu-orange">Customers</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "In-Seat Delivery",
                description: "Get food and drinks delivered directly to your seat without missing any of the action."
              },
              {
                title: "Skip the Lines",
                description: "No more standing in long queues during intermissions or breaks."
              },
              {
                title: "More Event Time",
                description: "Enjoy more of what you came for – the event, not the waiting."
              },
              {
                title: "Variety of Options",
                description: "Browse all vendors in one app, expanding your food and drink choices."
              },
              {
                title: "Secure Payments",
                description: "Pay securely through the app with various payment options."
              },
              {
                title: "Real-Time Updates",
                description: "Track your order in real-time from preparation to delivery."
              }
            ].map((benefit, index) => (
              <Card key={index} className="border-t-4 border-t-venu-orange">
                <CardContent className="pt-6">
                  <div className="flex items-start">
                    <div className="mr-4 mt-1 bg-venu-orange/10 p-2 rounded-full">
                      <Check className="h-5 w-5 text-venu-orange" />
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
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
            How It <span className="text-venu-orange">Works</span>
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: "1",
                title: "Download the App",
                description: "Get Venuapp from the App Store or Google Play Store."
              },
              {
                step: "2",
                title: "Browse & Order",
                description: "View all available vendors and place your order from your seat."
              },
              {
                step: "3",
                title: "Pay Securely",
                description: "Complete your payment through our secure platform."
              },
              {
                step: "4",
                title: "Receive Your Order",
                description: "Get your food and drinks delivered to your seat or pick up from a designated point."
              }
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-venu-orange text-white text-xl font-bold mb-4">
                  {step.step}
                </div>
                <h3 className="font-bold text-lg mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Button className="bg-venu-orange text-white hover:bg-venu-orange/90">
              <a href="/subscribe">I Want This First!</a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CustomerPage;
