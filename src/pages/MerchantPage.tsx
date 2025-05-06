
import { Button } from "@/components/ui/button";
import { Download, ShoppingCart, Check, CreditCard, BarChart, ShieldCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const MerchantPage = () => {
  return (
    <div className="flex-grow pt-20">
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center rounded-full px-4 py-1 mb-4 bg-venu-orange/10 text-venu-orange font-medium">
                <ShoppingCart className="mr-2 h-4 w-4" />
                <span>For Merchants</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-venu-black mb-6">
                Expand Your <span className="text-venu-orange">Reach</span>
              </h1>
              <p className="text-gray-600 text-lg mb-8">
                Join Venuapp's marketplace to reach more customers, increase sales, and streamline your operations at events across South Africa.
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
                src="/lovable-uploads/60e514f6-8668-4b57-b0f1-fe2ea1d0b808.png" 
                alt="Merchant preparing food"
                className="w-full h-auto object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
            Benefits for <span className="text-venu-orange">Merchants</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Increased Sales Volume",
                description: "Reach more customers at events with our mobile ordering platform.",
                icon: <ShoppingCart className="h-5 w-5 text-venu-orange" />
              },
              {
                title: "Streamlined Operations",
                description: "Manage orders efficiently through our intuitive merchant dashboard.",
                icon: <Check className="h-5 w-5 text-venu-orange" />
              },
              {
                title: "Digital Payments",
                description: "Eliminate cash handling risks with secure electronic transactions.",
                icon: <CreditCard className="h-5 w-5 text-venu-orange" />
              },
              {
                title: "Business Insights",
                description: "Access detailed analytics on sales, popular items, and customer behavior.",
                icon: <BarChart className="h-5 w-5 text-venu-orange" />
              },
              {
                title: "Multi-Event Participation",
                description: "Easily manage your presence across multiple venues and events.",
                icon: <ShoppingCart className="h-5 w-5 text-venu-orange" />
              },
              {
                title: "Secure Platform",
                description: "Operate on our trusted platform with reliable payment processing.",
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <img 
                src="/lovable-uploads/a324a41f-b192-4da3-88ed-46939c740f35.png" 
                alt="Food service preparation"
                className="w-full h-auto rounded-lg shadow-md"
              />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-6">
                Grow Your <span className="text-venu-orange">Business</span>
              </h2>
              <p className="text-gray-600 mb-6">
                Whether you're a food vendor, beverage supplier, or merchandise seller, Venuapp helps you connect with customers at events across South Africa.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <Check className="mr-2 h-5 w-5 text-venu-orange flex-shrink-0 mt-0.5" />
                  <span>Simple onboarding process with dedicated merchant support</span>
                </li>
                <li className="flex items-start">
                  <Check className="mr-2 h-5 w-5 text-venu-orange flex-shrink-0 mt-0.5" />
                  <span>Easy-to-use menu management and inventory tracking</span>
                </li>
                <li className="flex items-start">
                  <Check className="mr-2 h-5 w-5 text-venu-orange flex-shrink-0 mt-0.5" />
                  <span>Integration with existing POS systems where applicable</span>
                </li>
                <li className="flex items-start">
                  <Check className="mr-2 h-5 w-5 text-venu-orange flex-shrink-0 mt-0.5" />
                  <span>Flexible commission structure based on transaction volume</span>
                </li>
              </ul>
              <div className="mt-8">
                <Button className="bg-venu-orange text-white hover:bg-venu-orange/90">
                  <a href="/subscribe">I Want This First!</a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MerchantPage;
