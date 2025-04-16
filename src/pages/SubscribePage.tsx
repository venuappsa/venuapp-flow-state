
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { Check } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const SubscribePage = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Subscription successful!",
        description: "You're now on the list to get early access to Venuapp.",
      });
      setIsSubmitting(false);
      setEmail("");
      setName("");
      setRole("");
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-20">
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
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium">
                          Full Name
                        </label>
                        <Input
                          id="name"
                          type="text"
                          placeholder="Your name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium">
                          Email Address
                        </label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="you@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="role" className="text-sm font-medium">
                          I am interested as a
                        </label>
                        <Select value={role} onValueChange={setRole}>
                          <SelectTrigger id="role">
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
        
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">
              Launching <span className="text-venu-orange">Soon</span> Across South Africa
            </h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto mb-8">
              Venuapp is preparing to transform how South Africans experience events.
              Our platform will be available for various types of events:
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
              {[
                "Music Concerts",
                "Sports Events",
                "Festivals",
                "Conferences",
                "Theaters",
                "Nightclubs",
                "Food Markets",
                "Corporate Events"
              ].map((eventType, index) => (
                <div key={index} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                  <span className="font-medium">{eventType}</span>
                </div>
              ))}
            </div>
            <div className="mt-12">
              <img 
                src="/lovable-uploads/2b0ca0a1-3b98-44e8-8563-cf25f85e169f.png" 
                alt="VenuApp mobile app preview"
                className="rounded-lg shadow-xl max-w-full md:max-w-3xl mx-auto"
              />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default SubscribePage;
