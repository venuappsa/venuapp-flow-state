
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-16 bg-venu-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="mb-8 flex justify-center">
          <img 
            src="/lovable-uploads/e9386f08-cbd8-40f1-b3b8-fa095a8e1a4b.png" 
            alt="Venuapp Experience" 
            className="h-24 md:h-32 rounded-full border-4 border-venu-orange shadow-lg"
          />
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Ready to Transform Your <span className="text-venu-orange">Event Experience?</span>
        </h2>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-8">
          Join thousands of hosts, merchants, and event-goers who are eager to enjoy queue-free experiences across South Africa.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button className="bg-venu-orange text-white hover:bg-venu-orange/90 text-lg px-8 py-6">
            <a href="/register">Get Started Now</a>
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button variant="outline" className="border-white text-white hover:bg-white/10 text-lg px-8 py-6">
            <a href="#contact">Contact Us</a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
